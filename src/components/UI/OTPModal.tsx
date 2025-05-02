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
        onVerificationSuccess();
        onClose();
        if (onRedirect) {
          onRedirect();
        } else {
          router.push('/auth/role-selection');
        }
      } else {
        setError(result.message);
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
    try {
      const result = await emailVerificationService.resendVerificationCode(email);
      if (result.success) {
        setError("");
        // You can add a success toast/notification here if needed
        console.log("Verification code resent successfully");
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError("Failed to resend code. Please try again.");
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
              onChange={(e) => setOtp(e.target.value)}
              isInvalid={!!error}
              errorMessage={error}
              size="lg"
              maxLength={6}
              classNames={{
                input: "font-primary text-shark-900 text-center text-lg tracking-widest",
                label: "font-secondary text-shark-500 text-sm font-normal",
                inputWrapper: "py-3",
              }}
            />
            
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-verdant-600 hover:text-verdant-700 text-sm font-medium font-primary"
              >
                Resend Code
              </button>
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
