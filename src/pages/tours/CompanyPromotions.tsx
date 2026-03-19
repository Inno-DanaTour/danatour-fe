import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  TicketPercent,
  Search,
  Tag,
  Calendar,
  Users,
  CreditCard,
  Percent,
  ChevronRight,
  Loader2,
  Package,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/layout/Header";
import { promotionService } from "../promotions/services/promotionService";
import { PromotionResponse } from "../promotions/types";
import PromotionModal from "../../components/promotions/PromotionModal";
import { companyService } from "../company-detail/services/companyService";

const CompanyPromotions: React.FC = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState<PromotionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionResponse | null>(
    null,
  );
  const [companyId, setCompanyId] = useState<number | undefined>();

  useEffect(() => {
    const init = async () => {
      try {
        const info = await companyService.getMyProviderInfo();
        setCompanyId(info.companyId);
        fetchPromotions();
      } catch (err) {
        console.error("Provider info failed", err);
      }
    };
    init();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionService.getCompanyPromotions();
      setPromotions(data.content);
    } catch (error: any) {
      console.error("Failed to fetch promotions", error);
      const serverMsg = error.response?.data?.message || error.message;
      alert(`Error: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              Marketing <span className="text-primary">& Promos</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Create and manage discount codes for your exclusive tours.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary py-4 px-8 shadow-xl shadow-primary/20 flex items-center gap-2 group"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <Plus size={20} />
            </div>
            New Promotion
          </button>
        </div>

        {/* Promotion Modal */}
        <PromotionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPromo(null);
          }}
          onSuccess={fetchPromotions}
          role="COMPANY"
          companyId={companyId}
          mode={editingPromo ? "EDIT" : "CREATE"}
          initialData={editingPromo || undefined}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Active Codes",
              value: promotions.filter((p) => p.isActive).length,
              icon: Tag,
              color: "bg-primary",
            },
            {
              label: "Redemptions",
              value: promotions.reduce((acc, p) => acc + (p.usedCount || 0), 0),
              icon: TrendingUp,
              color: "bg-cta",
            },
            {
              label: "Applied Tours",
              value: "8",
              icon: Package,
              color: "bg-black",
            },
            {
              label: "Revenue Saved",
              value: "2.5M",
              icon: Calendar,
              color: "bg-blue-500",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4"
            >
              <div
                className={`${stat.color} text-white p-4 rounded-2xl shadow-lg`}
              >
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                  {stat.label}
                </p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm mb-8">
          <div className="relative w-full">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your promo codes..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 font-medium"
            />
          </div>
        </div>

        {/* List Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Fetching your campaigns...
            </p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="bg-gray-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <TicketPercent size={40} />
            </div>
            <h3 className="text-2xl font-black mb-2">No Promotions Found</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Boost your booking rates by creating limited-time discount codes
              for your customers.
            </p>
            <button className="btn-primary py-4 px-10">
              Create First Coupon
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.map((promo) => (
              <motion.div
                whileHover={{ y: -5 }}
                key={promo.id}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden flex flex-col"
              >
                <div className="p-8 flex-1">
                  <div className="flex justify-between items-center mb-6">
                    <div
                      className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${promo.discountType === "PERCENTAGE" ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
                    >
                      {promo.discountType === "PERCENTAGE"
                        ? "Percentage"
                        : "Fixed Amount"}
                    </div>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${promo.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {promo.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-primary font-mono tracking-widest mb-2">
                    {promo.code}
                  </h3>
                  <p className="text-lg font-black text-gray-900 mb-4">
                    {promo.title || "Seasonal Discount"}
                  </p>

                  <div className="bg-gray-50 p-4 rounded-2xl space-y-2 mb-6">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 font-bold">Discount</span>
                      <span className="font-black text-cta">
                        {promo.discountType === "PERCENTAGE"
                          ? `${promo.discountValue}%`
                          : `${promo.discountValue.toLocaleString()} VND`}
                      </span>
                    </div>
                    {promo.maxDiscountAmount && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500 font-bold">Max Cap</span>
                        <span className="font-black">
                          {promo.maxDiscountAmount.toLocaleString()} VND
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
                      <Calendar size={14} />{" "}
                      {new Date(promo.validTo).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-900 font-black text-xs">
                      <Users size={14} className="text-primary" />
                      {promo.usedCount}/{promo.usageLimit || "∞"}
                    </div>
                  </div>
                </div>
                <div className="flex text-white font-black text-xs uppercase tracking-widest">
                  <button
                    onClick={() => {
                      setEditingPromo(promo);
                      setIsModalOpen(true);
                    }}
                    className="flex-[1] py-5 bg-gray-900 border-r border-gray-800 flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => navigate(`/tours/promotions/${promo.id}`)}
                    className="flex-[2] py-5 bg-black flex items-center justify-center gap-2 hover:bg-primary transition-colors"
                  >
                    Promotion Stats <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default CompanyPromotions;
