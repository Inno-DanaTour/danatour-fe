import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  MapPin,
  Globe,
  User,
  Briefcase,
  Phone,
  Mail,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  FileCheck,
  CheckCircle,
} from "lucide-react";
import Header from "../../../components/layout/Header";
import { api } from "../../../configs/api";

interface ProviderApplicationResponse {
  id: number | string;
  [key: string]: unknown;
}

interface FormState {
  companyName: string;
  taxCode: string;
  businessAddress: string;
  websiteUrl: string;
  representativeName: string;
  representativePosition: string;
  contactPhone: string;
  contactEmail: string;
  citizenId: string;
  description: string;
}

const TABS = [
  {
    id: 0,
    title: "Business Information",
    icon: Building2,
    description: "Company details & address",
  },
  {
    id: 1,
    title: "Representative",
    icon: User,
    description: "Contact & role details",
  },
  {
    id: 2,
    title: "Legal Documents",
    icon: FileText,
    description: "Licenses & verifications",
  },
];

const ProviderOnboarding: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FormState>({
    companyName: "",
    taxCode: "",
    businessAddress: "",
    websiteUrl: "",
    representativeName: "",
    representativePosition: "",
    contactPhone: "",
    contactEmail: "",
    citizenId: "",
    description: "",
  });

  const [files, setFiles] = useState<{
    selectedFile: File | null;
  }>({
    selectedFile: null,
  });

  const [selectedDocType, setSelectedDocType] = useState<string>("TAX_NUMBER");

  const DOC_TYPES = [
    { id: "TAX_NUMBER", label: "Tax Number", icon: FileText },
    { id: "CITIZEN_ID", label: "Citizen ID / Passport", icon: User },
    { id: "BUSINESS_LICENSE", label: "Business License", icon: Building2 },
    { id: "TRAVEL_LICENSE", label: "Travel Business License", icon: Briefcase },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFiles({ selectedFile: e.target.files[0] });
    }
  };

  const validateTab = (tabIndex: number): boolean => {
    if (tabIndex === 0) {
      return !!(
        formData.companyName &&
        formData.taxCode &&
        formData.businessAddress &&
        formData.description
      );
    }
    if (tabIndex === 1) {
      return !!(
        formData.representativeName &&
        formData.contactPhone &&
        formData.contactEmail &&
        formData.citizenId
      );
    }
    if (tabIndex === 2) {
      return !!files.selectedFile;
    }
    return true;
  };

  const isTabCompleted = (tabIndex: number): boolean => {
    return validateTab(tabIndex);
  };

  const handleNext = () => {
    if (activeTab < TABS.length - 1) {
      setActiveTab((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 1. Validate dữ liệu
    if (!validateTab(0) || !validateTab(1) || !validateTab(2)) {
      setError("Please complete all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      // The backend uses @ModelAttribute (multipart/form-data) with files + text fields
      // combined in one request — so we send everything in a single FormData payload.
      const payload = new FormData();
      // JSON Bundle Strategy: Combine all text fields into one JSON Blob part
      const infoPayload = {
        companyName: formData.companyName,
        taxCode: formData.taxCode,
        citizenId: formData.citizenId,
        businessAddress: formData.businessAddress,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        description: formData.description,
        websiteUrl: formData.websiteUrl,
        representativeName: formData.representativeName,
        representativePosition: formData.representativePosition,
      };

      payload.append(
        "info",
        new Blob([JSON.stringify(infoPayload)], { type: "application/json" }),
      );

      // Append file part separately
      if (files.selectedFile) {
        const fieldMap: Record<string, string> = {
          TAX_NUMBER: "taxNumber",
          CITIZEN_ID: "representativeIdCard",
          BUSINESS_LICENSE: "businessLicense",
          TRAVEL_LICENSE: "travelLicense",
        };
        payload.append(fieldMap[selectedDocType], files.selectedFile);
      }

      await api.postMultipart<ProviderApplicationResponse>(
        "/provider-applications",
        payload,
      );

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit application.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-primary/10 max-w-lg w-full border border-primary/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 border-4 border-white shadow-xl">
            <CheckCircle2 size={48} />
          </div>
          <h1 className="text-3xl font-black text-gray-900 mb-4 uppercase tracking-tight">
            Application Submitted!
          </h1>
          <p className="text-gray-500 font-medium mb-10 leading-relaxed">
            Your application to become a Tour Provider has been received. Our
            admin team will review your documents and notify you via email
            within 2-3 business days.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            RETURN TO HOME
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-primary/20">
      <Header onBookClick={() => navigate("/tours")} />

      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl opacity-50" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-3xl opacity-50" />
      </div>

      <main className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto relative z-10 flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar Navigation */}
        <aside className="lg:w-1/3 xl:w-1/4 shrink-0">
          <div className="sticky top-32">
            <div className="mb-8 p-2">
              <motion.div
                c
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary text-xs font-black uppercase tracking-widest border border-primary/10 shadow-sm mb-4"
              >
                <Building2 size={14} />
                Partner Program
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl font-black text-gray-900 tracking-tight leading-tight"
              >
                Become a <span className="text-primary">Provider</span>
              </motion.h1>
            </div>

            <nav className="space-y-3">
              {TABS.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = activeTab === idx;
                const isCompleted = isTabCompleted(idx) && activeTab !== idx;

                return (
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(idx)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? "bg-white shadow-xl shadow-black/5 border-transparent ring-1 ring-primary/20 scale-[1.02]"
                        : "hover:bg-white/60 text-gray-500 border border-transparent hover:border-gray-200"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary"
                      />
                    )}

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? "bg-gradient-to-br from-primary/10 to-secondary/10 text-primary"
                          : isCompleted
                            ? "bg-green-50 text-green-500"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle size={24} />
                      ) : (
                        <Icon size={24} />
                      )}
                    </div>

                    <div>
                      <h3
                        className={`font-black text-sm tracking-tight transition-colors ${isActive ? "text-gray-900" : ""}`}
                      >
                        {tab.title}
                      </h3>
                      <p
                        className={`text-xs font-medium transition-colors ${isActive ? "text-gray-500" : "text-gray-400"}`}
                      >
                        {tab.description}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:w-2/3 xl:w-3/4">
          <form
            onSubmit={handleSubmit}
            className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-6 lg:p-12 shadow-2xl shadow-black/5 border border-white relative overflow-hidden min-h-[600px] flex flex-col"
          >
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-100 p-5 rounded-2xl flex items-center gap-4 text-red-600 mb-8 z-10 relative"
                >
                  <AlertCircle size={24} className="shrink-0" />
                  <p className="font-bold text-sm tracking-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex-grow relative">
              <AnimatePresence mode="wait">
                {activeTab === 0 && (
                  <motion.div
                    key="tab0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">
                        Business Information
                      </h2>
                      <p className="text-gray-500 text-sm font-medium">
                        Tell us about your company and where you're registered.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Building2 size={14} /> Company Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="companyName"
                          required
                          placeholder="e.g. Danatour Travel JSC"
                          value={formData.companyName}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <FileText size={14} /> Tax Code{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="taxCode"
                          required
                          placeholder="e.g. 0401234567"
                          value={formData.taxCode}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <MapPin size={14} /> Business Address{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="businessAddress"
                          required
                          rows={3}
                          placeholder="Enter full registered business address"
                          value={formData.businessAddress}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Globe size={14} /> Website URL{" "}
                          <span className="text-gray-400 font-medium ml-1">
                            (Optional)
                          </span>
                        </label>
                        <input
                          type="url"
                          name="websiteUrl"
                          placeholder="e.g. https://www.yourcompany.com"
                          value={formData.websiteUrl}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <FileText size={14} /> Company Description{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          required
                          rows={4}
                          placeholder="Tell us about your company and travel services"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300 resize-none"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    key="tab1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">
                        Representative Contact
                      </h2>
                      <p className="text-gray-500 text-sm font-medium">
                        Who should we contact regarding this application?
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <User size={14} /> Full Name{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="representativeName"
                          required
                          placeholder="Legal representative name"
                          value={formData.representativeName}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Briefcase size={14} /> Position
                        </label>
                        <input
                          type="text"
                          name="representativePosition"
                          placeholder="e.g. CEO, Director"
                          value={formData.representativePosition}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Phone size={14} /> Contact Phone{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="contactPhone"
                          required
                          placeholder="+84 901 234 567"
                          value={formData.contactPhone}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <Mail size={14} /> Business Email{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="contactEmail"
                          required
                          placeholder="email@company.com"
                          value={formData.contactEmail}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                          <User size={14} /> Citizen ID / ID Card Number{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="citizenId"
                          required
                          placeholder="Representative's Citizen ID number"
                          value={formData.citizenId}
                          onChange={handleInputChange}
                          className="w-full px-5 py-4 bg-slate-50/50 rounded-2xl border border-gray-100 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    key="tab2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 mb-2">
                        Legal Documents
                      </h2>
                      <p className="text-gray-500 text-sm font-medium">
                        Select one document type and upload the scan for
                        verification. (Formats: JPG, PNG, PDF. Max 10MB)
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* Document Type Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {DOC_TYPES.map((type) => (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => {
                              setSelectedDocType(type.id);
                              setFiles({ selectedFile: null });
                            }}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                              selectedDocType === type.id
                                ? "border-primary bg-primary/5 ring-4 ring-primary/5"
                                : "border-gray-100 hover:border-gray-200"
                            }`}
                          >
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                selectedDocType === type.id
                                  ? "bg-primary text-white"
                                  : "bg-gray-100 text-gray-400"
                              }`}
                            >
                              <type.icon size={20} />
                            </div>
                            <span
                              className={`text-sm font-black uppercase tracking-tight ${
                                selectedDocType === type.id
                                  ? "text-gray-900"
                                  : "text-gray-500"
                              }`}
                            >
                              {type.label}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* File Upload Area */}
                      <div className="group">
                        <label className="text-sm font-black text-gray-800 mb-3 block flex items-center gap-2">
                          Upload{" "}
                          {
                            DOC_TYPES.find((t) => t.id === selectedDocType)
                              ?.label
                          }{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="file"
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            accept=".jpg,.jpeg,.png,.pdf"
                          />
                          <div
                            className={`p-10 rounded-[2rem] border-2 border-dashed transition-all flex flex-col items-center text-center gap-6 ${
                              files.selectedFile
                                ? "border-green-500 bg-green-50"
                                : "border-gray-200 bg-slate-50/50 group-hover:border-primary group-hover:bg-primary/5"
                            }`}
                          >
                            <div
                              className={`w-20 h-20 rounded-2xl flex items-center justify-center shadow-xl transition-all ${
                                files.selectedFile
                                  ? "bg-green-500 text-white shadow-green-500/20"
                                  : "bg-white text-gray-400 shadow-black/5 group-hover:text-primary group-hover:shadow-primary/20 group-hover:scale-110"
                              }`}
                            >
                              {files.selectedFile ? (
                                <FileCheck size={40} />
                              ) : (
                                <Upload size={40} />
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-lg font-black uppercase tracking-tight ${
                                  files.selectedFile
                                    ? "text-green-700"
                                    : "text-gray-900"
                                }`}
                              >
                                {files.selectedFile
                                  ? files.selectedFile.name
                                  : "Drag & drop or click to upload"}
                              </p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 px-8">
                                {files.selectedFile
                                  ? `${(files.selectedFile.size / (1024 * 1024)).toFixed(2)} MB`
                                  : "Maximum file size: 10MB. Supported: JPG, PNG, PDF"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Navigation Buttons */}
            <div className="pt-10 mt-10 border-t border-gray-100 flex items-center justify-between z-10 relative">
              {activeTab > 0 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="px-6 py-4 rounded-2xl font-black text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all flex items-center gap-3 uppercase tracking-tight text-sm"
                >
                  <ArrowLeft size={18} /> BACK
                </button>
              ) : (
                <div /> // Spacer
              )}

              {activeTab < TABS.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-black transition-all flex items-center gap-3 uppercase tracking-tight text-sm hover:scale-[1.02] shadow-xl shadow-black/10 active:scale-95"
                >
                  NEXT STEP <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-10 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-black transition-all flex items-center gap-3 uppercase tracking-tight text-sm hover:scale-[1.02] shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      SUBMIT APPLICATION <CheckCircle size={18} />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>

          {activeTab === TABS.length - 1 && (
            <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mt-8 px-4">
              By submitting, you agree to Danatour's Provider Partnership Terms
              & Conditions
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderOnboarding;
