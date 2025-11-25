"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Copy, Share2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/smoothscroll";
import { 
    resourcesData, categories, ResourcePost, ResourceCategory, categoryIcons
} from "./data/papersdata";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// --- Card Component ---
const ResourceCard = ({ post }: { post: ResourcePost }) => {
    const Icon = categoryIcons[post.category];
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/resources/${post.slug}` : '';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex flex-col bg-white dark:bg-neutral-900 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:shadow-xl hover:border-orange-500/30 dark:hover:border-orange-500/30 transition-all duration-300"
        >
            {/* Image Container */}
            <Link href={`/resources/${post.slug}`} className="relative h-60 w-full overflow-hidden">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>

            {/* Content */}
            <div className="flex-1 p-8 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border",
                        post.category === 'Whitepapers' ? "bg-blue-100 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800" :
                            post.category === 'Feature Updates' ? "bg-purple-100 dark:bg-purple-900/20 text-purple-600 border-purple-200 dark:border-purple-800" :
                                "bg-orange-100 dark:bg-orange-900/20 text-orange-600 border-orange-200 dark:border-orange-800"
                    )}>
                        <Icon className="w-3.5 h-3.5" />
                        {post.category}
                    </div>
                    {/* Share Button on Card */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-neutral-500 hover:text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/20"
                        onClick={(e) => {
                            e.preventDefault(); // Prevent Link navigation
                            handleShare(post.title, post.excerpt, shareUrl);
                        }}
                    >
                        <Share2 className="w-4 h-4" />
                    </Button>
                </div>

                <Link href={`/resources/${post.slug}`} className="block group/title">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 leading-tight group-hover/title:text-orange-600 dark:group-hover/title:text-orange-500 transition-colors">
                        {post.title}
                    </h3>
                </Link>

                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
                    {post.excerpt}
                </p>

                {/* Footer Meta */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-3">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-200">
                            <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                        </div>
                        <div className="text-xs">
                            <p className="font-medium text-neutral-900 dark:text-white">{post.author.name}</p>
                            <p className="text-neutral-500">{post.date} · {post.readTime}</p>
                        </div>
                    </div>
                    <Link href={`/resources/${post.slug}`} className="text-orange-600 dark:text-orange-500 p-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/20 transition-colors">
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export const handleShare = async (title: string, text: string, url: string) => {
    // Use the Web Share API if available (mobile mostly)
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: url,
            });
            return;
        } catch (error) {
            console.log('Error sharing:', error);
        }
    }

    // Fallback: Copy to clipboard
    try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
    } catch (err) {
        toast.error("Failed to copy link.");
    }
};

// --- Main Page Component ---
export default function ResourcesListingPage() {
    const [activeCategory, setActiveCategory] = useState<ResourceCategory>("All");

    const filteredPosts = resourcesData.filter(post =>
        activeCategory === "All" ? true : post.category === activeCategory
    );

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 selection:bg-orange-500/30 selection:text-orange-900 dark:selection:text-white font-sans">
                <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-orange-500/5 dark:bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
                    <div className="container max-w-7xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-6"
                        >
                            <Sparkles className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-semibold uppercase tracking-wide text-neutral-600 dark:text-neutral-300">
                                Research & Insights
                            </span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white mb-6 tracking-tight"
                        >
                            The Orbit <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Knowledge Hub</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
                        >
                            Deep dives into productivity, new feature announcements, and research on the future of synchronized work.
                        </motion.p>
                    </div>
                </section>
                <section className="pt-12 pb-32 px-6">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
                            {
                                categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={cn(
                                            "relative px-6 py-2.5 rounded-full text-sm font-medium transition-colors outline-none",
                                            activeCategory === category
                                                ? "text-neutral-900 dark:text-white"
                                                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
                                        )}
                                    >
                                        {
                                            activeCategory === category && (
                                                <motion.div
                                                    layoutId="activeCategoryTab"
                                                    className="absolute inset-0 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm rounded-full -z-10"
                                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                />
                                            )
                                        }
                                        {category}
                                    </button>
                                ))
                            }
                        </div>
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {
                                    filteredPosts.map((post) => (
                                        <ResourceCard key={post.id} post={post} />
                                    ))
                                }
                            </AnimatePresence>
                        </motion.div>

                        {
                            filteredPosts.length === 0 && (
                                <div className="text-center py-20 text-neutral-500">
                                    No posts found in this category.
                                </div>
                            )
                        }
                    </div>
                </section>
            </div>
        </SmoothScroll>
    );
}