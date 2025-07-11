"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type UserRole = "VOLUNTEER" | "ORGANIZATION" | "SPONSOR";

interface SignupFormData {
  role: UserRole | "";
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    role: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.role) {
      newErrors.role = "Please select your role";
    }
    
    if (!formData.name.trim()) {
      newErrors.name = formData.role === "ORGANIZATION" ? "Organization name is required" : "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGoogleSignup = () => {
    setIsLoading(true);
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Here you would integrate with your signup API
      console.log("Signup data:", formData);
      // For now, just simulate loading
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to success page or dashboard
      window.location.href = '/auth/success';
    } catch (error) {
      console.error("Signup failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case "VOLUNTEER": return "Volunteer";
      case "ORGANIZATION": return "Organization";
      case "SPONSOR": return "Sponsor";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Hero Content */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-verdant-600 to-verdant-700 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute w-72 h-72 bg-white opacity-10 rounded-full top-1/4 left-1/3 blur-[100px] animate-pulse"></div>
          <div className="absolute w-48 h-48 bg-white opacity-10 rounded-full bottom-1/4 right-1/3 blur-[80px] animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <h1 className="text-[3.2rem] font-medium text-white font-secondary mb-4">
              Join Our Community
            </h1>
            <p className="text-xl opacity-90 leading-relaxed font-primary">
              Connect with volunteers, organizations, and sponsors to create meaningful impact in your community.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
              <div>
                <h3 className="font-semibold font-primary">Connect & Collaborate</h3>
                <p className="opacity-80 font-secondary">Work together on meaningful projects</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌍</span>
              </div>
              <div>
                <h3 className="font-semibold font-primary">Global Impact</h3>
                <p className="opacity-80 font-secondary">Make a difference across communities</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="font-semibold font-primary">Streamlined Management</h3>
                <p className="opacity-80 font-secondary">Organize events and volunteers effortlessly</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Image 
              src="/images/logo.svg" 
              alt="Voluntrix" 
              width={150} 
              height={40} 
              className="mx-auto mb-6"
            />
            <h2 className="text-2xl font-medium text-shark-950 font-secondary mb-2">
              Create your account
            </h2>
            <p className="text-shark-600 font-primary">
              Start making a difference today
            </p>
          </div>

          <div className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-shark-700 font-primary">
                I am signing up as a:
              </label>
              <div className="space-y-2">
                {(["VOLUNTEER", "ORGANIZATION", "SPONSOR"] as const).map((role) => (
                  <div
                    key={role}
                    onClick={() => handleInputChange("role", role)}
                    className={`
                      p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 font-primary
                      ${formData.role === role 
                        ? "border-verdant-500 bg-verdant-50 shadow-md" 
                        : "border-shark-200 hover:border-verdant-300 hover:bg-verdant-50"
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center
                        ${formData.role === role ? "border-verdant-500 bg-verdant-500" : "border-shark-300"}
                      `}>
                        {formData.role === role && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-shark-900">{getRoleDisplayName(role)}</h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1 font-primary">{errors.role}</p>
              )}
            </div>

            {/* Form Fields */}
            <Input
              label={formData.role === "ORGANIZATION" ? "Organization Name" : "Full Name"}
              placeholder={formData.role === "ORGANIZATION" ? "Enter organization name" : "Enter your full name"}
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
              size="lg"
              classNames={{
                input: "font-primary",
                label: "font-primary text-shark-700",
              }}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              size="lg"
              classNames={{
                input: "font-primary",
                label: "font-primary text-shark-700",
              }}
            />

            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              size="lg"
              classNames={{
                input: "font-primary",
                label: "font-primary text-shark-700",
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

            <Input
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              size="lg"
              classNames={{
                input: "font-primary",
                label: "font-primary text-shark-700",
              }}
              endContent={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-shark-400 hover:text-shark-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
            />

            {/* Submit Button */}
            <Button
              onPress={handleSubmit}
              className="w-full bg-verdant-600 text-white py-3 text-lg font-medium font-primary tracking-[0.8px] rounded-[20px] shadow-lg hover:bg-verdant-700 transition-colors"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-shark-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-shark-500 font-primary">Or continue with</span>
              </div>
            </div>

            {/* Google Signup */}
            <Button
              onPress={handleGoogleSignup}
              variant="bordered"
              className="w-full border-shark-200 text-shark-700 font-primary py-3 rounded-[20px] hover:bg-shark-50"
              size="lg"
              isDisabled={isLoading}
            >
              <span className="mr-2 text-lg">G</span>
              Continue with Google
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-shark-600 font-primary">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-verdant-600 hover:text-verdant-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
