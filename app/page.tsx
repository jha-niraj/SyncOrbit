"use client"

import SmoothScroll from "@/components/smoothscroll";
import Navbar from "@/components/homepage/site-header";
import HeroSection from "@/components/homepage/herosection";
import { ServicesSection } from "@/components/homepage/services-section";
import { ProjectsSection } from "@/components/homepage/projects-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";
import { LocationsSection } from "@/components/homepage/locations-section";
import ScrollProgress from "@/components/ui/scroll-progress";

export default function ServicesPage() {
    return (
        <SmoothScroll>
            <div className="relative max-w-7xl mx-auto">
                <Navbar />
                <ScrollProgress className="top-[65px]" />
                <main>
                    <HeroSection />
                    <ServicesSection />
                    <ProjectsSection />
                    <TestimonialsSection />
                    <LocationsSection />
                </main>
            </div>
        </SmoothScroll>
    )
}