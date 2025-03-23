import { motion } from "framer-motion";
import { Palette, Code, Laptop, Clock, Film, Handshake } from "lucide-react";

export default function WhyUs() {

    const cards = [
        {
            icon: <Palette className="w-8 h-8 text-red-400 group-hover:rotate-45 transition-transform duration-300" />,
            title: "Creative Excellence*",
            description:
                "Transforming your vision into stunning visual experiences that captivate and engage your audience. *May occasionally resemble a toddler's crayon masterpiece.",
        },
        {
            icon: <Code className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform duration-300" />,
            title: "Technical Mastery",
            description:
                "Expertly crafted websites using cutting-edge technologies and best practices in development. We promise to use at least three programming languages you've never heard of.",
        },
        {
            icon: <Laptop className="w-8 h-8 text-red-400 group-hover:-translate-y-1 transition-transform duration-300" />,
            title: "Responsive Design",
            description:
                "Seamless experiences across all devices, ensuring your website looks and performs flawlessly everywhere. Even on your grandma's flip phone from 2005.",
        },
        {
            icon: <Film className="w-8 h-8 text-red-400 group-hover:rotate-12 transition-transform duration-300" />,
            title: "Visual Storytelling",
            description:
                "Professional video editing that brings your narrative to life with compelling visual effects and seamless transitions. We'll make your cat video look like a Hollywood blockbuster.",
        },
        {
            icon: <Clock className="w-8 h-8 text-red-400 group-hover:rotate-180 transition-transform duration-300" />,
            title: "Timely Delivery",
            description:
                "Consistent track record of delivering high-quality projects within agreed timelines and budgets. We'll only ask for a deadline extension twice, we promise.",
        },
        {
            icon: <Handshake className="w-8 h-8 text-red-400 group-hover:scale-110 transition-transform duration-300" />,
            title: "Client Partnership",
            description:
                "Dedicated support and collaboration throughout your project, ensuring your vision is brought to life exactly as you imagined. We'll even pretend to laugh at your jokes during meetings.",
        },
    ];

    return (
        <section id="whyus" className="w-full bg-gradient-90deg-black-to-gray px-4 py-16 md:py-24">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl md:text-5xl text-white font-bold text-center mb-16">
                    What Makes Us <span className="text-red-400">Stand Out</span>?
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-7xl mx-auto">
                    {
                        cards.map((card, index) => (
                            <motion.div
                                key={index}
                                className="group space-y-4 p-6 transition-all duration-300 hover:bg-white/10 shadow-lg hover:shadow-2xl rounded-2xl"
                                initial={{ opacity: 0, y: -50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, ease: "easeOut" }}
                            >
                                {card.icon}
                                <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                                <p className="text-white leading-relaxed">{card.description}</p>
                            </motion.div>
                        ))
                    }
                </div>
            </div>
        </section>
    );
}
