import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Voluntrix",
  description: "Join, organize, and support volunteer events effortlessly.",
  keywords: ["volunteering", "events", "community", "nonprofits"],
  openGraph: {
    title: "Voluntrix",
    description: "Empowering volunteers and organizations worldwide.",
    // url: "https://voluntrix.com",
    type: "website",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        {/* Layout UI */}
        {/* Place children where you want to render a page or nested layout */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
