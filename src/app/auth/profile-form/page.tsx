"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import authService from "@/services/authService";
import VolunteerProfileForm from "@/components/forms/volunteer/VolunteerProfileForm";
import Image from "next/image";

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

interface VolunteerFormData {
  institute: string;
  instituteEmail: string;
  isAvailable: string;
  about: string;
  profilePicture: File | null;
  phoneNumber: string;
  selectedCategories: string[];
}

const ProfileFormPage = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Check if user is authenticated and has role
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/signup');
          return;
        }
        
        const user = await authService.getCurrentUser();
        if (!user) {
          router.replace('/auth/signup');
          return;
        }

        // Check if user has role, if not redirect to role selection
        if (!user.role || user.role === "null") {
          router.replace('/auth/role-selection');
          return;
        }

        // Check if profile is already completed
        if (user.profileCompleted) {
          router.replace('/dashboard');
          return;
        }
        
        // User has role but profile not completed - perfect for this page
        setUser(user);
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/auth/signup');
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleSubmit = async (formData: VolunteerFormData) => {
    setIsLoading(true);
    try {
      console.log("Profile data:", formData);
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/dashboard');
    } catch (error) {
      console.error("Profile submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication status
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-shark-600 font-primary">Loading profile setup...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-12"
        >
          <Image src="/images/logo.svg" alt="Voluntrix Logo" width={120} height={40} className="h-10 mb-4" priority />
          <h1 className="text-4xl font-bold text-shark-950 mb-2 font-secondary">
            Complete Your <span className="text-verdant-600 capitalize">{user.role.toLowerCase()}</span> Profile
          </h1>
          <p className="text-[1.15rem] text-shark-600 font-primary tracking-[0.025rem]">
            Set up your profile to get started.
          </p>
        </motion.div>

        {user.role.toLowerCase() === 'volunteer' ? (
          <VolunteerProfileForm 
            user={user} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-shark-600 font-primary">
              Profile form for {user.role} coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileFormPage;
