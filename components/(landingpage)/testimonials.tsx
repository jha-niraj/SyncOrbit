"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

// Updated Data relevant to ProjectCentral
const testimonials = [
    {
        text: "ProjectCentral revolutionized our sprint planning. We cut meeting times by 40% and the team actually enjoys updating their status now.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
        name: "Sarah Chen",
        role: "Product Manager @ TechFlow",
    },
    {
        text: "The gamification features are genius. My engineering team competes to clear the backlog to earn points. Productivity is at an all-time high.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        name: "Michael Rodriguez",
        role: "CTO @ DevCorp",
    },
    {
        text: "Finally, a tool that handles complex hierarchies without feeling clunky. The 'Team Heads' feature gave our managers the autonomy they needed.",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80",
        name: "Dr. Amara Patel",
        role: "Director @ Creative Agency",
    },
    {
        text: "We migrated from Jira in less than a day. The import tool was flawless, and the UI is so much cleaner. No training required.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
        name: "Omar Raza",
        role: "Founder @ StartupX",
    },
    {
        text: "The timeline view is actually usable. I can see dependencies across three different departments without the graph breaking.",
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
        name: "Zainab Hussain",
        role: "Program Manager",
    },
    {
        text: "Customer support is incredible. We needed a custom integration for our internal chat tool and they helped us build it via API.",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
        name: "Aliza Khan",
        role: "Tech Lead",
    },
    {
        text: "Best investment we made this year. The ROI on clarity alone is worth it. No more 'what are you working on?' messages.",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
        name: "Farhan Siddiqui",
        role: "VP of Operations",
    },
    {
        text: "I love the dark mode implementation. It's easy on the eyes for late-night coding sessions. The UX is top-tier.",
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=150&q=80",
        name: "Sana Sheikh",
        role: "Senior Developer",
    },
    {
        text: "From a marketing perspective, managing campaigns here is a breeze. The visual boards make asset tracking very simple.",
        image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=150&q=80",
        name: "Hassan Ali",
        role: "Marketing Lead",
    },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

const TestimonialsColumn = (props: {
    className?: string;
    testimonials: typeof testimonials;
    duration?: number;
}) => {
    return (
        <div className={props.className}>
            <motion.div
                animate={{
                    translateY: "-50%",
                }}
                transition={{
                    duration: props.duration || 10,
                    repeat: Infinity,
                    ease: "linear",
                    repeatType: "loop",
                }}
                className="flex flex-col gap-6 pb-6"
            >
                {
                    [...new Array(2)].map((_, index) => (
                        <React.Fragment key={index}>
                            {
                                props.testimonials.map(({ text, image, name, role }, i) => (
                                    <div
                                        key={i}
                                        className="p-8 rounded-3xl border border-gray-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-lg dark:shadow-none"
                                    >
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">"{text}"</p>
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={image}
                                                alt={name}
                                                width={40}
                                                height={40}
                                                className="h-10 w-10 rounded-full object-cover border border-gray-200 dark:border-neutral-700"
                                            />
                                            <div className="flex flex-col">
                                                <div className="font-bold text-gray-900 dark:text-white text-sm">{name}</div>
                                                <div className="text-gray-500 dark:text-gray-500 text-xs font-medium">{role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </React.Fragment>
                    ))
                }
            </motion.div>
        </div>
    );
};

const Testimonials = () => {
    return (
        <section className="bg-white dark:bg-neutral-950 py-24 relative transition-colors duration-300" id="testimonials">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mb-12 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white text-xs">04</span>
                        <span>Testimonials</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
                        Trusted by teams who ship.
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        From startups to enterprises, see how teams are using ProjectCentral to deliver faster.
                    </p>
                </div>
                <div className="relative flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[700px] overflow-hidden">
                    <TestimonialsColumn testimonials={firstColumn} duration={15} />
                    <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
                    <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
                </div>
            </div>
        </section>
    );
};

export default Testimonials;