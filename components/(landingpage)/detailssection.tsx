import React, { useState } from "react";
import { toast } from "sonner";
import { Check, ArrowRight } from "lucide-react";

const DetailsSection = () => {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        company: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.fullName || !formData.email) {
            toast.error("Please fill in all required fields");
            return;
        }
        toast.success("Request submitted successfully!");
        setFormData({ fullName: "", email: "", company: "" });
    };

    return (
        <section id="details" className="w-full bg-white dark:bg-neutral-950 py-20 transition-colors duration-300">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

                    {/* Left Card - Specs */}
                    <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl dark:shadow-orange-900/10 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
                        {/* Header Image/Gradient Area */}
                        <div className="relative h-48 sm:h-64 p-8 flex items-end bg-gradient-to-br from-gray-900 to-black">
                            <div className="absolute inset-0 bg-[url('/background-section3.png')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center px-3 py-1 mb-3 rounded-full bg-orange-500/20 border border-orange-500/30 backdrop-blur-md text-orange-300 text-xs font-medium">
                                    Technical Specs
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    System Metrics
                                </h2>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 p-8">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
                                Precision engineering meets adaptive intelligence
                            </h3>

                            <div className="space-y-5">
                                {[
                                    { label: "Uptime Guarantee", value: "99.99%" },
                                    { label: "Concurrent Users", value: "Unlimited" },
                                    { label: "API Response", value: "< 50ms" },
                                    { label: "Data Retention", value: "Unlimited" },
                                    { label: "Encryption", value: "AES-256" },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center flex-shrink-0 text-orange-600 dark:text-orange-500 group-hover:scale-110 transition-transform">
                                            <Check className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/50 border border-gray-100 dark:border-neutral-800 transition-colors hover:border-orange-200 dark:hover:border-orange-900/30">
                                            <span className="font-medium text-gray-600 dark:text-gray-400">{item.label}</span>
                                            <span className="font-bold text-gray-900 dark:text-white">{item.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Card - Contact Form */}
                    <div className="flex flex-col rounded-2xl overflow-hidden shadow-2xl dark:shadow-orange-900/10 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
                        {/* Header Gradient Area */}
                        <div className="relative h-48 sm:h-64 p-8 flex flex-col items-start justify-end bg-[#FE5C02]">
                            <div className="absolute inset-0 bg-[url('/background-section1.png')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                            {/* Abstract shapes */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="relative z-10">
                                <div className="inline-block px-4 py-1 border border-white/40 bg-white/10 backdrop-blur-sm text-white rounded-full text-xs font-medium mb-4">
                                    Request a demo
                                </div>
                                <h2 className="text-3xl font-bold text-white">
                                    See it for yourself
                                </h2>
                            </div>
                        </div>

                        {/* Form Content */}
                        <div className="flex-1 p-8 bg-white dark:bg-neutral-900">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Work Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@company.com"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Name</label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Acme Inc. (Optional)"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#FE5C02] hover:bg-orange-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transform hover:-translate-y-0.5"
                                    >
                                        Request Access
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailsSection;