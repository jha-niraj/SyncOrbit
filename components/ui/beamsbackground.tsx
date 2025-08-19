"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedGradientBackgroundProps {
    className?: string;
    children?: React.ReactNode;
    intensity?: "subtle" | "medium" | "strong";
}

interface Beam {
    x: number;
    y: number;
    width: number;
    length: number;
    angle: number;
    speed: number;
    opacity: number;
    hue: number;
    pulse: number;
    pulseSpeed: number;
}

function createBeam(width: number, height: number): Beam {
    const angle = -35 + Math.random() * 10;
    return {
        x: Math.random() * width * 1.2 - width * 0.1, // Reduced spread for performance
        y: Math.random() * height * 1.2 - height * 0.1,
        width: 25 + Math.random() * 50, // Slightly smaller beams
        length: height * 2,
        angle: angle,
        speed: 0.4 + Math.random() * 0.8, // Slightly slower for smoothness
        opacity: 0.1 + Math.random() * 0.12,
        hue: 190 + Math.random() * 60, // Reduced color range
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.02, // Slower pulse for smoothness
    };
}

export function BeamsBackground({
    className,
    intensity = "strong",
}: AnimatedGradientBackgroundProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const beamsRef = useRef<Beam[]>([]);
    const animationFrameRef = useRef<number>(0);
    const lastFrameTimeRef = useRef<number>(0);
    const isVisibleRef = useRef<boolean>(true);
    const MINIMUM_BEAMS = 15; // Reduced for better performance
    const TARGET_FPS = 30; // Limit frame rate for better scroll performance
    const FRAME_INTERVAL = 1000 / TARGET_FPS;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const currentOpacityMap = {
            subtle: 0.7,
            medium: 0.85,
            strong: 1,
        };

        const updateCanvasSize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2); // Limit DPR for performance
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = `${window.innerWidth}px`;
            canvas.style.height = `${window.innerHeight}px`;
            ctx.scale(dpr, dpr);

            const totalBeams = Math.min(MINIMUM_BEAMS * 1.2, 25); // Cap max beams
            beamsRef.current = Array.from({ length: totalBeams }, () =>
                createBeam(canvas.width, canvas.height)
            );
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);

        // Add Intersection Observer to pause animation when not visible
        const observer = new IntersectionObserver(
            (entries) => {
                isVisibleRef.current = entries[0].isIntersecting;
            },
            { threshold: 0.1 }
        );

        if (canvas) {
            observer.observe(canvas);
        }

        function resetBeam(beam: Beam, index: number, totalBeams: number) {
            if (!canvas) return beam;
            
            const column = index % 3;
            const spacing = canvas.width / 3;

            beam.y = canvas.height + 50; // Reduced offset
            beam.x =
                column * spacing +
                spacing / 2 +
                (Math.random() - 0.5) * spacing * 0.3; // Reduced randomness
            beam.width = 80 + Math.random() * 60; // Smaller beams
            beam.speed = 0.4 + Math.random() * 0.3; // Slower speed
            beam.hue = 190 + (index * 50) / totalBeams; // Smoother color transition
            beam.opacity = 0.15 + Math.random() * 0.08;
            return beam;
        }

        function drawBeam(ctx: CanvasRenderingContext2D, beam: Beam) {
            ctx.save();
            ctx.translate(beam.x, beam.y);
            ctx.rotate((beam.angle * Math.PI) / 180);

            // Calculate pulsing opacity
            const pulsingOpacity =
                beam.opacity *
                (0.8 + Math.sin(beam.pulse) * 0.2) *
                currentOpacityMap[intensity];

            const gradient = ctx.createLinearGradient(0, 0, 0, beam.length);

            // Enhanced gradient with multiple color stops
            gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`);
            gradient.addColorStop(
                0.1,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(
                0.4,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.6,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity})`
            );
            gradient.addColorStop(
                0.9,
                `hsla(${beam.hue}, 85%, 65%, ${pulsingOpacity * 0.5})`
            );
            gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`);

            ctx.fillStyle = gradient;
            ctx.fillRect(-beam.width / 2, 0, beam.width, beam.length);
            ctx.restore();
        }

        function animate(currentTime: number = 0) {
            if (!canvas || !ctx) return;

            // Frame rate limiting
            if (currentTime - lastFrameTimeRef.current < FRAME_INTERVAL) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            lastFrameTimeRef.current = currentTime;

            // Pause animation when not visible for performance
            if (!isVisibleRef.current) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Reduce blur for better performance
            ctx.filter = "blur(25px)";

            const totalBeams = beamsRef.current.length;
            beamsRef.current.forEach((beam, index) => {
                beam.y -= beam.speed;
                beam.pulse += beam.pulseSpeed;

                // Reset beam when it goes off screen
                if (beam.y + beam.length < -100) {
                    resetBeam(beam, index, totalBeams);
                }

                drawBeam(ctx, beam);
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        }

        animate();

        return () => {
            observer.disconnect();
            window.removeEventListener("resize", updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [intensity, FRAME_INTERVAL]);

    return (
        <div
            className={cn(
                "absolute inset-0 w-full h-full overflow-hidden",
                className
            )}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ 
                    filter: "blur(15px)",
                    willChange: "auto", // Optimize for performance
                    transform: "translateZ(0)" // Force hardware acceleration
                }}
            />

            <motion.div
                className="absolute inset-0 bg-white/15 dark:bg-neutral-900/15"
                animate={{
                    opacity: [0.08, 0.15, 0.08],
                }}
                transition={{
                    duration: 10, // Slower transition for smoothness
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                }}
                style={{
                    backdropFilter: "blur(20px)", // Reduced blur
                    willChange: "opacity", // Optimize for opacity changes only
                }}
            />
        </div>
    );
}