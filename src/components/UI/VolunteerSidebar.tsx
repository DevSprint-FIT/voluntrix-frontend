'use client';

import { useState, useEffect } from 'react';
import {
  Home,
  BarChart,
  User,
  Calendar,
  Bell,
  Send,
  Settings,
  LogOut,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { Button, useDisclosure } from '@heroui/react';
import VolunteerToHostModal from './VolunteerToHostModal';
import {
  fetchVolunteer,
  VolunteerProfile,
} from '@/services/volunteerProfileService';
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
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [volunteer, setVolunteer] = useState<VolunteerProfile>();

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setNotificationCount(3);
    }, 500);
  }, []);

  useEffect(() => {
    const getVolunteerProfile = async () => {
      try {
        const data = await fetchVolunteer();
        setVolunteer(data);
      } catch (error) {
        console.error('Error fetching volunteer profile:', error);
      }
    };
    getVolunteerProfile();
  }, []);

  const menuItems: MenuItem[] = [
    { name: 'Home', icon: Home, href: '/' },
    { name: 'Dashboard', icon: BarChart, href: '/Volunteer/dashboard' },
    { name: 'Profile', icon: User, href: '/Volunteer/profile' },
    { name: 'Events', icon: Calendar, href: '/Volunteer/events/active' },
    {
      name: 'Notifications',
      icon: Bell,
      badge: notificationCount,
      href: '/notifications',
    },
    { name: 'Social Feed', icon: Send, href: '/social-feed' },
    { name: 'Settings', icon: Settings, href: '/Volunteer/settings' },
  ];

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-[#f8fefc] border-r px-4 py-6 flex flex-col justify-between z-10">
      {/* Logo */}
      <div>
        <div className="mb-8 flex justify-center">
          <img
            src="/images/logo.svg"
            alt="Logo"
            className="h-18 w-18 ml-[-10px]"
          />
        </div>

        {/* Navigation */}
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
        <Button
          onPress={() => {
            if (volunteer && volunteer.isEventHost) {
              router.push('/event-host/events');
            } else {
              onOpen();
            }
          }}
          className="rounded-full bg-shark-950 text-shark-50 font-primary text-base tracking-wide mt-8"
        >
          Switch to Event Host
        </Button>
        <VolunteerToHostModal isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={() => setSelectedItem('Logout')}
          className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-verdant-50 group text-sm text-shark-950 w-full text-left"
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
