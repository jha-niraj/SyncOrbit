import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/homepage/site-header";

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
	title: "The Coder'z",
	description: "You think we will deliver the best",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={spaceGrotesk.className} style={{ scrollBehavior: "smooth" }}
			>
				<main className="relative max-w-7xl mx-auto dark:bg-black bg-white dark:bg-grid-white/[0.2] bg-grid-black/[0.2]">
					<div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
					<Navbar />
					{children}
				</main>
			</body>
		</html>
	);
}
