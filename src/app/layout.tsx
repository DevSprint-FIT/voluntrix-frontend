import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: 'Voluntrix',
  description: 'Join, organize, and support volunteer events effortlessly.',
  keywords: ['volunteering', 'events', 'community', 'nonprofits'],
  openGraph: {
    title: 'Voluntrix',
    description: 'Empowering volunteers and organizations worldwide.',
    url: 'https://voluntrix-preview.vercel.app/',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* PayHere script preloading */}
        <Script 
          src="https://www.payhere.lk/lib/payhere.js" 
          strategy="beforeInteractive"
          id="payhere-script"
        />
      </head>
      <body suppressHydrationWarning>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
