"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
    CreditCard, Shield, Lock, ArrowLeft, Star,
    Users, Globe, BarChart3, HeadphonesIcon,
    Smartphone, Building2, CheckCircle
} from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PlanFeatures {
    projects: number | string;
    developers: number | string;
    storage: string;
    support: string;
    analytics: boolean;
    customDomain: boolean;
    apiAccess: boolean;
    webhooks: boolean;
    sso: boolean;
    whiteLabel: boolean;
    dedicatedManager: boolean;
    customIntegrations: boolean;
}

interface Plan {
    name: string;
    description: string;
    features: PlanFeatures;
    popular: boolean;
}

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
}

interface FormData {
    email: string;
    firstName: string;
    lastName: string;
    company: string;
    phone: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("card");
    const [isProcessing, setIsProcessing] = useState(false);
    const [currency, setCurrency] = useState<"USD" | "INR">("USD");
    const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
    const [formData, setFormData] = useState<FormData>({
        email: "",
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
        cardName: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "United States"
    });

    // Get plan and currency from URL params
    const planParam = searchParams.get("plan") || "professional";
    const currencyParam = searchParams.get("currency") as "USD" | "INR" || "USD";
    const billingParam = searchParams.get("billing") as "monthly" | "annual" || "monthly";

    useEffect(() => {
        setCurrency(currencyParam);
        setBillingCycle(billingParam);
    }, [currencyParam, billingParam]);

    const pricingData = {
        USD: {
            starter: { monthly: 0, annual: 0 },
            professional: { monthly: 19, annual: 15 },
            enterprise: { monthly: 49, annual: 39 },
        },
        INR: {
            starter: { monthly: 0, annual: 0 },
            professional: { monthly: 1599, annual: 1249 },
            enterprise: { monthly: 4099, annual: 3249 },
        }
    };

    const plans: Record<string, Plan> = {
        starter: {
            name: "Starter",
            description: "Perfect for individuals and small teams getting started",
            features: {
                projects: 3,
                developers: 2,
                storage: "5GB",
                support: "Community",
                analytics: true,
                customDomain: false,
                apiAccess: false,
                webhooks: false,
                sso: false,
                whiteLabel: false,
                dedicatedManager: false,
                customIntegrations: false,
            },
            popular: false,
        },
        professional: {
            name: "Professional",
            description: "Ideal for growing teams and professional projects",
            features: {
                projects: 15,
                developers: 10,
                storage: "100GB",
                support: "Priority Email",
                analytics: true,
                customDomain: true,
                apiAccess: true,
                webhooks: true,
                sso: false,
                whiteLabel: false,
                dedicatedManager: false,
                customIntegrations: true,
            },
            popular: true,
        },
        enterprise: {
            name: "Enterprise",
            description: "Advanced features for large organizations",
            features: {
                projects: "Unlimited",
                developers: "Unlimited",
                storage: "1TB",
                support: "24/7 Phone & Chat",
                analytics: true,
                customDomain: true,
                apiAccess: true,
                webhooks: true,
                sso: true,
                whiteLabel: true,
                dedicatedManager: true,
                customIntegrations: true,
            },
            popular: false,
        },
    };

    const paymentMethods: PaymentMethod[] = [
        {
            id: "card",
            name: "Credit/Debit Card",
            icon: CreditCard,
            description: "Visa, Mastercard, American Express"
        },
        {
            id: "upi",
            name: "UPI",
            icon: Smartphone,
            description: "Google Pay, PhonePe, Paytm"
        },
        {
            id: "netbanking",
            name: "Net Banking",
            icon: Building2,
            description: "All major banks supported"
        }
    ];

    const selectedPlan = plans[planParam];
    const planPrice = pricingData[currency][planParam as keyof typeof pricingData.USD];
    const currentPrice = planPrice[billingCycle];
    const savings = billingCycle === "annual" ? Math.round(((planPrice.monthly * 12 - planPrice.annual * 12) / (planPrice.monthly * 12)) * 100) : 0;

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            // Redirect to success page or show success message
            router.push("/checkout/success");
        }, 3000);
    };

    const formatPrice = (price: number) => {
        return currency === "USD" ? `$${price}` : `₹${price}`;
    };

    const planFeatures = [
        { key: "projects", label: "Projects", icon: Globe },
        { key: "developers", label: "Team Members", icon: Users },
        { key: "storage", label: "Storage", icon: BarChart3 },
        { key: "support", label: "Support", icon: HeadphonesIcon },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/pricing">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Pricing
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Complete Your Purchase
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            Secure checkout powered by industry-leading encryption
                        </p>
                    </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <Card className="border-2 border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl text-gray-900 dark:text-white">
                                            {selectedPlan.name} Plan
                                        </CardTitle>
                                        <CardDescription className="mt-1">
                                            {selectedPlan.description}
                                        </CardDescription>
                                    </div>
                                    {
                                        selectedPlan.popular && (
                                            <Badge className="bg-blue-500 text-white">
                                                <Star className="w-3 h-3 mr-1" />
                                                Popular
                                            </Badge>
                                        )
                                    }
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Billing Cycle
                                        </span>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm ${billingCycle === 'monthly' ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                                Monthly
                                            </span>
                                            <span className={`text-sm ${billingCycle === 'annual' ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                                                Annual
                                            </span>
                                            {
                                                savings > 0 && (
                                                    <Badge variant="secondary" className="ml-2">
                                                        Save {savings}%
                                                    </Badge>
                                                )
                                            }
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-gray-900 dark:text-white">
                                            Plan Includes:
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            {
                                                planFeatures.map((feature) => (
                                                    <div key={feature.key} className="flex items-center gap-2">
                                                        <feature.icon className="w-4 h-4 text-blue-500" />
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                                            {selectedPlan.features[feature.key as keyof PlanFeatures]} {feature.label}
                                                        </span>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {selectedPlan.name} ({billingCycle})
                                            </span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {formatPrice(currentPrice)}
                                                {billingCycle === "annual" ? "/year" : "/month"}
                                            </span>
                                        </div>
                                        {
                                            billingCycle === "annual" && (
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-500">
                                                        Billed annually
                                                    </span>
                                                    <span className="text-green-600 font-medium">
                                                        Save {formatPrice(planPrice.monthly * 12 - planPrice.annual * 12)}
                                                    </span>
                                                </div>
                                            )
                                        }
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span className="text-gray-900 dark:text-white">Total</span>
                                            <span className="text-gray-900 dark:text-white">
                                                {formatPrice(currentPrice)}
                                                {billingCycle === "annual" ? "/year" : "/month"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                                    <Shield className="w-5 h-5 text-green-500" />
                                    Secure Checkout
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        256-bit SSL encryption
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        PCI DSS compliant
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        30-day money-back guarantee
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        Cancel anytime
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-white">
                                        Contact Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                value={formData.firstName}
                                                onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                value={formData.lastName}
                                                onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="company">Company</Label>
                                            <Input
                                                id="company"
                                                value={formData.company}
                                                onChange={(e) => handleInputChange("company", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                value={formData.phone}
                                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-white">
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-3">
                                        {
                                            paymentMethods.map((method) => (
                                                <div
                                                    key={method.id}
                                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === method.id
                                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20"
                                                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300"
                                                        }`}
                                                    onClick={() => setSelectedPaymentMethod(method.id)}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-4 h-4 rounded-full border-2 ${selectedPaymentMethod === method.id
                                                                ? "border-blue-500 bg-blue-500"
                                                                : "border-gray-300"
                                                            }`}>
                                                            {
                                                                selectedPaymentMethod === method.id && (
                                                                    <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                                                                )
                                                            }
                                                        </div>
                                                        <method.icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-white">
                                                                {method.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {method.description}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    {
                                        selectedPaymentMethod === "card" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="space-y-4"
                                            >
                                                <div>
                                                    <Label htmlFor="cardNumber">Card Number</Label>
                                                    <Input
                                                        id="cardNumber"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={formData.cardNumber}
                                                        onChange={(e) => handleInputChange("cardNumber", e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                                        <Input
                                                            id="expiryDate"
                                                            placeholder="MM/YY"
                                                            value={formData.expiryDate}
                                                            onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="cvv">CVV</Label>
                                                        <Input
                                                            id="cvv"
                                                            placeholder="123"
                                                            value={formData.cvv}
                                                            onChange={(e) => handleInputChange("cvv", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="cardName">Name on Card</Label>
                                                    <Input
                                                        id="cardName"
                                                        value={formData.cardName}
                                                        onChange={(e) => handleInputChange("cardName", e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </motion.div>
                                        )
                                    }
                                    {
                                        selectedPaymentMethod === "upi" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="space-y-4"
                                            >
                                                <Alert>
                                                    <Smartphone className="h-4 w-4" />
                                                    <AlertDescription>
                                                        You will be redirected to your UPI app to complete the payment.
                                                    </AlertDescription>
                                                </Alert>
                                            </motion.div>
                                        )
                                    }
                                    {
                                        selectedPaymentMethod === "netbanking" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="space-y-4"
                                            >
                                                <Alert>
                                                    <Building2 className="h-4 w-4" />
                                                    <AlertDescription>
                                                        You will be redirected to your bank&apos;s secure website to complete the payment.
                                                    </AlertDescription>
                                                </Alert>
                                            </motion.div>
                                        )
                                    }
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-gray-900 dark:text-white">
                                        Billing Address
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={(e) => handleInputChange("address", e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={(e) => handleInputChange("city", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="state">State/Province</Label>
                                            <Input
                                                id="state"
                                                value={formData.state}
                                                onChange={(e) => handleInputChange("state", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                                            <Input
                                                id="zipCode"
                                                value={formData.zipCode}
                                                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="country">Country</Label>
                                            <Input
                                                id="country"
                                                value={formData.country}
                                                onChange={(e) => handleInputChange("country", e.target.value)}
                                                required
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Button
                                type="submit"
                                className="w-full h-12 text-lg font-semibold"
                                disabled={isProcessing}
                            >
                                {
                                    isProcessing ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Processing Payment...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Lock className="w-4 h-4" />
                                            Complete Purchase - {formatPrice(currentPrice)}
                                            {billingCycle === "annual" ? "/year" : "/month"}
                                        </div>
                                    )
                                }
                            </Button>
                            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                                By completing your purchase, you agree to our{" "}
                                <Link href="/terms" className="text-blue-600 hover:underline">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy" className="text-blue-600 hover:underline">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}