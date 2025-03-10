"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Code, Film, Layers, LucideIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

interface Service {
    icon: LucideIcon;
    title: string;
    description: string;
    extendedDescription: string;
    features: string[];
}

const services: Service[] = [
    {
        icon: Code,
        title: "Web Development",
        description: "Custom websites and web applications built with the latest technologies.",
        extendedDescription: "Our web development services cover everything from simple static websites to complex web applications. We use modern frameworks and technologies to ensure your website is fast, secure, and scalable. Our expertise includes frontend development with React, Angular, or Vue.js, backend development with Node.js, Python, or PHP, and database management with SQL or NoSQL solutions.",
        features: ["Responsive Design", "E-commerce Solutions", "CMS Integration", "API Development", "Performance Optimization", "SEO-friendly Structure"]
    },
    {
        icon: Layers,
        title: "Design",
        description: "Stunning visual designs that captivate and engage your audience.",
        extendedDescription: "Our design services focus on creating visually appealing and user-friendly interfaces that align with your brand identity. We combine aesthetics with functionality to deliver designs that not only look great but also provide an excellent user experience. From wireframing to final mockups, we ensure every design element serves a purpose.",
        features: ["UI/UX Design", "Brand Identity", "Graphic Design", "Logo Design", "Illustration", "Print Design"]
    },
    {
        icon: Film,
        title: "Video Editing",
        description: "Professional video editing services for all your content needs.",
        extendedDescription: "Our video editing services transform raw footage into polished, engaging content. Whether you need a promotional video for your business, content for social media, or a full-length documentary, our team has the skills and creativity to bring your vision to life. We use industry-standard software and techniques to ensure high-quality results.",
        features: ["Commercial Videos", "Social Media Content", "Motion Graphics", "Color Grading", "Sound Design", "Video Effects"]
    },
];

export default function ServicesSection() {
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const handleLearnMore = (service: Service) => {
        setSelectedService(service);
        setIsSheetOpen(true);
    };

    return (
        <section className="py-20 max-w-7xl mx-auto relative">
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none"></div>
            <div className="w-full px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex flex-col items-center justify-center space-y-4 text-center"
                >
                    <div className="space-y-2 max-w-3xl">
                        <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                            Our Services
                        </div>
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                            Premium Services at Competitive Prices
                        </h2>
                        <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            We deliver high-quality digital solutions that help businesses grow and succeed in the digital
                            landscape.
                        </p>
                    </div>
                </motion.div>
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="w-full mx-auto grid items-center gap-8 py-12 lg:grid-cols-3"
                >
                    {
                        services.map((service, index) => (
                            <Card key={index} className="group relative overflow-hidden rounded-xl border bg-background p-2 transition-all hover:shadow-lg hover:-translate-y-1">
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent z-0"></div>
                                <CardHeader className="p-4 relative z-10">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <service.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="mt-4">{service.title}</CardTitle>
                                    <CardDescription>{service.description}</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 relative z-10">
                                    <ul className="grid gap-2">
                                        {service.features.slice(0, 3).map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-primary" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                                <CardFooter className="p-4 pt-0 relative z-10">
                                    <Button variant="outline" className="w-full group" onClick={() => handleLearnMore(service)}>
                                        Learn More
                                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    }
                </motion.div>
            </div>

            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>{selectedService?.title}</SheetTitle>
                        <SheetDescription>{selectedService?.description}</SheetDescription>
                    </SheetHeader>
                    <div className="mt-6">
                        <p className="text-muted-foreground mb-6">{selectedService?.extendedDescription}</p>
                        <h4 className="text-xl font-semibold mb-4">Features:</h4>
                        <ul className="grid gap-3">
                            {
                                selectedService?.features.map((feature, index) => (
                                    <li key={index} className="flex items-center gap-2">
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                        <span>{feature}</span>
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                    <SheetClose asChild>
                        <Button className="mt-6" variant="outline">Close</Button>
                    </SheetClose>
                </SheetContent>
            </Sheet>
        </section>
    );
}