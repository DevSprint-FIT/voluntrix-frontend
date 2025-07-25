"use client";

import React , {useState} from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { X } from "lucide-react";
import { Button } from "@heroui/button";
import { sendVerificationCode } from "@/services/organizationSettingsService";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const PhoneVerificationModal = ({ isOpen, onClose }: Props) => {
  const [countryCode, setCountryCode] = useState("+94");
  const [phone, setPhone] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const isFormValid = phone.length >= 9 && !!captchaToken;

  const handleSendCode = async () => {
    const fullPhone = countryCode + phone;
    try {
      await sendVerificationCode(fullPhone, captchaToken!);
      alert(`Code sent to ${fullPhone}`);
    } catch (error) {
      alert("Failed to send verification code.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-shark-950 bg-opacity-60">
      <div className="relative bg-white text-shark-950 p-6 rounded-xl w-full max-w-lg  shadow-lg">
        {/* Close Button */}
        <button 
           onClick={onClose}
           className="absolute top-3 right-4 text-shark-500 hover:text-shark-700"
           aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-secondary font-semibold mb-2">
          Just one thing—first verify your account
        </h2>
        <p className="text-sm mb-1">
          Enter your phone number and we’ll send you a code
        </p>

        <div className="flex gap-2 mb-4">
          <select
            className="bg-[#FBFBFB] px-3 py-2 rounded w-1/3 text-shark-950"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            <option value="+94">LK +94</option>
            <option value="+1">US +1</option>
            <option value="+91">IN +91</option>
          </select>
          <input
            type="tel"
            placeholder="Phone number"
            className="bg-[#FBFBFB] px-3 py-2 rounded w-2/3"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* reCAPTCHA */}
        <div className="bg-[#FBFBFB] p-3 rounded mb-0">
          <ReCAPTCHA
             sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
             onChange={(token) => {
               if (token) {
                  setCaptchaToken(token); 
               }
            }}
           onExpired={() => setCaptchaToken(null)}
           />

        </div>

        <p className="text-sm text-shark-400 mb-4 ">
          Already have a code?{" "}
          <Button
             className="underline bg-transparent hover:bg-transparent "
             onPress={() => alert("Enter code feature coming soon")}>
            Enter it now.
          </Button>
        </p>

        <div className="flex justify-end gap-2">
          <Button
            onPress={onClose}
            className="px-4 py-2 rounded-full border border-shark-300 bg-white text-shark-950 hover:bg-shark-50"
          >
            Cancel
          </Button>
          <Button
            disabled={!isFormValid}
            className={`px-4 py-2 rounded-full text-white ${
              isFormValid
                ? "bg-shark-950 hover:bg-shark-400"
                : "bg-shark-950 cursor-not-allowed"
            }`}
            onPress={handleSendCode}
          >
            Send verification code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhoneVerificationModal;
