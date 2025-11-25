import React from "react";
import {
    Shield, Lock, Eye, Server, FileCheck
} from "lucide-react";

const Security = () => {
    return (
        <section className="py-24 bg-white dark:bg-neutral-950 transition-colors duration-300 relative" id="security">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4 border border-emerald-200 dark:border-emerald-800">
                            <Shield className="w-4 h-4" />
                            <span>Bank-Grade Security</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Your data, <span className="text-gray-400 dark:text-neutral-600">secure by design.</span>
                        </h2>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-sm md:text-right">
                        We don&apos;t just protect your data; we treat it as our most valuable asset.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-gray-50 dark:bg-neutral-900/50 p-8 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-emerald-500/30 transition-colors duration-300 group">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <Lock className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">End-to-End Encryption</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Data is encrypted in transit using TLS 1.3 and at rest using AES-256. Keys are managed via AWS KMS.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-neutral-900/50 p-8 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-emerald-500/30 transition-colors duration-300 group">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Granular Access</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Role-based access control (RBAC), SSO enforcement, and 2FA ensure only the right people see your data.
                        </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-neutral-900/50 p-8 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-emerald-500/30 transition-colors duration-300 group">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                            <FileCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Compliance Ready</h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                            Our architecture is SOC2 Type II ready. We conduct regular penetration testing and security audits.
                        </p>
                    </div>
                    <div className="md:col-span-2 lg:col-span-3 bg-[#0A0A0A] rounded-2xl p-8 sm:p-10 border border-neutral-800 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700"></div>

                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <Server className="w-6 h-6 text-emerald-500" />
                                    <h3 className="text-xl font-bold text-white">Data Residency & Backup</h3>
                                </div>
                                <p className="text-neutral-400 max-w-2xl text-lg">
                                    We perform daily encrypted backups stored in geographically separate regions.
                                    Enterprise customers can choose data residency in the <span className="text-white font-medium">US, EU, or India</span>.
                                </p>
                            </div>
                            <button className="flex-shrink-0 px-6 py-3 rounded-xl bg-white text-black font-bold hover:bg-emerald-500 hover:text-white transition-all duration-300">
                                View Security Policy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Security;