"use client";

import { useState, useEffect } from "react";
import { ListTodo, Trophy, Bell, ArrowLeft, LucideIcon } from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface MenuItem {
  name: string;
  icon: LucideIcon;
  href?: string;
  badge?: number;
}

const VolunteerWorkspaceSidebar = ({ eventId }: { eventId: string }) => {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<string>("Tasks");
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setNotificationCount(3);
    }, 500);
  }, []);

  const menuItems: MenuItem[] = [
    {
      name: "Tasks",
      icon: ListTodo,
      href: `/VolunteerWorkspace/${eventId}/tasks`,
    },
    {
      name: "Leaderboard",
      icon: Trophy,
      href: `/VolunteerWorkspace/${eventId}/leaderboard`,
    },
    {
      name: "Notifications",
      icon: Bell,
      badge: notificationCount,
      href: `/VolunteerWorkspace/${eventId}/notifications`,
    },
  ];

  // Set active item based on current route
  useEffect(() => {
    const currentItem = menuItems.find((item) => item.href === pathname);
    if (currentItem) {
      setSelectedItem(currentItem.name);
    } else {
      // Default to Tasks if no match found
      setSelectedItem("Tasks");
    }
  }, [pathname, menuItems]);

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-[#f8fefc] border-r px-4 py-6 flex flex-col justify-between z-10">
      {/* Logo */}
      <div>
        <div className="mb-24 mt-4 flex justify-center">
          <img
            src="/images/workspaceLogo.svg"
            alt="Workspace Logo"
            className="h-18 w-18 ml-[-10px] cursor-pointer"
            onClick={() => router.push("/")}
          />
        </div>

        {/* Navigation */}
        <nav>
          <div className="flex flex-col space-y-12">
            {menuItems.map((item) => {
              const isActive = selectedItem === item.name;

              return (
                <Link key={item.name} href={item.href || "#"}>
                  <div
                    onClick={() => setSelectedItem(item.name)}
                    className={`w-full cursor-pointer text-left flex items-center justify-between px-4 py-2 rounded-md hover:bg-verdant-50 relative ${
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

      {/* Back Button */}
      <div>
        <button
          onClick={() => {
            setSelectedItem("Back");
            router.push("/Volunteer/events/active");
          }}
          className="flex items-center justify-between px-4 py-2 rounded-md hover:bg-verdant-50 group text-sm text-shark-950 w-full text-left"
        >
          <div className="flex items-center space-x-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-primary">Back</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default VolunteerWorkspaceSidebar;
