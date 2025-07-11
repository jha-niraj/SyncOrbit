import React from "react";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

const data = [
    {
        question: "What services does our agency offer?",
        answer: "We offer a wide range of services including digital marketing, web development, graphic design, branding, and content creation tailored to meet your business needs."
    },
    {
        question: "How can I get started with our agency?",
        answer: "Getting started is easy! Simply fill out our contact form, and one of our team members will reach out to discuss your project and how we can assist you."
    },
    {
        question: "What is the typical project timeline?",
        answer: "Project timelines can vary based on the scope and complexity of the work. Generally, we aim to complete projects within 4 to 12 weeks. We'll provide a detailed timeline during our initial consultation."
    },
    {
        question: "Can you work within my budget?",
        answer: "Absolutely! We understand that every project has a budget. During our consultation, we will discuss your goals and find a solution that fits within your financial parameters."
    },
    {
        question: "Will I have a dedicated point of contact?",
        answer: "Yes! You will be assigned a dedicated project manager who will be your main point of contact throughout the project. They will keep you updated on progress and address any questions you may have."
    },
    {
        question: "Do you provide ongoing support after project completion?",
        answer: "Yes, we offer ongoing support and maintenance packages to ensure that your project continues to run smoothly after launch. We’re here to help with any updates or issues that may arise."
    },
    {
        question: "How do you measure the success of a project?",
        answer: "We measure success through key performance indicators (KPIs) defined at the start of each project. This may include metrics like website traffic, conversion rates, or social media engagement, depending on your goals."
    }
];

const FaqsAccrodian = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="max-w-7xl mx-auto mt-20 mb-16 bg-transparent"
            id="faqs"
        >
            <div className="flex flex-col lg:flex-row gap-10 w-full justify-around">
                <div className="flex flex-col gap-4 w-full lg:w-1/3">
                    <Badge className="w-14">FAQ&apos;s</Badge>
                    <h1 className="font-medium text-4xl">What would you like to know about Our Agency?</h1>
                    <Button className="flex gap-2 max-w-32">
                        <Link href="mailto:shunyatechofficial@gmail.com" className="flex gap-3">
                            <MessageCircle /> Talk to us
                        </Link>
                    </Button>
                </div>
                <div className="w-full lg:w-2/3">
                    <Accordion type="multiple" className="gap-3 rounded-lg flex flex-col">
                        {
                            data.map((faq, index) => {
                                return (
                                    <AccordionItem value={`item-${index}`} className="rounded-lg" key={index}>
                                        <AccordionTrigger className="text-left px-6">
                                            {
                                                faq.question
                                            }
                                        </AccordionTrigger>
                                        <AccordionContent className="px-6">
                                            {
                                                faq.answer
                                            }
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })
                        }
                    </Accordion>
                </div>
            </div>
        </motion.div>
    )
}

export default FaqsAccrodian;