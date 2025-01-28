"use client"

import Image from 'next/image'
import { ArrowRight, DollarSign, Clock, PieChart } from 'lucide-react'
import BudgetEstimatorForm from './_components/bugdetestimateform';
import budgetEstimateImg from "@/components/_images/budgetestimator.jpeg";

export const runtime = "edge";

export default function BudgetEstimatorPage() {
    const budgetEstimatorImg = budgetEstimateImg;

    return (
        <div className="min-h-screen w-full py-8 bg-black">
            <div className="relative max-w-7xl mx-auto h-screen overflow-hidden">
                <div className="absolute inset-0 flex items-center">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
                            <div className="lg:w-1/2 text-center lg:text-left">
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-white leading-tight">
                                    Estimate Your Project Budget <span className="text-green-400">in Minutes</span>
                                </h1>
                                <p className="text-lg md:text-xl font-medium text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                                    Get accurate cost projections for Web Development, Deployment, and Video Editing. Start your project with confidence and clarity.
                                </p>
                                <button
                                    className="group flex gap-2 items-center px-4 py-2 rounded-md border border-black bg-white text-black text-sm hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                                    onClick={() => document.getElementById('estimator-form')?.scrollIntoView({ behavior: 'smooth' })}
                                >
                                    Start Your Estimate
                                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {
                                        [
                                            { icon: DollarSign, text: "Accurate Pricing" },
                                            { icon: Clock, text: "Quick Turnaround" },
                                            { icon: PieChart, text: "Detailed Breakdown" }
                                        ].map((feature, index) => (
                                            <div key={index} className="flex items-center justify-center lg:justify-start">
                                                <feature.icon className="w-6 h-6 text-white mr-2" />
                                                <span className="text-gray-300 font-medium">{feature.text}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                            <div className="lg:w-1/2 h-full relative w-full flex items-center justify-center">
                                <div className="relative w-full max-w-md aspect-square">
                                    <Image
                                        src={budgetEstimatorImg}
                                        alt="Budget Estimation"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-tl-2xl rounded-br-2xl transition-transform hover:rotate-3 duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ArrowRight className="w-8 h-8 text-blue-600 transform rotate-90" />
                </div>
            </div>
            <section id="estimator-form" className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <BudgetEstimatorForm />
                </div>
            </section>
        </div>
    )
}

