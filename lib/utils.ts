import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount)
}

export function formatDate(date: Date | string): string {
	return new Intl.DateTimeFormat('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	}).format(new Date(date))
}

// Array of nature-themed cover images
export const DEFAULT_COVER_IMAGES = [
	"https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80", // Mountain lake
	"https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80", // Forest
	"https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80", // Sunlit forest
	"https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80", // Foggy mountains
	"https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80", // Path through forest
	"https://images.unsplash.com/photo-1426604966848-d7adac402bff?q=80", // Mountain stream
	"https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80", // Sunset valley
	"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80", // Mountain peaks
	"https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80", // Green hills
	"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80", // Autumn forest
	"https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?q=80", // Mountain lake reflection
	"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80"  // Misty mountains
]

// Random cover images from Unsplash
const coverImages = [
	'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
	'https://images.unsplash.com/photo-1511300636408-a63d4dc2e7e9',
	'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
	'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d',
	'https://images.unsplash.com/photo-1472214103451-9374bd1c798e'
];

export function getRandomCoverImage(): string {
	const randomIndex = Math.floor(Math.random() * coverImages.length);
	return `${coverImages[randomIndex]}?q=80&w=2000`;
}
