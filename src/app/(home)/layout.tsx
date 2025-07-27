import Navbar from '@/components/UI/Navbar';
import FooterSection from '@/components/layout/FooterSection';
import GoToTop from '@/components/UI/GoToTop';

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
      <FooterSection />
      <GoToTop />
    </>
  );
}
