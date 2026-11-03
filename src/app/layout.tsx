import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";
import { LiveImageProvider } from "@/context/LiveImageContext";
import { ClientShell } from "@/components/ClientShell";
import { AuthSessionProvider } from "@/components/AuthSessionProvider";
import { getServerSession } from "next-auth";
import { unstable_rethrow } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getFallbackSiteData, getSiteData, SiteData } from "@/lib/siteData";
import type { UserRole } from "@/data/seedData";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // A broken auth setup (e.g. missing NEXTAUTH_SECRET) must not take the
  // public site down; visitors are simply treated as signed out
  let role: UserRole | null = null;
  try {
    const session = await getServerSession(authOptions);
    role = session?.user.role ?? null;
  } catch (e) {
    // Let Next.js's own control-flow errors (dynamic rendering) through
    unstable_rethrow(e);
    console.error("Failed to read the login session", e);
  }
  let siteData: SiteData;
  try {
    siteData = await getSiteData(role);
  } catch (e) {
    console.error("Failed to load site data from the database", e);
    siteData = getFallbackSiteData(role);
  }

  return (
    <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
      <body className="antialiased selection:bg-rec selection:text-white">
        <AuthSessionProvider>
          <LiveImageProvider initialData={siteData}>
            <ClientShell>{children}</ClientShell>
          </LiveImageProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
