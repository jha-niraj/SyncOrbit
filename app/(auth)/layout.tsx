export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <section className="h-screen">
            {
                children
            }
        </section>
    );
}
