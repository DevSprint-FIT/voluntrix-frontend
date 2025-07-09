"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import Link from "next/link";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
}

const Sidebar = () => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>("Home");

  useEffect(() => {
    setTimeout(() => {
      setNotificationCount(3);
    }, 500);
  }, []);

  const menuItems: MenuItem[] = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Dashboard", icon: BarChart, href: "/Organization/dashboard" },
    { name: "Profile", icon: User, href: "/Organization/profile" },
    { name: "Events", icon: Calendar, href: "/Organization/events/active" },
    {
      name: "Notifications",
      icon: Bell,
      badge: notificationCount,
      href: "/Organization/notifications",
    },
    { name: "Social Feed", icon: Send, href: "/Organization/feed" },
    { name: "Settings", icon: Settings, href: "/Organization/settings" },
  ];

  return (
    <div className="h-screen w-60 bg-[#f8fefc] border-r  py-6 flex flex-col justify-between fixed">
      {/* Logo */}
      <div>
        <div className="mb-8 flex justify-center">
          <img src="/images/logo.svg" alt="Logo" className="h-18 w-18 mr-6" />
        </div>

        {/* Navigation */}
        <nav>
          <div className="flex flex-col space-y-4">
            {menuItems.map((item) => {
              const isActive = selectedItem === item.name;

              return (
                <Link key={item.name} href={item.href || "#"}>
                  <div
                    onClick={() => setSelectedItem(item.name)}
                    className={`w-full cursor-pointer text-left flex items-center justify-between px-6 py-2 rounded-md hover:bg-verdant-50 relative ${
                      isActive ? "text-verdant-700 font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <item.icon
                        className={`h-5 w-5 ${
                          isActive ? "text-verdant-700" : ""
                        }`}
                      />
                      <span className="font-secondary font-medium text-shark-950">
                        {item.name}
                      </span>
                    </div>

                    {typeof item.badge === "number" && item.badge > 0 && (
                      <span className="text-xs bg-verdant-100 text-shark-950  px-1 mr-4 rounded-md">
                        {item.badge}
                      </span>
                    )}

                    {isActive && (
                      <span className="absolute right-0 top-0 h-full w-1 bg-verdant-700 rounded-full " />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Logout */}
      <div>
        <button
          onClick={() => setSelectedItem("Logout")}
          className="flex items-center justify-between px-6 py-2 rounded-md hover:bg-verdant-50 group text-sm text-shark-950 w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <LogOut className="h-5 w-5" />
            <span className="font-secondary font-medium text-shark-950">
              Logout
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
