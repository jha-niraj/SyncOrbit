import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

export default function AboutUsSection() {
    return (
        <section id="about" className="w-full h-full py-12 md:py-24 lg:py-32 bg-muted px-4">
            <div className="max-w-7xl mx-auto h-full px-4 md:px-6">
                <div className="flex gap-10 flex-col md:flex-row h-full lg:gap-16 items-center">
                    <div className="space-y-4 h-full flex items-center md:items-start justify-center flex-col">
                        <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                            About Us
                        </div>
                        <h2 className="text-3xl font-bold text-center md:text-left tracking-tighter md:text-4xl/tight">
                            We&apos;re Not Your Average Tech Nerds
                        </h2>
                        <p className="text-gray-200 md:text-xl/relaxed text-center md:text-left">
                            We&apos;re a bunch of caffeinated code wizards and design ninjas who decided to band together and save the digital world, one pixel at a time. Oh, and we also build pretty cool products.
                        </p>
                        <div className="space-y-2 flex flex-col">
                            <h3 className="text-xl text-center md:text-left font-bold">Our Not-So-Secret Mission</h3>
                            <p className="text-gray-300 text-center md:text-left">
                                To create digital solutions so good, they&apos;ll make your competitors wish they&apos;d chosen a different career path. We&apos;re here to turn your &quot;meh&quot; into &quot;wow&quot; without breaking the bank.
                            </p>
                        </div>
                        <div className="space-y-2 flex flex-col">
                            <h3 className="text-xl text-center md:text-left font-bold">Our Slightly Unorthodox Approach</h3>
                            <p className="text-gray-300 text-center md:text-left">
                                We mix one part creativity, two parts tech savvy, and a dash of strategic genius. Shake well, and voilà! Solutions that not only look fabulous but actually work. Imagine that!
                            </p>
                        </div>
                        <div className="w-full space-y-2 flex flex-col">
                            <h3 className="text-xl text-center md:text-left font-bold">Why We&apos;re Awesome</h3>
                            <p className="text-gray-300 text-center md:text-left">
                                We&apos;re a product-based agency that tackles real-world issues faster than you can say &quot;digital transformation.&quot; We serve clients like a five-star restaurant, but with prices that won&apos;t make your wallet cry.
                            </p>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <Button asChild size="lg">
                                <Link href="/careers">Join Our Circus</Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/team">Meet the Misfits</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="hidden md:block bg-black rounded-md h-full">
                        <Image
                            src="/shunyatech.png"
                            width={600}
                            height={600}
                            alt="Our Totally Normal Team"
                            className="mx-auto aspect-square h-full overflow-hidden rounded-xl object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}