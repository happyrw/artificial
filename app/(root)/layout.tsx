import type { Metadata } from "next";
import "@uploadthing/react/styles.css";
import Sidebar from "@/components/shared/sidebar";
import { IBM_Plex_Sans } from "next/font/google";
import { cn } from "@/lib/utils";
import MobileNav from "@/components/shared/mobilenav";
import { Toaster } from "@/components/ui/toaster";

const IBMPlex = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '---font-ibm-plex'
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("font-IBMPlex antialiased", IBMPlex.variable)}>
        <main className="root">
          <Sidebar />
          <MobileNav />
          <div className="root-container">
            <div className="wrapper">
              {children}
            </div>
          </div>
          <Toaster />
        </main>
      </body>
    </html>
  );
}
