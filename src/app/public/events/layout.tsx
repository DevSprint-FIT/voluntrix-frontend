import React from 'react';
import { Providers } from '../../providers';
import Navbar from '@/components/UI/Navbar';
import FooterSection from '@/components/layout/FooterSection';

export default function EventHostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Navbar />
      <Providers>{children}</Providers>
      <FooterSection />
    </main>
  );
}
