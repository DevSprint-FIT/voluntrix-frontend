"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { Shield, Award, Calendar } from "lucide-react";
import Navbar from "@/components/UI/Navbar";
import authService from "@/services/authService";
import { User } from "@/services/authService";
import { generatePaymentID } from "@/services/paymentService";

interface SponsorshipFormData {
  currency: string;
  amount: string;
  eventName: string;
  agreeToTerms: boolean;
}

interface SponsorshipPackage {
  packageName: string;
  payableAmount: number;
  currency: string;
  benefits: string[];
  eventName: string;
}

const currencies = [
  { key: "LKR", label: "LKR - Sri Lankan Rupee", symbol: "Rs." },
  { key: "USD", label: "USD - US Dollar", symbol: "$" },
  { key: "EUR", label: "EUR - Euro", symbol: "€" },
];

export default function SponsorshipPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  // Mock sponsorship package data - this would come from API
  const [sponsorshipPackage] = useState<SponsorshipPackage>({
    packageName: "Gold Sponsor Package",
    payableAmount: 50000,
    currency: "LKR",
    benefits: [
      "Logo on event banners and materials",
      "Dedicated social media posts",
      "Speaking opportunity at event",
      "Premium booth location",
      "VIP networking access"
    ],
    eventName: "Tech Innovation Summit 2025"
  });
  
  const [formData, setFormData] = useState<SponsorshipFormData>({
    currency: sponsorshipPackage.currency,
    amount: "",
    eventName: sponsorshipPackage.eventName,
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const generateOrderId = async () => {
      try {
        const newOrderId = await generatePaymentID("SPONSORSHIP");
        setOrderId(newOrderId);
      } catch (error) {
        console.error("Error generating order ID:", error);
        setOrderId(`ORD${Date.now().toString().slice(-6)}`);
      }
    };

    generateOrderId();
  }, []);

  // Check authentication and verify sponsor role
  useEffect(() => {
    const checkAuthAndRole = async () => {
      try {
        const authenticated = authService.isAuthenticated();
        setIsAuthenticated(authenticated);
        
        if (authenticated) {
          const currentUser = await authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            
            // TODO: Add role verification for sponsors
            // if (currentUser.role !== 'sponsor') {
            //   router.push('/unauthorized');
            //   return;
            // }
          }
        } else {
          // Redirect to login if not authenticated
          // router.push('/auth/login');
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthAndRole();
  }, []);

  const handleInputChange = (field: keyof SponsorshipFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid sponsorship amount";
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
      console.log("Sponsorship form data:", formData);
      console.log("Order ID:", orderId);
      console.log("Package:", sponsorshipPackage);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to payment processing page
      // router.push('/payment-processing');
      
    } catch (error) {
      console.error("Sponsorship submission failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCurrency = currencies.find(c => c.key === formData.currency);
  const packageCurrency = currencies.find(c => c.key === sponsorshipPackage.currency);

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
              Processing Your Sponsorship
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
            <p className="text-shark-500 text-sm font-primary mb-1">Sponsorship Order</p>
            <h2 className="text-3xl font-bold text-verdant-600 font-secondary tracking-wider">
              #{orderId || "Loading..."}
            </h2>
          </div>
          
          <h1 className="text-4xl font-bold text-shark-950 mb-2 font-secondary">
            Complete Your <span className="text-verdant-600">Sponsorship</span>
          </h1>
          <p className="text-[1.15rem] text-shark-600 font-primary tracking-[0.025rem] max-w-2xl">
            Thank you for supporting our mission. Your sponsorship makes a significant impact!
          </p>
          
          {/* Sponsor Welcome */}
          {isAuthenticated && user && (
            <div className="mt-4 flex items-center space-x-2 text-sm text-verdant-600">
              <Shield className="w-4 h-4" />
              <span className="font-primary">Welcome back, {user.fullName}!</span>
            </div>
          )}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sponsorship Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Event Information */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
              <CardBody className="p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-verdant-600" />
                  <h3 className="text-xl font-semibold text-shark-900 font-secondary">
                    Event Information
                  </h3>
                </div>
                
                <Input
                  label="Event Name"
                  value={formData.eventName}
                  isReadOnly
                  classNames={{
                    input: "font-primary text-shark-900 tracking-[0.02rem]",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                  }}
                />
              </CardBody>
            </Card>

            {/* Package Information */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
              <CardBody className="p-8">
                <div className="flex items-center space-x-2 mb-6">
                  <Award className="w-5 h-5 text-verdant-600" />
                  <h3 className="text-xl font-semibold text-shark-900 font-secondary">
                    Your Sponsorship Package
                  </h3>
                </div>

                <div className="bg-verdant-50 rounded-lg p-6 mb-6">
                  <h4 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
                    {sponsorshipPackage.packageName}
                  </h4>
                  <p className="text-2xl font-bold text-verdant-600 font-secondary mb-4">
                    {packageCurrency?.symbol}{sponsorshipPackage.payableAmount.toLocaleString()} {sponsorshipPackage.currency}
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-shark-700 font-secondary mb-2">Package Benefits:</p>
                    {sponsorshipPackage.benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-verdant-500 rounded-full"></div>
                        <span className="text-sm text-shark-600 font-primary">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Input
                  label="Package Payable Amount"
                  value={`${packageCurrency?.symbol}${sponsorshipPackage.payableAmount.toLocaleString()} ${sponsorshipPackage.currency}`}
                  isReadOnly
                  description="This is your package commitment amount"
                  classNames={{
                    input: "font-primary text-shark-900 tracking-[0.02rem] font-medium",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                    description: "font-primary text-xs text-shark-400",
                  }}
                />
              </CardBody>
            </Card>

            {/* Payment Details */}
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg">
              <CardBody className="p-8">
                <h3 className="text-xl font-semibold text-shark-900 mb-6 font-secondary">
                  Payment Details
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
                        Payment Amount <span className="text-red-500">*</span>
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
                    description="You can pay any amount towards your sponsorship"
                    isInvalid={!!errors.amount}
                    errorMessage={errors.amount}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.02rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      description: "font-primary text-xs text-shark-400",
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          </motion.div>

          {/* Sponsorship Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-4"
          >
            <Card className="bg-white/70 backdrop-blur-sm shadow-lg sticky top-6">
              <CardBody className="p-6">
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Sponsorship Summary
                </h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Order ID:</span>
                    <span className="text-shark-900 font-medium font-secondary">#{orderId || "Loading..."}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Event:</span>
                    <span className="text-shark-900 font-medium font-secondary text-xs">{formData.eventName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Package:</span>
                    <span className="text-shark-900 font-medium font-secondary text-xs">{sponsorshipPackage.packageName}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Package Amount:</span>
                    <span className="text-shark-900 font-medium font-secondary">
                      {packageCurrency?.symbol}{sponsorshipPackage.payableAmount.toLocaleString()} {sponsorshipPackage.currency}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Paying Now:</span>
                    <span className="text-shark-900 font-medium font-secondary">
                      {selectedCurrency?.symbol}{formData.amount || "0.00"} {formData.currency}
                    </span>
                  </div>

                  {user && (
                    <div className="flex justify-between items-center">
                      <span className="text-shark-600 font-primary text-sm">Sponsor:</span>
                      <span className="text-shark-900 font-medium font-secondary text-xs">{user.fullName}</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-shark-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-shark-900 font-secondary">Payment Total:</span>
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
                    I agree to the terms and conditions for sponsorship
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
