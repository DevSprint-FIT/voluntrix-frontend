"use client";

import { useState, useEffect } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";
import OTPModal from "@/components/UI/OTPModal";

interface SignupFormData {
  fullName: string;
  handle: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [redirectType, setRedirectType] = useState<'signup' | 'google'>('signup');
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    handle: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/signup');
          return;
        }

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
        await authService.logout();
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router]);

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleRedirectToRoleSelection = (type: 'signup' | 'google' = 'signup', delay: number = 500) => {
    setRedirectType(type);
    setIsRedirecting(true);
    setTimeout(() => {
      router.push('/auth/role-selection');
    }, delay);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.handle.trim()) {
      newErrors.handle = "Handle is required";
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
    setRedirectType('google');
    setIsRedirecting(true);
    
    setTimeout(() => {
      window.location.href = `http://localhost:8080/oauth2/authorization/google?redirect_uri=${encodeURIComponent(window.location.origin + '/auth/role-selection')}`;
    }, 600); // Shorter delay for Google OAuth
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      const result = await authService.signup({
        fullName: formData.fullName,
        handle: formData.handle,
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {        
        // Always store user data and token first
        if (result.user) {
          console.log("User data received:", result.user);
        }
        
        // Check if email verification is needed
        console.log("Checking nextStep:", result.nextStep);
        if (result.nextStep === "VERIFY_EMAIL") {
          // Show OTP modal for email verification
          setShowOTPModal(true);
          return; 
        }
        
        // Show loading before redirecting to role selection
        handleRedirectToRoleSelection('signup', 600);
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      console.error("Signup failed:", error);
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
        className="absolute top-8 left-8 flex items-center space-x-2 px-4 py-2 border border-shark-300 rounded-[20px] text-shark-950 hover:text-shark-700 hover:border-shark-400 transition-colors font-primary bg-white/80 backdrop-blur-sm shadow-sm tracking-[0.05rem]"
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
          <p className="text-shark-600 font-primary tracking-[0.025rem]">
            Start making a difference today
          </p>
        </div>

        <div className="space-y-6">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-600 text-sm font-primary tracking-[0.02rem]">{errors.general}</p>
            </div>
          )}

          {/* Form Fields */}
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            isInvalid={!!errors.fullName}
            errorMessage={errors.fullName}
            size="lg"
            classNames={{
              input: "font-primary text-shark-900 tracking-[0.02rem]",
              label: "font-secondary text-shark-500 text-sm font-normal",
              inputWrapper: "py-3",
            }}
          />
          <p className="text-xs text-shark-500 font-primary tracking-[0.025rem] ml-4" style={{ marginTop: '5px' }}>
            <span className="text-verdant-600">For organizations:</span> Use your organization&apos;s official name
          </p>

          <Input
            label="Handle"
            placeholder="Choose a unique handle"
            value={formData.handle}
            onChange={(e) => handleInputChange("handle", e.target.value)}
            isInvalid={!!errors.handle}
            errorMessage={errors.handle}
            size="lg"
            classNames={{
              input: "font-primary text-shark-900 tracking-[0.02rem]",
              label: "font-secondary text-shark-500 text-sm font-normal",
              inputWrapper: "py-3",
            }}
          />
          <p className="text-xs text-shark-500 font-primary tracking-[0.025rem] ml-4" style={{ marginTop: '5px' }}>
            <span className="text-verdant-600">For organizations:</span> Use a recognizable handle
          </p>

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
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              isInvalid={!!errors.password}
              errorMessage={errors.password}
              size="lg"
              classNames={{
                input: "font-primary text-shark-900 tracking-[0.025rem]",
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

            <Button
              onPress={handleSubmit}
              className="w-full bg-verdant-600 text-white py-3 text-lg font-medium font-primary tracking-[0.8px] rounded-[20px] shadow-lg hover:bg-verdant-700 transition-colors"
              size="lg"
              isLoading={isLoading}
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-shark-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-to-br from-verdant-50 via-white to-verdant-50 text-shark-500 font-primary tracking-[0.025rem]">Or continue with</span>
              </div>
            </div>

            {/* Google Signup */}
            <Button
              onPress={handleGoogleSignup}
              variant="bordered"
              className="w-full border-shark-200 text-shark-700 font-primary py-3 rounded-[20px] hover:bg-shark-50 tracking-[0.025rem]"
              size="lg"
              isDisabled={isLoading}
            >
              <Image src="/icons/google.svg" alt="Google" width={20} height={20} className="mr-2" />
              Continue with Google
            </Button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-shark-600 font-primary tracking-[0.025rem]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-verdant-600 hover:text-verdant-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={formData.email}
        onVerificationSuccess={() => {
          // Handle successful verification
          console.log("Email verified successfully");
        }}
        onRedirect={() => {
          // Show loading and redirect
          handleRedirectToRoleSelection('signup', 600); // Quick loading for role selection
        }}
      />

      {/* Redirecting Loading Overlay */}
      {isRedirecting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4 text-center animate-in zoom-in duration-500">
            <div className="mb-6">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-shark-950 font-secondary mb-2">
              {redirectType === 'google' ? 'Connecting with Google...' : 'Account Created!'}
            </h3>
            <p className="text-shark-600 font-primary text-sm mb-1 tracking-[0.025rem]">
              {redirectType === 'google' ? 'Redirecting to Google OAuth' : 'Setting up your profile'}
            </p>
            <p className="text-shark-500 font-primary text-xs tracking-[0.025rem]">
              {redirectType === 'google' ? 'Please wait...' : 'Just a moment...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}