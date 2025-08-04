'use client';

import { useState } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Divider,
  Checkbox,
} from '@heroui/react';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  LogIn,
} from 'lucide-react';
import Image from 'next/image';
import authService, { User } from '@/services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onChange: (open: boolean) => void;
  onLoginSuccess?: (user: User) => void;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function LoginModal({
  isOpen,
  onChange,
  onLoginSuccess,
  onClose,
  title = 'Welcome Back',
  subtitle = 'Sign in to your account to continue',
}: LoginModalProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<LoginErrors>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleInputChange = (
    field: keyof LoginFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field as keyof LoginErrors]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
    // Clear general error when any field changes
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: LoginErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      console.log('Attempting login with email:', formData.email);

      // Call auth service login
      const result = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      console.log('Login successful:', result);

      // Show success state briefly
      setLoginSuccess(true);

      // Call success callback if provided with the user data
      if (onLoginSuccess && result.user) {
        onLoginSuccess(result.user);
      }

      // Close modal after short delay
      setTimeout(() => {
        handleClose();
      }, 1000);
    } catch (error) {
      console.error('Login failed:', error);

      // Handle different error types
      let errorMessage = 'Login failed. Please try again.';

      if (error instanceof Error) {
        if (
          error.message.includes('401') ||
          error.message.includes('Invalid')
        ) {
          errorMessage =
            'Invalid email or password. Please check your credentials.';
        } else if (error.message.includes('404')) {
          errorMessage = 'Account not found. Please check your email address.';
        } else if (
          error.message.includes('network') ||
          error.message.includes('fetch')
        ) {
          errorMessage =
            'Network error. Please check your connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }

      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  //   const handleGoogleLogin = async () => {
  //     try {
  //       console.log("Attempting Google login...");

  //       // Call auth service Google login
  //     //   const result = await authService.loginWithGoogle();

  //       console.log("Google login initiated:", result);

  //       // Note: Google login typically redirects, so we might not reach here
  //       if (onLoginSuccess) {
  //         onLoginSuccess(result);
  //       }

  //     } catch (error) {
  //       console.error("Google login failed:", error);
  //       setErrors({
  //         general: "Google login failed. Please try again or use email/password."
  //       });
  //     }
  //   };

  const handleClose = () => {
    // Reset form and states
    setFormData({
      email: '',
      password: '',
      rememberMe: false,
    });
    setErrors({});
    setIsPasswordVisible(false);
    setIsLoading(false);
    setLoginSuccess(false);

    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && !loginSuccess) {
      handleLogin();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onChange}
      onClose={handleClose}
      placement="center"
      backdrop="blur"
      size="md"
      closeButton={!isLoading}
      isDismissable={!isLoading}
      classNames={{
        base: 'bg-white/95 backdrop-blur-md',
        header: 'border-b border-shark-200',
        body: 'py-6',
        footer: 'border-t border-shark-200',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 text-center">
          <h3 className="text-2xl font-bold text-shark-900 font-secondary">
            {loginSuccess ? 'Welcome!' : title}
          </h3>
          <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
            {loginSuccess ? 'Login successful! Redirecting...' : subtitle}
          </p>
        </ModalHeader>

        <ModalBody>
          {loginSuccess ? (
            <div className="flex flex-col items-center py-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-verdant-100 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-verdant-600" />
              </div>
              <p className="text-verdant-600 font-medium font-secondary">
                Login successful!
              </p>
            </div>
          ) : (
            <div className="space-y-4" onKeyPress={handleKeyPress}>
              {/* General Error */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm font-primary">
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Email Input */}
              <Input
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                startContent={<Mail className="w-4 h-4 text-shark-400" />}
                classNames={{
                  input: 'font-primary text-shark-900 tracking-[0.02rem]',
                  label: 'font-secondary text-shark-500 text-sm font-normal',
                  errorMessage: 'font-primary text-xs',
                }}
                disabled={isLoading}
              />

              {/* Password Input */}
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                isInvalid={!!errors.password}
                errorMessage={errors.password}
                startContent={<Lock className="w-4 h-4 text-shark-400" />}
                endContent={
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="focus:outline-none"
                    disabled={isLoading}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="w-4 h-4 text-shark-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-shark-400" />
                    )}
                  </button>
                }
                classNames={{
                  input: 'font-primary text-shark-900 tracking-[0.02rem]',
                  label: 'font-secondary text-shark-500 text-sm font-normal',
                  errorMessage: 'font-primary text-xs',
                }}
                disabled={isLoading}
              />

              {/* Remember Me */}
              <div className="flex items-center justify-between">
                <Checkbox
                  isSelected={formData.rememberMe}
                  onValueChange={(checked) =>
                    handleInputChange('rememberMe', checked)
                  }
                  size="sm"
                  classNames={{
                    wrapper:
                      'data-[selected=true]:bg-verdant-600 data-[selected=true]:border-verdant-600',
                    icon: 'text-white',
                    label: 'text-shark-600 font-primary text-sm',
                  }}
                  disabled={isLoading}
                >
                  Remember me
                </Checkbox>

                <button
                  type="button"
                  className="text-verdant-600 hover:text-verdant-700 text-sm font-medium font-primary"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                onClick={handleLogin}
                isLoading={isLoading}
                className="w-full bg-verdant-600 hover:bg-verdant-700 text-white font-primary font-medium py-6 text-base tracking-[0.025rem]"
                size="lg"
                startContent={!isLoading ? <LogIn className="w-4 h-4" /> : null}
                disabled={!formData.email || !formData.password}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Divider */}
              <div className="flex items-center my-6">
                <Divider className="flex-1" />
                <span className="px-4 text-shark-500 text-sm font-primary">
                  or
                </span>
                <Divider className="flex-1" />
              </div>

              {/* Google Login */}
              <Button
                variant="bordered"
                className="w-full border-shark-300 text-shark-700 hover:bg-shark-50 font-primary font-medium py-6"
                size="lg"
                startContent={
                  <Image
                    src="/icons/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                }
                disabled={isLoading}
              >
                Continue with Google
              </Button>
            </div>
          )}
        </ModalBody>

        {!loginSuccess && (
          <ModalFooter className="justify-center">
            <p className="text-shark-500 text-sm font-primary">
              Don&apos;t have an account?{' '}
              <button
                type="button"
                className="text-verdant-600 hover:text-verdant-700 font-medium"
                disabled={isLoading}
              >
                Sign up here
              </button>
            </p>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
}
