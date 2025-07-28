import Sidebar from '@/components/UI/Sidebar';
import React from 'react';

export default function OrganizationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 ml-60">{children}</div>
    </div>
  );
}
