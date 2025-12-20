"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowRight, Terminal, FolderOpen, FileText, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import SmoothScroll from "@/components/smoothscroll";
import {
    resourcesData, categories, ResourcePost, ResourceCategory
} from "./data/papersdata";

// Mapping icons for schematic feel
const categoryIcons = {
    'All': FolderOpen,
    'Whitepapers': FileText,
    'Feature Updates': Zap,
    'Engineering': Terminal
};

const ResourceCard = ({ post }: { post: ResourcePost }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="group relative flex flex-col bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-orange-500/50 dark:hover:border-orange-500/50 transition-all duration-300 rounded-lg hover:shadow-[0_0_30px_-10px_rgba(249,115,22,0.15)]"
        >
            <div className="h-8 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex items-center justify-between px-3">
                <span className="text-[10px] font-mono uppercase text-neutral-500">{post.category}</span>
                <span className="text-[10px] font-mono text-neutral-400">{post.date}</span>
            </div>
            <Link href={`/papers/${post.slug}`} className="relative h-48 w-full overflow-hidden block">
                <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-neutral-900/10 group-hover:bg-transparent transition-colors" />
            </Link>
            <div className="p-6 flex flex-col flex-1">
                <Link href={`/papers/${post.slug}`}>
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-orange-500 transition-colors leading-tight">
                        {post.title}
                    </h3>
                </Link>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-neutral-200 overflow-hidden relative">
                            <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                        </div>
                        <span className="text-xs font-mono text-neutral-500">{post.author.name}</span>
                    </div>
                    <Link href={`/papers/${post.slug}`} className="text-neutral-400 hover:text-orange-500 transition-colors">
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default function ResourcesListingPage() {
    const [activeCategory, setActiveCategory] = useState<ResourceCategory>("All");
    const filteredPosts = resourcesData.filter(post => activeCategory === "All" ? true : post.category === activeCategory);

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 font-sans">
                <section className="relative pt-32 pb-12 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
                    <div className="absolute top-0 right-0 w-[500px] h-[300px] bg-orange-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <div className="container max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="text-[10px] font-mono uppercase tracking-widest text-orange-500 mb-2">/ Archive_Access</div>
                                <h1 className="text-4xl md:text-6xl font-bold text-neutral-900 dark:text-white tracking-tighter">
                                    Engineering <span className="text-neutral-400">Logs</span>
                                </h1>
                            </div>
                            <p className="text-neutral-600 dark:text-neutral-400 max-w-md text-sm leading-relaxed">
                                Technical whitepapers, release notes, and operational research on high-velocity team synchronization.
                            </p>
                        </div>
                    </div>
                </section>
                <section className="py-12 px-6">
                    <div className="container max-w-7xl mx-auto">
                        <div className="flex flex-wrap items-center gap-1 mb-10 border-b border-neutral-200 dark:border-neutral-800 pb-1">
                            {
                                categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={cn(
                                            "px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border-b-2",
                                            activeCategory === category
                                                ? "border-orange-500 text-orange-600 dark:text-orange-500 bg-orange-50 dark:bg-orange-900/10"
                                                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
                                        )}
                                    >
                                        {category}
                                    </button>
                                ))
                            }
                        </div>
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {
                                    filteredPosts.map((post) => (
                                        <ResourceCard key={post.id} post={post} />
                                    ))
                                }
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </section>
            </div>
        </SmoothScroll>
    );
}