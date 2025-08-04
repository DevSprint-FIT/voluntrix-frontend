import { Metadata } from 'next';
import AdminSidebar from '@/components/UI/AdminSidebar';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Voluntrix',
  description: 'Administrative dashboard for managing the Voluntrix platform',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}
