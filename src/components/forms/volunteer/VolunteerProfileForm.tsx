"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem, Avatar, Textarea, Card, CardBody, Chip, Switch, Checkbox } from "@heroui/react";
import { motion } from "framer-motion";
import { Camera, Mail, Phone, Building2, User, Info } from "lucide-react";
import OTPModal from "@/components/UI/OTPModal";

interface User {
  userId: number;
  email: string;
  fullName: string;
  handle: string;
  role: string;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
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
  agreeToTerms: boolean;
}

// Interest categories for volunteers
const interestCategories = [
  "Education & Teaching",
  "Healthcare & Medical",
  "Environmental",
  "Community Development",
  "Disaster Relief",
  "Animal Welfare",
  "Arts & Culture",
  "Technology & Digital Literacy",
  "Sports & Recreation",
  "Elder Care",
  "Child & Youth Development",
  "Human Rights",
  "Food & Nutrition",
  "Mental Health Support",
  "Special Needs Support"
];

// Sri Lankan Universities with their email domains
const sriLankanUniversities = [
  { key: "uoc", label: "University of Colombo", domain: "@edu.cmb.ac.lk" },
  { key: "uop", label: "University of Peradeniya", domain: "@pdn.ac.lk" },
  { key: "usj", label: "University of Sri Jayewardenepura", domain: "@sjp.ac.lk" },
  { key: "uom", label: "University of Moratuwa", domain: "@uom.lk" },
  { key: "uok", label: "University of Kelaniya", domain: "@stu.kln.ac.lk" },
  { key: "sliit", label: "Sri Lanka Institute of Information Technology (SLIIT)", domain: "@sliit.lk" },
  { key: "nsbm", label: "NSBM Green University", domain: "@nsbm.ac.lk" },
  { key: "ric", label: "Royal Institute of Colombo (RIC)", domain: "@ric.edu" },
  { key: "iit", label: "Informatics Institute of Technology (IIT)", domain: "@iit.ac.lk" },
  { key: "kdu", label: "General Sir John Kotelawala Defence University (KDU)", domain: "@kdu.ac.lk" }
];

interface VolunteerProfileFormProps {
  user: User;
  onSubmit: (formData: VolunteerFormData) => Promise<void>;
  isLoading: boolean;
}

const VolunteerProfileForm: React.FC<VolunteerProfileFormProps> = ({ user, onSubmit, isLoading }) => {
  const [showInstituteOTP, setShowInstituteOTP] = useState(false);
  const [isInstituteVerified, setIsInstituteVerified] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<VolunteerFormData>({
    selectedInstitute: "",
    instituteEmail: "",
    isAvailable: true,
    about: "",
    profilePicture: null,
    phoneNumber: "",
    selectedCategories: [],
    agreeToTerms: false
  });

  // Handle input changes
  const handleInputChange = (field: keyof VolunteerFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle availability toggle
  const handleAvailabilityChange = (isAvailable: boolean) => {
    setFormData(prev => ({ ...prev, isAvailable }));
    if (errors.isAvailable) {
      setErrors(prev => ({ ...prev, isAvailable: "" }));
    }
  };

  // Handle institute selection
  const handleInstituteChange = (instituteKey: string) => {
    const selectedUni = sriLankanUniversities.find(uni => uni.key === instituteKey);
    if (selectedUni) {
      setFormData(prev => ({ ...prev, selectedInstitute: instituteKey }));
      // Reset institute verification when institute changes
      setIsInstituteVerified(false);
      if (errors.selectedInstitute) {
        setErrors(prev => ({ ...prev, selectedInstitute: "" }));
      }
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePicture: "Please select a valid image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, profilePicture: "Image size should be less than 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, profilePicture: file }));
      setErrors(prev => ({ ...prev, profilePicture: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle category selection
  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.includes(category)
        ? prev.selectedCategories.filter(c => c !== category)
        : [...prev.selectedCategories, category]
    }));
  };

  // Handle terms agreement
  const handleTermsChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
    if (errors.agreeToTerms) {
      setErrors(prev => ({ ...prev, agreeToTerms: "" }));
    }
  };

  // Handle institute verification
  const handleInstituteVerification = () => {
    if (!formData.selectedInstitute) {
      setErrors(prev => ({ ...prev, selectedInstitute: "Please select a institute first" }));
      return;
    }
    if (!formData.instituteEmail.trim()) {
      setErrors(prev => ({ ...prev, instituteEmail: "Please enter your institute email" }));
      return;
    }
    
    const selectedUni = sriLankanUniversities.find(uni => uni.key === formData.selectedInstitute);
    const expectedDomain = selectedUni?.domain;
    
    if (expectedDomain && !formData.instituteEmail.endsWith(expectedDomain)) {
      setErrors(prev => ({ 
        ...prev, 
        instituteEmail: `Email must end with ${expectedDomain} for ${selectedUni.label}` 
      }));
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.instituteEmail)) {
      setErrors(prev => ({ ...prev, instituteEmail: "Please enter a valid email address" }));
      return;
    }

    // Show OTP modal for institute verification
    setShowInstituteOTP(true);
  };

  // Handle institute OTP verification success
  const handleInstituteVerificationSuccess = () => {
    setIsInstituteVerified(true);
    setShowInstituteOTP(false);
  };

  // Handle institute OTP verification cancel
  const handleInstituteVerificationCancel = () => {
    setShowInstituteOTP(false);
    setFormData(prev => ({ ...prev, selectedInstitute: "", instituteEmail: "" }));
    setIsInstituteVerified(false);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Institute information is optional, but if user provides institute or email, both must be provided and verified
    if (formData.selectedInstitute || formData.instituteEmail.trim()) {
      if (!formData.selectedInstitute) {
        newErrors.selectedInstitute = "Institute selection is required when adding institute information";
      }
      if (!formData.instituteEmail.trim()) {
        newErrors.instituteEmail = "Institute email is required when adding institute information";
      }
      if (formData.selectedInstitute && formData.instituteEmail.trim() && !isInstituteVerified) {
        newErrors.general = "Please verify your institute email before submitting the form";
      }
      
      // Validate email domain matches selected institute
      if (formData.selectedInstitute && formData.instituteEmail.trim()) {
        const selectedUni = sriLankanUniversities.find(uni => uni.key === formData.selectedInstitute);
        if (selectedUni && !formData.instituteEmail.endsWith(selectedUni.domain)) {
          newErrors.instituteEmail = `Email must end with ${selectedUni.domain} for ${selectedUni.label}`;
        }
      }
    }
    
    if (formData.instituteEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.instituteEmail)) {
      newErrors.instituteEmail = "Please enter a valid email address";
    }
    
    // Availability is no longer required - it's just a toggle
    
    if (!formData.about.trim()) {
      newErrors.about = "Please tell us about yourself";
    } else if (formData.about.trim().length < 50) {
      newErrors.about = "Please provide at least 50 characters about yourself";
    }
    
    if (formData.phoneNumber.trim() && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    if (formData.selectedCategories.length === 0) {
      newErrors.categories = "Please select at least one interest category";
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the Terms of Service and Privacy Policy";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await onSubmit(formData);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="lg:col-span-8"
      >
        <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
          <CardBody className="p-8">
            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <p className="text-red-600 text-sm font-primary tracking-[0.025rem]">{errors.general}</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Profile Picture Section - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Picture
                  <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                </h3>
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar
                      src={previewImage || undefined}
                      className="w-24 h-24"
                      name={user?.fullName}
                      size="lg"
                    />
                    <label
                      htmlFor="profile-picture"
                      className="absolute -bottom-2 -right-2 bg-verdant-600 hover:bg-verdant-700 text-white rounded-full p-2 cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-picture"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-shark-600 font-primary mb-1 tracking-[0.025rem]">
                      Upload a profile picture to help organizations recognize you
                    </p>
                    <p className="text-xs text-shark-500 font-secondary">
                      JPG, PNG, or GIF. Max file size 5MB.
                    </p>
                    {errors.profilePicture && (
                      <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Institute Information - Optional */}
              <div>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                    <Building2 className="w-5 h-5 mr-2" />
                    Institute Information
                    <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                  </h3>
                  <div className="group relative ml-2 mb-4">
                    <Info className="w-4 h-4 text-shark-400 hover:text-shark-600 cursor-help" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-64 p-3 bg-shark-800 text-white text-xs rounded-lg shadow-lg z-10">
                      <div className="font-medium mb-1">Institute Verification</div>
                      <div>Verifying your institute email allows you to access private events that are exclusively available to students and staff from your institution.</div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-shark-800"></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Select Your Institute"
                      placeholder="Choose your institute"
                      selectedKeys={formData.selectedInstitute ? [formData.selectedInstitute] : []}
                      onSelectionChange={(keys) => {
                        const selected = Array.from(keys)[0] as string;
                        handleInstituteChange(selected || "");
                      }}
                      isInvalid={!!errors.selectedInstitute}
                      errorMessage={errors.selectedInstitute}
                      size="lg"
                      isDisabled={isInstituteVerified}
                      classNames={{
                        label: "font-secondary text-shark-500 text-sm font-normal",
                        trigger: "py-3",
                      }}
                    >
                      {sriLankanUniversities.map((institute) => (
                        <SelectItem key={institute.key}>
                          {institute.label}
                        </SelectItem>
                      ))}
                    </Select>
                    {isInstituteVerified && (
                      <p className="text-verdant-600 text-xs mt-2 font-primary flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Institute verified successfully
                      </p>
                    )}
                  </div>
                  <div>
                    <div className="relative">
                      <Input
                        label="Institute Email"
                        type="email"
                        placeholder={formData.selectedInstitute ? 
                          "Enter your institue username" :
                          "Select institute first"
                        }
                        value={formData.instituteEmail}
                        onChange={(e) => handleInputChange("instituteEmail", e.target.value)}
                        isInvalid={!!errors.instituteEmail}
                        errorMessage={errors.instituteEmail}
                        size="lg"
                        isDisabled={isInstituteVerified || !formData.selectedInstitute}
                        classNames={{
                          input: "font-primary text-shark-900 tracking-[0.025rem]",
                          label: "font-secondary text-shark-500 text-sm font-normal",
                          inputWrapper: "py-3",
                        }}
                        endContent={
                          formData.selectedInstitute && (
                            <div className="text-shark-500 text-sm font-primary tracking-[0.025rem]">
                              {sriLankanUniversities.find(u => u.key === formData.selectedInstitute)?.domain}
                            </div>
                          )
                        }
                      />
                    </div>
                    {!isInstituteVerified && (formData.selectedInstitute || formData.instituteEmail.trim()) ? (
                      <Button
                        size="sm"
                        className="mt-2 bg-verdant-600 text-white font-primary tracking-[0.025rem]"
                        onPress={handleInstituteVerification}
                        isDisabled={!formData.selectedInstitute || !formData.instituteEmail.trim()}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Verify Institute Email
                      </Button>
                    ) : (formData.selectedInstitute || formData.instituteEmail.trim()) && !isInstituteVerified ? (
                      <p className="text-orange-600 text-xs mt-2 font-primary tracking-[0.025rem]">
                        Please select institute and fill email to verify
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Contact Information - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                  <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                </h3>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number: +94717283921"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  isInvalid={!!errors.phoneNumber}
                  errorMessage={errors.phoneNumber}
                  size="lg"
                  classNames={{
                    input: "font-primary text-shark-900 tracking-[0.025rem]",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                    inputWrapper: "py-3",
                  }}
                />
              </div>

              {/* Availability - Toggle */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Current Availability
                </h3>
                <div className="flex items-center space-x-4">
                  <Switch
                    isSelected={formData.isAvailable}
                    onValueChange={handleAvailabilityChange}
                    size="sm"
                    classNames={{
                      base: "inline-flex items-center",
                      wrapper: "group-data-[selected=true]:bg-verdant-500",
                      thumb: "group-data-[selected=true]:bg-white",
                      label: "text-sm font-secondary text-shark-700 ml-2",
                    }}
                  >
                    I am currently available to volunteer
                  </Switch>
                </div>
                <p className="text-xs text-shark-500 mt-2 font-primary tracking-[0.025rem]">
                  You can update your availability status anytime in your profile settings.
                </p>
              </div>

              {/* About Section - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  About Yourself <span className="text-red-600">*</span>
                </h3>
                <Textarea
                  label="Tell us about yourself"
                  placeholder="Share your background, experience, motivation for volunteering, and what makes you passionate about helping others..."
                  value={formData.about}
                  onChange={(e) => handleInputChange("about", e.target.value)}
                  isInvalid={!!errors.about}
                  errorMessage={errors.about}
                  minRows={4}
                  maxRows={6}
                  classNames={{
                    input: "font-primary text-shark-900 tracking-[0.025rem]",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                  }}
                />
                <p className="text-xs text-shark-500 mt-1 font-primary tracking-[0.025rem]">
                  {formData.about.length}/500 characters (minimum 50 required)
                </p>
              </div>

              {/* Interest Categories - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Areas of Interest <span className="text-red-600">*</span>
                </h3>
                <p className="text-[0.9rem] text-shark-600 mb-4 font-primary tracking-[0.025rem]">
                  Select the areas you&apos;re interested in volunteering for:
                </p>
                
                {/* Category Selection Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {interestCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      className={`p-3 rounded-lg border-2 transition-all text-left text-[0.8rem] font-secondary ${
                        formData.selectedCategories.includes(category)
                          ? 'border-verdant-500 bg-verdant-50 text-verdant-800'
                          : 'border-shark-200 bg-white hover:border-shark-300 text-shark-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
                
                {errors.categories && (
                  <p className="text-red-500 text-sm mt-2">{errors.categories}</p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </motion.div>

      {/* Right Side - Summary/Preview */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="lg:col-span-4"
      >
        <div className="sticky top-8">
          <Card className="bg-white/70 backdrop-blur-sm shadow-sm">
            <CardBody className="p-6">
              <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                Profile Summary
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-shark-500 font-secondary">Full Name</p>
                  <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{user?.fullName}</p>
                </div> 
                
                <div>
                  <p className="text-shark-500 font-secondary">Email</p>
                  <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{user?.email}</p>
                </div>
                
                {formData.selectedInstitute && (
                  <div>
                    <p className="text-shark-500 font-secondary">Institute</p>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">
                      {sriLankanUniversities.find(u => u.key === formData.selectedInstitute)?.label}
                    </p>
                    {isInstituteVerified && (
                      <p className="text-green-600 text-xs flex items-center mt-1">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Verified
                      </p>
                    )}
                  </div>
                )}
                
                <div>
                  <p className="text-shark-500 font-secondary">Availability Status</p>
                  <div className="flex items-center mt-1">
                    <div className={`w-2 h-2 rounded-full mr-2 ${formData.isAvailable ? 'bg-verdant-500' : 'bg-gray-400'}`}></div>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">
                      {formData.isAvailable ? 'Available to volunteer' : 'Currently unavailable'}
                    </p>
                  </div>
                </div>
                
                {formData.selectedCategories.length > 0 && (
                  <div>
                    <p className="text-shark-500 font-secondary">Interests</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.selectedCategories.map((category) => (
                        <Chip
                          key={category}
                          size="sm"
                          variant="flat"
                          color="success"
                          className="bg-verdant-100 text-verdant-800 text-xs font-primary tracking-[0.025rem] font-medium"
                        >
                          {category}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-shark-200">
                {/* Terms and Conditions - Required */}
                <div className="mb-4">
                  <Checkbox
                    isSelected={formData.agreeToTerms}
                    onValueChange={handleTermsChange}
                    size="sm"
                    classNames={{
                      base: "inline-flex w-full max-w-full items-start",
                      wrapper: "data-[selected=true]:bg-verdant-600 data-[selected=true]:border-verdant-600 before:border-verdant-600 group-data-[selected=true]:bg-verdant-600 group-data-[selected=true]:border-verdant-600 after:bg-verdant-600 data-[selected=true]:after:bg-verdant-600 group-data-[selected=true]:after:bg-verdant-600",
                      icon: "text-white data-[selected=true]:text-white",
                      label: "text-sm font-secondary text-shark-700 leading-relaxed ml-2",
                    }}
                  >
                    By creating an account, you agree to our{" "}
                    <a 
                      href="/terms-of-service" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-verdant-600 hover:text-verdant-700 underline font-medium"
                    >
                      Terms of Service
                    </a>
                    {" "}and{" "}
                    <a 
                      href="/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-verdant-600 hover:text-verdant-700 underline font-medium"
                    >
                      Privacy Policy
                    </a>
                    .
                  </Checkbox>
                  {errors.agreeToTerms && (
                    <p className="text-red-500 text-sm mt-2 ml-2">{errors.agreeToTerms}</p>
                  )}
                </div>
                
                <Button
                  color="primary"
                  size="lg"
                  className="w-full bg-verdant-600 hover:bg-verdant-700 font-primary rounded-lg tracking-[0.025rem] disabled:opacity-50 disabled:cursor-not-allowed"
                  onPress={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={isLoading || !formData.agreeToTerms}
                >
                  {isLoading ? "Saving Profile..." : "Complete Profile"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>

      {/* Institute OTP Modal */}
      <OTPModal
        isOpen={showInstituteOTP}
        onClose={handleInstituteVerificationCancel}
        email={formData.instituteEmail}
        onVerificationSuccess={handleInstituteVerificationSuccess}
        onRedirect={handleInstituteVerificationSuccess}
      />
    </div>
  );
};

export default VolunteerProfileForm;
