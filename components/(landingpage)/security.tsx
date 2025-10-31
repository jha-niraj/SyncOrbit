import React, { useRef, useEffect } from "react";
import { Shield, Lock, Database, Eye } from "lucide-react";

interface SecurityFeatureProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const SecurityFeature = ({ icon, title, description }: SecurityFeatureProps) => {
    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
            <div className="rounded-full bg-pulse-50 w-12 h-12 flex items-center justify-center text-pulse-500 mb-4">
                {icon}
            </div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
};

const Security = () => {
    const sectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const elements = entry.target.querySelectorAll(".fade-in-element");
                        elements.forEach((el, index) => {
                            setTimeout(() => {
                                el.classList.add("animate-fade-in");
                            }, index * 100);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1 }
        );

        const currentSection = sectionRef.current;
        if (currentSection) {
            observer.observe(currentSection);
        }

        return () => {
            if (currentSection) {
                observer.unobserve(currentSection);
            }
        };
    }, []);

    const securityFeatures = [
        {
            icon: <Lock className="w-6 h-6" />,
            title: "Encryption",
            description: "TLS in transit & AES-256 at rest. Your data is encrypted at every step."
        },
        {
            icon: <Eye className="w-6 h-6" />,
            title: "Access controls",
            description: "Role-based permissions, SSO & 2FA. Control who sees what in your workspace."
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Compliance options",
            description: "SOC2/ISO-ready architecture. Built for enterprise compliance requirements."
        },
        {
            icon: <Database className="w-6 h-6" />,
            title: "Backups & uptime",
            description: "Daily backups and 99.9% uptime SLA options for Enterprise plans."
        }
    ];

    return (
        <section className="py-20 bg-white relative" id="security" ref={sectionRef}>
            <div className="section-container">
                <div className="text-center mb-16 opacity-0 fade-in-element">
                    <div className="pulse-chip mx-auto mb-4">
                        <span>Security</span>
                    </div>
                    <h2 className="section-title mb-4">Enterprise-grade security — built for trust</h2>
                    <p className="section-subtitle mx-auto">
                        Secure by default — protect your data and your team.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {
                        securityFeatures.map((feature) => (
                            <div key={feature.title} className="opacity-0 fade-in-element">
                                <SecurityFeature
                                    icon={feature.icon}
                                    title={feature.title}
                                    description={feature.description}
                                />
                            </div>
                        ))
                    }
                </div>

                <div className="bg-gray-50 rounded-2xl p-8 text-center opacity-0 fade-in-element">
                    <div className="flex items-center justify-center mb-4">
                        <Shield className="w-8 h-8 text-pulse-500 mr-3" />
                        <h3 className="text-xl font-semibold">Data Residency</h3>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        We store backups in secure, SOC2-compliant data centers. Contact us for custom data residency requirements and regional compliance options.
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Security;