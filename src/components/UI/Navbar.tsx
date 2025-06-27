"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Avatar } from "@heroui/avatar";
import { Bell } from "lucide-react";
import AuthService from "@/services/authService";
import { User } from "@/services/authService";

gsap.registerPlugin(ScrollTrigger);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      start: "top+=10px top",
      onEnter: () => setIsScrolled(true),
      onLeaveBack: () => setIsScrolled(false),
    });

    return () => trigger.kill();
  }, []);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        setIsLoading(true);
        const authenticated = AuthService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = await AuthService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = () => {
    setIsLoggingIn(true);
    // Add delay to show loading state
    setTimeout(() => {
      router.push("/auth/login");
    }, 500);
  };

  const signup = () => {
    setIsSignup(true);
    setTimeout(() => {
      router.push("/auth/signup");
    }, 500);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await AuthService.logout();
      
      // Add delay to allow backend to process logout and show loading state
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUser(null);
      setIsAuthenticated(false);
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDropdownAction = (key: string) => {
    if (!user){
      router.push("/auth/login");
      return;
    }

    switch (key) {
      case "profile":
        router.push(`/${user.role.slice(0,1) + user.role.slice(1).toLowerCase()}/profile`);
        break;
      case "dashboard":
        router.push(`/${user.role.slice(0,1) + user.role.slice(1).toLowerCase()}/dashboard`);
        break;
      case "settings":
        router.push(`/${user.role.slice(0,1) + user.role.slice(1).toLowerCase()}/settings`);
        break;
      case "help":
        router.push(`/${user.role.slice(0,1) + user.role.slice(1).toLowerCase()}/help`);
        break;
      case "logout":
        handleLogout();
        break;
      default:
        break;
    }
  };

  // Show loading state or return null during initial load
  if (isLoading) {
    return (
      <nav
        className={`fixed z-50 top-0 flex items-center justify-between px-32 w-full transition-all duration-300 ease-in-out ${
          isScrolled ? "shadow-md bg-white py-2" : "bg-transparent py-6"
        }`}
      >
        <div className="w-[1250px] mx-auto flex items-center justify-between">
          <Link href="/">
            <Image src="/images/logo.svg" alt="Voluntrix Logo" width={190} height={50} />
          </Link>
          <div className="flex space-x-4">
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-20 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Login Loading Overlay */}
      {isLoggingIn && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
              Redirecting to Login
            </h3>
            <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
              Please wait while we redirect you to the login page...
            </p>
          </div>
        </div>
      )}

      {/* Logout Loading Overlay */}
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
              Logging Out
            </h3>
            <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
              Please wait while we securely log you out and redirect you to the home page...
            </p>
          </div>
        </div>
      )}

      {isSignup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
              Redirecting to Sign Up
            </h3>
            <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
              Please wait while we redirect you to the sign up page...
            </p>
          </div>
        </div>
      )}

      <nav
        className={`fixed z-50 top-0 flex items-center justify-between px-32 w-full transition-all duration-300 ease-in-out ${
          isScrolled ? "shadow-md bg-white py-2" : "bg-transparent py-6"
        }`}
      >
      <div
        className={`w-[1250px] mx-auto flex items-center justify-between transition-all duration-300 ease-in-out`}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${
            isScrolled ? "scale-90" : "scale-100"
          }`}
        >
          <Link href="/">
            <Image src="/images/logo.svg" alt="Voluntrix Logo" width={190} height={50} />
          </Link>
        </div>

        <div
          className={`flex space-x-16 text-shark-950 text-[1rem] font-primary tracking-wider font-medium transition-all duration-300 ease-in-out ${
            isScrolled ? "text-[0.95rem]" : "text-[1.05rem]"
          }`}
        >
          <Link href="#" className="transition-all duration-300 ease-in-out hover:text-verdant-600">
            Features
          </Link>
          <Link href="/events" className="transition-all duration-300 ease-in-out hover:text-verdant-600">
            Events
          </Link>
          <Link href="/PublicFeed" className="transition-all duration-300 ease-in-out hover:text-verdant-600">
            {isAuthenticated ? "Event Feed" : "Social Feed"}
          </Link>
          <Link href="#" className="transition-all duration-300 ease-in-out hover:text-verdant-600">
            Volunteers
          </Link>
        </div>

        {/* Conditional rendering based on authentication status */}
        {isAuthenticated && user ? (
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <Bell size={20} className="text-shark-950" />
            </button>

            {/* User Profile Dropdown */}
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <div className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity duration-200">
                  <Avatar
                    src={user.imageURL || "/images/user.png"} // You can customize this path
                    alt={user.fullName}
                    size="sm"
                    className="w-8 h-8"
                    fallback={user.fullName.charAt(0).toUpperCase()}
                  />
                  <span className="text-shark-950 font-primary font-medium text-sm">
                    {user.fullName}
                  </span>
                  <svg
                    className="w-4 h-4 text-shark-950 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User Actions"
                onAction={(key) => handleDropdownAction(key as string)}
                className="min-w-[180px]"
              >
                <DropdownItem key="profile" className="font-primary">
                  Profile
                </DropdownItem>
                <DropdownItem key="dashboard" className="font-primary">
                  Dashboard
                </DropdownItem>
                <DropdownItem key="settings" className="font-primary">
                  Settings
                </DropdownItem>
                <DropdownItem key="help" className="font-primary">
                  Help & Support
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="text-danger font-primary"
                  color="danger"
                >
                  Logout
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        ) : (
          /* Login & Sign Up Buttons for unauthenticated users */
          <div className="flex space-x-4 text-[1rem] transition-all duration-300 ease-in-out">
            <Button
              onPress={login}
              variant="light"
              className="text-md text-shark-950 font-primary border-0 tracking-[1px] font-medium px-4 py-2 rounded-[20px]"
            >
              Login
            </Button>
            <Button
              onPress={signup}
              variant="shadow"
              className="bg-shark-950 text-white text-sm font-primary px-4 py-2 rounded-[20px] tracking-[1px]"
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
    </>
  );
}