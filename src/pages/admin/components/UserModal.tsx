import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Save, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Shield, 
  Info,
  Camera,
} from "lucide-react";
import { UserResponse } from "../types/user.types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit" | "view";
  user?: UserResponse | null;
  onSubmit?: (data: any) => void;
  isLoading?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ 
  isOpen, 
  onClose, 
  mode, 
  user, 
  onSubmit,
  isLoading 
}) => {
  const [formData, setFormData] = useState<any>({
    username: "",
    email: "",
    password: "",
    fullName: "",
    phone: "",
    bio: "",
    gender: "MALE",
    dob: "",
    city: "",
    country: "Vietnam"
  });

  useEffect(() => {
    if (user && (mode === "edit" || mode === "view")) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.profile?.fullName || "",
        phone: user.profile?.phone || "",
        bio: user.profile?.bio || "",
        gender: user.profile?.gender || "MALE",
        dob: user.profile?.dob || "",
        city: user.profile?.city || "",
        country: user.profile?.country || "Vietnam"
      });
    } else if (mode === "create") {
      setFormData({
        username: "",
        email: "",
        password: "",
        fullName: "",
        phone: "",
        bio: "",
        gender: "MALE",
        dob: "",
        city: "",
        country: "Vietnam"
      });
    }
  }, [user, mode, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      if (mode === "create") {
        onSubmit({
          user: {
            username: formData.username,
            email: formData.email,
            password: formData.password
          },
          profile: {
            fullName: formData.fullName
          }
        });
      } else {
        onSubmit({
          profile: {
            fullName: formData.fullName,
            phone: formData.phone,
            bio: formData.bio,
            gender: formData.gender,
            dob: formData.dob,
            city: formData.city,
            country: formData.country
          }
        });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]"
        >
          {/* Modal Header */}
          <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                {mode === "create" ? <UserIcon size={24} /> : mode === "edit" ? <Shield size={24} /> : <Info size={24} />}
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 tracking-tight">
                  {mode === "create" ? "Create New User" : mode === "edit" ? "Edit User Profile" : "User Details"}
                </h2>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                  {mode === "create" ? "Add member to DanaTour" : mode === "edit" ? `Editing @${user?.username}` : `Viewing @${user?.username}`}
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white hover:shadow-md rounded-2xl border border-transparent hover:border-gray-100 transition-all text-gray-400 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
            {/* Profile Picture & Basic Info */}
            <div className="flex flex-col md:flex-row gap-8 items-start">
              <div className="relative group self-center md:self-start">
                <div className="w-32 h-32 rounded-[2rem] overflow-hidden bg-gray-100 border-4 border-white shadow-xl">
                  <img 
                    src={user?.profile?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || formData.username || "User")}&background=random&size=128`} 
                    className="w-full h-full object-cover"
                    alt="Profile"
                  />
                  {mode !== "view" && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <Camera className="text-white" size={24} />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 w-full space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Username</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        name="username"
                        disabled={mode !== "create"}
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                        placeholder="johndoe"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      disabled={mode === "view"}
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="email"
                      name="email"
                      disabled={mode !== "create"}
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                {mode === "create" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm"
                      placeholder="••••••••"
                      required={mode === "create"}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Extended Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="tel"
                    name="phone"
                    disabled={mode === "view"}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                    placeholder="0912345678"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Gender</label>
                <select
                  name="gender"
                  disabled={mode === "view"}
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50 appearance-none"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="date"
                    name="dob"
                    disabled={mode === "view"}
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    name="city"
                    disabled={mode === "view"}
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50"
                    placeholder="City / Region"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-4">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Biography / About</label>
              <textarea
                name="bio"
                disabled={mode === "view"}
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-sm disabled:opacity-50 resize-none"
                placeholder="Tell something about this user..."
              />
            </div>
            
            {mode === "view" && user?.createdAt && (
              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-2">
                <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <span>Created At</span>
                  <span className="text-gray-900">{new Date(user.createdAt).toLocaleString()}</span>
                </div>
                {user.lastLoginAt && (
                  <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-wider">
                    <span>Last Login</span>
                    <span className="text-gray-900">{new Date(user.lastLoginAt).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-wider">
                  <span>Status</span>
                  <span className={`text-xs font-black p-1 border rounded-lg ${user.status === 'ACTIVE' ? 'text-emerald-500 border-emerald-500/20' : 'text-rose-500 border-rose-500/20'}`}>
                    {user.status}
                  </span>
                </div>
              </div>
            )}
          </form>

          {/* Modal Footer */}
          {mode !== "view" && (
            <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex items-center justify-end gap-4">
              <button 
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 hover:bg-white transition-all shadow-sm shadow-transparent hover:shadow-gray-200/50 border border-transparent hover:border-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30 hover:shadow-primary/40 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:active:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Save size={16} strokeWidth={3} />
                    {mode === "create" ? "Create User" : "Save Changes"}
                  </>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UserModal;
