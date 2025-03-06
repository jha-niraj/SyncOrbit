import { cn } from "@/lib/utils";
import Marquee from "../ui/marquee";
import Image from "next/image";

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
    },
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

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

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
                "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-2 flex items-center gap-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
            )}
        >
            <Image
                className="rounded-full"
                width="150"
                height="150"
                alt={`${name}'s avatar`}
                src={img}
            />
            <div className="flex flex-col">
                <figcaption className="text-sm font-medium text-black ">
                    {name}
                </figcaption>
                <p className="text-xs font-medium text-black">{location}</p>
            </div>
        </figure>
    );
};

export function PeopleService() {
    return (
        <div className="relative max-w-7xl mx-auto flex h-[350px] w-full flex-col items-center justify-center overflow-hidden rounded-lg">
            <Marquee reverse pauseOnHover className="[--duration:15s]">
                {
                    firstRow.map((review) => (
                        <ReviewCard key={review.name} {...review} />
                    ))
                }
            </Marquee>
            <Marquee pauseOnHover className="[--duration:15s]">
                {
                    secondRow.map((review) => (
                        <ReviewCard key={review.name}  {...review} />
                    ))
                }
            </Marquee>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
        </div>
    );
}
