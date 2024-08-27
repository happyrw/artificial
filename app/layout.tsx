import type { Metadata } from "next";

import "./globals.css"
import "@uploadthing/react/styles.css";
import { ClerkProvider } from "@clerk/nextjs";
import Head from "next/head";

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
                <Head>
                    {process.env.NODE_ENV === 'production' && (
                        <script
                            async
                            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6529864147696481"
                            crossOrigin="anonymous"
                        ></script>
                    )}
                </Head>
                <body>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}