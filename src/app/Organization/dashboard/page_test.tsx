"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button, Avatar } from "@heroui/react";
import { LogOut, Settings, Bell } from "lucide-react";
import Image from "next/image";
import authService from "@/services/authService";

interface User {
  userId: number;
  email: string;
  fullName: string;
  handle: string;
  role: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  authProvider: string;
  createdAt: string;
  lastLogin: string;
}

const OrganizationDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/signup');
          return;
        }

        const currentUser = await authService.getCurrentUser();
        console.log(currentUser);
        if (!currentUser) {
          router.replace('/auth/login');
          return;
        }

        // Check if user is organization
        if (currentUser.role.toLowerCase() !== 'organization') {
            console.error('Unauthorized access: User is not an organization', currentUser.role);
          router.replace('/not-found'); // Redirect to 404 page
          return;
        }

        // Check if profile is completed
        if (!currentUser.isProfileCompleted) {
          router.replace('/auth/profile-form?type=organization');
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/auth/signup');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndLoadData();
  }, [router]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authService.logout();
      router.replace('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-shark-600 font-primary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Image 
              src="/images/logo.svg" 
              alt="Voluntrix Logo" 
              width={120} 
              height={40} 
              className="h-8" 
              priority 
            />
            <div>
              <h1 className="text-3xl font-bold text-shark-950 font-secondary">
                Welcome back, {user.fullName}!
              </h1>
              <p className="text-shark-600 font-primary tracking-[0.025rem]">
                Organization Dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              isIconOnly
              variant="ghost"
              className="text-shark-500 hover:text-shark-700"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="ghost"
              className="text-shark-500 hover:text-shark-700"
            >
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              isIconOnly
              variant="ghost"
              className="text-shark-500 hover:text-red-600"
              onClick={handleLogout}
              isLoading={isLoggingOut}
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <Avatar
              name={user.fullName}
              size="md"
              className="bg-verdant-600 text-white font-medium"
            />
          </div>
        </motion.div>

        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/70 backdrop-blur-sm shadow-sm rounded-lg p-8 mb-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-shark-900 font-secondary mb-4">
              Welcome to Your Organization Dashboard
            </h2>
            <p className="text-shark-600 font-primary tracking-[0.025rem] mb-6 max-w-2xl mx-auto">
              This is your organization dashboard where you can manage events, volunteers, and track your impact. 
              Start building meaningful connections and making a difference in your community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                className="bg-verdant-600 hover:bg-verdant-700 text-white font-primary px-6"
                size="lg"
              >
                Create Your First Event
              </Button>
              <Button
                variant="bordered"
                className="border-shark-300 text-shark-700 font-primary px-6"
                size="lg"
              >
                Complete Profile Setup
              </Button>
            </div>
          </div>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/70 backdrop-blur-sm shadow-sm rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-sm text-shark-500 font-primary">Full Name</p>
                <p className="text-shark-900 font-medium font-primary">{user.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-shark-500 font-primary">Email</p>
                <p className="text-shark-900 font-medium font-primary">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-shark-500 font-primary">Handle</p>
                <p className="text-shark-900 font-medium font-primary">@{user.handle}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-shark-500 font-primary">Role</p>
                <p className="text-shark-900 font-medium font-primary capitalize">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-shark-500 font-primary">Email Status</p>
                <p className={`font-medium font-primary ${user.isEmailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.isEmailVerified ? 'Verified' : 'Pending Verification'}
                </p>
              </div>
              <div>
                <p className="text-sm text-shark-500 font-primary">Profile Status</p>
                <p className={`font-medium font-primary ${user.isProfileCompleted ? 'text-green-600' : 'text-yellow-600'}`}>
                  {user.isProfileCompleted ? 'Complete' : 'Incomplete'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Logout Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={handleLogout}
            isLoading={isLoggingOut}
            className="bg-red-600 hover:bg-red-700 text-white font-primary px-8"
            startContent={!isLoggingOut && <LogOut className="w-4 h-4" />}
            size="lg"
          >
            {isLoggingOut ? "Signing Out..." : "Sign Out"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default OrganizationDashboard;