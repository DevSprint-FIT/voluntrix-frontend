"use client";

import { useState } from "react";
import { Button, Input, Avatar, Textarea, Card, CardBody, Checkbox } from "@heroui/react";
import { motion } from "framer-motion";
import { Camera, Building2, User, CreditCard, Globe, Facebook, Linkedin, Instagram, FileText, Upload, X } from "lucide-react";

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

interface OrganizationFormData {
  phone: string;
  institute: string;
  imageUrl: File | null;
  bankName: string;
  accountNumber: string;
  description: string;
  website: string;
  facebookLink: string;
  linkedinLink: string;
  instagramLink: string;
  verificationDocument: File | null;
  agreeToTerms: boolean;
}

interface OrganizationProfileFormProps {
  user: User;
  onSubmit: (formData: OrganizationFormData) => Promise<void>;
  isLoading: boolean;
}

const OrganizationProfileForm: React.FC<OrganizationProfileFormProps> = ({ user, onSubmit, isLoading }) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<OrganizationFormData>({
    phone: "",
    institute: "",
    imageUrl: null,
    bankName: "",
    accountNumber: "",
    description: "",
    website: "",
    facebookLink: "",
    linkedinLink: "",
    instagramLink: "",
    verificationDocument: null,
    agreeToTerms: false
  });

  // Handle input changes
  const handleInputChange = (field: keyof OrganizationFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle profile picture upload
  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, imageUrl: "Please select a valid image file" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, imageUrl: "Image size should be less than 5MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, imageUrl: file }));
      setErrors(prev => ({ ...prev, imageUrl: "" }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle verification document upload
  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type (allow PDFs, images, and common document formats)
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, verificationDocument: "Please upload PDF, DOC, DOCX, or image files only" }));
        return;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, verificationDocument: "File should be less than 10MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, verificationDocument: file }));
      setErrors(prev => ({ ...prev, verificationDocument: "" }));
    }
  };

  // Handle document removal
  const handleDocumentRemove = () => {
    setFormData(prev => ({ ...prev, verificationDocument: null }));
  };

  // Format file size for display
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle terms agreement
  const handleTermsChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
    if (errors.agreeToTerms) {
      setErrors(prev => ({ ...prev, agreeToTerms: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    
    if (!formData.institute.trim()) {
      newErrors.institute = "Organization/Institute name is required";
    }
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = "Bank name is required";
    }
    
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account number is required";
    } else if (!/^\d{8,20}$/.test(formData.accountNumber.replace(/\s/g, ''))) {
      newErrors.accountNumber = "Please enter a valid account number (8-20 digits)";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Organization description is required";
    } else if (formData.description.trim().length < 100) {
      newErrors.description = "Please provide at least 100 characters about your organization";
    }
    
    // Validate website URL if provided
    if (formData.website.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.website)) {
        newErrors.website = "Please enter a valid website URL";
      }
    }
    
    // Validate social media links if provided
    if (formData.facebookLink.trim()) {
      if (!formData.facebookLink.includes('facebook.com') && !formData.facebookLink.includes('fb.com')) {
        newErrors.facebookLink = "Please enter a valid Facebook URL";
      }
    }
    
    if (formData.linkedinLink.trim()) {
      if (!formData.linkedinLink.includes('linkedin.com')) {
        newErrors.linkedinLink = "Please enter a valid LinkedIn URL";
      }
    }
    
    if (formData.instagramLink.trim()) {
      if (!formData.instagramLink.includes('instagram.com')) {
        newErrors.instagramLink = "Please enter a valid Instagram URL";
      }
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
            <div className="space-y-8">
              {/* Organization Logo - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Organization Logo
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
                      htmlFor="organization-logo"
                      className="absolute -bottom-2 -right-2 bg-verdant-600 hover:bg-verdant-700 text-white rounded-full p-2 cursor-pointer transition-colors"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="organization-logo"
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <p className="text-sm text-shark-600 font-primary mb-1 tracking-[0.025rem]">
                      Upload your organization logo to help volunteers recognize you
                    </p>
                    <p className="text-xs text-shark-500 font-secondary">
                      JPG, PNG, or GIF. Max file size 5MB.
                    </p>
                    {errors.imageUrl && (
                      <p className="text-red-500 text-xs mt-1">{errors.imageUrl}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Basic Information - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Organization/Institute Name"
                    placeholder="Enter your organization name"
                    value={formData.institute}
                    onChange={(e) => handleInputChange("institute", e.target.value)}
                    isInvalid={!!errors.institute}
                    errorMessage={errors.institute}
                    size="lg"
                    isRequired
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                  <Input
                    label="Phone Number"
                    placeholder="Enter organization phone number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    isInvalid={!!errors.phone}
                    errorMessage={errors.phone}
                    size="lg"
                    isRequired
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                </div>
              </div>

              {/* Banking Information - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Banking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Bank Name"
                    placeholder="Enter your bank name"
                    value={formData.bankName}
                    onChange={(e) => handleInputChange("bankName", e.target.value)}
                    isInvalid={!!errors.bankName}
                    errorMessage={errors.bankName}
                    size="lg"
                    isRequired
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                  <Input
                    label="Account Number"
                    placeholder="Enter your account number"
                    value={formData.accountNumber}
                    onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                    isInvalid={!!errors.accountNumber}
                    errorMessage={errors.accountNumber}
                    size="lg"
                    isRequired
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                </div>
                <p className="text-xs text-shark-500 mt-2 font-primary tracking-[0.025rem]">
                  Banking information is required for donation processing and payments
                </p>
              </div>

              {/* Organization Description - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Organization Description <span className="text-red-600">*</span>
                </h3>
                <Textarea
                  label="Tell us about your organization"
                  placeholder="Share your organizations mission, vision, activities, impact, and what makes you passionate about your cause..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  isInvalid={!!errors.description}
                  errorMessage={errors.description}
                  minRows={4}
                  maxRows={6}
                  classNames={{
                    input: "font-primary text-shark-900 tracking-[0.025rem]",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                  }}
                />
                <p className="text-xs text-shark-500 mt-1 font-primary tracking-[0.025rem]">
                  {formData.description.length}/1000 characters (minimum 100 required)
                </p>
              </div>

              {/* Website - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Website
                  <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                </h3>
                <Input
                  label="Organization Website"
                  placeholder="https://your-organization.com"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  isInvalid={!!errors.website}
                  errorMessage={errors.website}
                  size="lg"
                  classNames={{
                    input: "font-primary text-shark-900 tracking-[0.025rem]",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                    inputWrapper: "py-3",
                  }}
                />
              </div>

              {/* Social Media Links - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Social Media Links
                  <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Facebook Page"
                    placeholder="https://facebook.com/your-organization"
                    value={formData.facebookLink}
                    onChange={(e) => handleInputChange("facebookLink", e.target.value)}
                    isInvalid={!!errors.facebookLink}
                    errorMessage={errors.facebookLink}
                    size="lg"
                    startContent={<Facebook className="w-4 h-4 text-shark-400" />}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                  <Input
                    label="LinkedIn Page"
                    placeholder="https://linkedin.com/company/your-organization"
                    value={formData.linkedinLink}
                    onChange={(e) => handleInputChange("linkedinLink", e.target.value)}
                    isInvalid={!!errors.linkedinLink}
                    errorMessage={errors.linkedinLink}
                    size="lg"
                    startContent={<Linkedin className="w-4 h-4 text-shark-400" />}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                  <Input
                    label="Instagram Page"
                    placeholder="https://instagram.com/your-organization"
                    value={formData.instagramLink}
                    onChange={(e) => handleInputChange("instagramLink", e.target.value)}
                    isInvalid={!!errors.instagramLink}
                    errorMessage={errors.instagramLink}
                    size="lg"
                    startContent={<Instagram className="w-4 h-4 text-shark-400" />}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                </div>
              </div>

              {/* Verification Document - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Verification Document
                  <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                </h3>
                <div className="space-y-4">
                  {!formData.verificationDocument ? (
                    <div className="border-2 border-dashed border-shark-300 rounded-lg p-6 hover:border-verdant-400 transition-colors">
                      <div className="text-center">
                        <p className="text-sm text-shark-600 font-primary mb-1 tracking-[0.025rem]">
                          Upload a document to verify your organization
                        </p>
                        <p className="text-xs text-shark-500 font-secondary mb-3">
                          Registration certificate, tax exemption letter, or other official documents
                        </p>
                        <label
                          htmlFor="verification-document"
                          className="inline-flex items-center px-4 py-2 bg-verdant-600 hover:bg-verdant-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </label>
                        <input
                          id="verification-document"
                          type="file"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleDocumentUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="text-xs text-shark-500 text-center mt-2 font-secondary">
                        Supported formats: PDF, DOC, DOCX, JPG, PNG • Max 10MB
                      </p>
                      {errors.verificationDocument && (
                        <p className="text-red-500 text-sm text-center mt-2">{errors.verificationDocument}</p>
                      )}
                    </div>
                  ) : (
                    <div className="border border-shark-200 rounded-lg p-4 bg-shark-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-verdant-600" />
                          <div>
                            <p className="text-sm font-medium text-shark-800 font-primary tracking-[0.025rem]">
                              {formData.verificationDocument.name}
                            </p>
                            <p className="text-xs text-shark-500 font-secondary">
                              {formatFileSize(formData.verificationDocument.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="text-shark-400 hover:text-red-500 hover:bg-red-50"
                          onPress={handleDocumentRemove}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-shark-500 font-primary tracking-[0.025rem] mt-2">
                        This document will be reviewed by our team for organization verification
                      </p>
                    </div>
                  )}
                </div>
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
                Organization Summary
              </h3>
              
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-shark-500 font-secondary">Contact Person</p>
                  <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{user?.fullName}</p>
                </div> 
                
                <div>
                  <p className="text-shark-500 font-secondary">Email</p>
                  <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{user?.email}</p>
                </div>
                
                {formData.institute && (
                  <div>
                    <p className="text-shark-500 font-secondary">Organization</p>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{formData.institute}</p>
                  </div>
                )}
                
                {formData.phone && (
                  <div>
                    <p className="text-shark-500 font-secondary">Phone</p>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{formData.phone}</p>
                  </div>
                )}
                
                {formData.website && (
                  <div>
                    <p className="text-shark-500 font-secondary">Website</p>
                    <a 
                      href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-verdant-600 hover:text-verdant-700 underline font-primary tracking-[0.025rem] font-medium"
                    >
                      {formData.website}
                    </a>
                  </div>
                )}
                
                {(formData.facebookLink || formData.linkedinLink || formData.instagramLink) && (
                  <div>
                    <p className="text-shark-500 font-secondary">Social Media</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {formData.facebookLink && (
                        <a 
                          href={formData.facebookLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-verdant-600 hover:text-verdant-700"
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {formData.linkedinLink && (
                        <a 
                          href={formData.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-verdant-600 hover:text-verdant-700"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {formData.instagramLink && (
                        <a 
                          href={formData.instagramLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-verdant-600 hover:text-verdant-700"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
                
                {formData.verificationDocument && (
                  <div>
                    <p className="text-shark-500 font-secondary">Verification Document</p>
                    <div className="flex items-center mt-1">
                      <FileText className="w-3 h-3 mr-1 text-verdant-600" />
                      <span className="text-shark-800 font-primary tracking-[0.025rem] font-medium text-sm truncate">
                        {formData.verificationDocument.name.length > 25 
                          ? formData.verificationDocument.name.substring(0, 25) + '...' 
                          : formData.verificationDocument.name}
                      </span>
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
                  {isLoading ? "Saving Profile..." : "Complete Organization Profile"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizationProfileForm;
