import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

export default function AboutUsSection() {
    return (
        <section id="about" className="w-full h-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="max-w-7xl mx-auto h-full px-4 md:px-6">
                <div className="flex gap-10 flex-col md:flex-row h-full lg:gap-16 items-center">
                    <div className="space-y-4 h-full flex items-center md:items-start justify-center flex-col">
                        <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                            About Us
                        </div>
                        <h2 className="text-3xl font-bold text-center md:text-left tracking-tighter md:text-4xl/tight">
                            We&apos;re More Than Just an Agency
                        </h2>
                        <p className="text-muted-foreground md:text-xl/relaxed text-center md:text-left">
                            Founded with a vision to provide premium digital solutions at affordable prices, we&apos;ve grown into a
                            team of passionate experts dedicated to helping businesses succeed online.
                        </p>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Our Mission</h3>
                            <p className="text-muted-foreground">
                                To deliver exceptional digital services and innovative products that help businesses grow and thrive
                                in the digital landscape.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-bold">Our Approach</h3>
                            <p className="text-muted-foreground">
                                We combine creativity, technical expertise, and strategic thinking to deliver solutions that not
                                only look great but also drive results.
                            </p>
                        </div>
                        <Button asChild size="lg" className="mt-4">
                            <Link href="/careers">Work With Us</Link>
                        </Button>
                    </div>
                    <div className="hidden md:block bg-black rounded-md h-full">
                        <Image
                            src="/shunyatech.png"
                            width={600}
                            height={600}
                            alt="About Us"
                            className="mx-auto aspect-square h-full overflow-hidden rounded-xl object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}