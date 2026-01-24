"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    subject: "General Question",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const subjectOptions = [
    "General Question",
    "Repair Inquiry",
    "Quote Request",
    "Warranty Claim",
    "Other",
  ];

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Question",
        message: "",
      });
    } catch (error) {
      setSubmitStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-bg-light">
        {/* Hero Section */}
        <section className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-3xl md:text-4xl font-bold text-text-dark mb-4">
                Contact Us
              </h1>
              <p className="text-lg text-text-body">
                Have a question about your console repair? We&apos;re here to help.
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-text-dark mb-6">
                    Send Us a Message
                  </h2>

                  {submitStatus === "success" ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-text-dark mb-2">
                        Message Sent!
                      </h3>
                      <p className="text-text-body mb-6">
                        Thanks for reaching out! We&apos;ll get back to you within 24 hours.
                      </p>
                      <button
                        onClick={() => setSubmitStatus("idle")}
                        className="text-primary hover:text-primary-dark font-medium"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      {submitStatus === "error" && (
                        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                          <p className="text-red-700 text-sm">{errorMessage}</p>
                        </div>
                      )}

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div>
                          <label
                            htmlFor="name"
                            className="block text-sm font-medium text-text-dark mb-2"
                          >
                            Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.name
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-200 focus:ring-primary focus:border-primary"
                            } focus:outline-none focus:ring-2 transition-colors`}
                            placeholder="Your name"
                          />
                          {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium text-text-dark mb-2"
                          >
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 rounded-lg border ${
                              errors.email
                                ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                                : "border-gray-200 focus:ring-primary focus:border-primary"
                            } focus:outline-none focus:ring-2 transition-colors`}
                            placeholder="you@example.com"
                          />
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Phone */}
                        <div>
                          <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-text-dark mb-2"
                          >
                            Phone <span className="text-text-body">(optional)</span>
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary focus:outline-none focus:ring-2 transition-colors"
                            placeholder="(555) 123-4567"
                          />
                        </div>

                        {/* Subject */}
                        <div>
                          <label
                            htmlFor="subject"
                            className="block text-sm font-medium text-text-dark mb-2"
                          >
                            Subject
                          </label>
                          <select
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-primary focus:border-primary focus:outline-none focus:ring-2 transition-colors bg-white"
                          >
                            {subjectOptions.map((option) => (
                              <option key={option} value={option}>
                                {option}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Message */}
                      <div>
                        <label
                          htmlFor="message"
                          className="block text-sm font-medium text-text-dark mb-2"
                        >
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className={`w-full px-4 py-3 rounded-lg border ${
                            errors.message
                              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                              : "border-gray-200 focus:ring-primary focus:border-primary"
                          } focus:outline-none focus:ring-2 transition-colors resize-none`}
                          placeholder="Tell us about your console issue or question..."
                        />
                        {errors.message && (
                          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Send Message
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>

              {/* Contact Info Sidebar */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 sticky top-24">
                  <h2 className="text-2xl font-bold text-text-dark mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-6">
                    {/* Email */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-dark mb-1">Email</h3>
                        <a
                          href="mailto:repairs@arbafix.com"
                          className="text-text-body hover:text-primary transition-colors"
                        >
                          repairs@arbafix.com
                        </a>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-dark mb-1">Phone</h3>
                        <a
                          href="tel:+15704198540"
                          className="text-text-body hover:text-primary transition-colors"
                        >
                          (570) 419-8540
                        </a>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-dark mb-1">Location</h3>
                        <p className="text-text-body">
                          Serving Hershey, PA &<br />
                          Surrounding Areas
                        </p>
                      </div>
                    </div>

                    {/* Business Hours */}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Clock className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-text-dark mb-1">Business Hours</h3>
                        <div className="text-text-body space-y-1">
                          <p>Monday - Friday: 9am - 6pm</p>
                          <p>Saturday: 10am - 4pm</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Response Note */}
                  <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <p className="text-sm text-text-body">
                      <span className="font-semibold text-text-dark">Quick Response:</span>{" "}
                      We typically respond to all inquiries within 24 hours during business days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
