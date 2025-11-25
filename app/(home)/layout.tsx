import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="h-screen">
            <Navbar />
            {
                children
            }
            <Footer />
        </section>
    );
}