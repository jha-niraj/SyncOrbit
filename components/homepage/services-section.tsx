import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Paintbrush, Palette, CuboidIcon as Cube, PenTool, Monitor, Printer } from 'lucide-react'

export function ServicesSection() {
    const services = [
        {
            icon: <Paintbrush className="h-6 w-6" />,
            title: "UI/UX Design",
            description: "Product design has great importance in creating a good user experience",
        },
        {
            icon: <Palette className="h-6 w-6" />,
            title: "Logo Branding",
            description: "Logo branding is necessary to create a unique brand identity",
            featured: true,
        },
        {
            icon: <Cube className="h-6 w-6" />,
            title: "3D Design",
            description: "3D design is an emerging trend in digital product design",
        },
        {
            icon: <PenTool className="h-6 w-6" />,
            title: "Illustration",
            description: "Make your product more eye-catching with a beautiful illustration",
        },
        {
            icon: <Monitor className="h-6 w-6" />,
            title: "Digital Painting",
            description: "If you like digital painting it will very popular with young people",
        },
        {
            icon: <Printer className="h-6 w-6" />,
            title: "Print Design",
            description: "It is a technique that business need will have print design",
        },
    ]

    return (
        <section className="container py-24 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">What We Serve</h2>
                    <p className="text-blue-600">For Your Business</p>
                </div>
                <Button>Get Started</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                    <Card
                        key={index}
                        className={`group transition-transform duration-300 hover:-translate-y-2 ${service.featured ? "bg-blue-600 text-white" : ""
                            }`}
                    >
                        <CardHeader>
                            <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.featured ? "bg-blue-500" : "bg-gray-100"
                                    }`}
                            >
                                {service.icon}
                            </div>
                            <CardTitle className="mt-4">{service.title}</CardTitle>
                            <CardDescription className={service.featured ? "text-blue-100" : ""}>
                                {service.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button variant={service.featured ? "secondary" : "ghost"} className="group-hover:translate-x-2 transition-transform">
                                Learn more
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

