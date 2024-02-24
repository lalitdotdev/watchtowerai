import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/Theme-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "watchtowerai | ObjectDetection",
    description: "An AI-powered Next.js 14 web application with advanced people detection and recording capabilities. Experience real-time monitoring and seamless recording features for enhanced security and surveillance. Powered by cutting-edge technology, this app ensures efficient detection and tracking while providing a user-friendly interface for effortless management.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <ThemeProvider attribute="class" defaultTheme="system">
                <body className={inter.className}>{children}</body>
                <Toaster />
            </ThemeProvider>
        </html>
    );
}
