import { Code2, Briefcase, Zap, FileText } from "lucide-react";

export type ResourceCategory = "All" | "Whitepapers" | "Feature Updates" | "Productivity Guides";

export interface Author {
    name: string;
    avatar: string;
    role: string;
}

export interface ResourcePost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string; // Using HTML string for simplicity in this demo
    coverImage: string;
    category: Exclude<ResourceCategory, "All">;
    author: Author;
    date: string;
    readTime: string;
}

export const resourcesData: ResourcePost[] = [
    {
        id: "wp-001",
        slug: "the-synchronization-effect-whitepaper",
        title: "The Synchronization Effect: How Unified Workflows compound Team Velocity",
        excerpt: "A deep dive into the productivity loss caused by context switching and how SyncOrbit's dual-mode architecture reclaims lost hours.",
        coverImage: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2940&auto=format&fit=crop",
        category: "Whitepapers",
        author: {
            name: "Nilesh Kumar Gupta",
            avatar: "/aboutus/nirajjha.jpeg",
            role: "Founder & CEO"
        },
        date: "Oct 24, 2025",
        readTime: "12 min read",
        content: `
            <h2>The Fragmented Reality of Modern Work</h2>
            <p>In the current landscape of digital work, teams are drowning in tools. A typical product team might use Jira for tracking, Notion for documentation, Slack for communication, and email for external client wrangling. While each tool serves a purpose, the space *between* them is where productivity goes to die.</p>
            <p>We call this "Context Switching Tax." Research suggests it takes an average of 23 minutes to regain deep focus after an interruption. If an engineer or PM is switching between an internal roadmap and a client-facing board ten times a day, half their day is lost to cognitive recalibration.</p>

            <h2>Enter the Orbital Workflow</h2>
            <p>SyncOrbit was built on a singular premise: **Movement shouldn't mean friction.** By unifying internal product development and external client services into a single, synchronized platform, we eliminate the need to jump between disparate systems.</p>
            
            <h3>1. The Power of Dual Modes</h3>
            <p>The core of this productivity boost lies in our unique architecture. Teams don't have to hack one tool to serve two masters. </p>
            <ul>
                <li><strong>Internal Mode:</strong> Engineers work with raw velocity. Git integrations, technical specs, and honest internal debate happen here, completely shielded from external view.</li>
                <li><strong>Agency Mode:</strong> A curated, sanitized view of progress is presented to clients. They see movement and feel involved, cutting down on the "any updates?" emails by over 60%.</li>
            </ul>

            <h3>2. Single Source of Truth, Multiple Views</h3>
            <p>The magic happens because these aren't two different databases. It's one central "Orbit" of data. When an engineer moves a task to "Done" in Internal Mode, the corresponding card on the Client Board automatically updates based on pre-set rules. No manual double-entry. No conflicting status reports.</p>

            <h2>Measuring the Impact</h2>
            <p>Early adopters of this unified approach have reported significant improvements in key metrics:</p>
            <ul>
                <li><strong>40% reduction</strong> in time spent on weekly status reporting.</li>
                <li><strong>25% increase</strong> in engineering sprint velocity due to fewer interruptions.</li>
                <li><strong>Higher client satisfaction scores (NPS)</strong> due to real-time transparency.</li>
            </ul>
            <p>By stopping the gravitational pull of chaotic, disconnected tools, SyncOrbit allows your team to enter a state of flow—a stable, high-velocity trajectory toward your goals.</p>
        `
    },
    {
        id: "fu-001",
        slug: "introducing-hybrid-core",
        title: "Feature Update: Introducing Hybrid Core for Enterprise",
        excerpt: "Run R&D and Client Services under one roof with strict firewalls. The ultimate solution for large organizations shipping IP and serving clients.",
        coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
        category: "Feature Updates",
        author: {
            name: "Niraj Kumar Jha",
            avatar: "/aboutus/nirajjha.jpeg",
            role: "Co-Founder & CTO"
        },
        date: "Oct 15, 2025",
        readTime: "5 min read",
        content: `<p>We are thrilled to announce the general availability of Hybrid Core...</p>` // Add full content
    },
    {
        id: "pg-001",
        slug: "guide-async-communication",
        title: "The Art of Async: Mastering communication in a distributed world",
        excerpt: "Stop relying on real-time meetings for everything. Learn how to use SyncOrbit's threaded comments and Loom integrations to work better, apart.",
        coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop",
        category: "Productivity Guides",
        author: {
            name: "Anoop Grover",
            avatar: "/aboutus/anoopgrover.jpeg",
            role: "COO"
        },
        date: "Oct 1, 2025",
        readTime: "8 min read",
        content: `<p>Async is not just about working in different timezones...</p>` // Add full content
    },
];

export const categories: ResourceCategory[] = ["All", "Whitepapers", "Feature Updates", "Productivity Guides"];

export const categoryIcons = {
    "All": Zap,
    "Whitepapers": FileText,
    "Feature Updates": Code2,
    "Productivity Guides": Briefcase
};