"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
    ArrowLeft, Calendar, Clock, Copy, Linkedin, Share2, Twitter 
} from "lucide-react";
import SmoothScroll from "@/components/smoothscroll";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { categoryIcons, ResourcePost } from "../data/papersdata";

interface ResourcePostPageProps {
    post: ResourcePost;
}

export default function ResourcePostPage({ post }: ResourcePostPageProps) {
    if (!post) return null;

    const Icon = categoryIcons[post.category];
    // Ensure we have access to window for URL, provide fallback for SSR
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-white dark:bg-neutral-950 selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-white font-sans">
                <article className="pt-32 pb-24">
                    {/* Header Section */}
                    <div className="container max-w-4xl mx-auto px-6 mb-12">
                        <Link href="/resources" className="inline-flex items-center text-sm text-neutral-500 hover:text-orange-600 dark:hover:text-orange-500 transition-colors mb-8 group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Back to Resources
                        </Link>

                        {/* Category Badge */}
                        <div className="flex items-center gap-4 mb-6">
                             <div className={cn(
                                "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                                post.category === 'Whitepapers' ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800" :
                                post.category === 'Feature Updates' ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 border-purple-200 dark:border-purple-800" :
                                "bg-orange-100 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-800"
                            )}>
                                <Icon className="w-3.5 h-3.5" />
                                {post.category}
                            </div>
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white tracking-tight mb-8 leading-tight">
                            {post.title}
                        </h1>
                        
                        {/* Author & Meta + Share Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between py-6 border-y border-neutral-100 dark:border-neutral-800 gap-6">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-200 ring-2 ring-white dark:ring-neutral-900">
                                        <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-bold text-neutral-900 dark:text-white">{post.author.name}</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">{post.author.role}</p>
                                </div>
                            </div>

                             <div className="flex items-center gap-6 text-sm text-neutral-500 dark:text-neutral-400">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> {post.date}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" /> {post.readTime}
                                </div>
                                {/* Share Action */}
                                <div className="pl-6 border-l border-neutral-200 dark:border-neutral-800">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="rounded-full gap-2 hover:text-orange-600 hover:border-orange-200 dark:hover:border-orange-900/50"
                                        onClick={() => handle修Share(post.title, post.excerpt, currentUrl)}
                                    >
                                        <Share2 className="w-4 h-4" /> Share
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="container max-w-7xl mx-auto px-4 sm:px-6 mb-16">
                        <motion.div 
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="relative aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <Image 
                                src={post.coverImage} 
                                alt={post.title} 
                                fill 
                                className="object-cover"
                                priority
                            />
                        </motion.div>
                    </div>

                    {/* Article Content (Prose) */}
                    <div className="container max-w-3xl mx-auto px-6">
                        <div 
                            className="prose prose-lg dark:prose-invert prose-neutral 
                            prose-headings:font-bold prose-headings:tracking-tight 
                            prose-a:text-orange-600 dark:prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline
                            prose-img:rounded-3xl prose-img:shadow-lg
                            prose-quotes:border-l-orange-500 prose-quotes:bg-orange-50/50 dark:prose-quotes:bg-neutral-900/50 prose-quotes:py-2 prose-quotes:px-6 prose-quotes:not-italic prose-quotes:rounded-r-xl
                            max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>
                
                {/* Bottom CTA / Read Next could go here */}
                <div className="container max-w-3xl mx-auto px-6 pb-24 text-center">
                     <p className="text-neutral-500 mb-6">Share this article</p>
                     <div className="flex items-center justify-center gap-4">
                        <Button variant="outline" size="icon" className="rounded-full" onClick={() => handleShare(post.title, post.excerpt, currentUrl)}>
                            <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full">
                            <Twitter className="w-4 h-4" />
                        </Button>
                         <Button variant="outline" size="icon" className="rounded-full">
                            <Linkedin className="w-4 h-4" />
                        </Button>
                     </div>
                </div>
            </div>
        </SmoothScroll>
    );
}