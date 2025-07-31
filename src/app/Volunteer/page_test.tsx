"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Avatar } from "@heroui/react";
import { User, Calendar, Award, TrendingUp, Settings, Bell } from "lucide-react";
import Image from "next/image";
import authService from "@/services/authService";

interface User {
  userId: number;
  email: string;
  fullName: string;
  handle: string;
  role: string;
  emailVerified: boolean;
  profileCompleted: boolean;
  authProvider: string;
  createdAt: string;
  lastLogin: string;
}

const VolunteerDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndLoadData = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/login');
          return;
        }

        const currentUser = await authService.getCurrentUser();
        if (!currentUser) {
          router.replace('/auth/login');
          return;
        }

        // Check if user is volunteer
        if (currentUser.role.toLowerCase() !== 'volunteer') {
          router.replace('/dashboard');
          return;
        }

        // Check if profile is completed
        if (!currentUser.profileCompleted) {
          router.replace('/auth/profile-form?type=volunteer');
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
                Volunteer Dashboard
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
            <Avatar
              name={user.fullName}
              size="md"
              className="bg-verdant-600 text-white font-medium"
            />
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-shark-500 text-sm font-secondary">Events Joined</p>
                  <p className="text-2xl font-bold text-shark-900 font-secondary">0</p>
                </div>
                <div className="w-12 h-12 bg-verdant-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-verdant-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-shark-500 text-sm font-secondary">Volunteer Hours</p>
                  <p className="text-2xl font-bold text-shark-900 font-secondary">0</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-shark-500 text-sm font-secondary">Reward Points</p>
                  <p className="text-2xl font-bold text-shark-900 font-secondary">0</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-shark-500 text-sm font-secondary">Volunteer Level</p>
                  <p className="text-2xl font-bold text-shark-900 font-secondary">1</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button
                  className="w-full justify-start bg-verdant-600 hover:bg-verdant-700 text-white font-primary"
                  startContent={<Calendar className="w-4 h-4" />}
                >
                  Browse Events
                </Button>
                <Button
                  variant="bordered"
                  className="w-full justify-start border-shark-300 text-shark-700 font-primary"
                  startContent={<Award className="w-4 h-4" />}
                >
                  View Achievements
                </Button>
                <Button
                  variant="bordered"
                  className="w-full justify-start border-shark-300 text-shark-700 font-primary"
                  startContent={<User className="w-4 h-4" />}
                >
                  Edit Profile
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                Recent Activity
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-verdant-600 rounded-full"></div>
                  <p className="text-shark-600 font-primary">Volunteer profile created</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <p className="text-shark-600 font-primary">Ready to join events!</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <p className="text-shark-600 font-primary">Welcome to Voluntrix!</p>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                Account Status
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-shark-600 font-primary">Profile</span>
                  <span className="text-sm text-green-600 font-medium">Complete</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-shark-600 font-primary">Availability</span>
                  <span className="text-sm text-green-600 font-medium">Available</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-shark-600 font-primary">Email</span>
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
