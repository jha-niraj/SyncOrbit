import Link from "next/link";

export default function InvoiceFooter() {
    return (
        <footer className="w-full flex items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full max-w-7xl p-4 mx-auto space-y-4 text-sm text-center text-gray-500">
                <p>
                    &copy; 2025 Shunya Tech. All rights reserved.
                </p>
                <p>
                    Made with ❤️ by <Link href="https://x.com/vayulabs" target="_blank" rel="noopener noreferrer" className="text-primary">Shunya Tech</Link>
                </p>
            </div>
    </footer>
    )
}