"use client";

import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@heroui/react";
import { useRouter } from "next/navigation";
import emailVerificationService from "@/services/emailVerificationService";

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationSuccess: () => void;
  onRedirect?: () => void; 
}

const OTPModal = ({ isOpen, onClose, email, onVerificationSuccess, onRedirect }: OTPModalProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();

  const handleVerifyOTP = async () => {
    if (!otp.trim()) {
      setError("Please enter the OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await emailVerificationService.verifyEmail(email, otp);
      
      if (result.success) {
        // Only call success callback if verification actually succeeded
        console.log("Email verified successfully");
        onVerificationSuccess();
        onClose();
        if (onRedirect) {
          onRedirect();
        } else {
          router.push('/auth/role-selection');
        }
      } else {
        // Show error message and don't proceed
        console.log("Email verification failed:", result.message);
        setError(result.message);
        setOtp("");
      }
    } catch (error) {
      console.error("OTP verification error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onClose();
    if (onRedirect) {
      onRedirect();
    } else {
      router.push('/auth/role-selection');
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError("");
    setResendMessage("");
    
    try {
      const result = await emailVerificationService.resendVerificationCode(email);
      if (result.success) {
        setResendMessage("Verification code sent successfully!");
        // Clear the success message after 3 seconds
        setTimeout(() => setResendMessage(""), 3000);
        console.log("Verification code resent successfully");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend code. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      placement="center"
      classNames={{
        base: "bg-white",
        header: "border-b border-shark-200",
        footer: "border-t border-shark-200",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h3 className="text-xl font-bold text-shark-950 font-secondary">
            Verify Your Email
          </h3>
          <p className="text-sm text-shark-600 font-primary">
            We&apos;ve sent a verification code to <span className="font-medium">{email}</span>
          </p>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <Input
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value);
                // Clear error when user starts typing
                if (error) setError("");
              }}
              isInvalid={!!error}
              errorMessage={error}
              size="lg"
              maxLength={6}
              disabled={isLoading}
              classNames={{
                input: `font-primary text-shark-900 text-center text-lg tracking-widest ${isLoading ? 'opacity-50' : ''}`,
                label: "font-secondary text-shark-500 text-sm font-normal",
                inputWrapper: "py-3",
              }}
            />
            
            <div className="text-center space-y-2">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isResending || isLoading}
                className={`text-sm font-medium font-primary ${
                  isResending || isLoading 
                    ? 'text-shark-400 cursor-not-allowed' 
                    : 'text-verdant-600 hover:text-verdant-700'
                }`}
              >
                {isResending ? "Sending..." : "Resend Code"}
              </button>
              
              {resendMessage && (
                <p className="text-sm text-green-600 font-primary">
                  {resendMessage}
                </p>
              )}
            </div>
          </div>
        </ModalBody>
        
        <ModalFooter>
          <div className="flex gap-3 w-full">
            <Button 
              variant="light" 
              onPress={handleSkip}
              className="flex-1 font-primary"
            >
              Skip for now
            </Button>
            <Button 
              color="primary"
              onPress={handleVerifyOTP}
              isLoading={isLoading}
              className="flex-1 bg-verdant-600 hover:bg-verdant-700 font-primary"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OTPModal;
