"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Facebook, Twitter, Linkedin, Instagram, Github } from "lucide-react"

const navigation = {
	solutions: [
		{ name: "Web Development", href: "#" },
		{ name: "Mobile Apps", href: "#" },
		{ name: "Cloud Solutions", href: "#" },
		{ name: "API Development", href: "#" },
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
		{ name: "GitHub", icon: Github, href: "#" },
	],
}

export default function Footer() {
	return (
		<footer className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-black dark:to-slate-900">
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
							<Image
								src="/shunyatech.png"
								alt="ShunyaTech"
								width={32}
								height={32}
							/>
							<span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-emerald-700 bg-clip-text text-transparent">
								ShunyaTech
							</span>
						</Link>
						<p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
							Transforming ideas into digital reality through innovative technology solutions and expert consulting.
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
							{navigation.solutions.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
									>
										{item.name}
									</Link>
								</li>
							))}
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
							{navigation.company.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
									>
										{item.name}
									</Link>
								</li>
							))}
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
							{navigation.resources.map((item) => (
								<li key={item.name}>
									<Link
										href={item.href}
										className="text-sm text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
									>
										{item.name}
									</Link>
								</li>
							))}
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
							{navigation.social.map((item) => (
								<Link
									key={item.name}
									href={item.href}
									className="text-gray-600 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
								>
									<span className="sr-only">{item.name}</span>
									<item.icon className="h-5 w-5" />
								</Link>
							))}
						</motion.div>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: 0.5 }}
							className="mt-8 md:mt-0 text-sm text-gray-600 dark:text-gray-300"
						>
							&copy; {new Date().getFullYear()} ShunyaTech. All rights reserved.
						</motion.p>
					</div>
				</div>
			</div>
		</footer>
	)
} 