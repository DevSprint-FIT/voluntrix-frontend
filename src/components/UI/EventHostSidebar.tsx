'use client';

import { useState, useEffect } from 'react';
import { BarChart, Calendar, Bell, LogOut, LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@heroui/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
}

const VolunteerSidebar = () => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>('Home');

  useEffect(() => {
    setTimeout(() => {
      setNotificationCount(3);
    }, 500);
  }, []);

  const menuItems: MenuItem[] = [
    { name: 'Dashboard', icon: BarChart, href: '/event-host/dashboard' },
    // { name: 'Profile', icon: User, href: '/event-host/profile' },
    { name: 'Events', icon: Calendar, href: '/event-host/events' },
    {
      name: 'Notifications',
      icon: Bell,
      badge: notificationCount,
      href: '/event-host/notifications',
    },
    // { name: 'Social Feed', icon: Send, href: '/event-host/social-feed' },
    // { name: 'Settings', icon: Settings, href: '/event-host/settings' },
  ];

  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-[#f8fefc] border-r px-4 py-6 flex flex-col justify-between z-10">
      <div>
        <div className="mb-8 flex justify-center">
          <Image
            src="/images/logo.svg"
            alt="Logo"
            width={152}
            height={44}
            className="ml-[-10px]"
          />
        </div>
        <nav>
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => {
              const isActive = selectedItem === item.name;

              return (
                <Link key={item.name} href={item.href || '#'}>
                  <div
                    onClick={() => setSelectedItem(item.name)}
                    className={`w-full cursor-pointer text-left flex items-center justify-between px-2 py-2 rounded-md hover:bg-verdant-50 relative ${
                      isActive ? 'text-verdant-700 font-semibold' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon
                        className={`h-5 w-5 ${
                          isActive ? 'text-verdant-700' : ''
                        }`}
                      />
                      <span className="font-secondary font-medium text-shark-950">
                        {item.name}
                      </span>
                    </div>

                    {typeof item.badge === 'number' && item.badge > 0 && (
                      <span className="text-xs bg-verdant-100 text-shark-950 px-1.5 rounded-md">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute right-0 top-0 h-full w-1 bg-verdant-700 rounded-l-md" />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
      <div className="space-y-8">
        <Button
          onPress={() => router.push('/Volunteer/dashboard')}
          className="rounded-full bg-shark-950 text-shark-50 font-primary text-base tracking-wide mt-8"
        >
          Switch to Volunteer
        </Button>

        <button
          onClick={() => setSelectedItem('Logout')}
          className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-shark-50 group text-sm text-shark-950 w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <LogOut className="h-5 w-5" />
            <span className="font-primary">Logout</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VolunteerSidebar;
