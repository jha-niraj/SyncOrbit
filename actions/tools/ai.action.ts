"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function chatWithAI(messages: any[]) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Authentication required" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                ownedCompany: { select: { id: true, name: true } },
                company: { select: { id: true, name: true } }
            }
        });

        const companyId = user?.ownedCompany?.id || user?.company?.id;
        if (!companyId) return { success: false, error: "Company not found" };

        // 1. Fetch Latest Knowledge Base
        const kb = await prisma.knowledgeBase.findMany({
            where: { companyId },
            orderBy: { date: "desc" },
            take: 10
        });

        const context = kb.map(entry => `Date: ${entry.date}\nContent: ${entry.content}`).join("\n\n---\n\n");

        // 2. Call OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", // Cost effective for basic tasks
            messages: [
                {
                    role: "system",
                    content: `You are a helpful AI assistant for ${user?.ownedCompany?.name || user?.company?.name || 'the company'}. 
                    Use the provided knowledge base context to answer questions. 
                    If the answer isn't available in the context, use your general knowledge but clarify it.
                    
                    Knowledge Base Context:
                    ${context || "No context available."}`
                },
                ...messages
            ],
        });

        return {
            success: true,
            message: response.choices[0].message
        };

    } catch (error) {
        console.error("AI Chat Error:", error);
        return { success: false, error: "Failed to connect to AI service" };
    }
}

export async function generateDocumentContent(prompt: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Authentication required" };

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a professional technical writer. Help the user write or improve their document based on their prompt. Return only the suggested text."
                },
                { role: "user", content: prompt }
            ],
        });

        return {
            success: true,
            content: response.choices[0].message.content
        };
    } catch (error) {
        return { success: false, error: "AI generation failed" };
    }
}
