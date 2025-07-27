import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import Navbar from '@/components/UI/Navbar';
import FooterSection from '@/components/layout/FooterSection';
import GoToTop from '@/components/UI/GoToTop';

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

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <main>
          <Providers>{children}</Providers>
        </main>
      </body>
    </html>
  );
}
