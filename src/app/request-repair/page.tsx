"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Gamepad2,
  User,
  ClipboardCheck,
  CheckCircle,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Types
interface FormData {
  // Step 1: Device Info
  deviceType: string;
  issueDescription: string;
  commonIssues: string[];
  // Step 2: Contact Info
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  // Step 3
  agreeToTerms: boolean;
}

interface FormErrors {
  [key: string]: string;
}

const DEVICE_TYPES = [
  "Nintendo Switch",
  "Nintendo 3DS",
  "PlayStation 5",
  "PlayStation 4",
  "Xbox Series X",
  "Xbox One",
  "Other",
];

const COMMON_ISSUES = [
  "Won't turn on",
  "Disc drive issues",
  "Controller drift",
  "HDMI/display problems",
  "Overheating",
  "Battery issues",
  "Other",
];

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
];

function generateConfirmationNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "ARB-";
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function RequestRepairPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [confirmationNumber, setConfirmationNumber] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    deviceType: "",
    issueDescription: "",
    commonIssues: [],
    fullName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    agreeToTerms: false,
  });

  const updateFormData = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const toggleCommonIssue = (issue: string) => {
    const current = formData.commonIssues;
    if (current.includes(issue)) {
      updateFormData(
        "commonIssues",
        current.filter((i) => i !== issue)
      );
    } else {
      updateFormData("commonIssues", [...current, issue]);
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.deviceType) {
      newErrors.deviceType = "Please select a device type";
    }
    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = "Please describe the issue with your device";
    } else if (formData.issueDescription.trim().length < 10) {
      newErrors.issueDescription = "Please provide more detail (at least 10 characters)";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state) {
      newErrors.state = "State is required";
    }
    if (!formData.zip.trim()) {
      newErrors.zip = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = "Please enter a valid ZIP code";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms of service";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleSubmit = () => {
    if (validateStep3()) {
      // Log the submission (for now, until database is added)
      console.log("Repair Request Submitted:", formData);

      // Generate confirmation number
      const confNum = generateConfirmationNumber();
      setConfirmationNumber(confNum);

      console.log("Confirmation Number:", confNum);

      // Show success state
      setIsSubmitted(true);
    }
  };

  const steps = [
    { number: 1, title: "Device Info", icon: Gamepad2 },
    { number: 2, title: "Contact Info", icon: User },
    { number: 3, title: "Review", icon: ClipboardCheck },
  ];

  // Success Screen
  if (isSubmitted) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-bg-light py-16 md:py-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-success" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
                Request Submitted!
              </h1>
              <p className="text-text-body text-lg mb-6">
                Thank you for choosing Arbafix for your repair needs.
              </p>
              <div className="bg-bg-light rounded-xl p-6 mb-8">
                <p className="text-sm text-text-body mb-2">Your confirmation number</p>
                <p className="text-2xl md:text-3xl font-bold text-primary tracking-wider">
                  {confirmationNumber}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-8 text-left">
                <h3 className="font-semibold text-text-dark mb-2">What happens next?</h3>
                <p className="text-text-body">
                  We&apos;ll email you within <span className="font-semibold">24 hours</span> with a
                  free quote and shipping instructions. Keep an eye on your inbox at{" "}
                  <span className="font-semibold">{formData.email}</span>.
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light py-12 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-text-dark">
              Request a Repair
            </h1>
            <p className="mt-3 text-text-body">
              Fill out the form below and we&apos;ll get back to you with a free quote.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-10">
            <div className="flex items-center justify-center">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${
                        currentStep > step.number
                          ? "bg-success border-success text-white"
                          : currentStep === step.number
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-gray-200 text-text-body"
                      }`}
                    >
                      {currentStep > step.number ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <step.icon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`mt-2 text-sm font-medium hidden sm:block ${
                        currentStep >= step.number ? "text-text-dark" : "text-text-body"
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 md:w-24 h-0.5 mx-2 ${
                        currentStep > step.number ? "bg-success" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-10">
            {/* Step 1: Device Information */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-text-dark mb-6">
                  Device Information
                </h2>

                {/* Device Type */}
                <div className="mb-6">
                  <label
                    htmlFor="deviceType"
                    className="block text-sm font-medium text-text-dark mb-2"
                  >
                    Device Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="deviceType"
                    value={formData.deviceType}
                    onChange={(e) => updateFormData("deviceType", e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg bg-white text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.deviceType ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="">Select your device...</option>
                    {DEVICE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.deviceType && (
                    <p className="mt-2 text-sm text-red-500">{errors.deviceType}</p>
                  )}
                </div>

                {/* Issue Description */}
                <div className="mb-6">
                  <label
                    htmlFor="issueDescription"
                    className="block text-sm font-medium text-text-dark mb-2"
                  >
                    Describe What&apos;s Wrong <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="issueDescription"
                    value={formData.issueDescription}
                    onChange={(e) => updateFormData("issueDescription", e.target.value)}
                    rows={4}
                    placeholder="Describe what's wrong with your device..."
                    className={`w-full px-4 py-3 border rounded-lg text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none ${
                      errors.issueDescription ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.issueDescription && (
                    <p className="mt-2 text-sm text-red-500">{errors.issueDescription}</p>
                  )}
                </div>

                {/* Common Issues */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-dark mb-3">
                    Common Issues (select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COMMON_ISSUES.map((issue) => (
                      <label
                        key={issue}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.commonIssues.includes(issue)
                            ? "border-primary bg-primary/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.commonIssues.includes(issue)}
                          onChange={() => toggleCommonIssue(issue)}
                          className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-text-dark">{issue}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-text-dark mb-6">
                  Contact Information
                </h2>

                {/* Full Name */}
                <div className="mb-5">
                  <label
                    htmlFor="fullName"
                    className="block text-sm font-medium text-text-dark mb-2"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => updateFormData("fullName", e.target.value)}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 border rounded-lg text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                      errors.fullName ? "border-red-500" : "border-gray-200"
                    }`}
                  />
                  {errors.fullName && (
                    <p className="mt-2 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-text-dark mb-2"
                    >
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john@example.com"
                      className={`w-full px-4 py-3 border rounded-lg text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                        errors.email ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-text-dark mb-2"
                    >
                      Phone Number <span className="text-text-body">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    />
                  </div>
                </div>

                {/* Shipping Address Section */}
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <h3 className="text-lg font-semibold text-text-dark mb-4">
                    Shipping Address
                  </h3>

                  {/* Street */}
                  <div className="mb-5">
                    <label
                      htmlFor="street"
                      className="block text-sm font-medium text-text-dark mb-2"
                    >
                      Street Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="street"
                      value={formData.street}
                      onChange={(e) => updateFormData("street", e.target.value)}
                      placeholder="123 Main St"
                      className={`w-full px-4 py-3 border rounded-lg text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                        errors.street ? "border-red-500" : "border-gray-200"
                      }`}
                    />
                    {errors.street && (
                      <p className="mt-2 text-sm text-red-500">{errors.street}</p>
                    )}
                  </div>

                  {/* City, State, ZIP Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="col-span-2 md:col-span-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        City <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        placeholder="Hershey"
                        className={`w-full px-4 py-3 border rounded-lg text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                          errors.city ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-500">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="state"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        State <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="state"
                        value={formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                        className={`w-full px-4 py-3 border rounded-lg bg-white text-text-dark focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                          errors.state ? "border-red-500" : "border-gray-200"
                        }`}
                      >
                        <option value="">State</option>
                        {US_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-2 text-sm text-red-500">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="zip"
                        className="block text-sm font-medium text-text-dark mb-2"
                      >
                        ZIP <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="zip"
                        value={formData.zip}
                        onChange={(e) => updateFormData("zip", e.target.value)}
                        placeholder="17033"
                        className={`w-full px-4 py-3 border rounded-lg text-text-dark placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                          errors.zip ? "border-red-500" : "border-gray-200"
                        }`}
                      />
                      {errors.zip && (
                        <p className="mt-2 text-sm text-red-500">{errors.zip}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Review & Submit */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-text-dark mb-6">
                  Review Your Request
                </h2>

                {/* Device Info Summary */}
                <div className="bg-bg-light rounded-xl p-5 mb-5">
                  <h3 className="text-sm font-semibold text-text-body uppercase tracking-wide mb-3">
                    Device Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-body">Device Type</span>
                      <span className="text-text-dark font-medium">{formData.deviceType}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-text-body block mb-1">Issue Description</span>
                      <p className="text-text-dark bg-white rounded-lg p-3 border border-gray-100">
                        {formData.issueDescription}
                      </p>
                    </div>
                    {formData.commonIssues.length > 0 && (
                      <div className="pt-2">
                        <span className="text-text-body block mb-2">Selected Issues</span>
                        <div className="flex flex-wrap gap-2">
                          {formData.commonIssues.map((issue) => (
                            <span
                              key={issue}
                              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                            >
                              {issue}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info Summary */}
                <div className="bg-bg-light rounded-xl p-5 mb-6">
                  <h3 className="text-sm font-semibold text-text-body uppercase tracking-wide mb-3">
                    Contact Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-body">Name</span>
                      <span className="text-text-dark font-medium">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-body">Email</span>
                      <span className="text-text-dark font-medium">{formData.email}</span>
                    </div>
                    {formData.phone && (
                      <div className="flex justify-between">
                        <span className="text-text-body">Phone</span>
                        <span className="text-text-dark font-medium">{formData.phone}</span>
                      </div>
                    )}
                    <div className="pt-2">
                      <span className="text-text-body block mb-1">Shipping Address</span>
                      <p className="text-text-dark">
                        {formData.street}
                        <br />
                        {formData.city}, {formData.state} {formData.zip}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="mb-6">
                  <label
                    className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.agreeToTerms
                        ? "border-primary bg-primary/5"
                        : errors.agreeToTerms
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateFormData("agreeToTerms", e.target.checked)}
                      className="w-5 h-5 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-text-dark">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        terms of service
                      </a>{" "}
                      and understand that Arbafix will contact me regarding my repair request.
                    </span>
                  </label>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-sm text-red-500">{errors.agreeToTerms}</p>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 px-5 py-3 text-text-body font-semibold hover:text-text-dark transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-md hover:shadow-lg"
                >
                  Continue
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-success text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Submit Request
                  <Check className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
