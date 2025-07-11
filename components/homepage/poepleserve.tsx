import { cn } from "@/lib/utils";
import Marquee from "../ui/marquee";
import Image from "next/image";

const companyLogos = [
    {
        name: "Google",
        industry: "Technology",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    },
    {
        name: "Apple",
        industry: "Technology",
        logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    },
    {
        name: "Nike",
        industry: "Apparel",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
    },
    {
        name: "Tesla",
        industry: "Automotive",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg",
    },
    {
        name: "Spotify",
        industry: "Music Streaming",
        logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg",
    }
];

const firstRow = companyLogos.slice(0, companyLogos.length / 2);
const secondRow = companyLogos.slice(companyLogos.length / 2);

const CompanyCard = ({
    logo,
    name,
    industry,
}: {
    logo: string;
    name: string;
    industry: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-2 flex items-center gap-4",
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <Image
                className="flex h-full w-40"
                width="150"
                height="150"
                alt={`${name} logo`}
                src={logo}
            />
            <div className="flex flex-col">
                <figcaption className="text-sm font-medium text-black">
                    {name}
                </figcaption>
                <p className="text-xs font-medium text-black">{industry}</p>
            </div>
        </figure>
    );
};

export function PeopleService() {
    return (
        <div className="relative max-w-7xl mx-auto flex h-[400px] py-10 w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent">
            <Marquee reverse pauseOnHover className="[--duration:15s]">
                {
                    firstRow.map((company) => (
                        <CompanyCard key={company.name} {...company} />
                    ))
                }
            </Marquee>
            <Marquee pauseOnHover className="[--duration:15s]">
                {
                    secondRow.map((company) => (
                        <CompanyCard key={company.name} {...company} />
                    ))
                }
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
    );
}
