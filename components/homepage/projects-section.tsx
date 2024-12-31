import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function ProjectsSection() {
    const projects = [
        {
            title: "AI 3D Design Concept",
            description: "All connected with 3D design to solve problems with",
            image: "/placeholder.svg?height=400&width=300",
        },
        {
            title: "Digital Marketing Dashboard",
            description: "Analytics and tracking solution",
            image: "/placeholder.svg?height=400&width=300",
        },
        {
            title: "Creative Design Portfolio",
            description: "Showcase of creative works",
            image: "/placeholder.svg?height=400&width=300",
        },
        {
            title: "Mobile App Design",
            description: "User-friendly interface design",
            image: "/placeholder.svg?height=400&width=300",
        },
    ]

    return (
        <section className="container py-24 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold">Projects We have</h2>
                    <p className="text-blue-600">Completed</p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline">View More Project</Button>
                    <Button>View All Work</Button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {projects.map((project, index) => (
                    <Card key={index} className="group overflow-hidden">
                        <CardContent className="p-0">
                            <div className="relative h-[300px] overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold">{project.title}</h3>
                                <p className="text-sm text-gray-500">{project.description}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    )
}

