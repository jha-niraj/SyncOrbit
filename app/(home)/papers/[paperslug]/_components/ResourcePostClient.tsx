"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SmoothScroll from "@/components/smoothscroll";
import { ResourcePost } from "../../data/papersdata";

export default function ResourcePostClient({ post }: { post: ResourcePost }) {
    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-950 font-sans">
                <div className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 z-50 flex items-center px-6">
                    <div className="container max-w-4xl mx-auto flex justify-between items-center">
                        <Link href="/papers" className="text-xs font-mono uppercase tracking-wide text-neutral-500 hover:text-orange-500 transition-colors flex items-center gap-2">
                            <ArrowLeft className="w-3 h-3" /> Index
                        </Link>
                        <div className="text-[10px] font-mono text-neutral-400 hidden sm:block">DOC_ID: {post.slug.toUpperCase()}</div>
                    </div>
                </div>
                <article className="pt-32 pb-24">
                    <div className="container max-w-4xl mx-auto px-6">
                        <div className="mb-10 border-l-2 border-orange-500 pl-6 py-1">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                                    {post.category}
                                </span>
                                <span className="text-xs text-neutral-400 font-mono">{post.date}</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tighter mb-6 leading-[1.1]">
                                {post.title}
                            </h1>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-neutral-200 relative overflow-hidden">
                                        <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                                    </div>
                                    <div className="text-xs">
                                        <p className="font-bold text-neutral-900 dark:text-white">{post.author.name}</p>
                                        <p className="text-neutral-500 font-mono uppercase">{post.author.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mb-16 relative aspect-[2/1] w-full overflow-hidden rounded border border-neutral-200 dark:border-neutral-800">
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent z-10 pointer-events-none"></div>
                            <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="prose prose-lg dark:prose-invert prose-neutral max-w-none 
                            prose-headings:font-bold prose-headings:tracking-tighter 
                            prose-p:text-neutral-600 dark:prose-p:text-neutral-400 prose-p:leading-loose
                            prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
                            prose-blockquote:border-l-orange-500 prose-blockquote:text-lg prose-blockquote:font-light"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
            </div>
        </SmoothScroll>
    );
}
