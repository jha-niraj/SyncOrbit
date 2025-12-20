import React from "react";
import {
    Shield, Lock, Server, FileCheck, Fingerprint
} from "lucide-react";

const Security = () => {
    return (
        <section className="py-24 bg-white dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 relative overflow-hidden" id="security">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-2 py-1 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-900 mb-6">
                            <Shield className="w-3 h-3 text-green-600 dark:text-green-500" />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">Security_Protocol_Lvl_4</span>
                        </div>
                        <h2 className="text-4xl sm:text-5xl font-bold text-neutral-900 dark:text-white tracking-tighter">
                            Fortified <span className="text-neutral-400">Architecture.</span>
                        </h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-neutral-200 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden">
                    {
                        [
                            { icon: <Lock />, title: "AES-256 Encryption", desc: "Data encrypted at rest and in transit via TLS 1.3. Keys managed via AWS KMS." },
                            { icon: <Fingerprint />, title: "RBAC & SSO", desc: "Granular permission scopes. Enforce Google/Okta SSO for all organization members." },
                            { icon: <FileCheck />, title: "SOC2 Type II", desc: "Compliance ready architecture. Regular penetration testing and third-party audits." },
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-neutral-950 p-8 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-colors group">
                                <div className="w-10 h-10 rounded border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-white mb-6 group-hover:border-green-500/50 group-hover:text-green-500 transition-colors">
                                    {
                                        item.icon
                                    }
                                </div>
                                <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))
                    }
                    <div className="md:col-span-2 lg:col-span-3 bg-neutral-950 p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neutral-800/30 rounded-full blur-[100px] pointer-events-none"></div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <Server className="w-5 h-5 text-green-500" />
                                    <h3 className="text-xl font-bold text-white">Data Residency Options</h3>
                                </div>
                                <p className="text-neutral-400 max-w-xl text-base font-light">
                                    Strict data sovereignty. Select your hosting region during workspace initialization to ensure compliance with local regulations.
                                    Available in <span className="text-white font-mono">US-EAST</span>, <span className="text-white font-mono">EU-WEST</span>, and <span className="text-white font-mono">APAC-SOUTH</span>.
                                </p>
                            </div>
                            <button className="px-6 py-3 rounded border border-neutral-700 hover:bg-white hover:text-black hover:border-white text-white transition-all text-xs font-mono uppercase tracking-widest font-bold">
                                View Security Whitepaper
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Security;