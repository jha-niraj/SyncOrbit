"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Download, Save, Zap, Database, Loader2, ArrowRight, Plus, X, HelpCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { EstimateResult } from "@/types"
import { generateAIEstimate } from "@/lib/(budgetestimator)/ai-estimate"
import { getInHouseEstimate } from "@/lib/(budgetestimator)/in-house-estimate"
import BudgetBreakdown from "./budget-breakdown"

type BudgetEstimatorProps = {
    initialProjectType?: string
}

// Project-specific requirements based on project type
const PROJECT_REQUIREMENTS = {
    "Web Development": [
        "User Authentication",
        "Payment Processing",
        "Content Management",
        "SEO Optimization",
        "Analytics Integration",
        "Responsive Design",
        "Multi-language Support",
        "Admin Dashboard",
        "API Integration",
        "Social Media Integration",
        "Email Notifications",
        "Search Functionality",
    ],
    "Mobile App": [
        "User Authentication",
        "Push Notifications",
        "Offline Mode",
        "In-App Purchases",
        "Social Media Integration",
        "Analytics",
        "Cross-platform Support",
        "Geolocation Features",
        "Camera Integration",
        "Biometric Authentication",
        "Payment Gateway",
        "Chat/Messaging",
    ],
    "E-commerce": [
        "Product Catalog",
        "Shopping Cart",
        "Payment Gateway",
        "Order Management",
        "Customer Accounts",
        "Inventory Management",
        "Discount System",
        "Reviews & Ratings",
        "Wishlist",
        "Product Comparison",
        "Shipping Integration",
        "Tax Calculation",
    ],
    "Enterprise Software": [
        "User Management",
        "Role-based Access",
        "Data Analytics",
        "Reporting",
        "API Integration",
        "Workflow Automation",
        "Document Management",
        "Audit Trails",
        "Single Sign-On",
        "Data Import/Export",
        "Compliance Features",
        "Custom Dashboards",
    ],
    "UI/UX Design": [
        "Wireframing",
        "Prototyping",
        "User Testing",
        "Style Guide",
        "Design System",
        "Responsive Design",
        "Accessibility Compliance",
        "Animation & Interactions",
        "Usability Testing",
        "Information Architecture",
        "User Research",
        "Competitive Analysis",
    ],
    "Digital Marketing": [
        "SEO Strategy",
        "Content Marketing",
        "Social Media",
        "Email Campaigns",
        "PPC Advertising",
        "Analytics & Reporting",
        "Conversion Optimization",
        "Marketing Automation",
        "Competitor Analysis",
        "Audience Targeting",
        "A/B Testing",
        "Landing Page Optimization",
    ],
    Branding: [
        "Logo Design",
        "Brand Guidelines",
        "Visual Identity",
        "Brand Strategy",
        "Brand Messaging",
        "Brand Assets",
        "Brand Positioning",
        "Market Research",
        "Competitor Analysis",
        "Brand Naming",
        "Tagline Development",
        "Brand Voice & Tone",
    ],
    "Content Creation": [
        "Blog Posts",
        "Video Production",
        "Infographics",
        "Social Media Content",
        "Copywriting",
        "Email Newsletters",
        "Ebooks & Whitepapers",
        "Case Studies",
        "Product Descriptions",
        "Technical Documentation",
        "Scriptwriting",
        "Content Strategy",
    ],
    "Video Editing": [
        "Color Grading",
        "Sound Design",
        "Motion Graphics",
        "Visual Effects",
        "Animation",
        "Transitions",
        "Subtitles & Captions",
        "Thumbnail Creation",
        "Intro/Outro Creation",
        "Green Screen Editing",
        "Audio Enhancement",
        "Video Optimization",
    ],
}

// Team size options
const TEAM_SIZES = [
    "Solo entrepreneur",
    "2-5 employees",
    "6-20 employees",
    "21-50 employees",
    "51-200 employees",
    "201-500 employees",
    "500+ employees",
]

// Budget ranges
const BUDGET_RANGES = [
    "Under $5,000",
    "$5,000 - $10,000",
    "$10,000 - $25,000",
    "$25,000 - $50,000",
    "$50,000 - $100,000",
    "$100,000 - $250,000",
    "$250,000+",
]

// Project goals
const PROJECT_GOALS = [
    "Launch a new product/service",
    "Improve existing product/service",
    "Increase revenue/sales",
    "Reduce costs/improve efficiency",
    "Enhance user experience",
    "Expand to new markets",
    "Comply with regulations",
    "Rebrand/reposition in market",
]

export default function BudgetEstimator({ initialProjectType = "" }: BudgetEstimatorProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [useAI, setUseAI] = useState(true)
    const [customRequirement, setCustomRequirement] = useState("")
    const [selectedRequirements, setSelectedRequirements] = useState<string[]>([]);
    console.log(selectedRequirements);
    const [formData, setFormData] = useState({
        projectType: initialProjectType,
        projectDescription: "",
        projectGoals: [] as string[],
        targetAudience: "",
        teamSize: "",
        expectedLaunchDate: "",
        budgetRange: "",
        additionalRequirements: [] as string[],
        timeline: "3-6 months",
        complexity: "medium",
        customRequirements: [] as string[],
        integrationsNeeded: "",
        competitiveAnalysis: false,
        maintenancePlan: false,
        scalabilityRequirements: "",
        securityRequirements: [] as string[],
    })
    const [estimateResult, setEstimateResult] = useState<EstimateResult | null>(null)
    const [activeSection, setActiveSection] = useState("basic")
    const requirementsRef = useRef<HTMLDivElement>(null)

    // Update available requirements when project type changes
    const availableRequirements = formData.projectType
        ? PROJECT_REQUIREMENTS[formData.projectType as keyof typeof PROJECT_REQUIREMENTS] || []
        : []

    // Update selected requirements when project type changes
    useEffect(() => {
        setSelectedRequirements([])
        setFormData((prev) => ({
            ...prev,
            additionalRequirements: [],
        }))
    }, [formData.projectType])

    // Generate estimate when form is submitted
    const handleGenerateEstimate = async () => {
        setIsLoading(true)

        try {
            let result

            if (useAI) {
                result = await generateAIEstimate(formData)
            } else {
                result = await getInHouseEstimate(formData)
            }

            setEstimateResult(result)
        } catch (err) {
            const error = err as Error;
            console.log("Error generating estimate:", error)
        } finally {
            setIsLoading(false)
        }
    }

    // Handle form field changes
    const handleChange = (field: string, value: string | number | boolean) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }))

        // Clear estimate when important fields change
        if (field === "projectType" || field === "complexity" || field === "timeline") {
            setEstimateResult(null)
        }
    }

    // Toggle between AI and In-House data
    const handleToggleAI = (checked: boolean) => {
        setUseAI(checked)
        // Clear previous estimate when switching methods
        setEstimateResult(null)
    }

    // Handle requirement selection
    const handleRequirementChange = (requirement: string, isChecked: boolean) => {
        if (isChecked) {
            if (!formData.additionalRequirements.includes(requirement)) {
                setFormData((prev) => ({
                    ...prev,
                    additionalRequirements: [...prev.additionalRequirements, requirement],
                }))
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                additionalRequirements: prev.additionalRequirements.filter((req) => req !== requirement),
            }))
        }
    }

    // Add custom requirement
    const handleAddCustomRequirement = () => {
        if (customRequirement.trim() && !formData.customRequirements.includes(customRequirement.trim())) {
            setFormData((prev) => ({
                ...prev,
                customRequirements: [...prev.customRequirements, customRequirement.trim()],
            }))
            setCustomRequirement("")
        }
    }

    // Remove custom requirement
    const handleRemoveCustomRequirement = (requirement: string) => {
        setFormData((prev) => ({
            ...prev,
            customRequirements: prev.customRequirements.filter((req) => req !== requirement),
        }))
    }

    // Handle project goals selection
    const handleGoalChange = (goal: string, isChecked: boolean) => {
        if (isChecked) {
            if (!formData.projectGoals.includes(goal)) {
                setFormData((prev) => ({
                    ...prev,
                    projectGoals: [...prev.projectGoals, goal],
                }))
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                projectGoals: prev.projectGoals.filter((g) => g !== goal),
            }))
        }
    }

    // Handle security requirements
    const handleSecurityRequirementChange = (requirement: string, isChecked: boolean) => {
        if (isChecked) {
            if (!formData.securityRequirements.includes(requirement)) {
                setFormData((prev) => ({
                    ...prev,
                    securityRequirements: [...prev.securityRequirements, requirement],
                }))
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                securityRequirements: prev.securityRequirements.filter((req) => req !== requirement),
            }))
        }
    }

    // Export as PDF
    const handleExportPDF = () => {
        alert("PDF export functionality would be implemented here")
    }

    // Save estimate
    const handleSaveEstimate = () => {
        alert("Save functionality would be implemented here")
    }

    return (
        <div className="mb-12">
            <Card className="mb-8 bg-white border-gray-200 shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                        <CardTitle className="text-gray-900">Estimation Method</CardTitle>
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="ai-toggle" className={!useAI ? "text-blue-500 font-medium" : "text-gray-500"}>
                                <Database className="h-4 w-4 inline mr-1" />
                                In-House
                            </Label>
                            <Switch
                                id="ai-toggle"
                                checked={useAI}
                                onCheckedChange={handleToggleAI}
                                className="data-[state=checked]:bg-blue-500"
                            />
                            <Label htmlFor="ai-toggle" className={useAI ? "text-blue-500 font-medium" : "text-gray-500"}>
                                <Zap className="h-4 w-4 inline mr-1" />
                                AI-Powered
                            </Label>
                        </div>
                    </div>
                    <CardDescription className="text-gray-600">
                        {
                            useAI
                                ? "Using AI to generate a custom estimate based on your detailed project description and inputs"
                                : "Using our in-house data from similar projects for a standardized estimate"
                        }
                    </CardDescription>
                </CardHeader>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-5">
                    <Card className="bg-white border-gray-200 shadow-md">
                        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
                            <CardHeader>
                                <CardTitle className="text-gray-900">Project Details</CardTitle>
                                <CardDescription className="text-gray-600">
                                    Fill in the details below to get your budget estimate
                                </CardDescription>

                                <div className="mt-4">
                                    <TabsList className="grid grid-cols-3 mb-4">
                                        <TabsTrigger
                                            value="basic"
                                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                        >
                                            Basic Info
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="requirements"
                                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                        >
                                            Requirements
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="advanced"
                                            className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                                        >
                                            Advanced
                                        </TabsTrigger>
                                    </TabsList>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form className="space-y-6">
                                <TabsContent value="basic" className="mt-0 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="projectType" className="text-gray-900 flex items-center">
                                            Project Type
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="w-80">Select the type of project you&apos;re planning to develop</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </Label>
                                        <Select value={formData.projectType} onValueChange={(value) => handleChange("projectType", value)}>
                                            <SelectTrigger id="projectType" className="bg-white border-gray-300 text-gray-900">
                                                <SelectValue placeholder="Select project type" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-gray-200">
                                                {
                                                    Object.keys(PROJECT_REQUIREMENTS).map((type) => (
                                                        <SelectItem key={type} value={type} className="text-gray-900 hover:bg-gray-100">
                                                            {type}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    {
                                        useAI && (
                                            <div className="space-y-2">
                                                <Label htmlFor="projectDescription" className="text-gray-900 flex items-center">
                                                    Project Description
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <HelpCircle className="h-4 w-4 ml-1 text-gray-400" />
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p className="w-80">
                                                                    Provide a detailed description of your project for more accurate AI estimation
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </Label>
                                                <Textarea
                                                    id="projectDescription"
                                                    placeholder="Describe your project in detail. What are your goals? What specific features do you need? Any technical requirements?"
                                                    className="min-h-[120px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                                    value={formData.projectDescription}
                                                    onChange={(e) => handleChange("projectDescription", e.target.value)}
                                                />
                                                <p className="text-xs text-gray-500">
                                                    The more details you provide, the more accurate your AI-generated estimate will be.
                                                </p>
                                            </div>
                                        )
                                    }
                                    <div className="space-y-2">
                                        <Label htmlFor="projectGoals" className="text-gray-900">
                                            Project Goals
                                        </Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                            {
                                                PROJECT_GOALS.map((goal) => (
                                                    <div key={goal} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`goal-${goal}`}
                                                            checked={formData.projectGoals.includes(goal)}
                                                            onCheckedChange={(checked) => handleGoalChange(goal, checked === true)}
                                                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                        />
                                                        <Label htmlFor={`goal-${goal}`} className="text-sm text-gray-700 cursor-pointer">
                                                            {goal}
                                                        </Label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="targetAudience" className="text-gray-900">
                                            Target Audience
                                        </Label>
                                        <Input
                                            id="targetAudience"
                                            placeholder="Who is your target audience?"
                                            className="bg-white border-gray-300 text-gray-900"
                                            value={formData.targetAudience}
                                            onChange={(e) => handleChange("targetAudience", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="teamSize" className="text-gray-900">
                                            Team Size
                                        </Label>
                                        <Select value={formData.teamSize} onValueChange={(value) => handleChange("teamSize", value)}>
                                            <SelectTrigger id="teamSize" className="bg-white border-gray-300 text-gray-900">
                                                <SelectValue placeholder="Select team size" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-gray-200">
                                                {
                                                    TEAM_SIZES.map((size) => (
                                                        <SelectItem key={size} value={size} className="text-gray-900 hover:bg-gray-100">
                                                            {size}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="budgetRange" className="text-gray-900">
                                            Budget Range
                                        </Label>
                                        <Select value={formData.budgetRange} onValueChange={(value) => handleChange("budgetRange", value)}>
                                            <SelectTrigger id="budgetRange" className="bg-white border-gray-300 text-gray-900">
                                                <SelectValue placeholder="Select budget range" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-gray-200">
                                                {
                                                    BUDGET_RANGES.map((range) => (
                                                        <SelectItem key={range} value={range} className="text-gray-900 hover:bg-gray-100">
                                                            {range}
                                                        </SelectItem>
                                                    ))
                                                }
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="timeline" className="text-gray-900">
                                            Estimated Timeline
                                        </Label>
                                        <Select value={formData.timeline} onValueChange={(value) => handleChange("timeline", value)}>
                                            <SelectTrigger id="timeline" className="bg-white border-gray-300 text-gray-900">
                                                <SelectValue placeholder="Select timeline" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white border-gray-200">
                                                <SelectItem value="1-3 months" className="text-gray-900 hover:bg-gray-100">
                                                    1-3 months
                                                </SelectItem>
                                                <SelectItem value="3-6 months" className="text-gray-900 hover:bg-gray-100">
                                                    3-6 months
                                                </SelectItem>
                                                <SelectItem value="6-12 months" className="text-gray-900 hover:bg-gray-100">
                                                    6-12 months
                                                </SelectItem>
                                                <SelectItem value="12+ months" className="text-gray-900 hover:bg-gray-100">
                                                    12+ months
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <Label htmlFor="complexity" className="text-gray-900">
                                                Project Complexity
                                            </Label>
                                            <span className="text-sm text-gray-600 capitalize">{formData.complexity}</span>
                                        </div>
                                        <Slider
                                            id="complexity"
                                            min={0}
                                            max={2}
                                            step={1}
                                            value={[formData.complexity === "low" ? 0 : formData.complexity === "medium" ? 1 : 2]}
                                            onValueChange={(value) => {
                                                const complexityMap = ["low", "medium", "high"]
                                                handleChange("complexity", complexityMap[value[0]])
                                            }}
                                            className="mt-2"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Low</span>
                                            <span>Medium</span>
                                            <span>High</span>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="requirements" className="mt-0 space-y-6">
                                    <div className="space-y-2" ref={requirementsRef}>
                                        <div className="flex justify-between items-center">
                                            <Label className="text-gray-900 font-medium">Feature Requirements</Label>
                                            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none">
                                                {formData.additionalRequirements.length} selected
                                            </Badge>
                                        </div>
                                        {
                                            formData.projectType ? (
                                                <div className="border border-gray-200 rounded-md p-4 max-h-[300px] overflow-y-auto">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                        {
                                                            availableRequirements.map((req) => (
                                                                <div key={req} className="flex items-center space-x-2">
                                                                    <Checkbox
                                                                        id={`req-${req}`}
                                                                        checked={formData.additionalRequirements.includes(req)}
                                                                        onCheckedChange={(checked) => handleRequirementChange(req, checked === true)}
                                                                        className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                                    />
                                                                    <Label htmlFor={`req-${req}`} className="text-sm text-gray-700 cursor-pointer">
                                                                        {req}
                                                                    </Label>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center p-6 border border-dashed border-gray-300 rounded-md">
                                                    <p className="text-gray-500">Please select a project type first</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="customRequirement" className="text-gray-900">
                                            Custom Requirements
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="customRequirement"
                                                placeholder="Add any specific requirements"
                                                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                                value={customRequirement}
                                                onChange={(e) => setCustomRequirement(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") {
                                                        e.preventDefault()
                                                        handleAddCustomRequirement()
                                                    }
                                                }}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                                onClick={handleAddCustomRequirement}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {
                                                formData.customRequirements.map((req, index) => (
                                                    <Badge key={index} variant="outline" className="border-blue-500/50 text-blue-700 bg-blue-50">
                                                        {req}
                                                        <X
                                                            className="h-3 w-3 ml-1 cursor-pointer"
                                                            onClick={() => handleRemoveCustomRequirement(req)}
                                                        />
                                                    </Badge>
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="integrationsNeeded" className="text-gray-900">
                                            Third-party Integrations
                                        </Label>
                                        <Textarea
                                            id="integrationsNeeded"
                                            placeholder="List any third-party services or APIs you need to integrate with"
                                            className="min-h-[80px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                            value={formData.integrationsNeeded}
                                            onChange={(e) => handleChange("integrationsNeeded", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-gray-900">Security Requirements</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                                            {
                                                [
                                                    "GDPR Compliance",
                                                    "HIPAA Compliance",
                                                    "SOC 2",
                                                    "PCI DSS",
                                                    "Two-Factor Authentication",
                                                    "Data Encryption",
                                                ].map((req) => (
                                                    <div key={req} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`security-${req}`}
                                                            checked={formData.securityRequirements.includes(req)}
                                                            onCheckedChange={(checked) => handleSecurityRequirementChange(req, checked === true)}
                                                            className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                                        />
                                                        <Label htmlFor={`security-${req}`} className="text-sm text-gray-700 cursor-pointer">
                                                            {req}
                                                        </Label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="advanced" className="mt-0 space-y-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="expectedLaunchDate" className="text-gray-900">
                                            Expected Launch Date
                                        </Label>
                                        <Input
                                            id="expectedLaunchDate"
                                            type="date"
                                            className="bg-white border-gray-300 text-gray-900"
                                            value={formData.expectedLaunchDate}
                                            onChange={(e) => handleChange("expectedLaunchDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="scalabilityRequirements" className="text-gray-900">
                                            Scalability Requirements
                                        </Label>
                                        <Textarea
                                            id="scalabilityRequirements"
                                            placeholder="Describe your scalability needs (e.g., expected user growth, traffic spikes)"
                                            className="min-h-[80px] bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                                            value={formData.scalabilityRequirements}
                                            onChange={(e) => handleChange("scalabilityRequirements", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="competitiveAnalysis"
                                                checked={formData.competitiveAnalysis}
                                                onCheckedChange={(checked) => handleChange("competitiveAnalysis", checked === true)}
                                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                            />
                                            <Label htmlFor="competitiveAnalysis" className="text-gray-900 cursor-pointer">
                                                Include competitive analysis
                                            </Label>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="maintenancePlan"
                                                checked={formData.maintenancePlan}
                                                onCheckedChange={(checked) => handleChange("maintenancePlan", checked === true)}
                                                className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                                            />
                                            <Label htmlFor="maintenancePlan" className="text-gray-900 cursor-pointer">
                                                Include maintenance plan
                                            </Label>
                                        </div>
                                    </div>
                                </TabsContent>
                                <div className="pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
                                        onClick={handleGenerateEstimate}
                                        disabled={isLoading || !formData.projectType}
                                    >
                                        {
                                            isLoading ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Generating Estimate...
                                                </>
                                            ) : (
                                                <>
                                                    Generate Estimate
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </>
                                            )
                                        }
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                        </Tabs>
                    </Card>
                </div>
                <div className="lg:col-span-7">
                    {
                        estimateResult ? (
                            <Card className="bg-white border-gray-200 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-gray-900">Budget Estimate</CardTitle>
                                    <CardDescription className="text-gray-600">
                                        Based on {useAI ? "AI analysis" : "in-house data"} for your {formData.projectType} project
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <BudgetBreakdown estimate={estimateResult} />
                                    <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                        <Button
                                            variant="outline"
                                            onClick={handleExportPDF}
                                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Export as PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleSaveEstimate}
                                            className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                        >
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Estimate
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card className="border-dashed bg-white border-gray-300 shadow-md">
                                <CardContent className="flex flex-col items-center justify-center py-16">
                                    <div className="text-center text-gray-600">
                                        <div className="mb-4">
                                            {
                                                useAI ? (
                                                    <Zap className="h-16 w-16 mx-auto text-blue-400/50" />
                                                ) : (
                                                    <Database className="h-16 w-16 mx-auto text-blue-400/50" />
                                                )
                                            }
                                        </div>
                                        <h3 className="text-xl font-medium mb-4 text-gray-900">No Estimate Generated Yet</h3>
                                        <p className="max-w-md mx-auto">
                                            Fill in your project details and click &quot;Generate Estimate&quot; to see a detailed budget breakdown
                                        </p>
                                        {
                                            useAI && (
                                                <div className="mt-6 p-4 bg-blue-50 rounded-lg max-w-md mx-auto">
                                                    <h4 className="font-medium text-blue-700 mb-2">AI-Powered Estimation</h4>
                                                    <p className="text-sm text-gray-700">
                                                        Our AI analyzes your project description, requirements, and parameters to generate a tailored
                                                        estimate based on current market rates and industry standards.
                                                    </p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

