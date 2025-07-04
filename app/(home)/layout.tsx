import Footer from "@/components/footer";
import Navbar from "@/components/homepage/navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="min-h-screen">
            <Navbar />
            {
                children
            }
            <Footer />
        </section>
    );
}