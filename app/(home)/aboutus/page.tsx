"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Building2, Target, Users2, Lightbulb } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import SmoothScroll from "@/components/smoothscroll"
import { Button } from "@/components/ui/button"

const teamMembers = [
    {
        id: 1,
        name: "John Smith",
        role: "CEO & Founder",
        image: "/team/ceo.jpg",
        bio: "15+ years of experience in tech leadership and innovation",
        linkedin: "https://linkedin.com"
    },
    {
        id: 2,
        name: "Sarah Johnson",
        role: "CTO",
        image: "/team/cto.jpg",
        bio: "Expert in cloud architecture and emerging technologies",
        linkedin: "https://linkedin.com"
    },
    {
        id: 3,
        name: "Michael Chen",
        role: "Lead Developer",
        image: "/team/lead-dev.jpg",
        bio: "Full-stack developer with a passion for clean code",
        linkedin: "https://linkedin.com"
    },
    {
        id: 4,
        name: "Emily Davis",
        role: "Product Manager",
        image: "/team/pm.jpg",
        bio: "Driving product vision and user experience",
        linkedin: "https://linkedin.com"
    },
    {
        id: 5,
        name: "Alex Turner",
        role: "UI/UX Designer",
        image: "/team/designer.jpg",
        bio: "Creating beautiful and intuitive interfaces",
        linkedin: "https://linkedin.com"
    },
    {
        id: 6,
        name: "Lisa Wang",
        role: "Marketing Director",
        image: "/team/marketing.jpg",
        bio: "Digital marketing expert with global experience",
        linkedin: "https://linkedin.com"
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

export default function AboutUsPage() {
    const scrollToSection = (sectionId: string) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <SmoothScroll>
            <div className="min-h-screen">
                <section className="relative py-40 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-black dark:to-slate-900 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-400/10 rounded-full blur-3xl"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-center"
                        >
                            <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                                <Building2 className="w-4 h-4 text-teal-500 mr-2" />
                                <span className="text-teal-700 dark:text-teal-300">About Us</span>
                            </Badge>
                            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl leading-tight">
                                Innovating for <span className="text-indigo-500">a Smarter Tomorrow</span>
                            </h1>
                            <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                                We are a team of engineers, designers, and strategists passionate about building scalable digital solutions. Our mission is to empower businesses with the technology they need to thrive in a connected world.
                            </p>
                            <div className="mt-8 flex justify-center gap-4 flex-wrap">
                                <Button 
                                    variant="default" 
                                    size="lg"
                                    onClick={() => scrollToSection("team")}
                                >
                                    Meet the Team
                                </Button>
                                <Button variant="outline" size="lg">
                                    <Link href="/#approach">Our Approach</Link>
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </section>
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-12"
                        >
                            <motion.div
                                variants={item}
                                className="shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-teal-200/30 dark:border-teal-800/30"
                            >
                                <Target className="w-12 h-12 text-teal-500 mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    To empower businesses with cutting-edge technology solutions that drive growth, efficiency, and innovation. We strive to be at the forefront of digital transformation, delivering exceptional value to our clients.
                                </p>
                            </motion.div>
                            <motion.div
                                variants={item}
                                className="shadow-lg hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-teal-200/30 dark:border-teal-800/30"
                            >
                                <Lightbulb className="w-12 h-12 text-teal-500 mb-6" />
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
                                <p className="text-gray-600 dark:text-gray-300">
                                    To be the leading force in digital innovation, recognized globally for our commitment to excellence, sustainability, and creating meaningful impact through technology.
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>
                <section id="team" className="py-24 bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-black dark:to-slate-900">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-16"
                        >
                            <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                                <Users2 className="w-4 h-4 text-teal-500 mr-2" />
                                <span className="text-teal-700 dark:text-teal-300">Our Team</span>
                            </Badge>
                            <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                                Meet the Innovators
                            </h2>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                                Our diverse team brings together expertise from various domains to deliver exceptional results.
                            </p>
                        </motion.div>
                        <motion.div
                            variants={container}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {
                                teamMembers.map((member) => (
                                    <motion.div
                                        key={member.id}
                                        variants={item}
                                        className="group relative bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-2xl p-6 border border-teal-200/30 dark:border-teal-800/30 hover:border-teal-300 dark:hover:border-teal-700 transition-all duration-300"
                                    >
                                        <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden">
                                            <Image
                                                src={member.image}
                                                alt={member.name}
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                                            />
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            {member.name}
                                        </h3>
                                        <p className="text-teal-600 dark:text-teal-400 font-medium mt-1">
                                            {member.role}
                                        </p>
                                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                                            {member.bio}
                                        </p>
                                        <div className="mt-6">
                                            <Link
                                                href={member.linkedin}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                                            >
                                                Connect on LinkedIn →
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))
                            }
                        </motion.div>
                    </div>
                </section>
            </div>
        </SmoothScroll>
    )
}
