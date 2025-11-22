import React from "react";
import { Shield, Lock, Database, Eye, CheckCircle } from "lucide-react";

const Security = () => {
    const securityFeatures = [
        {
            icon: <Lock className="w-6 h-6" />,
            title: "End-to-End Encryption",
            description: "TLS in transit & AES-256 at rest. Your data is encrypted at every step of the journey.",
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Granular Access Controls",
            description: "Role-based permissions, SSO & 2FA. Precise control over who sees what in your workspace.",
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Enterprise Compliance",
            description: "SOC2 Type II ready architecture. Built to meet rigorous enterprise compliance requirements.",
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: "Reliability & Backups",
            description: "Daily encrypted backups and 99.9% uptime SLA guarantees for Enterprise plans.",
        },
    ];

    return (
        <section className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300" id="security">
            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-4">
                        <span>Security</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Enterprise-grade security
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Secure by default. We protect your data so you can focus on your work.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {securityFeatures.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-8 border border-transparent hover:border-orange-200 dark:hover:border-orange-900/50 transition-colors duration-300"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white dark:bg-neutral-800 shadow-sm flex items-center justify-center text-[#FE5C02] mb-6">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Bottom Banner */}
                <div className="bg-gray-900 dark:bg-neutral-900 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
                    {/* Background decorative glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-neutral-800 to-transparent opacity-50 pointer-events-none"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center justify-center mb-4 text-white">
                            <Shield className="w-8 h-8 text-[#FE5C02] mr-3" />
                            <h3 className="text-2xl font-bold">Data Residency & Privacy</h3>
                        </div>
                        <p className="text-gray-300 max-w-2xl mx-auto text-lg mb-8">
                            We store backups in secure, SOC2-compliant data centers. We offer EU and US data residency options for Enterprise customers.
                        </p>
                        <button className="px-6 py-3 rounded-full border border-gray-600 text-white hover:bg-white hover:text-black transition-colors duration-300 font-medium">
                            Read our Security Whitepaper
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Security;