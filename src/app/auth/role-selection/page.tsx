"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardBody, Button } from "@heroui/react";
import { User, Building, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import authService from "@/services/authService";
import userService from "@/services/userService";

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

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState<"VOLUNTEER" | "ORGANIZATION" | "SPONSOR" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/signup');
          return;
        }
        
        const user = await authService.getCurrentUser();
        if (user && user.profileCompleted) {
          // User already completed profile, redirect to dashboard
          router.replace('/dashboard');
          return;
        }
        
        // Set user data for welcome message
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

  const roles = [
    {
      id: "VOLUNTEER" as const,
      title: "Volunteer",
      description: "Join events and make a difference in your community",
      icon: <User className="w-6 h-6 text-verdant-600" />,
      features: [
        "Discover opportunities",
        "Track volunteer commitments",
        "Connect with causes",
      ]
    },
    {
      id: "ORGANIZATION" as const,
      title: "Organization",
      description: "Create events and manage volunteers for your cause",
      icon: <Building className="w-6 h-6 text-verdant-600" />,
      features: [
        "Organize events",
        "Track impact",
        "Build community"
      ]
    },
    {
      id: "SPONSOR" as const,
      title: "Sponsor",
      description: "Support causes and fund meaningful initiatives",
      icon: <Heart className="w-6 h-6 text-verdant-600" />,
      features: [
        "Support volunteering events",
        "Connect with orgs",
        "Build visibility"
      ]
    }
  ];

  const handleRoleSelect = (role: "VOLUNTEER" | "ORGANIZATION" | "SPONSOR") => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    setError("");
    
    try {
      const currentToken = authService.getToken();
      if (!currentToken) {
        throw new Error("No authentication token found");
      }

      const result = await userService.setUserRole(selectedRole, currentToken);
      
      if (!result.success) {
        throw new Error(result.message);
      }

      console.log("Role update response:", result.data);

      if (result.data?.token) {
        // Set the new token with updated role
        authService.setNewToken(result.data.token);
        
        console.log("Role updated successfully:", result.data.role);
        console.log("New token set with role-based authentication");
        
        router.push('/dashboard');
      } else {
        throw new Error("No token received from role update");
      }
    } catch (error) {
      console.error("Error selecting role:", error);
      setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
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
          <p className="text-shark-600 font-primary">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100">
      <div className="max-w-[72rem] mx-auto px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-10"
        >
          <Image src="/images/logo.svg" alt="Voluntrix Logo" width={120} height={40} className="h-10 mb-4" priority />
          <h1 className="text-[2.4rem] font-bold text-shark-900 font-secondary">
            Welcome <span className="text-verdant-600 font-medium">{user?.fullName || ""}</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[1.15rem] text-shark-700 font-primary tracking-[0.025rem]"
          >
            Choose your role to get started on your journey
          </motion.p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-red-50 border border-red-200 rounded-xl p-4 max-w-md mx-auto"
          >
            <p className="text-red-600 text-sm font-primary text-center">{error}</p>
          </motion.div>
        )}

        {/* Role Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-300 h-full bg-white/70 backdrop-blur-sm shadow-sm hover:bg-white/90 relative ${
                  selectedRole === role.id
                    ? "ring-2 ring-verdant-500 bg-white/90"
                    : ""
                }`}
                isPressable
                onPress={() => handleRoleSelect(role.id)}
              >
                <CardBody className="p-8">
                  {/* Radio Button */}
                  <div className="absolute top-5 left-5">
                    <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
                      selectedRole === role.id 
                        ? "border-verdant-500 bg-verdant-500" 
                        : "border-shark-300 bg-white"
                    }`}>
                      {selectedRole === role.id && (
                        <div className="w-2.5 h-2.5 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex justify-center mb-4 mt-3">
                    <div className={`p-3 rounded-xl transition-colors ${
                      selectedRole === role.id 
                        ? "bg-verdant-100" 
                        : "bg-shark-50"
                    }`}>
                      {role.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-bold text-shark-950 mb-2 text-center font-primary tracking-[0.025rem]">
                    {role.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-shark-600 mb-6 text-center text-sm font-secondary leading-relaxed">
                    {role.description}
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-3">
                    {role.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center text-[0.92rem] text-shark-700">
                        <div className={`w-2 h-2 rounded-full mr-3 ${
                          selectedRole === role.id ? "bg-verdant-500" : "bg-shark-400"
                        }`}></div>
                        <span className="font-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Continue Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex justify-end"
        >
          <Button
            color="primary"
            size="lg"
            className="px-6 py-3 text-base font-semibold bg-verdant-600 hover:bg-verdant-700 font-primary rounded-full"
            isDisabled={!selectedRole}
            isLoading={isLoading}
            onPress={handleContinue}
            endContent={!isLoading && <ArrowRight className="w-4 h-4" />}
          >
            {isLoading ? "Setting up..." : "Continue"}
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
