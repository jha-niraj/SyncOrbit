import { motion } from "framer-motion";
import { Palette, Code, Clock, Handshake, Shield, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WhyUs() {
    const cards = [
        {
            icon: <Palette className="w-8 h-8 text-teal-500 group-hover:rotate-45 transition-transform duration-300" />,
            title: "Creative Excellence",
            description:
                "Our design team combines creativity with strategic thinking to deliver visually stunning and user-centric digital experiences that resonate with your audience.",
        },
        {
            icon: <Code className="w-8 h-8 text-teal-500 group-hover:scale-110 transition-transform duration-300" />,
            title: "Technical Expertise",
            description:
                "We leverage cutting-edge technologies and industry best practices to build robust, scalable, and high-performance digital solutions.",
        },
        {
            icon: <Shield className="w-8 h-8 text-teal-500 group-hover:-translate-y-1 transition-transform duration-300" />,
            title: "Quality Assurance",
            description:
                "Rigorous testing and quality control processes ensure your project meets the highest standards of performance, security, and reliability.",
        },
        {
            icon: <Sparkles className="w-8 h-8 text-teal-500 group-hover:rotate-12 transition-transform duration-300" />,
            title: "Innovation Focus",
            description:
                "We stay ahead of digital trends, incorporating innovative solutions and emerging technologies to give your business a competitive edge.",
        },
        {
            icon: <Clock className="w-8 h-8 text-teal-500 group-hover:rotate-180 transition-transform duration-300" />,
            title: "Timely Delivery",
            description:
                "Our proven project management methodology ensures efficient execution and on-time delivery while maintaining transparency throughout the process.",
        },
        {
            icon: <Handshake className="w-8 h-8 text-teal-500 group-hover:scale-110 transition-transform duration-300" />,
            title: "Client Partnership",
            description:
                "We build lasting partnerships through dedicated support, clear communication, and a deep commitment to understanding and achieving your business goals.",
        },
    ];

    return (
        <section id="whyus" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                        <Sparkles className="w-4 h-4 text-teal-500 mr-2" />
                        <span className="text-teal-700 dark:text-teal-300">Why Choose Us</span>
                    </Badge>
                    <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                        Excellence in Every <span className="text-teal-500">Detail</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        We combine technical expertise with creative innovation to deliver exceptional digital solutions that drive your business forward.
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {
                        cards.map((card, index) => (
                            <motion.div
                                key={index}
                                className="group flex flex-col items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-teal-200/30 dark:border-teal-800/30 hover:border-teal-500/50 dark:hover:border-teal-500/50 transition-all duration-300"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                            >
                                {card.icon}
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-4">{card.title}</h3>
                                <p className="mt-2 text-gray-600 dark:text-gray-300 text-center leading-relaxed">{card.description}</p>
                                <div className="absolute -z-10 inset-0 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 dark:from-teal-500/10 dark:to-emerald-500/10 rounded-2xl" />
                            </motion.div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
}