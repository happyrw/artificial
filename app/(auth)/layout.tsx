import "@uploadthing/react/styles.css";

export default function RootLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <body className="bg-black flex justify-center mt-5 md:mt-20">
            {children}
        </body>
    );
};