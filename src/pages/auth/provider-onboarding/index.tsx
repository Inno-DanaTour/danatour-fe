import React, { useState, useEffect } from "react";
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
  X,
} from "lucide-react";
import Header from "../../../components/layout/Header";
import {
  providerService,
  ProviderApplicationInfo,
  MyProviderApplicationResponse,
} from "../../../services/providerService";
import { useLogin } from "../login/hooks/useLogin";

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

  const [files, setFiles] = useState<Record<string, File | null>>({
    TAX_NUMBER: null,
    CITIZEN_ID: null,
    BUSINESS_LICENSE: null,
    TRAVEL_LICENSE: null,
  });

  const [previews, setPreviews] = useState<Record<string, string | null>>({
    TAX_NUMBER: null,
    CITIZEN_ID: null,
    BUSINESS_LICENSE: null,
    TRAVEL_LICENSE: null,
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
  const { handleRefreshToken } = useLogin();
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [existingApplication, setExistingApplication] =
    useState<MyProviderApplicationResponse | null>(null);

  // Initial status check
  useEffect(() => {
    const fetchStatus = async () => {
      setIsCheckingStatus(true);
      try {
        const data = await providerService.getMyApplications();
        if (data.company) {
          setExistingApplication(data);
        }
      } catch (err) {
        console.error("Failed to fetch application status", err);
      } finally {
        setIsCheckingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  // Cleanup effect for ObjectURLs
  useEffect(() => {
    return () => {
      Object.values(previews).forEach((url) => {
        if (typeof url === "string") URL.revokeObjectURL(url);
      });
    };
  }, [previews]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Update files state
      setFiles((prev) => ({
        ...prev,
        [selectedDocType]: file,
      }));

      // Create and update preview
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviews((prev) => {
          // Revoke old URL if it exists
          if (prev[selectedDocType])
            URL.revokeObjectURL(prev[selectedDocType]!);
          return {
            ...prev,
            [selectedDocType]: url,
          };
        });
      } else {
        // For non-images (PDFs), clear preview
        setPreviews((prev) => ({
          ...prev,
          [selectedDocType]: null,
        }));
      }
    }
  };

  const removeFile = (docType: string) => {
    setFiles((prev) => ({ ...prev, [docType]: null }));
    setPreviews((prev) => {
      if (prev[docType]) URL.revokeObjectURL(prev[docType]!);
      return { ...prev, [docType]: null };
    });
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
      // At least one document must be uploaded
      return Object.values(files).some((f) => f !== null);
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

    if (!validateTab(2)) {
      setError("Please upload at least one legal document.");
      setIsLoading(false);
      return;
    }

    try {
      const info: ProviderApplicationInfo = {
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

      await providerService.submitApplication(info, files);

      // Refresh token to update roles if approved/changed
      await handleRefreshToken();

      // Refresh status after submission
      const data = await providerService.getMyApplications();
      setExistingApplication(data);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsLoading(false);
    }
  };

  const checkApplicationStatus = async () => {
    setIsCheckingStatus(true);
    try {
      const data = await providerService.getMyApplications();
      setExistingApplication(data);

      const status = data.company?.status;

      if (status === "ACTIVE") {
        await handleRefreshToken();
        // Redirect to tour company dashboard or home
        navigate("/");
      } else if (status === "REJECTED" || status === "SUSPENDED") {
        setError(
          `Your application has been ${status.toLowerCase()}. ${data.company?.rejectionReason || "Please contact support for more details."}`,
        );
      } else {
        setError(
          "Your application is still under review. Please check back later.",
        );
        setTimeout(() => setError(null), 3000);
      }
    } catch (err: any) {
      setError("Failed to check status. Please try again later.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  if (existingApplication && existingApplication.company) {
    const { company, documents } = existingApplication;
    const isPending = company.status === "PENDING_VERIFICATION";
    const isActive = company.status === "ACTIVE";
    const isRejected = company.status === "REJECTED";

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-12 rounded-[3rem] shadow-2xl shadow-primary/10 max-w-2xl w-full border border-primary/5 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />

          {isPending && (
            <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-500 mx-auto mb-8 border-4 border-white shadow-xl">
              <Loader2 className="animate-spin" size={48} />
            </div>
          )}

          {isActive && (
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-green-500 mx-auto mb-8 border-4 border-white shadow-xl">
              <CheckCircle2 size={48} />
            </div>
          )}

          {isRejected && (
            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8 border-4 border-white shadow-xl">
              <X size={48} />
            </div>
          )}

          <h1 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tight">
            {isActive
              ? "Application Approved!"
              : isRejected
                ? "Application Rejected"
                : "Application Under Review"}
          </h1>

          <div className="mb-8">
            <span
              className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                isActive
                  ? "bg-green-100 text-green-600"
                  : isRejected
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
              }`}
            >
              {company.status.replace("_", " ")}
            </span>
          </div>

          <div className="bg-slate-50/50 rounded-3xl p-6 mb-8 text-left space-y-4 border border-gray-100">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Company Name
              </span>
              <span className="text-sm font-bold text-gray-900">
                {company.name}
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-100">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Tax Code
              </span>
              <span className="text-sm font-bold text-gray-900">
                {company.taxCode}
              </span>
            </div>
            {company.rejectionReason && (
              <div className="pt-2">
                <span className="text-xs font-black text-red-400 uppercase tracking-widest block mb-2">
                  Rejection Reason
                </span>
                <p className="text-sm font-medium text-red-600 leading-relaxed">
                  {company.rejectionReason}
                </p>
              </div>
            )}
          </div>

          <div className="mb-10 text-left">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">
              Submitted Documents ({documents.length})
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3 shadow-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-gray-900 truncate uppercase mt-0.5">
                      {doc.documentType.replace("_", " ")}
                    </p>
                    <span className="text-[8px] font-bold text-green-500 uppercase tracking-tighter">
                      {doc.verificationStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600 mb-6 overflow-hidden"
              >
                <AlertCircle size={18} className="shrink-0" />
                <p className="font-bold text-xs tracking-tight text-left">
                  {error}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            {isPending && (
              <button
                onClick={checkApplicationStatus}
                disabled={isCheckingStatus}
                className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
              >
                {isCheckingStatus ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    REFRESHING STATUS...
                  </>
                ) : (
                  <>
                    <FileCheck size={20} />
                    REFRESH STATUS
                  </>
                )}
              </button>
            )}

            {isActive && (
              <button
                onClick={() => navigate("/")}
                className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                GO TO DASHBOARD
              </button>
            )}

            {isRejected && (
              <button
                onClick={() => setExistingApplication(null)}
                className="w-full py-5 bg-gradient-to-r from-primary to-secondary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                RE-SUBMIT APPLICATION
              </button>
            )}

            <button
              onClick={() => navigate("/")}
              className="w-full py-5 bg-white text-gray-900 font-black rounded-2xl border-2 border-gray-100 hover:bg-gray-50 transition-all uppercase tracking-tight text-sm"
            >
              RETURN TO HOME
            </button>
          </div>
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
                            <div className="flex flex-col">
                              <span
                                className={`text-sm font-black uppercase tracking-tight ${
                                  selectedDocType === type.id
                                    ? "text-gray-900"
                                    : "text-gray-500"
                                }`}
                              >
                                {type.label}
                              </span>
                              {files[type.id] && (
                                <span className="text-[10px] text-green-500 font-bold flex items-center gap-1">
                                  <CheckCircle size={10} /> ATTACHED
                                </span>
                              )}
                            </div>
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
                          {!files[selectedDocType] ? (
                            <>
                              <input
                                type="file"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept=".jpg,.jpeg,.png,.pdf"
                              />
                              <div className="p-10 rounded-[2rem] border-2 border-dashed border-gray-200 bg-slate-50/50 group-hover:border-primary group-hover:bg-primary/5 transition-all flex flex-col items-center text-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-white text-gray-400 flex items-center justify-center shadow-xl shadow-black/5 group-hover:text-primary group-hover:shadow-primary/20 group-hover:scale-110 transition-all">
                                  <Upload size={40} />
                                </div>
                                <div>
                                  <p className="text-lg font-black uppercase tracking-tight text-gray-900">
                                    Drag & drop or click to upload
                                  </p>
                                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 px-8">
                                    Maximum file size: 10MB. Supported: JPG,
                                    PNG, PDF
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="p-8 rounded-[2rem] border-2 border-green-500 bg-green-50/50 flex flex-col items-center gap-6 relative overflow-hidden group/uploaded">
                              <button
                                type="button"
                                onClick={() => removeFile(selectedDocType)}
                                className="absolute top-4 right-4 p-2 bg-white text-red-500 rounded-xl shadow-lg hover:bg-red-50 transition-all z-20"
                                title="Remove file"
                              >
                                <X size={20} />
                              </button>

                              {previews[selectedDocType] ? (
                                <div className="w-full max-w-md aspect-video rounded-2xl overflow-hidden border-4 border-white shadow-2xl relative group/preview">
                                  <img
                                    src={previews[selectedDocType]!}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-black text-xs uppercase tracking-widest">
                                      Click cross to change
                                    </p>
                                  </div>
                                </div>
                              ) : (
                                <div className="w-24 h-24 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-green-500/20">
                                  <FileCheck size={48} />
                                </div>
                              )}

                              <div className="text-center">
                                <p className="text-lg font-black uppercase tracking-tight text-green-700 max-w-xs truncate">
                                  {files[selectedDocType]?.name}
                                </p>
                                <p className="text-xs text-green-600/70 font-bold uppercase tracking-widest mt-1">
                                  {(
                                    files[selectedDocType]!.size /
                                    (1024 * 1024)
                                  ).toFixed(2)}{" "}
                                  MB • Ready to upload
                                </p>
                              </div>
                            </div>
                          )}
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
