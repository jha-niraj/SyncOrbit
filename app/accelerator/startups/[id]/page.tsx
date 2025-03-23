"use client"

import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Users, Calendar, MapPin, Building, Briefcase, Globe, Mail, Phone } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data for startup submissions - same as in discover page
const STARTUP_SUBMISSIONS = [
    {
        id: "ecotrack",
        name: "EcoTrack",
        summary: "IoT-based solution for tracking and reducing carbon footprint in manufacturing",
        industry: "CleanTech",
        stage: "Prototype Ready",
        advisorsInterested: 7,
        description:
            "EcoTrack uses IoT sensors to monitor energy usage, emissions, and waste in real-time. Our AI-powered dashboard provides actionable insights to reduce environmental impact while saving costs. We've built a working prototype and tested it with 3 manufacturing companies with promising results.",
        logo: "/placeholder.svg?height=80&width=80",
        founder: "Rahul Sharma",
        foundedYear: 2022,
        location: "Bangalore, India",
        teamSize: 5,
        website: "#",
        funding: "Bootstrapped (₹50 Lakhs)",
        problem:
            "Manufacturing industries contribute significantly to carbon emissions and environmental degradation, yet many lack real-time visibility into their environmental impact.",
        solution:
            "Our IoT sensor network and AI analytics platform provide real-time monitoring and actionable insights to reduce environmental impact while optimizing operational efficiency.",
        traction:
            "3 pilot customers, 15% average reduction in energy costs, 20% reduction in carbon emissions for clients.",
        businessModel:
            "Hardware-as-a-Service (sensors) + SaaS subscription for analytics platform. ₹2.5 lakhs setup fee + ₹50,000 monthly subscription.",
        team: [
            { name: "Rahul Sharma", role: "Founder & CEO", bio: "Ex-Siemens, 8 years in industrial IoT" },
            { name: "Priya Desai", role: "CTO", bio: "Ex-Microsoft, IoT specialist" },
            { name: "Amit Kumar", role: "Head of Hardware", bio: "10+ years in sensor technology" },
        ],
        milestones: [
            { date: "Jan 2022", title: "Company Founded" },
            { date: "Apr 2022", title: "First Prototype Developed" },
            { date: "Aug 2022", title: "First Pilot Customer" },
            { date: "Dec 2022", title: "Completed 3 Successful Pilots" },
            { date: "Mar 2023", title: "Selected for ShunyaTech Accelerator" },
        ],
        contact: {
            email: "info@ecotrack.in",
            phone: "+91 9876543210",
        },
    },
    {
        id: "mediconnect",
        name: "MediConnect",
        summary: "Telemedicine platform connecting rural patients with specialist doctors",
        industry: "HealthTech",
        stage: "MVP",
        advisorsInterested: 5,
        description:
            "MediConnect bridges the healthcare gap for rural communities by providing a simple, low-bandwidth telemedicine solution. Our platform includes appointment scheduling, video consultations, prescription management, and follow-up care coordination. We've completed our MVP and are running a pilot program in 5 rural clinics.",
        logo: "/placeholder.svg?height=80&width=80",
        founder: "Dr. Ananya Patel",
        foundedYear: 2021,
        location: "Hyderabad, India",
        teamSize: 8,
        website: "#",
        funding: "Angel Round (₹1.2 Cr)",
        problem:
            "Over 700 million Indians live in rural areas with limited access to specialist healthcare. Patients often travel 100+ km for specialist consultations.",
        solution:
            "Our low-bandwidth telemedicine platform connects rural patients with urban specialists through local healthcare centers, reducing travel time and improving healthcare access.",
        traction: "5 rural clinics onboarded, 500+ consultations completed, 92% patient satisfaction rate.",
        businessModel:
            "B2B2C model - we charge healthcare centers a monthly subscription (₹15,000) plus a per-consultation fee (₹100).",
        team: [
            { name: "Dr. Ananya Patel", role: "Founder & CEO", bio: "Former Head of Telemedicine at Apollo Hospitals" },
            { name: "Vikram Reddy", role: "CTO", bio: "Ex-Practo, built telemedicine solutions for 5+ years" },
            { name: "Dr. Rajesh Kumar", role: "Medical Director", bio: "20+ years in rural healthcare" },
        ],
        milestones: [
            { date: "Sep 2021", title: "Company Founded" },
            { date: "Dec 2021", title: "MVP Development Completed" },
            { date: "Feb 2022", title: "First Rural Clinic Partnership" },
            { date: "Jul 2022", title: "Angel Funding Secured" },
            { date: "Nov 2022", title: "Expanded to 5 Rural Clinics" },
            { date: "Jan 2023", title: "Joined ShunyaTech Accelerator" },
        ],
        contact: {
            email: "contact@mediconnect.in",
            phone: "+91 8765432109",
        },
    },
    {
        id: "finlit",
        name: "FinLit",
        summary: "Gamified financial literacy app for teenagers and young adults",
        industry: "FinTech",
        stage: "Idea Stage",
        advisorsInterested: 3,
        description:
            "FinLit makes learning about personal finance fun and engaging through interactive games, challenges, and rewards. The app covers budgeting, saving, investing, and credit management with age-appropriate content. We're looking for guidance on developing our prototype and go-to-market strategy.",
        logo: "/placeholder.svg?height=80&width=80",
        founder: "Vikram Mehta",
        foundedYear: 2023,
        location: "Mumbai, India",
        teamSize: 3,
        website: "#",
        funding: "Pre-seed (₹25 Lakhs)",
        problem:
            "Financial literacy among Indian youth is alarmingly low, with only 27% of adults being financially literate. Traditional financial education is boring and ineffective.",
        solution:
            "Our gamified app makes financial education engaging through interactive challenges, real-world simulations, and reward systems tailored to different age groups.",
        traction: "Concept validation with 200 students across 3 schools, 85% expressed interest in using the app.",
        businessModel:
            "Freemium model with basic financial education free and premium features (advanced modules, personalized coaching) at ₹199/month.",
        team: [
            {
                name: "Vikram Mehta",
                role: "Founder & CEO",
                bio: "Former investment banker, passionate about financial education",
            },
            { name: "Neha Singh", role: "Product Designer", bio: "UX specialist with background in educational apps" },
            { name: "Rohan Joshi", role: "Game Developer", bio: "Created 3 educational games with 1M+ downloads" },
        ],
        milestones: [
            { date: "Feb 2023", title: "Company Founded" },
            { date: "Apr 2023", title: "Concept Validation Completed" },
            { date: "Jun 2023", title: "Pre-seed Funding Secured" },
            { date: "Jul 2023", title: "Applied to ShunyaTech Accelerator" },
        ],
        contact: {
            email: "hello@finlit.app",
            phone: "+91 7654321098",
        },
    },
    {
        id: "freshfarm",
        name: "FreshFarm",
        summary: "Farm-to-table marketplace connecting local farmers directly with consumers",
        industry: "AgriTech",
        stage: "Scaling Up",
        advisorsInterested: 9,
        description:
            "FreshFarm eliminates middlemen by enabling farmers to sell produce directly to consumers through our platform. We handle logistics, quality control, and payments, ensuring farmers get fair prices and consumers get fresh, local produce. We've launched in 3 cities and are looking to expand nationwide.",
        logo: "/placeholder.svg?height=80&width=80",
        founder: "Arjun Singh",
        foundedYear: 2020,
        location: "Pune, India",
        teamSize: 22,
        website: "#",
        funding: "Series A (₹8 Cr)",
        problem:
            "Indian farmers receive only 20-30% of the final consumer price due to multiple intermediaries. Consumers pay high prices for produce that isn't fresh.",
        solution:
            "Our platform connects farmers directly with consumers, handling logistics and quality control, ensuring farmers get 70%+ of the final price while consumers get fresher produce.",
        traction:
            "3,500+ active customers, 450+ farmer partners, ₹1.2 Cr monthly GMV, operating in Pune, Mumbai, and Nashik.",
        businessModel:
            "Marketplace model with 15% commission on transactions + premium subscription for consumers (₹499/year) with free delivery and early access.",
        team: [
            { name: "Arjun Singh", role: "Founder & CEO", bio: "Third-generation farmer, MBA from IIM-A" },
            { name: "Meera Patil", role: "COO", bio: "Ex-BigBasket, supply chain expert" },
            { name: "Sanjay Sharma", role: "CTO", bio: "Former tech lead at Grofers" },
            { name: "Deepak Verma", role: "Head of Farmer Relations", bio: "15+ years in agricultural extension" },
        ],
        milestones: [
            { date: "Mar 2020", title: "Company Founded" },
            { date: "Aug 2020", title: "Seed Funding (₹1.5 Cr)" },
            { date: "Oct 2020", title: "Launched in Pune" },
            { date: "Apr 2021", title: "Expanded to Mumbai" },
            { date: "Sep 2021", title: "Expanded to Nashik" },
            { date: "Feb 2022", title: "Series A Funding (₹8 Cr)" },
            { date: "May 2022", title: "Reached 3,000+ Customers" },
            { date: "Nov 2022", title: "Joined ShunyaTech Accelerator" },
        ],
        contact: {
            email: "support@freshfarm.in",
            phone: "+91 9876543210",
        },
    },
    {
        id: "learnloop",
        name: "LearnLoop",
        summary: "Adaptive learning platform for personalized K-12 education",
        industry: "EdTech",
        stage: "MVP",
        advisorsInterested: 6,
        description:
            "LearnLoop uses AI to create personalized learning paths for students based on their strengths, weaknesses, and learning style. Our platform integrates with school curricula and provides real-time feedback to teachers and parents. We've completed our MVP and are piloting with 2 schools.",
        logo: "/placeholder.svg?height=80&width=80",
        founder: "Neha Gupta",
        foundedYear: 2022,
        location: "Delhi, India",
        teamSize: 7,
        website: "#",
        funding: "Seed (₹2.5 Cr)",
        problem:
            "One-size-fits-all education fails to address individual learning needs, leaving many students behind while not challenging others enough.",
        solution:
            "Our AI-powered platform creates personalized learning paths based on each student's abilities, learning style, and progress, adapting in real-time to optimize learning outcomes.",
        traction: "2 school pilots with 500+ students, showing 22% improvement in test scores after 3 months of use.",
        businessModel:
            "B2B SaaS model charging schools ₹300 per student per year, with additional parent portal access at ₹999/year.",
        team: [
            {
                name: "Neha Gupta",
                role: "Founder & CEO",
                bio: "Former educator with 10+ years experience, EdTech researcher",
            },
            { name: "Arun Sharma", role: "CTO", bio: "AI specialist, previously built ML systems at BYJU'S" },
            {
                name: "Dr. Kavita Rao",
                role: "Chief Learning Officer",
                bio: "PhD in Education Psychology, curriculum design expert",
            },
        ],
        milestones: [
            { date: "Apr 2022", title: "Company Founded" },
            { date: "Jul 2022", title: "Seed Funding Secured" },
            { date: "Oct 2022", title: "MVP Completed" },
            { date: "Dec 2022", title: "First School Pilot Launched" },
            { date: "Feb 2023", title: "Second School Pilot Launched" },
            { date: "Apr 2023", title: "Selected for ShunyaTech Accelerator" },
        ],
        contact: {
            email: "info@learnloop.in",
            phone: "+91 8765432109",
        },
    },
    {
        id: "securechain",
        name: "SecureChain",
        summary: "Blockchain-based supply chain verification for luxury goods",
        industry: "Blockchain",
        stage: "Prototype Ready",
        advisorsInterested: 4,
        description:
            "SecureChain provides end-to-end authentication and tracking for luxury products using blockchain technology. Our solution prevents counterfeiting and ensures ethical sourcing by recording every step of the supply chain. We've built a working prototype and are in talks with several luxury brands.",
        logo: "/placeholder.svg?height=80&width=80",
        founder: "Aditya Kapoor",
        foundedYear: 2022,
        location: "Bangalore, India",
        teamSize: 6,
        website: "#",
        funding: "Seed (₹1.8 Cr)",
        problem:
            "The luxury goods market loses ₹20,000+ Cr annually to counterfeiting in India alone. Consumers lack reliable ways to verify product authenticity and ethical sourcing.",
        solution:
            "Our blockchain platform creates an immutable record of each product's journey from raw materials to retail, accessible to consumers via QR codes or NFC tags on products.",
        traction: "Completed POC with 2 luxury brands, tracking 500+ products with 98% verification accuracy.",
        businessModel: "SaaS model with setup fee (₹5 lakhs) plus per-product tracking fee (₹200-500 depending on volume).",
        team: [
            { name: "Aditya Kapoor", role: "Founder & CEO", bio: "Blockchain specialist, previously at Polygon" },
            { name: "Riya Sharma", role: "CTO", bio: "Smart contract developer, built 3 blockchain platforms" },
            { name: "Vivek Malhotra", role: "Head of Business Development", bio: "15+ years in luxury retail" },
        ],
        milestones: [
            { date: "Jun 2022", title: "Company Founded" },
            { date: "Sep 2022", title: "Seed Funding Secured" },
            { date: "Dec 2022", title: "Prototype Completed" },
            { date: "Feb 2023", title: "First Brand Partnership" },
            { date: "Apr 2023", title: "Second Brand Partnership" },
            { date: "May 2023", title: "Joined ShunyaTech Accelerator" },
        ],
        contact: {
            email: "contact@securechain.io",
            phone: "+91 7654321098",
        },
    },
    {
        id: "droneagri",
        name: "DroneAgri",
        summary: "Drone-based crop monitoring and precision agriculture solutions",
        industry: "AgriTech",
        stage: "Scaling Up",
        advisorsInterested: 7,
        description:
            "DroneAgri uses drones equipped with multispectral cameras to monitor crop health, detect diseases early, and enable precision agriculture. Our AI algorithms analyze imagery to provide actionable insights to farmers, helping them optimize inputs and increase yields.",
        logo: "/placeholder.svg?height=80&width=80",
        founder: "Rajiv Patel",
        foundedYear: 2021,
        location: "Chandigarh, India",
        teamSize: 12,
        website: "#",
        funding: "Series A (₹6 Cr)",
        problem:
            "Indian farmers lose 15-25% of crops to diseases and pests annually. Traditional monitoring methods are labor-intensive and often detect issues too late.",
        solution:
            "Our drone-based monitoring system with AI analysis detects crop issues 7-10 days earlier than visual inspection, allowing timely intervention and reducing crop losses.",
        traction:
            "Serving 200+ farms covering 15,000+ acres across Punjab, Haryana, and UP. Average yield increase of 18% for client farms.",
        businessModel:
            "Service-based model charging ₹1,200 per acre per season with quarterly monitoring, plus additional on-demand flights.",
        team: [
            { name: "Rajiv Patel", role: "Founder & CEO", bio: "Agricultural engineer, drone enthusiast" },
            {
                name: "Dr. Sunita Rao",
                role: "Chief Agricultural Scientist",
                bio: "PhD in Agronomy, 15+ years in crop research",
            },
            { name: "Karan Singh", role: "CTO", bio: "Computer vision specialist, previously at DJI" },
            { name: "Manish Kumar", role: "Head of Operations", bio: "Managed drone fleets for government surveys" },
        ],
        milestones: [
            { date: "Feb 2021", title: "Company Founded" },
            { date: "May 2021", title: "Seed Funding (₹1 Cr)" },
            { date: "Aug 2021", title: "First 10 Farm Clients" },
            { date: "Dec 2021", title: "Expanded to 50+ Farms" },
            { date: "Apr 2022", title: "Series A Funding (₹6 Cr)" },
            { date: "Jul 2022", title: "Reached 100+ Farm Clients" },
            { date: "Jan 2023", title: "Expanded to 200+ Farms" },
            { date: "Mar 2023", title: "Joined ShunyaTech Accelerator" },
        ],
        contact: {
            email: "info@droneagri.in",
            phone: "+91 9876543210",
        },
    },
]

export default function StartupDetailPage() {
    const params = useParams()
    const startupId = params.id as string

    const startup = STARTUP_SUBMISSIONS.find((s) => s.id === startupId)

    if (!startup) {
        return notFound()
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="container max-w-6xl mx-auto px-4 py-12">
                <div className="mb-6">
                    <Link
                        href="/discover"
                        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Discover
                    </Link>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
                            <div className="flex flex-col md:flex-row md:items-center gap-6 mb-6">
                                <Image
                                    src={startup.logo || "/placeholder.svg"}
                                    alt={startup.name}
                                    width={100}
                                    height={100}
                                    className="rounded-full"
                                />
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{startup.name}</h1>
                                    <p className="text-xl text-muted-foreground mb-4">{startup.summary}</p>
                                    <div className="flex flex-wrap gap-2">
                                        <Badge variant="outline">{startup.industry}</Badge>
                                        <Badge
                                            variant="secondary"
                                            className={
                                                startup.stage === "Scaling Up"
                                                    ? "bg-green-100 text-green-800"
                                                    : startup.stage === "MVP"
                                                        ? "bg-blue-100 text-blue-800"
                                                        : startup.stage === "Prototype Ready"
                                                            ? "bg-yellow-100 text-yellow-800"
                                                            : "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {startup.stage}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                            <Tabs defaultValue="overview">
                                <TabsList className="mb-4">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="team">Team</TabsTrigger>
                                    <TabsTrigger value="milestones">Milestones</TabsTrigger>
                                </TabsList>
                                <TabsContent value="overview" className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-bold mb-3">Description</h2>
                                        <p className="text-muted-foreground">{startup.description}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-3">Problem</h2>
                                        <p className="text-muted-foreground">{startup.problem}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-3">Solution</h2>
                                        <p className="text-muted-foreground">{startup.solution}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-3">Traction</h2>
                                        <p className="text-muted-foreground">{startup.traction}</p>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold mb-3">Business Model</h2>
                                        <p className="text-muted-foreground">{startup.businessModel}</p>
                                    </div>
                                </TabsContent>
                                <TabsContent value="team" className="space-y-6">
                                    <h2 className="text-xl font-bold mb-4">Team Members</h2>
                                    <div className="grid gap-4">
                                        {
                                        startup.team?.map((member, index) => (
                                            <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                                                <div className="bg-muted rounded-full p-3">
                                                    <Users className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{member.name}</h3>
                                                    <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                                                    <p className="text-sm">{member.bio}</p>
                                                </div>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </TabsContent>
                                <TabsContent value="milestones" className="space-y-6">
                                    <h2 className="text-xl font-bold mb-4">Company Milestones</h2>
                                    <div className="relative border-l border-muted pl-6 ml-3 space-y-6">
                                        {
                                        startup.milestones?.map((milestone, index) => (
                                            <div key={index} className="relative">
                                                <div className="absolute -left-9 mt-1.5 h-4 w-4 rounded-full bg-primary"></div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground">{milestone.date}</p>
                                                    <h3 className="font-medium">{milestone.title}</h3>
                                                </div>
                                            </div>
                                        ))
                                        }
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                    <div>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Company Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Founded</p>
                                        <p>{startup.foundedYear}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p>{startup.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Team Size</p>
                                        <p>{startup.teamSize} employees</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Building className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Founder</p>
                                        <p>{startup.founder}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Funding</p>
                                        <p>{startup.funding}</p>
                                    </div>
                                </div>
                                {
                                startup.website && (
                                    <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Website</p>
                                            <a href={startup.website} className="text-primary hover:underline">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )
                                }
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Contact Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {
                                startup.contact?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Email</p>
                                            <a href={`mailto:${startup.contact.email}`} className="text-primary hover:underline">
                                                {startup.contact.email}
                                            </a>
                                        </div>
                                    </div>
                                )
                                }
                                {
                                startup.contact?.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Phone</p>
                                            <a href={`tel:${startup.contact.phone}`} className="text-primary hover:underline">
                                                {startup.contact.phone}
                                            </a>
                                        </div>
                                    </div>
                                )
                                }
                            </CardContent>
                        </Card>
                        <div className="mt-6">
                            <Button className="w-full">Connect with Founder</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

