import type { Metadata } from "next";

import "./globals.css"
import "@uploadthing/react/styles.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
    title: "AI",
    description: "AI image generator",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                variables: { colorPrimary: '#624cf5' }
            }}
        >
            <html lang="en">
                <body>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}