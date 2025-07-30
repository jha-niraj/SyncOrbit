import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
	ArrowRight, Calendar, Lightbulb, Users,
	CheckCircle, Globe, Smartphone, Database, Shield, Rocket,
	TrendingUp, Award, Clock, Monitor, MessageSquare, Eye, Bell, BarChart3, Settings
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { BackgroundPaths } from "../ui/backgroundpaths"
import { WordRotate } from "../ui/wordrotate"

const productsServices = [
	{
		icon: Users,
		title: "Client Services",
		description: "Bespoke digital solutions crafted specifically for your business goals and challenges",
		gradient: "from-emerald-400 to-teal-500",
		bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20",
		features: ["Custom Development", "UI/UX Design", "Consulting"],
	},
	{
		icon: Lightbulb,
		title: "Product Innovation",
		description: "Revolutionary products built from the ground up with cutting-edge technology",
		gradient: "from-teal-400 to-emerald-500",
		bgGradient: "from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20",
		features: ["SaaS Products", "Mobile Apps", "AI Solutions"],
	},
]

const features = [
	{ icon: Globe, label: "Global Reach" },
	{ icon: Smartphone, label: "Mobile First" },
	{ icon: Database, label: "Scalable Backend" },
	{ icon: Shield, label: "Enterprise Security" },
	{ icon: Rocket, label: "Fast Deployment" },
	{ icon: TrendingUp, label: "Growth Focused" },
]

const stats = [
	{ number: "150+", label: "Projects Delivered", icon: CheckCircle },
	{ number: "50+", label: "Happy Clients", icon: Users },
	{ number: "5+", label: "Years Experience", icon: Award },
	{ number: "24/7", label: "Support Available", icon: Clock },
]

const productFeatures = [
	{ icon: Monitor, title: "Real-time Tracking", description: "Monitor project progress instantly" },
	{ icon: MessageSquare, title: "Ticket System", description: "Raise and manage support tickets" },
	{ icon: Eye, title: "Live Updates", description: "See changes as they happen" },
	{ icon: Bell, title: "Smart Notifications", description: "Stay informed with alerts" },
	{ icon: BarChart3, title: "Analytics Dashboard", description: "Detailed project insights" },
	{ icon: Settings, title: "Custom Workflows", description: "Tailored to your needs" },
]

export default function HeroSection() {
	const rotatingWords = ["Build.", "Ship.", "Scale."]
	const services = ["SaaS Platform", "Custom Development", "AI Integration", "Enterprise Solutions"]

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					animate={{
						x: [0, 200, 0],
						y: [0, -150, 0],
						scale: [1, 1.2, 1],
					}}
					transition={{
						duration: 25,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute top-1/4 left-1/6 w-96 h-96 bg-gradient-to-r from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl"
				/>
				<motion.div
					animate={{
						x: [0, -150, 0],
						y: [0, 200, 0],
						scale: [1, 0.8, 1],
					}}
					transition={{
						duration: 30,
						repeat: Number.POSITIVE_INFINITY,
						ease: "easeInOut",
					}}
					className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-3xl"
				/>
			</div>
			<div className="relative w-full bg-white dark:bg-neutral-950">
				<div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
					<BackgroundPaths />

					<div className="relative z-10 py-20 px-6">
						<div className="text-center">
							<motion.div
								initial={{ opacity: 0, y: 30 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, ease: "easeOut" }}
							>
								<motion.div
									initial={{ opacity: 0, scale: 0.8 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ duration: 0.6, delay: 0.2 }}
									className="relative inline-block mb-4"
								>
									<div className="absolute inset-0 bg-gradient-to-r from-neutral-500/20 via-slate-500/20 to-neutral-500/20 rounded-full blur-xl" />
									<Badge className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium border border-neutral-200 dark:border-neutral-700 shadow-lg">
										<div className="w-2 h-2 bg-neutral-500 dark:bg-neutral-400 rounded-full animate-pulse" />
										Platform + Agency Excellence
									</Badge>
								</motion.div>

								<div className="space-y-4">
									<motion.div
										className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter"
										initial={{ opacity: 0, y: 50 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.8, delay: 0.3 }}
									>
										<WordRotate
											words={rotatingWords}
											duration={3000}
											className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-900 to-neutral-700/80 dark:from-white dark:to-white/80"
										/>
									</motion.div>
								</div>

								<motion.div
									initial={{ opacity: 0, y: 30 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.8, delay: 1 }}
									className="mt-6"
								>
									<p className="text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-light">
										We&apos;re{" "}
										<motion.span
											className="text-neutral-700 dark:text-neutral-300 font-medium relative"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 1.2 }}
										>
											engineering our own products
											<motion.div
												className="absolute -bottom-1 left-0 w-full h-0.5 bg-neutral-400 dark:bg-neutral-500"
												initial={{ scaleX: 0 }}
												animate={{ scaleX: 1 }}
												transition={{ delay: 1.4, duration: 0.6 }}
											/>
										</motion.span>{" "}
										while delivering{" "}
										<motion.span
											className="text-slate-700 dark:text-slate-300 font-medium relative"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											transition={{ delay: 1.6 }}
										>
											world-class solutions
											<motion.div
												className="absolute -bottom-1 left-0 w-full h-0.5 bg-neutral-500 dark:bg-neutral-400"
												initial={{ scaleX: 0 }}
												animate={{ scaleX: 1 }}
												transition={{ delay: 1.8, duration: 0.6 }}
											/>
										</motion.span>{" "}
										for forward-thinking clients.
									</p>
								</motion.div>

								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 1.4 }}
									className="mt-8 flex flex-wrap justify-center gap-3"
								>
									{services.map((item, index) => (
										<motion.span
											key={item}
											initial={{ opacity: 0, scale: 0.8 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{ delay: 1.6 + index * 0.1 }}
											className="px-4 py-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all duration-300"
										>
											{item}
										</motion.span>
									))}
								</motion.div>
							</motion.div>

							<motion.div
								className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
								initial={{ opacity: 0, y: 40 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.8, delay: 1.8 }}
							>
								<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
									<Link href="/signin">
										<Button className="group relative w-full sm:w-64 bg-gradient-to-r from-neutral-900 to-slate-900 hover:from-neutral-800 hover:to-slate-800 dark:from-white dark:to-slate-100 dark:hover:from-slate-100 dark:hover:to-white text-white dark:text-black shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl px-8 py-4 text-lg font-semibold overflow-hidden border border-neutral-200 dark:border-neutral-700">
											<span className="relative z-10 flex items-center justify-center">
												Our Latest Product
												<motion.div
													className="ml-3"
													animate={{ x: [0, 5, 0] }}
													transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
												>
													<ArrowRight className="h-5 w-5" />
												</motion.div>
											</span>
											<motion.div className="absolute inset-0 bg-gradient-to-r from-neutral-800 to-slate-800 dark:from-slate-200 dark:to-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
										</Button>
									</Link>
								</motion.div>

								<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
									<Link href="https://cal.com/niraj-jha/30min" target="_blank">
										<Button
											variant="outline"
											className="group w-full sm:w-64 border-2 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl bg-transparent"
										>
											<Calendar className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
											<span>Schedule Discovery</span>
											<motion.div
												className="ml-2 w-2 h-2 bg-neutral-500 dark:bg-neutral-400 rounded-full"
												animate={{ scale: [1, 1.2, 1] }}
												transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
											/>
										</Button>
									</Link>
								</motion.div>
							</motion.div>
						</div>
					</div>
				</div>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="mb-8 max-w-7xl mx-auto px-6"
				>
					<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-black via-gray-950 to-black border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl">
						<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5" />
						<div className="relative p-8 md:p-12">
							<div className="text-center mb-8">
								<Badge className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 mb-4">
									<Rocket className="w-4 h-4 mr-2" />
									Featured Product
								</Badge>
								<h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
									Revolutionary{" "}
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
										Project Management
									</span>{" "}
									Platform
								</h2>
								<p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
									Experience the future of client collaboration with our cutting-edge project management platform.{" "}
									<span className="text-emerald-700 dark:text-emerald-400 font-medium">
										Login, track, collaborate, and watch your projects come to life in real-time.
									</span>
								</p>
							</div>
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
								{
									productFeatures.map((feature, index) => (
										<motion.div
											key={feature.title}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
											className="group"
										>
											<div className="flex flex-col items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-lg">
												<feature.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform duration-300" />
												<h3 className="font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
												<p className="text-sm text-center text-slate-600 dark:text-slate-400">{feature.description}</p>
											</div>
										</motion.div>
									))
								}
							</div>
							<div className="text-center">
								<div className="flex flex-col sm:flex-row gap-4 justify-center">
									<Link href="/signin">
										<Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
											<Monitor className="mr-2 h-5 w-5" />
											Get Started
										</Button>
									</Link>
								</div>
								<p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
									Join hundreds of clients already managing their projects seamlessly
								</p>
							</div>
						</div>
					</div>
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 px-6"
				>
					{
						stats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, scale: 0.8 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
								className="text-center group"
							>
								<div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group-hover:-translate-y-1">
									<stat.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
									<div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-1">{stat.number}</div>
									<div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
								</div>
							</motion.div>
						))
					}
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.8 }}
					className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 mb-8 px-6"
				>
					{
						productsServices.map((service, index) => (
							<motion.div
								key={service.title}
								initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.8, delay: 1 + index * 0.2 }}
								className="group"
							>
								<Card
									className={`relative p-8 bg-gradient-to-br ${service.bgGradient} border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 overflow-hidden`}
								>
									<div className="absolute inset-0 opacity-5">
										<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,.1)_25%,rgba(0,0,0,.1)_50%,transparent_50%,transparent_75%,rgba(0,0,0,.1)_75%)] bg-[length:20px_20px]" />
									</div>

									<div className="relative z-10">
										<div
											className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${service.gradient} p-4 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
										>
											<service.icon className="w-8 h-8 text-white" />
										</div>
										<h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors duration-300">
											{service.title}
										</h3>
										<p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed mb-6">
											{service.description}
										</p>
										<div className="flex flex-wrap gap-2">
											{
												service.features.map((feature, idx) => (
													<Badge
														key={idx}
														variant="secondary"
														className="bg-white/50 dark:bg-black/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
													>
														{feature}
													</Badge>
												))
											}
										</div>
									</div>
									<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
								</Card>
							</motion.div>
						))
					}
				</motion.div>
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.2 }}
					className="mt-8 max-w-7xl mx-auto mb-8 px-6"
				>
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Us?</h2>
						<p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
							We combine technical expertise with creative innovation to deliver exceptional results
						</p>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{
							features.map((feature, index) => (
								<motion.div
									key={feature.label}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
									className="group text-center"
								>
									<div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl p-6 border border-emerald-100 dark:border-emerald-900 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-lg">
										<feature.icon className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
										<div className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.label}</div>
									</div>
								</motion.div>
							))
						}
					</div>
				</motion.div>
			</div>
		</div>
	)
}