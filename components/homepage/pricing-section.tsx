import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function PricingSection() {
    const formatPrice = (usd: number) => {
        const inr = usd * 83;
        return {
            usd: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(usd),
            inr: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(inr)
        }
    }

    return (
        <section className=" px-4 py-16 md:py-24">
            <div className="container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Crystal Clear <span className="text-red-500">Pricing</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose the perfect plan that suits your needs. All prices include unlimited updates and premium support.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black text-white p-8 rounded-xl border border-white/10">
                            <h3 className="text-xl font-semibold mb-4">Starter</h3>
                            <div className="mb-6">
                                <div className="text-4xl font-bold mb-2">{formatPrice(99).usd}</div>
                                <div className="">{formatPrice(99).inr}</div>
                                <div className="text-sm ">One-time payment</div>
                            </div>
                            <ul className="space-y-3 mb-16">
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Custom Landing Page</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Mobile Optimization</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Basic SEO Setup</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>7-Day Delivery</span>
                                </li>
                            </ul>
                            <Button className="w-full text-black dark:text-white" variant="outline">Get Started</Button>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black text-white p-8 rounded-xl border border-white/10">
                            <div className="absolute -top-4 right-4 bg-gradient-to-r from-red-500 to-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                                Popular
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Professional</h3>
                            <div className="mb-6">
                                <div className="text-4xl font-bold mb-2">{formatPrice(199).usd}</div>
                                <div className="">{formatPrice(199).inr}</div>
                                <div className="text-sm">One-time payment</div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Full Website (Up to 5 Pages)</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Advanced SEO Integration</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Performance Optimization</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>3 Free Revisions</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Priority Support</span>
                                </li>
                            </ul>
                            <Button className="w-full">Get Started</Button>
                        </div>
                    </div>
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative bg-black text-white p-8 rounded-xl border border-white/10">
                            <h3 className="text-xl font-semibold mb-4">Enterprise</h3>
                            <div className="mb-6">
                                <div className="text-4xl font-bold mb-2">{formatPrice(49).usd}</div>
                                <div className="">{formatPrice(49).inr}</div>
                                <div className="text-sm ">per month</div>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Unlimited Pages</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Custom Features</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>24/7 Priority Support</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Monthly Updates</span>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-5 h-5 text-red-500" />
                                    <span>Advanced Analytics</span>
                                </li>
                            </ul>
                            <Button className="w-full text-black dark:text-white" variant="outline">Contact Sales</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

