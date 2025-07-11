"use client"

import SmoothScroll from "@/components/smoothscroll";
import HeroSection from "@/components/homepage/herosection";
import ServicesSection from "@/components/homepage/services-section";
import ProjectsSection from "@/components/homepage/projects-section";
import { TestimonialsSection } from "@/components/homepage/testimonials-section";
import WhyUs from "@/components/homepage/whyus";
import PricingSection from "@/components/homepage/pricing-section";
import FaqsAccrodian from "@/components/homepage/faqs";
import { PeopleService } from "@/components/homepage/poepleserve";
import AboutUsSection from "@/components/homepage/aboutussection";
import ApproachSection from "@/components/homepage/approach";
import CTAPage from "@/components/homepage/cta";
import Navbar from "@/components/homepage/navbar";
import Footer from "@/components/footer";

export default function MainLandingPage() {
    return (
        <SmoothScroll>
            <Navbar />
            <main className="w-full">
                <HeroSection />
                <section className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-black dark:to-slate-900">
                    <ServicesSection />
                    <ProjectsSection />
                    <AboutUsSection />
                    <ApproachSection />
                    <WhyUs />
                    <TestimonialsSection />
                    <PeopleService />
                    <PricingSection />
                    <FaqsAccrodian />
                    <CTAPage />
                </section>
            </main>
            <Footer />
        </SmoothScroll>
    )
}