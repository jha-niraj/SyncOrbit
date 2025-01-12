"use client";

import { motion } from "framer-motion";
import { Code, Paintbrush, Video } from "lucide-react";

const services = [
    {
        icon: Code,
        title: "Web Development and Deployment",
        description:
            "Build and deploy responsive, dynamic, and scalable websites using the latest web technologies and frameworks.",
    },
    {
        icon: Paintbrush,
        title: "Designing",
        description:
            "Create visually stunning designs for websites, apps, and branding that align with your business identity.",
    },
    {
        icon: Video,
        title: "Video Editing",
        description:
            "Produce high-quality videos with professional editing, transitions, and effects to create engaging content.",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.2,
            duration: 0.6,
            ease: "easeOut",
        },
    }),
};

export default function ServicesSection() {
    return (
        <section className="py-20 max-w-7xl mx-auto">
            <div className="px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl font-bold mb-4 text-black dark:text-white">
                        Our services
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Dive into our comprehensive collection of features which you can
                        use on the go
                    </p>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    {services.map((service, index) => {
                        const Icon = service.icon;
                        return (
                            <motion.div
                                key={index}
                                custom={index}
                                variants={cardVariants}
                                className="group relative text-black border dark:rounded-lg dark:text-white p-6 overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                <div className="absolute left-2 top-1/3 w-1 h-6 group-hover:scale-110 group-hover:bg-red-500 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-in-out" />
                                <div className="relative transition-transform duration-300 ease-in-out">
                                    <div className="p-3 rounded-lg bg-primary/10 inline-block">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-semibold group-hover:translate-x-2 transition-transform duration-300 ease-in-out mt-4">
                                        {service.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed mt-2">
                                        {service.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
