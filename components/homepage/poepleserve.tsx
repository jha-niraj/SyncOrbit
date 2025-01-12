import { cn } from "@/lib/utils";
import Marquee from "../ui/marquee";
import ShineBorder from "../ui/shine-border";
import Image from "next/image";

const service = [
    {
        name: "Website Development",
        location: "",
        img: "https://imgs.search.brave.com/wENFW3F9ShMe934oX5sYornMfePsrEXGkQ3LEdgaWag/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzAxLzYzLzA1/LzM2MF9GXzMwMTYz/MDU5Ml9GdkpPSVc5/WkR6UEtnUnl3cWls/Z0VvcXJYdDJxZG93/aS5qcGc"
    },
    {
        name: "Web Designing",
        location: "",
        img: "https://imgs.search.brave.com/wENFW3F9ShMe934oX5sYornMfePsrEXGkQ3LEdgaWag/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzAxLzYzLzA1/LzM2MF9GXzMwMTYz/MDU5Ml9GdkpPSVc5/WkR6UEtnUnl3cWls/Z0VvcXJYdDJxZG93/aS5qcGc"
    },
    {
        name: "Video Editing",
        location: "",
        img: "https://imgs.search.brave.com/wENFW3F9ShMe934oX5sYornMfePsrEXGkQ3LEdgaWag/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAzLzAxLzYzLzA1/LzM2MF9GXzMwMTYz/MDU5Ml9GdkpPSVc5/WkR6UEtnUnl3cWls/Z0VvcXJYdDJxZG93/aS5qcGc"
    }
]
const reviews = [
    {
        name: "Jack",
        location: "New York, USA",
        img: "https://img.freepik.com/free-photo/confident-sassy-young-bearded-gay-man-pink-t-shirt-shirt-hold-hand-waist-pointing-upper-left-corner-smiling-suggest-friends-visit-party-nearby_176420-37053.jpg?semt=ais_hybrid",
    },
    {
        name: "Jill",
        location: "London, UK",
        img: "https://img.freepik.com/free-photo/confident-sassy-young-bearded-gay-man-pink-t-shirt-shirt-hold-hand-waist-pointing-upper-left-corner-smiling-suggest-friends-visit-party-nearby_176420-37053.jpg?semt=ais_hybrid",
    },
    {
        name: "John",
        location: "Sydney, Australia",
        img: "https://img.freepik.com/free-photo/confident-sassy-young-bearded-gay-man-pink-t-shirt-shirt-hold-hand-waist-pointing-upper-left-corner-smiling-suggest-friends-visit-party-nearby_176420-37053.jpg?semt=ais_hybrid",
    }
];

const firstRow = service.slice(0, service.length);
const secondRow = reviews.slice(0, reviews.length);

const ReviewCard = ({
    img,
    name,
    location,
}: {
    img: string;
    name: string;
    location: string;
}) => {
    return (
        <figure
            className={cn(
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4 flex items-center gap-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <Image
                className="rounded-full"
                width="48"
                height="48"
                alt={`${name}'s avatar`}
                src={img}
            />
            <div className="flex flex-col">
                <figcaption className="text-sm font-medium text-white ">
                    {name}
                </figcaption>
                <p className="text-xs font-medium text-white">{location}</p>
            </div>
        </figure>
    );
};

export function PeopleService() {
    return (
        <div className="relative max-w-6xl mx-auto flex h-[200px] w-full flex-col items-center justify-center overflow-hidden rounded-lg md:shadow-xl">
            <Marquee pauseOnHover className="[--duration:20s]">
                {
                    firstRow.map((review) => (
                        <ShineBorder key={review.name}>
                            <ReviewCard {...review} />
                        </ShineBorder>
                    ))
                }
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {
                    secondRow.map((review) => (
                        <ShineBorder key={review.name}>
                            <ReviewCard {...review} />
                        </ShineBorder>
                    ))
                }
            </Marquee>
            {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div> */}
        </div>
    );
}
