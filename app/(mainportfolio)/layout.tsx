import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/homepage/site-header";
import { ThemeProvider } from "@/components/theme-providers";
import Footer from "@/components/homepage/footer";
import { Toaster } from "@/components/ui/toaster";

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
	);
}
