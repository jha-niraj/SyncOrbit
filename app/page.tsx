"use client"

import SmoothScroll from "@/components/smoothscroll";
import HeroSection from "@/components/homepage/herosection";
import ServicesSection from "@/components/homepage/services-section";
import ProjectsSection from "@/components/homepage/projects-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";
// import { LocationsSection } from "@/components/homepage/locations-section";
import { Approach } from "@/components/homepage/approach";
import WhyUs from "@/components/homepage/whyus";
import PricingSection from "@/components/homepage/pricing-section";
import FaqsAccrodian from "@/components/homepage/faqs";

export default function ServicesPage() {
    return (
        <SmoothScroll>
            <main className="relative w-full mx-auto">
                <HeroSection />
                <ServicesSection />
                <ProjectsSection />
                <Approach />
                {/* <LocationsSection /> */}
                <WhyUs />
                <TestimonialsSection />
                <PricingSection />
                <FaqsAccrodian />
            </main>
        </SmoothScroll>
    )
}