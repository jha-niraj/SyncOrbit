import type { Metadata } from "next";
import { Geist_Mono, Geist, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-providers";
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
	title: {
		default: "SyncOrbit",
		template: "%s | SyncOrbit"
	},
	description: "Eliminate friction and scattered workflows. Syncorbit brings your people, projects, and priorities into perfect alignment, ensuring everyone moves together in a stable, high-velocity path toward delivery.",
	keywords: ["Project Management", "Eliminate Friction", "Build"],
	authors: [{ name: "Niraj Jha" }],
	creator: "Shunya Tech",
	publisher: "Shunya Tech",
	metadataBase: new URL("https://www.syncorbit.nirajjha.xyz"),
	alternates: {
		canonical: "/",
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://www.syncorbit.nirajjha.xyz",
		siteName: "SyncOrbit",
		title: "SyncOrbit - Eliminate friction and scattered workflows",
		description: "Eliminate friction and scattered workflows. Syncorbit brings your people, projects, and priorities into perfect alignment, ensuring everyone moves together in a stable, high-velocity path toward delivery.",
		images: [
			{
				url: "/mainiconwhite.png",
				width: 1024,
				height: 1024,
				alt: "SyncOrbit - Eliminate friction and scattered workflows",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "SyncOrbit - Eliminate friction and scattered workflows",
		description: "Eliminate friction and scattered workflows. Syncorbit brings your people, projects, and priorities into perfect alignment, ensuring everyone moves together in a stable, high-velocity path toward delivery.",
		images: ["/mainiconwhite.png"],
		creator: "@syncorbit",
	},
	icons: {
		icon: [
			{ url: "/mainiconwhite.ico", sizes: "any" },
			{ url: "/mainiconwhite.png", type: "image/png", sizes: "512x512" },
		],
		apple: [
			{ url: "/mainiconwhite.png", sizes: "180x180", type: "image/png" },
		],
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	verification: {
		// Add your verification codes here when you have them
		// google: "your-google-verification-code",
		// yandex: "your-yandex-verification-code",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/mainiconwhite.ico" />
				<link rel="apple-touch-icon" href="/mainiconwhite.png" />
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
						<SonnerToaster position="top-center" closeButton richColors />
					</ThemeProvider>
				</Providers>
			</body>
		</html>
	);
}