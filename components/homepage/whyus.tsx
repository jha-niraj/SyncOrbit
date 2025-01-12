import { Palette, Code, Laptop, Clock, Film, Handshake } from 'lucide-react'

export default function WhyUs() {
    return (
        <section id="whyus" className="w-full bg-gradient-90deg-black-to-gray px-4 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl text-white font-bold text-center mb-16">
                    What Makes Us <span className="text-red-400">Stand Out</span>?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-7xl mx-auto">
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Palette className="w-8 h-8 text-red-400 group-hover:rotate-45 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Creative Excellence
                        </h3>
                        <p className="text-white leading-relaxed">
                            Transforming your vision into stunning visual experiences that captivate and engage your audience.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Code className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Technical Mastery
                        </h3>
                        <p className="text-white leading-relaxed">
                            Expertly crafted websites using cutting-edge technologies and best practices in development.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Laptop className="w-8 h-8 text-red-400 group-hover:-translate-y-1 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Responsive Design
                        </h3>
                        <p className="text-white leading-relaxed">
                            Seamless experiences across all devices, ensuring your website looks and performs flawlessly everywhere.
                        </p>
                    </div>
                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Film className="w-8 h-8 text-red-400 group-hover:rotate-12 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Visual Storytelling
                        </h3>
                        <p className="text-white leading-relaxed">
                            Professional video editing that brings your narrative to life with compelling visual effects and seamless transitions.
                        </p>
                    </div>

                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Clock className="w-8 h-8 text-red-400 group-hover:rotate-180 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Timely Delivery
                        </h3>
                        <p className="text-white leading-relaxed">
                            Consistent track record of delivering high-quality projects within agreed timelines and budgets.
                        </p>
                    </div>

                    <div className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl">
                        <Handshake className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform duration-300" />
                        <h3 className="text-xl font-semibold text-white">
                            Client Partnership
                        </h3>
                        <p className="text-white leading-relaxed">
                            Dedicated support and collaboration throughout your project, ensuring your vision is brought to life exactly as you imagined.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}