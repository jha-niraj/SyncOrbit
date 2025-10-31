import React, { useRef } from "react";

interface TestimonialProps {
    content: string;
    author: string;
    role: string;
    gradient: string;
    backgroundImage?: string;
}

const testimonials: TestimonialProps[] = [{
    content: "ProjectCentral transformed our product delivery process. We cut our sprint planning time in half and finally ship on schedule. The gamification features keep our team motivated.",
    author: "Sarah Chen",
    role: "Product Manager, TechFlow Startup",
    gradient: "from-blue-700 via-indigo-800 to-purple-900",
    backgroundImage: "/background-section1.png"
}, {
    content: "The team management features are incredible. Setting up different teams with heads and tracking progress has never been easier. Our engineering team loves the point system.",
    author: "Michael Rodriguez",
    role: "Engineering Manager, DevCorp",
    gradient: "from-indigo-900 via-purple-800 to-orange-500",
    backgroundImage: "/background-section2.png"
}, {
    content: "As an agency, ProjectCentral helps us manage multiple client projects seamlessly. The reward system keeps our team engaged and productive across all departments.",
    author: "Dr. Amara Patel",
    role: "Creative Director, Digital Agency",
    gradient: "from-purple-800 via-pink-700 to-red-500",
    backgroundImage: "/background-section3.png"
}, {
    content: "Setting up teams for Technical, Marketing, and Social Media was so intuitive. The team heads can now manage their groups independently while I track overall progress.",
    author: "Jason Lee",
    role: "CEO, Growth Solutions Inc.",
    gradient: "from-orange-600 via-red-500 to-purple-600",
    backgroundImage: "/background-section1.png"
}];

const TestimonialCard = ({
    content,
    author,
    role,
    backgroundImage = "/background-section1.png"
}: TestimonialProps) => {
    return <div className="bg-cover bg-center rounded-lg p-8 h-full flex flex-col justify-between text-white transform transition-transform duration-300 hover:-translate-y-2 relative overflow-hidden" style={{
        backgroundImage: `url('${backgroundImage}')`
    }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white z-10"></div>

        <div className="relative z-0">
            <p className="text-xl mb-8 font-medium leading-relaxed pr-20">{`"${content}"`}</p>
            <div>
                <h4 className="font-semibold text-xl">{author}</h4>
                <p className="text-white/80">{role}</p>
            </div>
        </div>
    </div>;
};

const Testimonials = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    return <section className="py-12 bg-white relative" id="testimonials" ref={sectionRef}> {/* Reduced from py-20 */}
        <div className="section-container opacity-0 animate-on-scroll">
            <div className="flex items-center gap-4 mb-6">
                <div className="pulse-chip">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-pulse-500 text-white mr-2">04</span>
                    <span>Who It&apos;s For</span>
                </div>
            </div>

            <h2 className="text-5xl font-display font-bold mb-4 text-left">Built for teams of all sizes</h2>
            <p className="text-xl text-gray-600 mb-12 text-left">From startups to agencies to product teams — ProjectCentral adapts to your flow.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => <TestimonialCard key={index} content={testimonial.content} author={testimonial.author} role={testimonial.role} gradient={testimonial.gradient} backgroundImage={testimonial.backgroundImage} />)}
            </div>
        </div>
    </section>;
};

export default Testimonials;