"use client";

import { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import authService from "@/services/authService";

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

function DashboardPage() {
    const router = useRouter();
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // Check authentication and get user data
    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                if (!authService.isAuthenticated()) {
                    router.replace('/auth/signup');
                    return;
                }
                
                const userData = await authService.getCurrentUser();
                if (!userData) {
                    router.replace('/auth/signup');
                    return;
                }

                if (!userData.profileCompleted) {
                    router.replace('/auth/role-selection');
                    return;
                }

                setUser(userData);
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

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await authService.logout();
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Show loading while checking authentication
    if (isCheckingAuth) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                        <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <p className="text-shark-600 font-primary">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-shark-950 mb-2">
                            Welcome to your Dashboard! 🎉
                        </h1>
                        {user && (
                            <p className="text-shark-600">
                                Hello, <span className="font-medium">{user.fullName}</span> ({user.role})
                            </p>
                        )}
                    </div>

                    <div className="text-center">
                        <Button 
                            onPress={handleLogout}
                            variant="bordered"
                            isLoading={isLoggingOut}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                            {isLoggingOut ? "Logging out..." : "Logout"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;         