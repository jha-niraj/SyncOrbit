import type { Metadata } from "next";
import { Geist_Mono, Geist, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-providers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { Providers } from "./providers/providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});
const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-space-grotesk',
})
const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "ShunyaTech - Innovative Digital Solutions",
	description: "Transform your business with cutting-edge technology solutions from ShunyaTech. We specialize in web development, mobile apps, cloud solutions, and more.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body className={`${spaceGrotesk.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<main>{children}</main>
						<Toaster />
						<SonnerToaster position="top-center" closeButton richColors />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
