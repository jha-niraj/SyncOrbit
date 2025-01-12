'use client'

import { motion } from 'framer-motion'
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

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
    }

    return (
        <section id="pricing" className="bg-gradient-90deg-black-to-gray w-full px-4 py-16 md:py-24">
            <motion.div
                className="max-w-7xl mx-auto"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h2 className="text-4xl md:text-5xl text-white font-bold mb-4">
                        Crystal Clear <span className="text-red-500">Pricing</span>
                    </h2>
                    <p className="text-white max-w-2xl mx-auto">
                        Choose the perfect plan that suits your needs. All prices include unlimited updates and premium support.
                    </p>
                </motion.div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {
                        [
                            { title: 'Starter', price: 99, features: ['Custom Landing Page', 'Mobile Optimization', 'Basic SEO Setup', '7-Day Delivery'] },
                            { title: 'Professional', price: 199, features: ['Full Website (Up to 5 Pages)', 'Advanced SEO Integration', 'Performance Optimization', '3 Free Revisions', 'Priority Support'], popular: true },
                            { title: 'Enterprise', price: 49, features: ['Unlimited Pages', 'Custom Features', '24/7 Priority Support', 'Monthly Updates', 'Advanced Analytics'], monthly: true }
                        ].map((plan, index) => (
                            <motion.div
                                className="relative group"
                                key={plan.title}
                                variants={cardVariants}
                                custom={index}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-purple-600 rounded-xl blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <div className="relative bg-black text-white p-8 rounded-xl border border-white/10">
                                    {plan.popular && (
                                        <div className="absolute -top-4 right-4 bg-gradient-to-r from-red-500 to-purple-600 px-3 py-1 rounded-full text-sm font-medium">
                                            Popular
                                        </div>
                                    )}
                                    <h3 className="text-xl font-semibold mb-4">{plan.title}</h3>
                                    <div className="mb-6">
                                        <div className="text-4xl font-bold mb-2">{formatPrice(plan.price).usd}</div>
                                        <div className="">{formatPrice(plan.price).inr}</div>
                                        <div className="text-sm">{plan.monthly ? 'per month' : 'One-time payment'}</div>
                                    </div>
                                    <ul className="space-y-3 mb-8">
                                        {
                                            plan.features.map((feature) => (
                                                <li className="flex items-center gap-2" key={feature}>
                                                    <Check className="w-5 h-5 text-red-500" />
                                                    <span>{feature}</span>
                                                </li>
                                            ))
                                        }
                                    </ul>
                                    <Button className="w-full">
                                        {plan.monthly ? 'Contact Sales' : 'Get Started'}
                                    </Button>
                                </div>
                            </motion.div>
                        ))
                    }
                </div>
            </motion.div>
        </section>
    )
}
