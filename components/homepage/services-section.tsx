import { motion } from "framer-motion";
import { Code2, Smartphone, Globe, Database, Shield, Rocket, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const services = [
    {
        icon: Code2,
        name: "Web Development",
        description: "Custom web applications built with modern frameworks and best practices",
        color: "text-teal-500"
    },
    {
        icon: Smartphone,
        name: "Mobile Apps",
        description: "Native and cross-platform mobile applications for iOS and Android",
        color: "text-emerald-500"
    },
    {
        icon: Globe,
        name: "Cloud Solutions",
        description: "Scalable cloud infrastructure and deployment strategies",
        color: "text-green-500"
    },
    {
        icon: Database,
        name: "Database Design",
        description: "Optimized database architecture and management systems",
        color: "text-blue-500"
    },
    {
        icon: Shield,
        name: "Security",
        description: "Robust security implementations and best practices",
        color: "text-indigo-500"
    },
    {
        icon: Rocket,
        name: "DevOps",
        description: "Streamlined development and deployment processes",
        color: "text-purple-500"
    },
    {
        icon: Zap,
        name: "API Development",
        description: "RESTful and GraphQL API design and implementation",
        color: "text-pink-500"
    },
    {
        icon: Sparkles,
        name: "UI/UX Design",
        description: "Beautiful and intuitive user interfaces and experiences",
        color: "text-orange-500"
    }
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ServicesSection() {
    return (
        <section id="services" className="py-12 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                            <Rocket className="w-4 h-4 text-teal-500 mr-2" />
                            <span className="text-teal-700 dark:text-teal-300">Our Services</span>
                        </Badge>
                        <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Comprehensive Digital Solutions
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                            From concept to deployment, we offer end-to-end services to bring your digital vision to life with cutting-edge technology and expert craftsmanship.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={container}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true }}
                        className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        {
                            services.map((service) => (
                                <motion.div
                                    key={service.name}
                                    variants={item}
                                    className="group flex flex-col items-center justify-center relative bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-teal-200/30 dark:border-teal-800/30 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300"
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/5 to-emerald-500/5 dark:from-teal-500/10 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <service.icon className={`h-8 w-8 ${service.color} mb-4 relative`} />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white relative">
                                        {service.name}
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300 relative">
                                        {service.description}
                                    </p>
                                </motion.div>
                            ))
                        }
                    </motion.div>
                </div>
            </div>
        </section>
    );
}