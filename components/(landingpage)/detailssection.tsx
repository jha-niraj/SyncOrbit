"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import {
    ArrowRight, Shield, Zap, Activity, Terminal, Cpu, Lock
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const DetailsSection = () => {
    const [formData, setFormData] = useState({ fullName: "", email: "", company: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Protocol initiated.");
        setFormData({ fullName: "", email: "", company: "" });
    };

    return (
        <section id="details" className="w-full bg-white dark:bg-neutral-950 py-24 border-t border-neutral-200 dark:border-neutral-800">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="container relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    <div className="relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-800 p-8 flex flex-col justify-between min-h-[500px]">
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20"></div>
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8 border-b border-neutral-800 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">System_Telemetry_v2.4</span>
                                </div>
                                <Terminal className="w-4 h-4 text-neutral-600" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">
                                Operational <br /> <span className="text-neutral-500">Excellence</span>
                            </h2>
                            <p className="text-neutral-400 text-sm font-mono mt-4 max-w-sm">
                                // REAL-TIME MONITORING <br />
                                Latency minimized. Throughput maximized.
                                Security protocols active.
                            </p>
                        </div>
                        <div className="relative z-10 grid grid-cols-1 gap-3 mt-12">
                            {
                                [
                                    { icon: <Activity className="w-4 h-4" />, label: "UPTIME_GUARANTEE", value: "99.99%", bar: "w-full" },
                                    { icon: <Zap className="w-4 h-4" />, label: "AVG_LATENCY", value: "24ms", bar: "w-[92%]" },
                                    { icon: <Shield className="w-4 h-4" />, label: "ENCRYPTION_LEVEL", value: "AES-256", bar: "w-full" },
                                    { icon: <Cpu className="w-4 h-4" />, label: "SERVER_LOAD", value: "34%", bar: "w-[34%]" },
                                ].map((item, idx) => (
                                    <div key={idx} className="group p-3 rounded bg-neutral-950/50 border border-neutral-800 hover:border-neutral-700 transition-all">
                                        <div className="flex justify-between items-center mb-2">
                                            <div className="flex items-center gap-2 text-neutral-500 text-[10px] font-mono uppercase tracking-wider group-hover:text-orange-500 transition-colors">
                                                {item.icon}
                                                {item.label}
                                            </div>
                                            <div className="text-xs font-mono font-bold text-white">{item.value}</div>
                                        </div>
                                        <div className="h-1 w-full bg-neutral-900 rounded-full overflow-hidden">
                                            <div className={cn("h-full bg-neutral-700 group-hover:bg-orange-500 transition-colors duration-500", item.bar)}></div>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    <div className="relative p-8 sm:p-10 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                        <div className="mb-8">
                            <div className="inline-block px-2 py-1 mb-4 border border-neutral-200 dark:border-neutral-800 rounded bg-neutral-50 dark:bg-neutral-900">
                                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-neutral-500">Access_Request</span>
                            </div>
                            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                                Initialize Workspace
                            </h2>
                            <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                                Enter your credentials to request early access to the engine.
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-mono font-bold uppercase text-neutral-500">User_ID (Name)</Label>
                                    <Input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full h-11 px-3 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white outline-none transition-all placeholder:text-neutral-400 font-mono"
                                        placeholder="Jordan Smith"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-[10px] font-mono font-bold uppercase text-neutral-500">Contact_Point (Email)</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full h-11 px-3 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white outline-none transition-all placeholder:text-neutral-400 font-mono"
                                        placeholder="jordan@acme.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-mono font-bold uppercase text-neutral-500">Org_Reference (Company)</Label>
                                <Input
                                    type="text"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    className="w-full h-11 px-3 rounded-md bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm focus:ring-1 focus:ring-neutral-900 dark:focus:ring-white focus:border-neutral-900 dark:focus:border-white outline-none transition-all placeholder:text-neutral-400 font-mono"
                                    placeholder="Acme Inc."
                                />
                            </div>
                            <button
                                type="submit"
                                className="mt-2 w-full flex items-center justify-center gap-2 h-12 bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 text-white dark:text-black font-bold text-sm uppercase tracking-wide rounded-md transition-all duration-200 group"
                            >
                                <Lock className="w-3 h-3" />
                                Submit Request
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <div className="flex justify-center pt-2">
                                <p className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">
                                    Protocol: Secure • 14-Day Eval Period
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetailsSection;