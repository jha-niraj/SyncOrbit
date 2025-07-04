import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
	ArrowRight,
	Calendar,
	Lightbulb,
	Users,
	Zap,
	Star,
	CheckCircle,
	Globe,
	Smartphone,
	Database,
	Shield,
	Rocket,
	TrendingUp,
	Award,
	Clock,
	Monitor,
	MessageSquare,
	Eye,
	Bell,
	BarChart3,
	Settings,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function HeroSection() {
	const openCalendar = () => {
		// @ts-ignore
		if (window.Cal) {
			// @ts-ignore
			window.Cal.showModal()
		}
	}

	const services = [
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

	return (
		<div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/10">
			<div className="absolute inset-0 w-full h-full">
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
				<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5" />
			</div>
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

			{/* Main Content */}
			<div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28 lg:py-32">
				{/* Header Section */}
				<div className="text-center mb-16">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
					>
						<Badge className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-600 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300">
							<Star className="w-4 h-4 text-white" />
							Excellence in Digital Innovation
						</Badge>
						<div className="mt-6 space-y-4">
							<h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight">
								<span className="block text-slate-900 dark:text-white">We</span>
								<span className="block">
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-500">
										Build
									</span>
									<span className="text-slate-900 dark:text-white"> & </span>
									<span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 dark:from-teal-400 dark:via-emerald-400 dark:to-teal-500">
										Create
									</span>
								</span>
							</h1>

							<motion.div
								initial={{ scaleX: 0 }}
								animate={{ scaleX: 1 }}
								transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
								className="h-1.5 w-24 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
							/>
						</div>

						<p className="mt-8 text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed font-light">
							From <span className="text-emerald-700 dark:text-emerald-400 font-medium">bespoke client solutions</span>{" "}
							to{" "}
							<span className="text-teal-700 dark:text-teal-400 font-medium">groundbreaking product innovations</span>,
							we transform ideas into digital excellence.
						</p>
					</motion.div>

					<motion.div
						className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, delay: 0.3 }}
					>
						<Link href="/contact">
							<Button className="group relative w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-2xl hover:shadow-emerald-500/25 transition-all duration-500 rounded-2xl px-10 py-6 text-lg font-semibold overflow-hidden">
								<span className="relative z-10 flex items-center">
									Start Your Journey
									<ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
								</span>
								<div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</Button>
						</Link>

						<Link
							href="https://cal.com/niraj-jha/30min"
							target="_blank"
							className="flex items-center justify-center border border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/30 dark:hover:bg-emerald-950/30 px-6 md:px-8 py-3 md:py-4 rounded-xl text-md font-semibold bg-transparent transition-all duration-300 w-full sm:w-auto"
						>
							<Calendar className="mr-2 h-5 w-5" />
							Schedule a Call
						</Link>
					</motion.div>
				</div>

				{/* Featured Product Spotlight */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					className="mb-16"
				>
					<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-emerald-600/10 border border-emerald-200/50 dark:border-emerald-800/50 backdrop-blur-xl">
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
								{productFeatures.map((feature, index) => (
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
											<p className="text-sm text-slate-600 dark:text-slate-400">{feature.description}</p>
										</div>
									</motion.div>
								))}
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

				{/* Stats Section */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
				>
					{stats.map((stat, index) => (
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
					))}
				</motion.div>

				{/* Services Showcase */}
				<motion.div
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1, delay: 0.8 }}
					className="grid lg:grid-cols-2 gap-8 mb-16"
				>
					{services.map((service, index) => (
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
										{service.features.map((feature, idx) => (
											<Badge
												key={idx}
												variant="secondary"
												className="bg-white/50 dark:bg-black/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
											>
												{feature}
											</Badge>
										))}
									</div>
								</div>

								<div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* Features Grid */}
				<motion.div
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 1.2 }}
					className="mt-8"
				>
					<div className="text-center mb-12">
						<h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose Us?</h2>
						<p className="text-slate-600 dark:text-slate-300 text-lg max-w-2xl mx-auto">
							We combine technical expertise with creative innovation to deliver exceptional results
						</p>
					</div>

					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{features.map((feature, index) => (
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
						))}
					</div>
				</motion.div>
			</div>
		</div>
	)
}