"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadImageToCloudinary } from "@/actions/shared/upload.action";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { InvoiceStatus } from "@prisma/client";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getInvoicePreloadData() {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Authentication required" };
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: {
                ownedCompany: true,
                company: true
            }
        });

        if (!user || (!user.ownedCompany && !user.company)) {
            return { success: false, error: "Company not found" };
        }

        const company = user.ownedCompany || user.company;

        // Get all clients associated with this company
        // A client is a user with Role.CLIENT in the same company
        const clients = await prisma.user.findMany({
            where: {
                companyId: company?.id,
                role: "CLIENT"
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        });

        return {
            success: true,
            company,
            clients
        };
    } catch (error) {
        console.error("Error fetching invoice preload data:", error);
        return { success: false, error: "Failed to fetch data" };
    }
}

export async function createInvoice(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { success: false, error: "Authentication required" };
        }

        const invoiceNumber = formData.get("invoiceNumber") as string;
        const amount = parseFloat(formData.get("amount") as string);
        const clientId = formData.get("clientId") as string;
        const dueDate = new Date(formData.get("dueDate") as string);
        const items = JSON.parse(formData.get("items") as string);
        const notes = formData.get("notes") as string;
        const pdfFile = formData.get("pdf") as File;

        // 1. Upload PDF to Cloudinary
        const uploadFormData = new FormData();
        uploadFormData.append("file", pdfFile);
        const uploadResult = await uploadImageToCloudinary(uploadFormData);

        if (!uploadResult.success || !uploadResult.url) {
            return { success: false, error: uploadResult.message || "Failed to upload PDF" };
        }

        // 2. Get User's Company
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;

        if (!companyId) {
            return { success: false, error: "Company not found" };
        }

        // 3. Save to Database
        const invoice = await prisma.invoice.create({
            data: {
                invoiceNumber,
                amount,
                status: "SENT",
                dueDate,
                companyId,
                clientId,
                items,
                pdfUrl: uploadResult.url,
                notes
            },
            include: {
                client: true,
                company: true
            }
        });

        // 4. Send Email via Resend
        if (invoice.client.email) {
            await resend.emails.send({
                from: "SyncOrbit <onboarding@resend.dev>", // Replace with verified domain in production
                to: invoice.client.email,
                subject: `New Invoice ${invoice.invoiceNumber} from ${invoice.company.name}`,
                html: `
                    <h1>New Invoice Received</h1>
                    <p>Hello ${invoice.client.name},</p>
                    <p>You have received a new invoice from ${invoice.company.name}.</p>
                    <p><strong>Invoice Number:</strong> ${invoice.invoiceNumber}</p>
                    <p><strong>Amount:</strong> ${invoice.amount} ${invoice.currency}</p>
                    <p><strong>Due Date:</strong> ${invoice.dueDate.toLocaleDateString()}</p>
                    <p>You can view and download the invoice using the link below:</p>
                    <a href="${invoice.pdfUrl}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">View Invoice</a>
                    <p>Thank you!</p>
                `
            });
        }

        revalidatePath("/tools/invoices");
        return { success: true, invoice };

    } catch (error) {
        console.error("Error creating invoice:", error);
        return { success: false, error: "Failed to create invoice" };
    }
}

export async function getInvoices() {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            include: { ownedCompany: true, company: true }
        });

        const companyId = user?.ownedCompany?.id || user?.companyId;

        // If it's a client, they might not have a companyId set in the same way 
        // but they are associated with invoices via clientId.

        const invoices = await prisma.invoice.findMany({
            where: {
                OR: [
                    companyId ? { companyId: companyId } : {},
                    { clientId: session.user.id }
                ].filter(condition => Object.keys(condition).length > 0)
            },
            include: {
                client: { select: { name: true, email: true, image: true } },
                company: { select: { name: true, logo: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        return { success: true, invoices };
    } catch (error) {
        console.error("Error fetching invoices:", error);
        return { success: false, error: "Failed to fetch invoices" };
    }
}

export async function getInvoiceById(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const invoice = await prisma.invoice.findUnique({
            where: { id },
            include: {
                client: { select: { id: true, name: true, email: true, image: true } },
                company: { select: { id: true, name: true, logo: true, address: true } },
                messages: {
                    include: {
                        sender: { select: { id: true, name: true, image: true, role: true } }
                    },
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!invoice) return { success: false, error: "Invoice not found" };

        // Check permission: user must be either the client or from the company
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { ownedCompany: { select: { id: true } }, companyId: true }
        });
        const companyId = user?.ownedCompany?.id || user?.companyId;

        if (invoice.clientId !== session.user.id && invoice.companyId !== companyId) {
            return { success: false, error: "Access denied" };
        }

        return { success: true, invoice };
    } catch (error) {
        console.error("Error fetching invoice:", error);
        return { success: false, error: "Failed to fetch invoice" };
    }
}

export async function sendInvoiceMessage(invoiceId: string, content: string) {
    try {
        const session = await auth();
        if (!session?.user?.id) return { success: false, error: "Unauthorized" };

        const message = await prisma.invoiceMessage.create({
            data: {
                content,
                invoiceId,
                senderId: session.user.id
            },
            include: {
                sender: { select: { id: true, name: true, image: true, role: true } }
            }
        });

        revalidatePath(`/tools/invoices/${invoiceId}`);
        return { success: true, message };
    } catch (error) {
        console.error("Error sending message:", error);
        return { success: false, error: "Failed to send message" };
    }
}
