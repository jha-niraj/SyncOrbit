"use client"

import SmoothScroll from "@/components/smoothscroll";
import HeroSection from "@/components/homepage/herosection";
import { ServicesSection } from "@/components/homepage/services-section";
import { ProjectsSection } from "@/components/homepage/projects-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";
import { LocationsSection } from "@/components/homepage/locations-section";
import { Approach } from "@/components/homepage/approach";

export default function ServicesPage() {
    return (
        <SmoothScroll>
            <main className="relative max-w-7xl mx-auto">
                <HeroSection />
                <ServicesSection />
                <ProjectsSection />
                <Approach />
                <TestimonialsSection />
                <LocationsSection />
            </main>
        </SmoothScroll>
    )
}