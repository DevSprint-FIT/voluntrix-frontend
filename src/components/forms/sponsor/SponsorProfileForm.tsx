"use client";

import { useState } from "react";
import { Button, Input, Textarea, Card, CardBody, Checkbox } from "@heroui/react";
import { motion } from "framer-motion";
import { Building2, User, Phone, Globe, Linkedin, MapPin, FileText } from "lucide-react";

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

interface SponsorFormData {
  company: string;
  jobTitle: string;
  mobileNumber: string;
  website: string;
  sponsorshipNote: string;
  documentUrl: File | null;
  linkedinProfile: string;
  address: string;
  agreeToTerms: boolean;
}

interface SponsorProfileFormProps {
  user: User;
  onSubmit: (formData: SponsorFormData) => Promise<void>;
  isLoading: boolean;
}

const SponsorProfileForm: React.FC<SponsorProfileFormProps> = ({ user, onSubmit, isLoading }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [documentFile, setDocumentFile] = useState<string | null>(null);

  const [formData, setFormData] = useState<SponsorFormData>({
    company: "",
    jobTitle: "",
    mobileNumber: "",
    website: "",
    sponsorshipNote: "",
    documentUrl: null,
    linkedinProfile: "",
    address: "",
    agreeToTerms: false
  });

  // Handle input changes
  const handleInputChange = (field: keyof SponsorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Handle document upload
  const handleDocumentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type and size
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, documentUrl: "Please select a PDF or Word document" }));
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(prev => ({ ...prev, documentUrl: "Document size should be less than 10MB" }));
        return;
      }

      setFormData(prev => ({ ...prev, documentUrl: file }));
      setErrors(prev => ({ ...prev, documentUrl: "" }));
      setDocumentFile(file.name);
    }
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
    
    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
    } else if (formData.company.length > 100) {
      newErrors.company = "Company name can have at most 100 characters";
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = "Job title is required";
    } else if (formData.jobTitle.length > 100) {
      newErrors.jobTitle = "Job title can have at most 100 characters";
    }
    
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits";
    }
    
    if (!formData.sponsorshipNote.trim()) {
      newErrors.sponsorshipNote = "Sponsorship note is required";
    } else if (formData.sponsorshipNote.length > 500) {
      newErrors.sponsorshipNote = "Sponsorship note can have at most 500 characters";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    } else if (formData.address.length > 255) {
      newErrors.address = "Address can have at most 255 characters";
    }
    
    // Validate website URL if provided
    if (formData.website.trim()) {
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlPattern.test(formData.website)) {
        newErrors.website = "Please enter a valid website URL";
      }
    }
    
    // Validate LinkedIn profile if provided
    if (formData.linkedinProfile.trim()) {
      if (!formData.linkedinProfile.includes('linkedin.com')) {
        newErrors.linkedinProfile = "Please enter a valid LinkedIn profile URL";
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
              {/* Professional Information - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Professional Information
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    placeholder="Enter your company name"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    isInvalid={!!errors.company}
                    errorMessage={errors.company}
                    size="lg"
                    isRequired
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                  <Input
                    label="Job Title"
                    placeholder="Enter your job title/position"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    isInvalid={!!errors.jobTitle}
                    errorMessage={errors.jobTitle}
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

              {/* Contact Information - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Mobile Number"
                    placeholder="Enter your 10-digit mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    isInvalid={!!errors.mobileNumber}
                    errorMessage={errors.mobileNumber}
                    size="lg"
                    isRequired
                    type="tel"
                    maxLength={10}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                  <Input
                    label="Address"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    isInvalid={!!errors.address}
                    errorMessage={errors.address}
                    size="lg"
                    isRequired
                    startContent={<MapPin className="w-4 h-4 text-shark-400" />}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                </div>
              </div>

              {/* Sponsorship Information - Required */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Sponsorship Information <span className="text-red-600">*</span>
                </h3>
                <Textarea
                  label="Sponsorship Note"
                  placeholder="Tell us about your sponsorship interests, preferred causes, budget range, and what impact you want to make through sponsorship..."
                  value={formData.sponsorshipNote}
                  onChange={(e) => handleInputChange("sponsorshipNote", e.target.value)}
                  isInvalid={!!errors.sponsorshipNote}
                  errorMessage={errors.sponsorshipNote}
                  minRows={4}
                  maxRows={6}
                  classNames={{
                    input: "font-primary text-shark-900 tracking-[0.025rem]",
                    label: "font-secondary text-shark-500 text-sm font-normal",
                  }}
                />
                <p className="text-xs text-shark-500 mt-1 font-primary tracking-[0.025rem]">
                  {formData.sponsorshipNote.length}/500 characters
                </p>
              </div>

              {/* Document Upload - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Supporting Document
                  <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                </h3>
                <div className="border-2 border-dashed border-shark-200 rounded-lg p-6 text-center hover:border-verdant-300 transition-colors">
                  <input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleDocumentChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="document-upload"
                    className="cursor-pointer block"
                  >
                    <FileText className="w-12 h-12 text-shark-400 mx-auto mb-3" />
                    {documentFile ? (
                      <div>
                        <p className="text-sm font-medium text-verdant-600 mb-1">{documentFile}</p>
                        <p className="text-xs text-shark-500">Click to change document</p>
                      </div>
                    ) : (
                      <div>
                        <p className="text-sm font-medium text-shark-700 mb-1">Upload Company Profile or Sponsorship Document</p>
                        <p className="text-xs text-shark-500">PDF, DOC, or DOCX up to 10MB</p>
                      </div>
                    )}
                  </label>
                  {errors.documentUrl && (
                    <p className="text-red-500 text-xs mt-2">{errors.documentUrl}</p>
                  )}
                </div>
              </div>

              {/* Online Presence - Optional */}
              <div>
                <h3 className="text-lg font-semibold text-shark-900 mb-4 font-secondary">
                  Online Presence
                  <span className="text-xs text-verdant-600 ml-2 font-primary font-medium tracking-[0.02rem]">(Optional)</span>
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Company Website"
                    placeholder="https://your-company.com"
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                    isInvalid={!!errors.website}
                    errorMessage={errors.website}
                    size="lg"
                    startContent={<Globe className="w-4 h-4 text-shark-400" />}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
                  <Input
                    label="LinkedIn Profile"
                    placeholder="https://linkedin.com/in/your-profile"
                    value={formData.linkedinProfile}
                    onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                    isInvalid={!!errors.linkedinProfile}
                    errorMessage={errors.linkedinProfile}
                    size="lg"
                    startContent={<Linkedin className="w-4 h-4 text-shark-400" />}
                    classNames={{
                      input: "font-primary text-shark-900 tracking-[0.025rem]",
                      label: "font-secondary text-shark-500 text-sm font-normal",
                      inputWrapper: "py-3",
                    }}
                  />
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
                Sponsor Summary
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
                
                {formData.company && (
                  <div>
                    <p className="text-shark-500 font-secondary">Company</p>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{formData.company}</p>
                  </div>
                )}
                
                {formData.jobTitle && (
                  <div>
                    <p className="text-shark-500 font-secondary">Position</p>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{formData.jobTitle}</p>
                  </div>
                )}
                
                {formData.mobileNumber && (
                  <div>
                    <p className="text-shark-500 font-secondary">Mobile</p>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium">{formData.mobileNumber}</p>
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
                
                {formData.linkedinProfile && (
                  <div>
                    <p className="text-shark-500 font-secondary">LinkedIn</p>
                    <a 
                      href={formData.linkedinProfile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-verdant-600 hover:text-verdant-700 underline font-primary tracking-[0.025rem] font-medium flex items-center"
                    >
                      <Linkedin className="w-3 h-3 mr-1" />
                      View Profile
                    </a>
                  </div>
                )}
                
                {documentFile && (
                  <div>
                    <p className="text-shark-500 font-secondary">Document</p>
                    <p className="text-shark-800 font-primary tracking-[0.025rem] font-medium flex items-center">
                      <FileText className="w-3 h-3 mr-1" />
                      {documentFile}
                    </p>
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
                  {isLoading ? "Saving Profile..." : "Complete Sponsor Profile"}
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default SponsorProfileForm;
