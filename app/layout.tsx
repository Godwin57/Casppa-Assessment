import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DevRoleSwitcher } from "@/components/DevRoleSwitcher"; // Adjust this path if needed
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CASPAA",
  description: "A CBT platform for schools",
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
        {children}
        <DevRoleSwitcher />
      </body>
    </html>
  );
}
