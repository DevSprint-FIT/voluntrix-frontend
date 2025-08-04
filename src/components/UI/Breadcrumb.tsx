'use client'

import authService from '@/services/authService';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Breadcrumb() {
  const [path, setPath] = useState('/public/events');
  useEffect(() => {
    if (authService.isAuthenticated()) {
      setPath('/events');
    }
  }, []);
  return (
    <div className="w-full flex items-start justify-center mt-32">
      <div className="h-8 w-[1200px] flex items-center justify-start">
        <p className="font-secondary font-medium text-shark-950 text-md">
          <Link href="/">Home</Link>
          <span className="text-shark-300"> / </span>
          <Link href={path}>Events</Link>
        </p>
      </div>
    </div>
  );
}
