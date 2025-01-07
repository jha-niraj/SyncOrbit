import { Compass, Rocket, Puzzle, Code2, HeartHandshake, Shield, Sparkles, Brain, Target } from 'lucide-react'

export default function WhyUs() {
    return (
        <section className="px-4 py-16 md:py-24">
            <div className="container mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
                    Wondering <span className="text-red-500">why select</span> us?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-6xl mx-auto">
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Compass className="w-8 h-8 text-red-500 group-hover:rotate-45 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Dynamic Layout
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Exceptional user experience across every screen dimension and platform.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Rocket className="w-8 h-8 text-red-500 group-hover:-translate-y-1 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Swift Performance
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Streamlined code architecture ensuring lightning-quick response times.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Puzzle className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Tailored Solutions
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Personalized digital experiences crafted to match your distinct vision.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Code2 className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Advanced Stack
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Proficiency in cutting-edge frameworks and revolutionary technologies.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <HeartHandshake className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Team Synergy
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Deep collaboration ensuring seamless integration with your workflow.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Shield className="w-8 h-8 text-red-500 group-hover:rotate-12 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Lasting Support
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Dedicated maintenance and regular updates to ensure peak performance.
                        </p>
                    </div>

                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Sparkles className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Innovation First
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Embracing cutting-edge technologies to keep you ahead of the curve.
                        </p>
                    </div>

                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Brain className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            AI Integration
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Smart automation and AI-powered features for enhanced functionality.
                        </p>
                    </div>

                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Target className="w-8 h-8 text-red-500 group-hover:rotate-180 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-black dark:text-white">
                            Results Driven
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                            Focus on measurable outcomes and continuous improvement.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

