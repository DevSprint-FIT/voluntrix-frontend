"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Home, AlertTriangle } from "lucide-react";
import Image from "next/image";

const NotFoundPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image 
              src="/images/logo.svg" 
              alt="Voluntrix Logo" 
              width={120} 
              height={40} 
              className="h-10" 
              priority 
            />
          </div>

          {/* 404 Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-verdant-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-verdant-600" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-shark-800 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm font-secondary">!</span>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="text-6xl font-bold text-shark-900 font-secondary">404</h1>
            <h2 className="text-2xl font-semibold text-shark-800 font-secondary">
              Page Not Found
            </h2>
            <p className="text-shark-600 font-primary tracking-[0.025rem] max-w-sm mx-auto">
              The page you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to access it.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              color="primary"
              size="lg"
              className="bg-verdant-600 hover:bg-verdant-700 font-primary tracking-[0.025rem] px-6"
              onPress={() => router.push('/')}
              startContent={<Home className="w-4 h-4" />}
            >
              Go Home
            </Button>
            <Button
              variant="bordered"
              size="lg"
              className="border-shark-300 text-shark-700 hover:bg-shark-50 font-primary tracking-[0.025rem] px-6"
              onPress={() => router.back()}
              startContent={<ArrowLeft className="w-4 h-4" />}
            >
              Go Back
            </Button>
          </motion.div>

          {/* Help Text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-sm text-shark-500 font-primary tracking-[0.025rem]"
          >
            Need help? Contact our{" "}
            <button 
              onClick={() => router.push('/contact')}
              className="text-verdant-600 hover:text-verdant-700 underline font-medium"
            >
              support team
            </button>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
