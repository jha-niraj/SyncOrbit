import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

export function LocationsSection() {
    return (
        <section className="max-w-7xl mx-auto py-24 space-y-8">
            <div>
                <h2 className="text-3xl font-bold">We are Serving</h2>
                <p className="text-blue-600">in Various Countries</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="overflow-hidden">
                    <CardContent className="p-0 relative aspect-[4/3]">
                        <Image
                            src="/placeholder.svg?height=400&width=600"
                            alt="Sisyphus Office"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg">
                            <h3 className="font-semibold">Sisyphus Office</h3>
                            <p className="text-sm text-gray-500">Bournemouth, Poole - UK</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="overflow-hidden">
                    <CardContent className="p-0 relative aspect-[4/3]">
                        <Image
                            src="/placeholder.svg?height=400&width=600"
                            alt="Sisyphus Office"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg">
                            <h3 className="font-semibold">Sisyphus Office</h3>
                            <p className="text-sm text-gray-500">London - UK</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

