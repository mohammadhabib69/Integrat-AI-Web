import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CopilotProviderWrapper from "@/components/CopilotProviderWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aether Todo | Premium Aesthetic Task Planner",
  description: "Organize work, manage goals, and clear your mind with a gorgeous interactive task dashboard designed in Next.js & Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CopilotProviderWrapper>
          {children}
        </CopilotProviderWrapper>
      </body>
    </html>
  );
}

