"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardBody, Button } from "@heroui/react";
import { User, Building, Heart } from "lucide-react";
import authService from "@/services/authService";

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState<"VOLUNTEER" | "ORGANIZATION" | "SPONSOR" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
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
      icon: <User className="w-8 h-8 text-verdant-600" />,
      features: [
        "Discover volunteer opportunities",
        "Track your volunteer hours",
        "Connect with organizations",
        "Earn recognition and badges"
      ]
    },
    {
      id: "ORGANIZATION" as const,
      title: "Organization",
      description: "Create events and manage volunteers for your cause",
      icon: <Building className="w-8 h-8 text-verdant-600" />,
      features: [
        "Create and manage events",
        "Recruit volunteers",
        "Track event impact",
        "Build your community"
      ]
    },
    {
      id: "SPONSOR" as const,
      title: "Sponsor",
      description: "Support causes and fund meaningful initiatives",
      icon: <Heart className="w-8 h-8 text-verdant-600" />,
      features: [
        "Sponsor events and causes",
        "Track donation impact",
        "Connect with organizations",
        "Build brand visibility"
      ]
    }
  ];

  const handleRoleSelect = (role: "VOLUNTEER" | "ORGANIZATION" | "SPONSOR") => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);
    try {
      // TODO: Implement role update API call
      // For now, just redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error("Error selecting role:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication status
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verdant-50 to-verdant-100 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 to-verdant-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-shark-950 mb-4">
            Choose Your Role
          </h1>
          <p className="text-lg text-shark-600 max-w-2xl mx-auto">
            Select how you&apos;d like to contribute to the community. You can always change this later in your profile settings.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-red-600 text-sm font-primary">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {roles.map((role) => (
            <Card
              key={role.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedRole === role.id
                  ? "ring-2 ring-verdant-600 shadow-lg transform scale-105"
                  : "hover:shadow-md"
              }`}
              isPressable
              onPress={() => handleRoleSelect(role.id)}
            >
              <CardBody className="p-8 text-center">
                <div className="mb-6 flex justify-center">
                  {role.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-shark-950 mb-4">
                  {role.title}
                </h3>
                
                <p className="text-shark-600 mb-6 text-base">
                  {role.description}
                </p>
                
                <div className="space-y-3">
                  {role.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-center text-sm text-shark-700">
                      <div className="w-2 h-2 bg-verdant-600 rounded-full mr-3"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                
                {selectedRole === role.id && (
                  <div className="mt-6 w-full h-1 bg-verdant-600 rounded-full"></div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            color="primary"
            size="lg"
            className="px-12 py-3 text-lg font-semibold bg-verdant-600 hover:bg-verdant-700"
            isDisabled={!selectedRole}
            isLoading={isLoading}
            onPress={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
