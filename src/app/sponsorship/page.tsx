/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardBody, Button, Input, Select, SelectItem, Checkbox } from "@heroui/react";
import { Shield, Award, Calendar } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import authService from "@/services/authService";
import { User } from "@/services/authService";
import { getSponsorshipPaymentDetails, SponsorshipPaymentDetails, startPayment, PaymentDetails, checkPaymentStatus } from "@/services/paymentService";
import Navbar from "@/components/UI/Navbar";

// Declare PayHere global interface
declare global {
  interface Window {
    payhere: any;
  }
}

interface SponsorshipFormData {
  currency: string;
  amount: string;
  eventName: string;
  agreeToTerms: boolean;
}

const currencies = [
  { key: "LKR", label: "LKR - Sri Lankan Rupee", symbol: "Rs." },
  { key: "USD", label: "USD - US Dollar", symbol: "$" },
  { key: "EUR", label: "EUR - Euro", symbol: "€" },
];

// Loading component for suspense fallback
function SponsorshipPageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 relative">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
              Loading Sponsorship Page
            </h3>
            <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
              Please wait while we load your sponsorship details...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main sponsorship content component
function SponsorshipPageContent() {
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>("");
  const router = useRouter();

  const [sponsorshipPackage, setSponsorshipPackage] = useState<SponsorshipPaymentDetails | null>(null);

  const [formData, setFormData] = useState<SponsorshipFormData>({
    currency: "LKR",
    amount: "",
    eventName: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch sponsorship details based on requestId from URL
  useEffect(() => {
    const requestId = searchParams?.get('requestId');
    
    if (requestId) {
      fetchSponsorshipDetails(parseInt(requestId));
    } else {
      console.error("No requestId provided in URL");
      setIsDataLoading(false);
    }
  }, [searchParams]);

  const fetchSponsorshipDetails = async (requestId: number) => {
    try {
      setIsDataLoading(true);
      const details = await getSponsorshipPaymentDetails(requestId);
      
      setSponsorshipPackage(details);
      
      // Update form data with fetched details
      setFormData(prev => ({
        ...prev,
        eventName: details.eventTitle,
      }));
      
      // Use the orderId from the API response
      setOrderId(details.orderId);
      
    } catch (error) {
      console.error('Error fetching sponsorship details:', error);
      // Handle error - maybe redirect back to dashboard
    } finally {
      setIsDataLoading(false);
    }
  };

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
          }
        } else {
          router.push('/auth/login');
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuthAndRole();
  }, [router]);

  // Setup PayHere event handlers - Match checkout page exactly
  useEffect(() => {
    if (typeof window !== "undefined" && window.payhere) {
      console.log("Setting up PayHere event handlers for sponsorship page...");
      
      window.payhere.onCompleted = function (orderId: string) {
        console.log("PayHere onCompleted triggered for order:", orderId);
        let attempts = 0;
        const maxAttempts = 10;
        
        const interval = setInterval(async () => {
          try {
            console.log(`Payment status check attempt ${attempts + 1}/${maxAttempts}`);
            const status = await checkPaymentStatus(orderId);
            console.log(`Payment status for ${orderId}: ${status}`);
            
            if(status === "SUCCESS") {
              clearInterval(interval);
              window.location.href = "/checkout/success";
            } else if (status === "FAILED") {
              clearInterval(interval);
              window.location.href = "/checkout/fail";
            } else if (attempts >= maxAttempts) {
              clearInterval(interval);
              window.location.href = "/checkout/fail";
            }
            attempts++;
          } catch (error) {
            console.error("Error checking payment status:", error);
            clearInterval(interval);
            window.location.href = "/checkout/fail";
          }
        }, 2000); // Increased interval to 2 seconds to be less aggressive
      };
  
      window.payhere.onDismissed = function () {
        console.log("PayHere onDismissed triggered");
        window.location.href = "/checkout/fail";
      };
  
      window.payhere.onError = function (error: any) {
        console.error("PayHere onError triggered:", error);
        window.location.href = "/checkout/fail";
      };
      
      console.log("PayHere event handlers setup completed for sponsorship page");
    } else {
      console.log("PayHere not available during useEffect setup");
    }
  }, []);

  const handleInputChange = (field: keyof SponsorshipFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validate payment amount
    if (!formData.amount || formData.amount.trim() === "") {
      newErrors.amount = "Payment amount is required";
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid payment amount greater than 0";
    }
    
    // Validate currency selection
    if (!formData.currency) {
      newErrors.currency = "Please select a currency";
    }
    
    // Validate terms and conditions
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must accept the terms and conditions to proceed";
    }

    // Validate user authentication
    if (!user) {
      newErrors.user = "User authentication required. Please log in again.";
    }

    // Validate sponsorship package data
    if (!sponsorshipPackage) {
      newErrors.package = "Sponsorship package data not available. Please refresh the page.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !sponsorshipPackage || !user) return;
    
    setIsLoading(true);
    try {
      console.log("Starting sponsorship payment process...");
      console.log("Form data:", formData);
      console.log("User:", user);
      console.log("Package:", sponsorshipPackage);
      
      // Create payment details object
      const paymentDetails: PaymentDetails = {
        orderId: orderId,
        amount: parseFloat(formData.amount).toFixed(2), // Ensure decimal format like "100.00"
        currency: formData.currency,
        firstName: user.fullName ? user.fullName.split(' ')[0] : null,
        lastName: user.fullName ? user.fullName.split(' ').slice(1).join(' ') : null,
        email: user.email,
        phone: null,
        address: null,
        city: null,
        country: null,
        userType: "SPONSOR",
        volunteerId: null,
        sponsorId: sponsorshipPackage.sponsorId,
        eventId: sponsorshipPackage.eventId,
        isAnnonymous: false,
        transactionType: "SPONSORSHIP"
      };

      console.log("Payment details being sent:", paymentDetails);

      // Start payment process
      console.log("Calling startPayment API...");
      const { hash, merchantId } = await startPayment(paymentDetails);
      
      console.log("Payment API response:", { hash, merchantId });
      
      // Prepare PayHere payment object
      const payment = {
        sandbox: true,
        merchant_id: merchantId,
        return_url: process.env.NEXT_PUBLIC_PAYHERE_RETURN_URL,
        cancel_url: process.env.NEXT_PUBLIC_PAYHERE_FAIL_URL,
        notify_url: process.env.NEXT_PUBLIC_PAYHERE_NOTIFY_URL,
        order_id: paymentDetails.orderId,
        items: paymentDetails.transactionType,
        amount: paymentDetails.amount,
        currency: paymentDetails.currency,
        first_name: paymentDetails.firstName,
        last_name: paymentDetails.lastName,
        email: paymentDetails.email,
        phone: paymentDetails.phone,
        address: paymentDetails.address,
        city: paymentDetails.city,
        country: paymentDetails.country,
        hash: hash,
      };

      console.log("PayHere payment object:", payment);
      
      // Ensure PayHere is available before calling it
      if (typeof window !== "undefined" && window.payhere) {
        console.log("PayHere is available, starting payment...");
        console.log("PayHere object details:", window.payhere);
        
        try {
          console.log("About to call window.payhere.startPayment...");
          window.payhere.startPayment(payment);
          console.log("window.payhere.startPayment called successfully");
        } catch (error) {
          console.error("Error calling payhere.startPayment:", error);
          alert(`PayHere Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      } else {
        console.error("PayHere is not available");
        throw new Error("PayHere payment system is not available. Please refresh the page and try again.");
      }
      
    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert(`Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCurrency = currencies.find(c => c.key === formData.currency);
  
  // Show loading while fetching data
  if (isDataLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 relative">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 relative">
                <div className="absolute inset-0 border-4 border-verdant-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-verdant-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
                Loading Sponsorship Details
              </h3>
              <p className="text-shark-600 font-primary text-sm tracking-[0.025rem]">
                Please wait while we fetch your sponsorship information...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if no sponsorship package data
  if (!sponsorshipPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-verdant-50 via-white to-verdant-100 relative">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-12 pt-32">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-shark-900 mb-2 font-secondary">
                Sponsorship Not Found
              </h3>
              <p className="text-shark-600 font-primary text-sm tracking-[0.025rem] mb-4">
                The sponsorship details could not be loaded. Please try again.
              </p>
              <Button 
                onClick={() => window.history.back()}
                className="bg-verdant-600 hover:bg-verdant-700 text-white font-primary"
              >
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    {sponsorshipPackage.type}
                  </h4>
                  <p className="text-2xl font-bold text-verdant-600 font-secondary mb-4">
                    Rs.{sponsorshipPackage.price.toLocaleString()} LKR
                  </p>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-shark-700 font-secondary mb-2">Package Benefits:</p>
                    <div className="bg-white rounded p-3">
                      {sponsorshipPackage.benefits ? (
                        <ul className="space-y-1">
                          {sponsorshipPackage.benefits.split('.').filter(benefit => benefit.trim() !== '').map((benefit, index) => (
                            <li key={index} className="text-sm text-shark-600 font-primary leading-relaxed flex items-start">
                              <span className="text-verdant-600 mr-2 mt-1 text-xs">•</span>
                              {benefit.trim()}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-shark-600 font-primary leading-relaxed">
                          No benefits information available
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Input
                  label="Package Payable Amount"
                  value={`Rs.${sponsorshipPackage.payableAmount.toLocaleString()} LKR`}
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
                    label={
                      <span>
                        Currency <span className="text-red-500">*</span>
                      </span>
                    }
                    placeholder="Select currency"
                    selectedKeys={[formData.currency]}
                    onSelectionChange={(keys) => handleInputChange("currency", Array.from(keys)[0] as string)}
                    isInvalid={!!errors.currency}
                    errorMessage={errors.currency}
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
                    <span className="text-shark-900 font-medium font-secondary text-xs">{sponsorshipPackage.type}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-shark-600 font-primary text-sm">Package Amount:</span>
                    <span className="text-shark-900 font-medium font-secondary">
                      Rs.{sponsorshipPackage.payableAmount.toLocaleString()} LKR
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
                    isInvalid={!!errors.agreeToTerms}
                    classNames={{
                      base: "inline-flex w-full max-w-full items-start",
                      wrapper: "data-[selected=true]:bg-verdant-600 data-[selected=true]:border-verdant-600 before:border-verdant-600 group-data-[selected=true]:bg-verdant-600 group-data-[selected=true]:border-verdant-600 after:bg-verdant-600 data-[selected=true]:after:bg-verdant-600 group-data-[selected=true]:after:bg-verdant-600",
                      icon: "text-white data-[selected=true]:text-white",
                      label: "text-sm font-secondary text-shark-700 leading-relaxed ml-2",
                    }}
                  >
                    <span>
                      I agree to the terms and conditions for sponsorship{" "}
                      <span className="text-red-500">*</span>
                    </span>
                  </Checkbox>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-xs mt-1 font-primary">{errors.agreeToTerms}</p>
                  )}
                </div>

                {/* Proceed Button */}
                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={!formData.amount || !formData.currency || !formData.agreeToTerms || parseFloat(formData.amount || "0") <= 0}
                  className="w-full bg-verdant-600 hover:bg-verdant-700 text-white font-primary font-medium py-6 text-base tracking-[0.025rem] disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {isLoading ? "Initializing Payment..." : "Pay with PayHere"}
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

// Main page component wrapped with Suspense
export default function SponsorshipPage() {
  return (
    <Suspense fallback={<SponsorshipPageLoading />}>
      <SponsorshipPageContent />
    </Suspense>
  );
}