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
	title: "Project Central",
	description: "Streamline Your Projects with Ease",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<link rel="icon" href="/projectcentral.ico" />
      
                <title>Project Central</title>
                <meta name="description" content="Streamline Your Projects with Ease" />

                <meta property="og:url" content="https://projectcentral.nirajjha.xyz" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Project Central" />
                <meta property="og:description" content="Streamline Your Projects with Ease" />
                <meta property="og:image" content="https://opengraph.b-cdn.net/production/images/e55831e0-2d0c-4c4e-8714-2bb667dc4170.png?token=IaDSxrXi48MuUZvj9Xp9Jk1xHZUJJpPKWwFYRxLzYJI&height=1024&width=1024&expires=33295316213" />

                <meta name="twitter:card" content="summary_large_image" />
                <meta property="twitter:domain" content="projectcentral.nirajjha.xyz" />
                <meta property="twitter:url" content="https://projectcentral.nirajjha.xyz" />
                <meta name="twitter:title" content="Project Central" />
                <meta name="twitter:description" content="Streamline Your Projects with Ease" />
                <meta name="twitter:image" content="https://opengraph.b-cdn.net/production/images/e55831e0-2d0c-4c4e-8714-2bb667dc4170.png?token=IaDSxrXi48MuUZvj9Xp9Jk1xHZUJJpPKWwFYRxLzYJI&height=1024&width=1024&expires=33295316213" />
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