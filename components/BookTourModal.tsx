import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  MapPin,
  Check,
  Loader2,
} from "lucide-react";
import { LOCATIONS } from "../constants";

interface BookTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedTourId?: string;
}

interface BookingFormData {
  tourId: string;
  date: string;
  adults: number;
  children: number;
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  tourId?: string;
  date?: string;
  name?: string;
  email?: string;
  phone?: string;
}

const BookTourModal: React.FC<BookTourModalProps> = ({
  isOpen,
  onClose,
  preselectedTourId,
}) => {
  const [formData, setFormData] = useState<BookingFormData>({
    tourId: preselectedTourId || "",
    date: "",
    adults: 1,
    children: 0,
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.tourId) {
      newErrors.tourId = "Please select a tour";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setIsSuccess(false);
      setErrors({});
      setFormData({
        tourId: "",
        date: "",
        adults: 1,
        children: 0,
        name: "",
        email: "",
        phone: "",
      });
      onClose();
    }
  };

  const handleInputChange = (
    field: keyof BookingFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg bg-gradient-to-br from-[#020617] to-primary/20 rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative px-6 pt-6 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-sea flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Book Your Tour
                  </h2>
                  <p className="text-sm text-gray-400">
                    Fill in the details below
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-400 mb-6">
                    We'll send you a confirmation email shortly.
                  </p>
                  <button
                    onClick={handleClose}
                    className="px-8 py-3 bg-gradient-to-r from-primary to-sea text-white font-semibold rounded-xl cursor-pointer"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Tour Selection */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <MapPin className="w-4 h-4 text-accent" />
                      Select Tour
                    </label>
                    <select
                      value={formData.tourId}
                      onChange={(e) =>
                        handleInputChange("tourId", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer ${
                        errors.tourId
                          ? "border-red-500"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    >
                      <option value="" className="bg-[#1a1f35]">
                        Choose a destination...
                      </option>
                      {LOCATIONS.map((loc) => (
                        <option
                          key={loc.id}
                          value={loc.id}
                          className="bg-[#1a1f35]"
                        >
                          {loc.name} - {loc.zone} Zone
                        </option>
                      ))}
                    </select>
                    {errors.tourId && (
                      <p className="mt-1 text-sm text-red-400">
                        {errors.tourId}
                      </p>
                    )}
                  </div>

                  {/* Date */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                      <Calendar className="w-4 h-4 text-accent" />
                      Travel Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer ${
                        errors.date
                          ? "border-red-500"
                          : "border-white/10 hover:border-white/20"
                      }`}
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-400">{errors.date}</p>
                    )}
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <Users className="w-4 h-4 text-accent" />
                        Adults
                      </label>
                      <select
                        value={formData.adults}
                        onChange={(e) =>
                          handleInputChange("adults", parseInt(e.target.value))
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50 transition-all cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                          <option key={n} value={n} className="bg-[#1a1f35]">
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                        <Users className="w-4 h-4 text-accent" />
                        Children
                      </label>
                      <select
                        value={formData.children}
                        onChange={(e) =>
                          handleInputChange(
                            "children",
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50 transition-all cursor-pointer"
                      >
                        {[0, 1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n} className="bg-[#1a1f35]">
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="pt-4 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-gray-300 mb-4">
                      Contact Information
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                          <User className="w-4 h-4 text-accent" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50 transition-all ${
                            errors.name
                              ? "border-red-500"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.name}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                          <Mail className="w-4 h-4 text-accent" />
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50 transition-all ${
                            errors.email
                              ? "border-red-500"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
                          <Phone className="w-4 h-4 text-accent" />
                          Phone
                        </label>
                        <input
                          type="tel"
                          placeholder="+84 xxx xxx xxx"
                          value={formData.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FFC857]/50 transition-all ${
                            errors.phone
                              ? "border-red-500"
                              : "border-white/10 hover:border-white/20"
                          }`}
                        />
                        {errors.phone && (
                          <p className="mt-1 text-sm text-red-400">
                            {errors.phone}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                    className="w-full py-4 bg-gradient-to-r from-primary to-sea text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookTourModal;
