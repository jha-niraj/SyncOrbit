"use client"

import { AnimatedTestimonials } from "../ui/animated-testimonials";

const testimonials = [
    {
        quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
        name: "Priya Iyer",
        designation: "Product Manager at TechFlow",
        src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote: "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
        name: "Neha Gupta",
        designation: "CTO at InnovateSphere",
        src: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote: "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
        name: "Rohan Mehta",
        designation: "Operations Director at CloudScale",
        src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote: "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
        name: "Amit Sharma",
        designation: "Engineering Lead at DataPro",
        src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=3464&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        quote: "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
        name: "Arjun Khanna",
        designation: "VP of Technology at FutureNet",
        src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
];


export function TestimonialsSection() {

    return (
        <div className="py-12 flex max-w-7xl mx-auto flex-col items-center justify-center overflow-hidden rounded-lg">
            <h2 className="text-3xl font-bold text-center">What Our Client&apos;s Say</h2>
            <AnimatedTestimonials testimonials={testimonials} />
        </div>
    )
}

