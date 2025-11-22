"use client"

import React, { useEffect } from "react";
import Navbar from "@/components/navbar";
import Hero from "@/components/(landingpage)/herosection";
import HumanoidSection from "@/components/(landingpage)/humaoidsection";
import SpecsSection from "@/components/(landingpage)/specssection";
import DetailsSection from "@/components/(landingpage)/detailssection";
import ImageShowcaseSection from "@/components/(landingpage)/imageshowcasesection";
import Features from "@/components/(landingpage)/featuressection";
import Pricing from "@/components/(landingpage)/pricing";
import Security from "@/components/(landingpage)/security";
import MadeByShunyaTech from "@/components/(landingpage)/madebyshunyatech";
import Footer from "@/components/footer";
import HowItWorks from "@/components/(landingpage)/howitworks";
import Testimonials from "@/components/(landingpage)/testimonials";
import SmoothScroll from "@/components/smoothscroll";

const LandingPage = () => {
    // Initialize intersection observer to detect when elements enter viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const elements = document.querySelectorAll(".animate-on-scroll");
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, []);

    useEffect(() => {
        // This helps ensure smooth scrolling for the anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = (e.target as HTMLAnchorElement).getAttribute('href')?.substring(1);
                if (!targetId) return;

                const targetElement = document.getElementById(targetId);
                if (!targetElement) return;

                // Increased offset to account for mobile nav
                const offset = window.innerWidth < 768 ? 100 : 80;

                window.scrollTo({
                    top: targetElement.offsetTop - offset,
                    behavior: 'smooth'
                });
            });
        });
    }, []);

    return (
        <SmoothScroll>
            <div className="min-h-screen">
                <Navbar />
                <main className="space-y-4 sm:space-y-8">
                    <Hero />
                    <HumanoidSection />
                    <SpecsSection />
                    <DetailsSection />
                    <ImageShowcaseSection />
                    <Features />
                    <HowItWorks />
                    <Testimonials />
                    <Pricing />
                    <Security />
                    <MadeByShunyaTech />
                </main>
                <Footer />
            </div>
        </SmoothScroll>
    );
};

export default LandingPage;