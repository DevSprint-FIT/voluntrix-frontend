"use client";

import { useState } from "react";
import { Button, Input, Select, SelectItem, Avatar, Textarea, Card, CardBody, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import { Camera, Mail, Phone, Building2, User } from "lucide-react";
import OTPModal from "@/components/UI/OTPModal";

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

interface VolunteerFormData {
  institute: string;
  instituteEmail: string;
  isAvailable: string;
  about: string;
  profilePicture: File | null;
  phoneNumber: string;
  selectedCategories: string[];
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

const availabilityOptions = [
  { key: "full-time", label: "Full Time" },
  { key: "part-time", label: "Part Time" },
  { key: "weekends", label: "Weekends Only" },
  { key: "flexible", label: "Flexible" }
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
    institute: "",
    instituteEmail: "",
    isAvailable: "",
    about: "",
    profilePicture: null,
    phoneNumber: "",
    selectedCategories: []
  });

  // Handle input changes
  const handleInputChange = (field: keyof VolunteerFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }

    // If institute name is cleared, reset institute verification
    if (field === 'institute' && !value.trim()) {
      setIsInstituteVerified(false);
      setFormData(prev => ({ ...prev, instituteEmail: "" }));
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

  // Handle remove category
  const handleRemoveCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      selectedCategories: prev.selectedCategories.filter(c => c !== category)
    }));
  };

  // Handle institute verification
  const handleInstituteVerification = () => {
    if (!formData.institute.trim()) {
      setErrors(prev => ({ ...prev, institute: "Please enter institute name first" }));
      return;
    }
    if (!formData.instituteEmail.trim()) {
      setErrors(prev => ({ ...prev, instituteEmail: "Please enter institute email" }));
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
    setFormData(prev => ({ ...prev, institute: "", instituteEmail: "" }));
    setIsInstituteVerified(false);
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Institute information is optional, but if provided, must be verified
    if (formData.institute.trim() && formData.instituteEmail.trim() && !isInstituteVerified) {
      newErrors.general = "Please verify your institute email first";
    }
    
    if (formData.instituteEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.instituteEmail)) {
      newErrors.instituteEmail = "Please enter a valid email address";
    }
    
    if (!formData.isAvailable) {
      newErrors.isAvailable = "Please select your availability";
    }
    
    if (!formData.about.trim()) {
      newErrors.about = "Please tell us about yourself";
    } else if (formData.about.trim().length < 50) {
      newErrors.about = "Please provide at least 50 characters about yourself";
    }
    
    // Phone number is optional, but if provided, must be valid
    if (formData.phoneNumber.trim() && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }
    
    if (formData.selectedCategories.length === 0) {
      newErrors.categories = "Please select at least one interest category";
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
                <p className="text-red-600 text-sm font-primary">{errors.general}</p>
              </div>
            )}

            <div className="space-y-8">
              {/* Profile Picture Section - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-950 mb-4 font-secondary flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Picture
                  <span className="text-xs text-shark-500 ml-2 font-primary">(Optional)</span>
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
                    <p className="text-sm text-shark-600 font-primary mb-1">
                      Upload a profile picture to help organizations recognize you
                    </p>
                    <p className="text-xs text-shark-500 font-primary">
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
                <h3 className="text-lg font-semibold text-shark-950 mb-4 font-secondary flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Institute Information
                  <span className="text-xs text-shark-500 ml-2 font-primary">(Optional)</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Institute/University Name"
                    placeholder="Enter your institute name"
                    value={formData.institute}
                    onChange={(e) => handleInputChange("institute", e.target.value)}
                    isInvalid={!!errors.institute}
                    errorMessage={errors.institute}
                    size="lg"
                    isDisabled={isInstituteVerified}
                    classNames={{
                      input: "font-primary text-shark-900",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                    endContent={isInstituteVerified && (
                      <div className="text-green-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  />
                  <div>
                    <Input
                      label="Institute Email"
                      type="email"
                      placeholder="Enter institute email"
                      value={formData.instituteEmail}
                      onChange={(e) => handleInputChange("instituteEmail", e.target.value)}
                      isInvalid={!!errors.instituteEmail}
                      errorMessage={errors.instituteEmail}
                      size="lg"
                      isDisabled={isInstituteVerified}
                      classNames={{
                        input: "font-primary text-shark-900",
                        label: "font-secondary text-shark-500 text-sm font-normal",
                        inputWrapper: "py-3",
                      }}
                    />
                    {!isInstituteVerified && formData.institute.trim() && formData.instituteEmail.trim() ? (
                      <Button
                        size="sm"
                        className="mt-2 bg-verdant-600 text-white font-primary"
                        onPress={handleInstituteVerification}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Verify Institute
                      </Button>
                    ) : isInstituteVerified ? (
                      <p className="text-green-600 text-xs mt-2 font-primary flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Institute verified successfully
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Contact Information - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-950 mb-4 font-secondary flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                  <span className="text-xs text-shark-500 ml-2 font-primary">(Optional)</span>
                </h3>
                <Input
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  isInvalid={!!errors.phoneNumber}
                  errorMessage={errors.phoneNumber}
                  size="lg"
                  classNames={{
                    input: "font-primary text-shark-900",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                    inputWrapper: "py-3",
                  }}
                />
              </div>

              {/* Availability - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-950 mb-4 font-secondary">
                  Availability *
                </h3>
                <Select
                  label="When are you available to volunteer?"
                  placeholder="Select your availability"
                  selectedKeys={formData.isAvailable ? [formData.isAvailable] : []}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as string;
                    handleInputChange("isAvailable", selected || "");
                  }}
                  isInvalid={!!errors.isAvailable}
                  errorMessage={errors.isAvailable}
                  size="lg"
                  classNames={{
                    label: "font-secondary text-shark-500 text-sm font-normal",
                    trigger: "py-3",
                  }}
                >
                  {availabilityOptions.map((option) => (
                    <SelectItem key={option.key} value={option.key}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              {/* About Section - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-950 mb-4 font-secondary">
                  About Yourself *
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
                    input: "font-primary text-shark-900",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                  }}
                />
                <p className="text-xs text-shark-500 mt-1 font-primary">
                  {formData.about.length}/500 characters (minimum 50 required)
                </p>
              </div>

              {/* Interest Categories - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-950 mb-4 font-secondary">
                  Interest Categories *
                </h3>
                <p className="text-sm text-shark-600 mb-4 font-primary">
                  Select the areas you&apos;re interested in volunteering for:
                </p>
                
                {/* Category Selection Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                  {interestCategories.map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => handleCategoryToggle(category)}
                      className={`p-3 rounded-lg border-2 transition-all text-left text-sm font-primary ${
                        formData.selectedCategories.includes(category)
                          ? 'border-verdant-500 bg-verdant-50 text-verdant-800'
                          : 'border-shark-200 bg-white hover:border-shark-300 text-shark-700'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                {/* Selected Categories Display */}
                {formData.selectedCategories.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-shark-700 mb-2 font-secondary">
                      Selected Categories:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {formData.selectedCategories.map((category) => (
                        <Chip
                          key={category}
                          onClose={() => handleRemoveCategory(category)}
                          variant="flat"
                          color="success"
                          className="bg-verdant-100 text-verdant-800 font-primary"
                        >
                          {category}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
                
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
              <h3 className="text-lg font-semibold text-shark-950 mb-4 font-secondary">
                Profile Summary
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-shark-700 font-secondary">Full Name</p>
                  <p className="text-shark-600 font-primary">{user?.fullName}</p>
                </div>
                
                <div>
                  <p className="font-medium text-shark-700 font-secondary">Email</p>
                  <p className="text-shark-600 font-primary">{user?.email}</p>
                </div>
                
                {formData.institute && (
                  <div>
                    <p className="font-medium text-shark-700 font-secondary">Institute</p>
                    <p className="text-shark-600 font-primary">{formData.institute}</p>
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
                
                {formData.isAvailable && (
                  <div>
                    <p className="font-medium text-shark-700 font-secondary">Availability</p>
                    <p className="text-shark-600 font-primary">
                      {availabilityOptions.find(opt => opt.key === formData.isAvailable)?.label}
                    </p>
                  </div>
                )}
                
                {formData.selectedCategories.length > 0 && (
                  <div>
                    <p className="font-medium text-shark-700 font-secondary">Interests</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {formData.selectedCategories.map((category) => (
                        <Chip
                          key={category}
                          size="sm"
                          variant="flat"
                          color="success"
                          className="bg-verdant-100 text-verdant-800 text-xs font-primary"
                        >
                          {category}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-4 border-t border-shark-200">
                <Button
                  color="primary"
                  size="lg"
                  className="w-full bg-verdant-600 hover:bg-verdant-700 font-primary rounded-lg"
                  onPress={handleSubmit}
                  isLoading={isLoading}
                  isDisabled={isLoading}
                >
                  {isLoading ? "Saving Profile..." : "Complete Profile"}
                </Button>
                <p className="text-xs text-shark-500 mt-2 text-center font-primary">
                  Make sure all information is correct before submitting
                </p>
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
