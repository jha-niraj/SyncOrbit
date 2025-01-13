import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/homepage/site-header";
import { ThemeProvider } from "@/components/theme-providers";
import Footer from "@/components/homepage/footer";
import { Toaster } from "@/components/ui/toaster";
import Head from "next/head";

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
	title: "Nexus",
	description: "You think we'll deliver",
	icons: {
        icon: "/nexuslogo.png",
    },
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
				<ThemeProvider
					attribute="class"
					defaultTheme="light"
					enableSystem
					disableTransitionOnChange
				>
					<main className="w-full mx-auto">
						<Navbar />
						{children}
						<Footer />
						<Toaster />
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
