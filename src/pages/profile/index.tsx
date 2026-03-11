import React, { useState, useEffect } from "react";
import { User, Shield, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/layout/Header";
import ProfileInfoTab from "./components/ProfileInfoTab";
import ChangePasswordTab from "./components/ChangePasswordTab";
import PaymentMethodsTab from "./components/PaymentMethodsTab";
import {
  profileService,
  UserProfileResponse,
} from "../../services/profileService";
import { useNavigate } from "react-router-dom";
import { parseJwt, getToken } from "../../configs/api";
import { Banknote } from "lucide-react";

type TabType = "profile" | "security" | "payment";

const UserProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [profileData, setProfileData] = useState<UserProfileResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = getToken();
  const payload = token ? parseJwt(token) : null;
  const isTourCompany = payload?.scope?.includes("ROLE_TOUR_COMPANY");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await profileService.getProfile();
      setProfileData(response);
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate("/login");
      } else {
        setError(err.message || "Failed to load profile data.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile Info", icon: User },
    ...(isTourCompany ? [{ id: "payment", label: "Payment Methods", icon: Banknote }] : []),
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2">
            Account <span className="text-primary">Settings</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your personal information and security preferences.
          </p>
        </header>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] shadow-xl shadow-black/5 border border-gray-100">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-gray-500 font-bold">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-red-50 rounded-[3rem] border-2 border-dashed border-red-100">
            <AlertCircle size={48} className="mx-auto text-red-300 mb-4" />
            <h3 className="text-xl font-bold text-red-400">{error}</h3>
            <button
              onClick={fetchProfile}
              className="mt-6 btn-primary px-10 py-3"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-xl shadow-black/5 border border-gray-100 overflow-hidden flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-gray-50/50 p-6 border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
              <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto scroolbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-3 px-5 py-4 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
                        isActive
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <Icon
                        size={18}
                        className={isActive ? "text-white" : "text-gray-400"}
                      />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-grow p-6 md:p-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === "profile" && (
                    <ProfileInfoTab
                      initialData={profileData}
                      onUpdate={(data) => setProfileData(data)}
                    />
                  )}
                  {activeTab === "payment" && <PaymentMethodsTab />}
                  {activeTab === "security" && <ChangePasswordTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserProfilePage;
