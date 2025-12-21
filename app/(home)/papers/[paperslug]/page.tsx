import React from "react";
import { resourcesData } from "../data/papersdata";
import { notFound } from "next/navigation";
import ResourcePostClient from "./_components/ResourcePostClient";

interface PageProps {
    params: Promise<{
        paperslug: string;
    }>;
}

export default async function ResourcePostPage({ params }: PageProps) {
    const resolvedParams = await params;
    const post = resourcesData.find(p => p.slug === resolvedParams.paperslug);

    if (!post) {
        notFound();
    }

    return <ResourcePostClient post={post} />;
}