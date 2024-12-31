"use client"

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import Image from "next/image";
import p1 from "./_images/p1.jpg";
import p2 from "./_images/p2.jpg";
import p3 from "./_images/p3.jpg";
import p4 from "./_images/p4.jpg";
import p5 from "./_images/p5.jpg";

const portfolioItems = [
    {
        title: 'Travel Vlog Editing',
        image: 'https://images.unsplash.com/photo-1527856263669-12c3a0af2aa6?auto=format&fit=crop&w=800&q=80',
        category: 'Video Editing',
    },
    {
        title: 'Tech Review Thumbnail',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
        category: 'Thumbnail Design',
    },
    {
        title: 'E-commerce Website',
        image: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?auto=format&fit=crop&w=800&q=80',
        category: 'Web Development',
    },
];

export default function Portfolio() {
    return (
        <section id="portfolio" className="py-20 w-full">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.h2
                    className="text-3xl font-extrabold text-center text-foreground mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Our Portfolio
                </motion.h2>
                <div id='images' className='my-10 mx-32'>
                    <div id='line1' className='flex justify-center gap-7'>
                        <Image data-aos="flip-left" data-aos-easing="ease-out-cubic"
                            data-aos-duration="1000" className='w-[50%] h-[50%] rounded-2xl' src={p1} alt="" />
                        <Image data-aos="flip-right" data-aos-easing="ease-out-cubic"
                            data-aos-duration="1000" className='w-[50%] h-[50%] rounded-2xl' src={p2} alt="" />
                    </div>
                    <div id='line2' className='flex justify-center gap-5 my-7'>
                        <Image data-aos="flip-up" data-aos-easing="ease-out-cubic"
                            data-aos-duration="1000" className='w-[33%] h-[40%] rounded-2xl' src={p3} alt="" />
                        <Image data-aos="flip-down" data-aos-easing="ease-out-cubic"
                            data-aos-duration="1000" className='w-[33%] h-[40%] rounded-2xl' src={p4} alt="" />
                        <Image data-aos="flip-up" data-aos-easing="ease-out-cubic"
                            data-aos-duration="1000" className='w-[33%] h-[40%] rounded-2xl' src={p5} alt="" />
                    </div>
                </div>
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {portfolioItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="overflow-hidden group">
                                <CardContent className="p-0">
                                    <div className="relative h-64">
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            layout="fill"
                                            objectFit="cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-center">
                                                <h3 className="text-white text-xl font-semibold">{item.title}</h3>
                                                <p className="text-white mt-2">{item.category}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div> */}
            </div>
        </section>
    )
}