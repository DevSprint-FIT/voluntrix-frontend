import AdminSidebar from '@/components/UI/AdminSidebar';
import React from 'react';
import { Metadata } from 'next';

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
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 p-6 ml-60">{children}</div>
    </div>
  );
}
