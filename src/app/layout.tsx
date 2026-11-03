import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { LiveImageProvider } from "@/context/LiveImageContext";
import { ClientShell } from "@/components/ClientShell";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LIVE IMAGE LK | 4K Multi-Camera Production & Live Streaming Sri Lanka",
  description:
    "Premier 4K multi-camera event production, live broadcasting, concerts, weddings, corporate events and sports cinematography in Colombo & across Sri Lanka. Founded by B Damith Sadaruwan.",
  keywords: [
    "Live Image LK",
    "B Damith Sadaruwan",
    "Multi-camera production Sri Lanka",
    "Live streaming Colombo",
    "Wedding live stream Sri Lanka",
    "4K OB van broadcast Sri Lanka",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-rec selection:text-white">
        <LiveImageProvider>
          <ClientShell>{children}</ClientShell>
        </LiveImageProvider>
      </body>
    </html>
  );
}
