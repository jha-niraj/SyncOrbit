"use client"

import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RainbowButton } from '@/components/ui/rainbow-button';
import ShinyButton from '@/components/ui/shiny-button';

const HeroSection = () => {
	return (
		<section className="h-screen flex flex-col items-center justify-center overflow-hidden">
			<div className="container pt-12 flex flex-col gap-3 sm:pt-20 mx-auto px-4 sm:px-6 lg:px-8">
				<ShinyButton className="w-[65%] mx-auto">
					<p className="text-small font-medium">
						Work on your ideas, leave the technicalities to us.
					</p>
				</ShinyButton>
				<motion.div
					className="max-w-3xl mx-auto text-center"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					<h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
						<span className="block">Elevate Your Digital Presence with</span>
						<span className="block text-primary mt-2">The Coder&apos;z</span>
					</h1>
					<p className="mt-6 text-lg text-muted-foreground">
						We specialize in professional video editing, eye-catching thumbnails, and cutting-edge web development. Let us bring your vision to life and help you stand out in the digital landscape.
					</p>
					<div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
						<RainbowButton>
							<div className="flex gap-4 items-center justify-center">
								<div className="flex items-center justify-center gap-2">
									<Calendar />
									Book a Call
								</div>
								{/* <ArrowRight className="ml-2 hover:left-2" size={24} /> */}
							</div>
						</RainbowButton>
						<Button size="lg" variant="outline">
							View Our Work
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};

export default HeroSection;