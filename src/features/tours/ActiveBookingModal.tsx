import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ActiveBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ActiveBookingModal: React.FC<ActiveBookingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  const handleGoToMyBookings = () => {
    onClose();
    navigate("/my-bookings");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#020617] rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-primary to-sea" />
            
            <div className="p-8">
              {/* Icon & Close */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <AlertCircle className="w-8 h-8 text-amber-500" />
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Text Content */}
              <div className="space-y-4 mb-8">
                <h3 className="text-2xl font-bold text-white">
                  Bạn đã có đơn đặt chỗ!
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Hệ thống ghi nhận bạn đã có một đơn đặt chỗ cho chuyến tham quan này đang <span className="text-amber-500 font-medium">chờ thanh toán</span> hoặc <span className="text-primary font-medium">đã xác nhận</span>.
                </p>
                <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <p className="text-sm text-gray-400">
                    Mỗi tài khoản chỉ có thể có một đơn đặt chỗ hoạt động cho cùng một lịch trình tour.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleGoToMyBookings}
                  className="w-full py-4 bg-gradient-to-r from-primary to-sea text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
                >
                  Kiểm tra đơn của tôi
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-white/5 text-gray-300 font-semibold rounded-2xl hover:bg-white/10 transition-all"
                >
                  Đóng
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ActiveBookingModal;
