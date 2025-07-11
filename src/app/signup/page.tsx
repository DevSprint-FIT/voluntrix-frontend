"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

type UserRole = "VOLUNTEER" | "ORGANIZATION" | "SPONSOR";

interface SignupFormData {
  role: UserRole | "";
  name: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    role: "",
    name: "",
    email: "",
    password: "",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center p-8 relative">
      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center space-x-2 px-4 py-2 border border-shark-200 rounded-[20px] text-shark-600 hover:text-verdant-600 hover:border-verdant-300 transition-colors font-primary bg-white/80 backdrop-blur-sm shadow-sm"
      >
        <Image 
          src="/icons/arrow-back.svg" 
          alt="Back" 
          width={16} 
          height={16}
        />
        <span className="text-sm font-medium">Home</span>
      </Link>

      {/* Signup Form */}
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
            <Select
              label="I am signing up as a"
              placeholder="Select your role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              isInvalid={!!errors.role}
              errorMessage={errors.role}
              size="lg"
              classNames={{
                trigger: "font-primary",
                label: "font-primary text-shark-700",
                value: "font-primary",
              }}
            >
              <SelectItem key="VOLUNTEER" value="VOLUNTEER" className="font-primary">
                Volunteer
              </SelectItem>
              <SelectItem key="ORGANIZATION" value="ORGANIZATION" className="font-primary">
                Organization
              </SelectItem>
              <SelectItem key="SPONSOR" value="SPONSOR" className="font-primary">
                Sponsor
              </SelectItem>
            </Select>

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
                <span className="px-2 bg-gradient-to-br from-verdant-50 via-white to-verdant-50 text-shark-500 font-primary">Or continue with</span>
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
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} className="mr-2" />
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
    );
  }
