"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const user = await authService.getCurrentUser();
          if (user) {
            // Redirect based on profile completion status
            if (user.role == null) {
              router.replace('/auth/role-selection');
            } else if (!user.isProfileCompleted) {
              router.replace(`/auth/profile-form?type=${user.role.toLowerCase()}`);
            } else {
              router.replace(`/${user.role.slice(0, 1) + user.role.slice(1).toLowerCase()}/dashboard`);
            }
            return;
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // If there's an error, clear any invalid tokens
        await authService.logout();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success && result.nextStep) {
        console.log("Login successful, navigating to:", result.nextStep);
        
        // Navigate based on user state
        switch (result.nextStep) {
          case "role-selection":
            router.push('/auth/role-selection');
            break;
          case "profile-form":
            router.push('/auth/profile-form');
            break;
          case "dashboard":
          default:
            router.push('/dashboard');
            break;
        }
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error("Login failed:", error);
      setErrors({ general: "Something went wrong. Please try again." });
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
          <p className="text-shark-600 font-primary tracking-[0.025rem]">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center p-8 relative">
      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center space-x-2 px-4 py-2 border border-shark-300 rounded-[20px] text-shark-950 hover:text-shark-700 hover:border-shark-400 transition-colors font-primary bg-white/80 backdrop-blur-sm shadow-sm tracking-[0.025rem]"
      >
        <Image 
          src="/icons/arrow-back.svg" 
          alt="Back" 
          width={16} 
          height={16}
        />
        <span className="text-sm font-medium">Home</span>
      </Link>

      {/* Login Form */}
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image 
            src="/images/logo.svg" 
            alt="Voluntrix" 
            width={150} 
            height={40} 
            className="mx-auto mb-6"
          />
          <h2 className="text-2xl font-medium text-shark-950 font-secondary mb-2">
            Welcome back
          </h2>
          <p className="text-shark-600 font-primary tracking-[0.025rem]">
            Sign in to continue making a difference
          </p>
        </div>

        <div className="space-y-6">
          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-primary">{errors.general}</p>
            </div>
          )}

          {/* Form Fields */}
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            isInvalid={!!errors.email}
            errorMessage={errors.email}
            size="lg"
            classNames={{
              input: "font-primary text-shark-900 tracking-[0.02rem]",
              label: "font-secondary text-shark-500 text-sm font-normal",
              inputWrapper: "py-3",
            }}
          />

          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            isInvalid={!!errors.password}
            errorMessage={errors.password}
            size="lg"
            classNames={{
              input: "font-primary text-shark-900 tracking-[0.02rem]",
              label: "font-secondary text-shark-500 text-sm font-normal",
              inputWrapper: "py-3",
            }}
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-shark-400 hover:text-shark-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            }
          />

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-verdant-600 hover:text-verdant-700 font-primary font-medium tracking-[0.02rem]"
            >
              Forgot your password?
            </Link>
          </div>

          <Button
            onPress={handleSubmit}
            className="w-full bg-verdant-600 text-white py-3 text-lg font-medium font-primary tracking-[0.8px] rounded-[20px] shadow-lg hover:bg-verdant-700 transition-colors"
            size="lg"
            isLoading={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-shark-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gradient-to-br from-verdant-50 via-white to-verdant-50 text-shark-500 font-primary tracking-[0.025rem]">Or continue with</span>
            </div>
          </div>

          {/* Google Login */}
          <Button
            onPress={handleGoogleLogin}
            variant="bordered"
            className="w-full border-shark-200 text-shark-700 font-primary tracking-[0.025rem] py-3 rounded-[20px] hover:bg-shark-50"
            size="lg"
            isDisabled={isLoading}
          >
            <Image src="/icons/google.svg" alt="Google" width={20} height={20} className="mr-2" />
            Continue with Google
          </Button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-shark-600 font-primary tracking-[0.025rem]">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup" className="text-verdant-600 hover:text-verdant-700 font-medium">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}