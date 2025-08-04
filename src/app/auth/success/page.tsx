"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import authService from "@/services/authService";

// Loading component for suspense fallback
function AuthSuccessLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4">
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-shark-900 mb-3 font-secondary">
          Loading...
        </h2>
        <p className="text-shark-600 font-primary text-sm">
          Please wait while we process your authentication...
        </p>
      </div>
    </div>
  );
}

// Main component that uses searchParams
function AuthSuccessContent() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        // Extract token and role from URL parameters
        const token = searchParams?.get('token');
        const role = searchParams?.get('role');

        console.log('OAuth Success - Received parameters:', { token: token ? 'Present' : 'Missing', role });

        if (!token) {
          setError("No authentication token received");
          return;
        }

        // Store the JWT token in localStorage (same as email/password login)
        localStorage.setItem('auth_token', token);

        // Get user information using the token
        const user = await authService.getCurrentUser();
        
        console.log('OAuth Success - User data:', user);
        
        if (!user) {
          setError("Failed to retrieve user information");
          return;
        }

        // Route based on role and profile completion status
        if (!user.role || user.role === 'ROLE_UNASSIGNED' || role === 'null' || !role) {
          // User needs to select a role
          router.replace('/auth/role-selection');
        } else if (!user.profileCompleted) {
          // User has role but profile is incomplete
          let userRole = user.role;
          if (userRole.startsWith('ROLE_')) {
            userRole = userRole.replace('ROLE_', '').toLowerCase();
          } else {
            userRole = userRole.toLowerCase();
          }
          router.replace(`/auth/profile-form?type=${userRole}`);
        } else {
          // User is fully set up, redirect to their dashboard
          let userRole = user.role;
          if (userRole.startsWith('ROLE_')) {
            userRole = userRole.replace('ROLE_', '').toLowerCase();
          } else {
            userRole = userRole.toLowerCase();
          }
          
          if (userRole === 'volunteer') {
            router.replace('/Volunteer/dashboard');
          } else if (userRole === 'organization') {
            router.replace('/Organization/dashboard');
          } else if (userRole === 'sponsor') {
            router.replace('/Sponsor/dashboard');
          } else {
            // Fallback to role selection if role is unrecognized
            router.replace('/auth/role-selection');
          }
        }

      } catch (error) {
        console.error('OAuth success handling error:', error);
        setError("Authentication failed. Please try again.");
        
        // Redirect to login after a delay
        setTimeout(() => {
          router.replace('/auth/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleOAuthSuccess();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4">
          <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-red-500 rounded-full flex items-center justify-center">
              <span className="text-red-500 text-lg font-bold">!</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-shark-900 mb-3 font-secondary">
            Authentication Error
          </h2>
          <p className="text-shark-600 font-primary text-sm mb-4">
            {error}
          </p>
          <p className="text-shark-500 font-primary text-xs">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-md mx-4">
        <div className="w-16 h-16 mx-auto mb-6 relative">
          <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h2 className="text-xl font-semibold text-shark-900 mb-3 font-secondary">
          Completing Sign In
        </h2>
        <p className="text-shark-600 font-primary text-sm">
          Please wait while we set up your account...
        </p>
      </div>
    </div>
  );
}

// Main page component wrapped with Suspense
export default function AuthSuccessPage() {
  return (
    <Suspense fallback={<AuthSuccessLoading />}>
      <AuthSuccessContent />
    </Suspense>
  );
}