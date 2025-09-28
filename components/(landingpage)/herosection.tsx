
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import LottieAnimation from "./lottieanimation";

const Hero = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [lottieData, setLottieData] = useState<any>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile on mount and when window resizes
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        fetch('/loop-header.lottie')
            .then(response => response.json())
            .then(data => setLottieData(data))
            .catch(error => console.error("Error loading Lottie animation:", error));
    }, []);

    useEffect(() => {
        // Skip effect on mobile
        if (isMobile) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current || !imageRef.current) return;

            const {
                left,
                top,
                width,
                height
            } = containerRef.current.getBoundingClientRect();
            const x = (e.clientX - left) / width - 0.5;
            const y = (e.clientY - top) / height - 0.5;

            imageRef.current.style.transform = `perspective(1000px) rotateY(${x * 2.5}deg) rotateX(${-y * 2.5}deg) scale3d(1.02, 1.02, 1.02)`;
        };

        const handleMouseLeave = () => {
            if (!imageRef.current) return;
            imageRef.current.style.transform = `perspective(1000px) rotateY(0deg) rotateX(0deg) scale3d(1, 1, 1)`;
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener("mousemove", handleMouseMove);
            container.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, [isMobile]);

    useEffect(() => {
        // Skip parallax on mobile
        if (isMobile) return;

        const handleScroll = () => {
            const scrollY = window.scrollY;
            const elements = document.querySelectorAll('.parallax');
            elements.forEach(el => {
                const element = el as HTMLElement;
                const speed = parseFloat(element.dataset.speed || '0.1');
                const yPos = -scrollY * speed;
                element.style.setProperty('--parallax-y', `${yPos}px`);
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile]);

    return (
        <section
            className="overflow-hidden relative bg-cover"
            id="hero"
            style={{
                backgroundImage: 'url("/Header-background.webp")',
                backgroundPosition: 'center 30%',
                padding: isMobile ? '100px 12px 40px' : '120px 20px 60px'
            }}
        >
            <div className="absolute -top-[10%] -right-[5%] w-1/2 h-[70%] bg-pulse-gradient opacity-20 blur-3xl rounded-full"></div>

            <div className="container px-4 sm:px-6 lg:px-8" ref={containerRef}>
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-center">
                    <div className="w-full lg:w-1/2">
                        <div
                            className="pulse-chip mb-3 sm:mb-6 opacity-0 animate-fade-in"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">01</span>
                            <span>Project Management</span>
                        </div>

                        <h1
                            className="section-title text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight opacity-0 animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            Transform How Your Team<br className="hidden sm:inline" />Delivers — Faster, Clearer, Together
                        </h1>

                        <p
                            style={{ animationDelay: "0.5s" }}
                            className="section-subtitle mt-3 sm:mt-6 mb-4 sm:mb-8 leading-relaxed opacity-0 animate-fade-in text-gray-950 font-normal text-base sm:text-lg text-left"
                        >
                            A single workspace to plan, track and ship work — built for teams that want fewer meetings and more results.
                        </p>

                        <p
                            style={{ animationDelay: "0.6s" }}
                            className="mt-3 mb-6 leading-relaxed opacity-0 animate-fade-in text-gray-700 font-normal text-sm sm:text-base text-left"
                        >
                            Plan with clarity. Collaborate in real time. Ship with confidence. ProjectCentral turns project chaos into a smooth system so your team spends less time coordinating and more time building.
                        </p>

                        <div
                            className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in"
                            style={{ animationDelay: "0.7s" }}
                        >
                            <div className="flex flex-col sm:flex-row gap-4 w-full">
                                <a
                                    href="#get-access"
                                    className="flex items-center justify-center group w-full sm:w-auto text-center"
                                    style={{
                                        backgroundColor: '#FE5C02',
                                        borderRadius: '1440px',
                                        boxSizing: 'border-box',
                                        color: '#FFFFFF',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        padding: '16px 24px',
                                        border: '1px solid white',
                                    }}
                                >
                                    Get Early Access
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                                <a
                                    href="#features"
                                    className="flex items-center justify-center group w-full sm:w-auto text-center border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                                    style={{
                                        borderRadius: '1440px',
                                        boxSizing: 'border-box',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        lineHeight: '20px',
                                        padding: '16px 24px',
                                    }}
                                >
                                    See Live Demo
                                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </a>
                            </div>

                            <div
                                className="text-center text-sm text-gray-600 opacity-0 animate-fade-in mt-4"
                                style={{ animationDelay: "0.8s" }}
                            >
                                14-day free trial • No credit card required • Instant onboarding
                            </div>

                            <div
                                className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-4 text-xs text-gray-500 opacity-0 animate-fade-in"
                                style={{ animationDelay: "0.9s" }}
                            >
                                <span>Trusted by startups, agencies & teams</span>
                                <span>•</span>
                                <span>Integrates with Slack, GitHub, Figma, Zoom</span>
                            </div>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 relative mt-6 lg:mt-0">
                        {lottieData ? (
                            <div className="relative z-10 animate-fade-in" style={{ animationDelay: "0.9s" }}>
                                <LottieAnimation
                                    animationPath={lottieData}
                                    className="w-full h-auto max-w-lg mx-auto"
                                    loop={true}
                                    autoplay={true}
                                />
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-dark-900 rounded-2xl sm:rounded-3xl -z-10 shadow-xl"></div>
                                <div className="relative transition-all duration-500 ease-out overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl">
                                    <img
                                        ref={imageRef}
                                        src="/lovable-uploads/5663820f-6c97-4492-9210-9eaa1a8dc415.png"
                                        alt="Atlas Robot"
                                        className="w-full h-auto object-cover transition-transform duration-500 ease-out"
                                        style={{ transformStyle: 'preserve-3d' }}
                                    />
                                    <div className="absolute inset-0" style={{ backgroundImage: 'url("/hero-image.jpg")', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay', opacity: 0.5 }}></div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="hidden lg:block absolute bottom-0 left-1/4 w-64 h-64 bg-pulse-100/30 rounded-full blur-3xl -z-10 parallax" data-speed="0.05"></div>
        </section>
    );
};

export default Hero;