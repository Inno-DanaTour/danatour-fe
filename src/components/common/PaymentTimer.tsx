import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { motion } from "framer-motion";

interface PaymentTimerProps {
  createdAt: string;
  onExpire?: () => void;
  className?: string;
}

const PaymentTimer: React.FC<PaymentTimerProps> = ({
  createdAt,
  onExpire,
  className = "",
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    // Ensure the timestamp is treated as UTC by appending 'Z' if it doesn't have timezone info
    let dateStr = createdAt;
    if (dateStr && !dateStr.includes("Z") && !dateStr.includes("+")) {
      // Replace space with 'T' and append 'Z'
      dateStr = dateStr.replace(" ", "T") + "Z";
    }

    const created = new Date(dateStr).getTime();
    const expiry = created + 10 * 60 * 1000;
    
    let timer: any;

    const updateTime = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, Math.floor((expiry - now) / 1000));
      setTimeLeft(diff);
      
      if (diff <= 0 && timer) {
        clearInterval(timer);
      }
    };

    updateTime(); // Initial call
    timer = setInterval(updateTime, 1000);

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [createdAt]);

  if (timeLeft <= 0) {
    return (
      <div className={`text-red-500 font-bold flex items-center gap-2 ${className}`}>
        <Clock size={16} />
        <span>Expired</span>
      </div>
    );
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-100/50 ${className}`}
    >
      <Clock size={18} className="text-amber-500 animate-pulse" />
      <div className="flex flex-col">
        <span className="text-[10px] text-amber-600 font-black uppercase tracking-widest leading-none mb-1">
          Time Remaining
        </span>
        <div className="flex items-baseline gap-1">
          <motion.span
            key={`min-${minutes}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-black text-amber-700 leading-none"
          >
            {minutes.toString().padStart(2, "0")}
          </motion.span>
          <span className="text-amber-700 font-black">:</span>
          <motion.span
            key={`sec-${seconds}`}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-lg font-black text-amber-700 leading-none"
          >
            {seconds.toString().padStart(2, "0")}
          </motion.span>
        </div>
      </div>
    </div>
  );
};

export default PaymentTimer;
