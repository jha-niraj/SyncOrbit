import React, { useState } from "react";
import { toast } from "sonner";
import {
    ArrowRight, Server, Shield, Zap, Activity, Globe
} from "lucide-react";

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
        <section id="details" className="w-full bg-white dark:bg-neutral-950 py-12 sm:py-24">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                    <div className="relative group overflow-hidden rounded-[2rem] bg-[#0A0A0A] border border-neutral-800 p-8 sm:p-12 flex flex-col justify-between min-h-[500px]">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-orange-500/20 blur-[100px] rounded-full pointer-events-none"></div>

                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-lg bg-neutral-900 border border-neutral-800">
                                    <Activity className="w-5 h-5 text-orange-500" />
                                </div>
                                <h3 className="text-xl font-medium text-white">System Performance</h3>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
                                Precision engineering <br />
                                <span className="text-neutral-500">meets adaptive intelligence.</span>
                            </h2>
                        </div>
                        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {
                                [
                                    { icon: <Globe className="w-4 h-4" />, label: "Uptime", value: "99.99%" },
                                    { icon: <Server className="w-4 h-4" />, label: "Latency", value: "< 50ms" },
                                    { icon: <Shield className="w-4 h-4" />, label: "Security", value: "AES-256" },
                                    { icon: <Zap className="w-4 h-4" />, label: "Updates", value: "Real-time" },
                                ].map((item, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
                                        <div className="flex items-center gap-2 text-neutral-400 mb-2 text-sm">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        <div className="text-2xl font-bold text-white tracking-tight">{item.value}</div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="relative overflow-hidden rounded-[2rem] bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-8 sm:p-12">
                        <div className="mb-8">
                            <div className="inline-block px-3 py-1 rounded-full bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-sm font-medium text-gray-900 dark:text-white mb-4 shadow-sm">
                                Get Early Access
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Ready to upgrade your workflow?
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        placeholder="Jordan Smith"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                        placeholder="jordan@acme.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Company (Optional)</label>
                                <input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
                                    placeholder="Acme Inc."
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-4 w-full flex items-center justify-center gap-2 px-8 py-4 bg-gray-900 dark:bg-white hover:bg-orange-600 dark:hover:bg-orange-500 text-white dark:text-black hover:text-white dark:hover:text-white font-bold rounded-xl transition-all duration-300 group"
                            >
                                Request Demo Access
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <p className="text-center text-xs text-gray-500 mt-4">No credit card required. Free 14-day trial.</p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailsSection;