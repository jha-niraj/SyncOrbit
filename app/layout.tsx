import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-providers";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "@/components/homepage/navbar";
import Footer from "@/components/footer";
import { Providers } from "./providers/providers";

const inter = Inter({ subsets: ["latin"] });

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
		<html lang="en" suppressHydrationWarning style={{ scrollBehavior: "smooth" }}>
			<head>
				<link rel="icon" href="/favicon.ico" />
			</head>
			<body className={inter.className}>
				<Providers>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<Navbar />
						<main>{children}</main>
						<Footer />
						<Toaster />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}
