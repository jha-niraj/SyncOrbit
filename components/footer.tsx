"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"

const navigation = {
	solutions: [
		{ name: "Project Management", href: "#" },
		{ name: "Team Collaboration", href: "#" },
		{ name: "Analytics & Reporting", href: "#" },
		{ name: "API Integration", href: "#" },
	],
	company: [
		{ name: "About", href: "/about" },
		{ name: "Team", href: "/team" },
		{ name: "Careers", href: "/careers" },
		{ name: "Contact", href: "/contact" },
	],
	resources: [
		{ name: "Blog", href: "/blog" },
		{ name: "Documentation", href: "/docs" },
		{ name: "Help Center", href: "/help" },
		{ name: "Privacy Policy", href: "/privacy" },
	],
	social: [
		{ name: "Facebook", icon: Facebook, href: "#" },
		{ name: "Twitter", icon: Twitter, href: "#" },
		{ name: "LinkedIn", icon: Linkedin, href: "#" },
		{ name: "Instagram", icon: Instagram, href: "#" },
	],
}

export default function Footer() {
	return (
		<footer className="bg-gradient-to-br from-gray-200 via-gray-100 to-gray-50 dark:from-black dark:via-neutral-950 dark:to-black text-gray-900 dark:text-white">
			<div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="col-span-2 md:col-span-1"
					>
						<Link href="/" className="flex items-center gap-2">
							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
								<span className="text-white font-bold text-sm">PC</span>
							</div>
							<span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								ProjectCentral
							</span>
						</Link>
						<p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
							Streamline your project management with powerful collaboration tools, analytics, and automation to deliver exceptional results.
						</p>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white">Solutions</h3>
						<ul className="mt-4 space-y-2">
							{
								navigation.solutions.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))
							}
						</ul>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.2 }}
					>
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white">Company</h3>
						<ul className="mt-4 space-y-2">
							{
								navigation.company.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))
							}
						</ul>
					</motion.div>
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<h3 className="text-sm font-semibold text-gray-900 dark:text-white">Resources</h3>
						<ul className="mt-4 space-y-2">
							{
								navigation.resources.map((item) => (
									<li key={item.name}>
										<Link
											href={item.href}
											className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
										>
											{item.name}
										</Link>
									</li>
								))
							}
						</ul>
					</motion.div>
				</div>
				<div className="mt-12 border-t border-teal-200/20 dark:border-teal-800/20 pt-8">
					<div className="flex flex-col md:flex-row justify-between items-center">
						<motion.div
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.4 }}
							className="flex space-x-6"
						>
							{
								navigation.social.map((item) => (
									<Link
										key={item.name}
										href={item.href}
										className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
									>
										<span className="sr-only">{item.name}</span>
										<item.icon className="h-5 w-5" />
									</Link>
								))
							}
						</motion.div>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="mt-8 md:mt-0 text-sm text-gray-600 dark:text-gray-300"
						>
							&copy; {new Date().getFullYear()} ProjectCentral. All rights reserved.
						</motion.p>
					</div>
				</div>
			</div>
		</footer>
	)
} 