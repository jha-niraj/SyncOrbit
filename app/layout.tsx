import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-providers";

const spaceGrotesk = Space_Grotesk({
	subsets: ['latin'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
	title: "Shunya Tech",
	description: "You think we'll deliver",
	icons: {
        icon: "/shunyatech.png",
    },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<head>
				<title>ShunyaTech</title>
				<link rel="icon" href="/shunyatech.ico" />
			</head>
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
						{children}
					</main>
				</ThemeProvider>
			</body>
		</html>
	);
}
