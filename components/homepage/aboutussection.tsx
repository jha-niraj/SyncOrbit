import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Sparkles, Target, Award } from "lucide-react"
import Image from "next/image"

const features = [
    {
        name: "Expert Team",
        description: "Our team comprises industry veterans and innovative minds working together to deliver exceptional results.",
        icon: Users
    },
    {
        name: "Innovation Focus",
        description: "We stay at the forefront of technology, implementing cutting-edge solutions for modern challenges.",
        icon: Sparkles
    },
    {
        name: "Client Success",
        description: "Your success is our priority. We align our solutions with your business objectives and growth targets.",
        icon: Target
    },
    {
        name: "Quality Assurance",
        description: "Rigorous quality standards and best practices ensure reliable, scalable, and secure solutions.",
        icon: Award
    }
]

export default function AboutUsSection() {
    return (
        <section id="about" className="py-24 bg-transparent">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <Badge variant="outline" className="px-4 py-2 border-teal-200/30 dark:border-teal-800/30 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
                            <Users className="w-4 h-4 text-teal-500 mr-2" />
                            <span className="text-teal-700 dark:text-teal-300">About Us</span>
                        </Badge>
                        <h2 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
                            Transforming Ideas into Digital Excellence
                        </h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                            ShunyaTech is a leading technology solutions provider, dedicated to helping businesses thrive in the digital age through innovative software solutions and expert consulting.
                        </p>
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {
                                features.map((feature) => (
                                    <motion.div
                                        key={feature.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.5 }}
                                        className="relative bg-white/50 dark:bg-black/50 backdrop-blur-xl rounded-xl p-4 border border-teal-200/30 dark:border-teal-800/30"
                                    >
                                        <feature.icon className="h-6 w-6 text-teal-500 mb-2" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {feature.name}
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                            {feature.description}
                                        </p>
                                    </motion.div>
                                ))
                            }
                        </div>
                        <div className="mt-8 flex flex-wrap gap-4">
                            <Button asChild size="lg" className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl">
                                <Link href="/contact">Get in Touch</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="rounded-xl border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30">
                                <Link href="/team">Meet Our Team</Link>
                            </Button>
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-black via-emerald-500/10 to-black p-1">
                            <Image
                                src="/shunyatech.png"
                                alt="ShunyaTech Team"
                                width={600}
                                height={600}
                                className="rounded-xl object-cover"
                                priority
                            />
                            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-teal-500/10 dark:ring-teal-400/10" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}