"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import authService from "@/services/authService";
import { createOrganization } from "@/services/organizationCreateService";
import { createVolunteer } from "@/services/volunteerService";
import { createSponsor } from "@/services/sponsorCreateService";
import VolunteerProfileForm from "@/components/forms/volunteer/VolunteerProfileForm";
import OrganizationProfileForm from "@/components/forms/organization/OrganizationProfileForm";
import SponsorProfileForm from "@/components/forms/sponsor/SponsorProfileForm";
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
  selectedInstitute: string;
  instituteEmail: string;
  isAvailable: boolean;
  about: string;
  profilePicture: File | null;
  phoneNumber: string;
  selectedCategories: string[];
}

interface OrganizationFormData {
  phone: string;
  institute: string;
  imageUrl: File | null;
  bankName: string;
  accountNumber: string;
  description: string;
  website: string;
  facebookLink: string;
  linkedinLink: string;
  instagramLink: string;
  verificationDocument: File | null;
  agreeToTerms: boolean;
}

interface SponsorFormData {
  company: string;
  jobTitle: string;
  mobileNumber: string;
  website: string;
  sponsorshipNote: string;
  documentUrl: File | null;
  linkedinProfile: string;
  address: string;
}

// type FormData = VolunteerFormData | OrganizationFormData | SponsorFormData;

const ProfileFormContent = () => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [profileType, setProfileType] = useState<string>("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is authenticated and has role
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.replace('/auth/signup');
          return;
        }
        
        const user = await authService.getCurrentUser();
        console.log("Current user on form:", user);
        if (!user) {
          router.replace('/auth/login');
          return;
        }

        // Check if profile is already completed
        if (user.profileCompleted) {
          router.replace(`/${user.role.slice(0, 1) + user.role.slice(1).toLowerCase()}/dashboard`);
          return;
        } else if (user.role == null) {
          router.replace("/auth/role-selection");
          return;
        }

        // Get profile type from URL params or user role
        const typeParam = searchParams ? searchParams.get('type') : null;
        const userRole = user.role?.toLowerCase();
        
        const validTypes = ['volunteer', 'organization', 'sponsor'];
        let finalType = '';

        // Prioritize user's actual role over URL parameter for security
        if (userRole && validTypes.includes(userRole) && userRole !== 'null') {
          finalType = userRole;
          
          // If URL param doesn't match user's role, redirect to correct URL or 404
          if (typeParam && typeParam !== userRole) {
            // Redirect to 404 if user tries to access wrong profile type
            router.replace('/not-found');
            return;
          }
        } else if (typeParam && validTypes.includes(typeParam)) {
          // Only allow URL param if user has no role set (shouldn't happen in normal flow)
          finalType = typeParam;
        } else {
          // Fallback: redirect to role selection if no valid type
          router.replace('/auth/role-selection');
          return;
        }
        
        // User has role but profile not completed - perfect for this page
        setUser(user);
        setProfileType(finalType);
      } catch (error) {
        console.error('Auth check error:', error);
        router.replace('/auth/signup');
        return;
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuthStatus();
  }, [router, searchParams]);

  const handleSubmit = async (formData: VolunteerFormData | OrganizationFormData | SponsorFormData) => {
    setIsLoading(true);
    try {
      console.log("Profile data:", formData);
      
      // Handle different form types
      if (profileType === 'organization') {
        const orgData = formData as OrganizationFormData;
        const response = await createOrganization(orgData);
        
        console.log("Organization created successfully:", response);

        // Update local auth service profile status
        await authService.updateProfileStatus(true);
        
        // Add delay to allow backend to process the profile completion
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Navigate to organization dashboard
        router.push('/Organization/dashboard');
        return;
      }

      // Handle volunteer profile submission
      if (profileType === 'volunteer') {
        const volData = formData as VolunteerFormData;
        const response = await createVolunteer(volData);

        console.log("Volunteer created successfully:", response);

        // Update local auth service profile status
        await authService.updateProfileStatus(true);

        // Add delay to allow backend to process the profile completion
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Navigate to volunteer dashboard
        router.push('/Volunteer/dashboard');
        return;
      }

      // Handle sponsor profile submission
      if (profileType === 'sponsor') {
        const sponsorData = formData as SponsorFormData;
        const response = await createSponsor(sponsorData);

        console.log("Sponsor created successfully:", response);

        // Update local auth service profile status
        await authService.updateProfileStatus(true);
        
        // Add delay to allow backend to process the profile completion
        await new Promise(resolve => setTimeout(resolve, 4000));

        // Navigate to sponsor dashboard
        router.push('/Sponsor/dashboard');

        
        return;
      }

    } catch (error) {
      console.error("Profile submission failed:", error);
      
      // Show error message to user
      if (error instanceof Error) {
        alert(`Profile submission failed: ${error.message}`);
      } else {
        alert('Profile submission failed. Please try again.');
      }
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
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
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 relative">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
              Completing Your Profile
            </h3>
            <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
              Please wait while we set up your account and redirect you to your dashboard...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-12"
        >
          <Image src="/images/logo.svg" alt="Voluntrix Logo" width={120} height={40} className="h-10 mb-4" priority />
          <h1 className="text-4xl font-bold text-shark-950 mb-2 font-secondary">
            Complete Your <span className="text-verdant-600 capitalize">{profileType || user.role.toLowerCase()}</span> Profile
          </h1>
          <p className="text-[1.15rem] text-shark-600 font-primary tracking-[0.025rem]">
            Set up your profile to get started.
          </p>
        </motion.div>

        {(profileType || user.role.toLowerCase()) === 'volunteer' ? (
          <VolunteerProfileForm 
            user={user} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : (profileType || user.role.toLowerCase()) === 'organization' ? (
          <OrganizationProfileForm 
            user={user} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : (profileType || user.role.toLowerCase()) === 'sponsor' ? (
          <SponsorProfileForm 
            user={user} 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-shark-600 font-primary">
              Profile form for {profileType || user.role} coming soon...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const ProfileFormPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-shark-600 font-primary">Loading...</p>
        </div>
      </div>
    }>
      <ProfileFormContent />
    </Suspense>
  );
};

export default ProfileFormPage;
