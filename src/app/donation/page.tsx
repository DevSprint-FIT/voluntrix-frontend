/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { Shield, Gift } from "lucide-react";
import Navbar from "@/components/UI/Navbar";
import authService from "@/services/authService";
import { User } from "@/services/authService";

interface DonationFormData {
  currency: string;
  amount: string;
  fullName: string;
  email: string;
  address: string;
  city: string;
  country: string;
  agreeToTerms: boolean;
}

const currencies = [
  { key: "LKR", label: "LKR - Sri Lankan Rupee", symbol: "Rs." },
  { key: "USD", label: "USD - US Dollar", symbol: "$" },
  { key: "EUR", label: "EUR - Euro", symbol: "€" },
];

export default function DonationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId] = useState(`ORD${Date.now().toString().slice(-6)}`);
  
  const [formData, setFormData] = useState<DonationFormData>({
    currency: "LKR",
    amount: "",
    fullName: "",
    email: "",
    address: "",
    city: "",
    country: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check authentication and auto-fill user data
  useEffect(() => {
    const checkAuthAndFillData = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            // Auto-fill form with user data
            setFormData(prev => ({
              ...prev,
              fullName: currentUser.fullName || "",
              email: currentUser.email || "",
            }));
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthAndFillData();
  }, []);

  const handleInputChange = (field: keyof DonationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid donation amount";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required to send payment invoice";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "Please accept the terms to continue";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Here you'll integrate with your payment processing
      console.log("Donation form data:", formData);
      console.log("Order ID:", orderId);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to payment processing page
      // router.push('/payment-processing');
      
    } catch (error) {
      console.error("Donation submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCurrency = currencies.find(c => c.key === formData.currency);

  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 relative">
      {/* Navbar */}
      <Navbar />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
              Processing Your Donation
            </h3>
            <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
              Please wait while we prepare your payment...
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >

          
          {/* Order ID Display */}
          <div className="mb-6">
            <p className="text-shark-500 text-sm font-primary mb-1">Donation Order</p>
            <h2 className="text-3xl font-bold text-verdant-600 font-secondary tracking-wider">
              #{orderId}
            </h2>
          </div>
          
          <h1 className="text-4xl font-bold text-shark-950 mb-2 font-secondary">
            Make a <span className="text-verdant-600">Donation</span>
          </h1>
          <p className="text-[1.15rem] text-shark-600 font-primary tracking-[0.025rem] max-w-2xl">
            Your contribution helps us make a difference in the community. Every donation counts!
          </p>
          
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8"
          >
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
              <CardBody className="p-8">
                <h3 className="text-xl font-semibold text-shark-900 mb-6 font-secondary">
                  Donation Details
                </h3>

                {/* Currency & Amount */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <Select
                    label="Currency"
                    placeholder="Select currency"
                    selectedKeys={[formData.currency]}
                    onSelectionChange={(keys) => handleInputChange("currency", Array.from(keys)[0] as string)}
                    classNames={{
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      trigger: "font-primary",
                    }}
                  >
                    {currencies.map((currency) => (
                      <SelectItem key={currency.key}>
                        {currency.label}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    label={
                      <span>
                        Donation Amount <span className="text-red-500">*</span>
                      </span>
                    }
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    startContent={
                      <span className="text-shark-400 text-sm font-medium">
                        {selectedCurrency?.symbol}
                      </span>
                    }
                    isInvalid={!!errors.amount}
                    errorMessage={errors.amount}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.02rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                    }}
                  />
                </div>

                {/* Donor Information */}
                <div className="space-y-4 mb-6">
                  <h4 className="text-lg font-medium text-shark-900 font-secondary">
                    Donor Information
                  </h4>
                  
                  <Input
                    label="Full Name"
                    placeholder="Enter your full name (optional)"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    description="Optional - for donation recognition"
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.02rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      description: "font-primary text-xs text-shark-400",
                    }}
                  />

                  <Input
                    label={
                      <span>
                        Email Address <span className="text-red-500">*</span>
                      </span>
                    }
                    type="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    isInvalid={!!errors.email}
                    errorMessage={errors.email}
                    description="Required - we'll send your payment invoice here"
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.02rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      description: "font-primary text-xs text-shark-400",
                    }}
                  />
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-lg font-medium text-shark-900 font-secondary">
                      Address Information
                    </h4>
                    <Gift className="w-4 h-4 text-verdant-600" />
                  </div>
                  
                  <p className="text-[0.8rem] text-shark-500 font-primary">
                    Optional - This information will be used to <span className="text-verdant-500">send rewards to our top donors</span>
                  </p>

                  <Input
                    label="Address"
                    placeholder="Enter your address (optional)"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.02rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                    }}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      placeholder="Enter city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      classNames={{
                        input: "font-primary text-shark-900 tracking-[0.02rem]",
                        label: "font-secondary text-shark-500 text-sm font-normal",
                      }}
                    />

                    <Input
                      label="Country"
                      placeholder="Enter country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      classNames={{
                        input: "font-primary text-shark-900 tracking-[0.02rem]",
                        label: "font-secondary text-shark-500 text-sm font-normal",
                      }}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Donation Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg sticky top-6">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Donation Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Order ID:</span>
                    <span className="text-shark-900 font-medium font-secondary">#{orderId}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Amount:</span>
                    <span className="text-shark-900 font-medium font-secondary">
                      {selectedCurrency?.symbol}{formData.amount || "0.00"} {formData.currency}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Currency:</span>
                    <span className="text-shark-900 font-medium font-secondary">{formData.currency}</span>
                  </div>

                  {formData.fullName && (
                    <div className="flex justify-between items-center">
                      <span className="text-shark-600 font-primary text-sm">Donor:</span>
                      <span className="text-shark-900 font-medium font-secondary">{formData.fullName}</span>
                    </div>
                  )}

                  {formData.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-shark-600 font-primary text-sm">Email:</span>
                      <span className="text-shark-900 font-medium font-secondary text-xs">{formData.email}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-shark-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-shark-900 font-secondary">Total:</span>
                    <span className="text-xl font-bold text-verdant-600 font-secondary">
                      {selectedCurrency?.symbol}{formData.amount || "0.00"} {formData.currency}
                    </span>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <Checkbox
                    isSelected={formData.agreeToTerms}
                    onValueChange={(checked) => handleInputChange("agreeToTerms", checked)}
                    color="success"
                    classNames={{
                      base: "inline-flex w-full max-w-full items-start",
                      wrapper: "data-[selected=true]:bg-verdant-600 data-[selected=true]:border-verdant-600 before:border-verdant-600 group-data-[selected=true]:bg-verdant-600 group-data-[selected=true]:border-verdant-600 after:bg-verdant-600 data-[selected=true]:after:bg-verdant-600 group-data-[selected=true]:after:bg-verdant-600",
                      icon: "text-white data-[selected=true]:text-white",
                      label: "text-sm font-secondary text-shark-700 leading-relaxed ml-2",
                    }}
                  >
                    I agree to the terms and conditions for donations
                  </Checkbox>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs mt-1 font-primary">{errors.agreeToTerms}</p>
                  )}
                </div>

                {/* Proceed Button */}
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  className="w-full bg-verdant-600 hover:bg-verdant-700 text-white font-primary font-medium py-6 text-base tracking-[0.025rem]"
                  size="lg"
                >
                  {isLoading ? "Processing..." : "Proceed to Payment"}
                </Button>

                {/* Security Note */}
                <div className="mt-4 flex items-center justify-center space-x-2 text-xs text-shark-500">
                  <Shield className="w-3 h-3" />
                  <span className="font-primary">Secure payment processing</span>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
