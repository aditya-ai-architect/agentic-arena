import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Agentic Arena | Build Agents, Not Workflows",
  description: "Experience the power of agentic AI. Try Sentinel for competitive intelligence, Voice Agent for real-time conversation, and more.",
  keywords: ["AI", "Agents", "MCP", "Claude", "Gemini", "Automation", "Voice AI"],
  authors: [{ name: "Aditya Gaurav", url: "https://adityaai.dev" }],
  openGraph: {
    title: "Agentic Arena | Build Agents, Not Workflows",
    description: "Experience the power of agentic AI with working demos.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-grid bg-gradient-radial min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
