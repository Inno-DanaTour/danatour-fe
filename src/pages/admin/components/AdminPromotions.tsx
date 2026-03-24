import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  TicketPercent,
  Search,
  Calendar,
  Users,
  Tag,
  Clock,
  CreditCard,
  Percent,
  ChevronRight,
  Loader2,
} from "lucide-react";
import PromotionModal from "../../../components/promotions/PromotionModal";

import { useAdminPromotions } from "../hooks/useAdminPromotions";

const AdminPromotions: React.FC = () => {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    editingPromo,
    sponsorFilter,
    setSponsorFilter,
    filteredPromotions,
    fetchPromotions,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
    promotions,
  } = useAdminPromotions();
  const navigate = useNavigate();

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <TicketPercent className="text-primary" size={32} />
            Platform Promotions
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            Manage global discount codes and marketing campaigns.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn-primary py-4 px-8 flex items-center gap-2 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} />
          Create New Campaign
        </button>
      </header>

      {/* Global Promotion Modal */}
      <PromotionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchPromotions}
        role="ADMIN"
        mode={editingPromo ? "EDIT" : "CREATE"}
        initialData={editingPromo || undefined}
      />

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            label: "Active Promos",
            value: promotions.filter((p) => p.isActive).length,
            icon: Tag,
            color: "bg-green-500",
          },
          {
            label: "Total Usage",
            value: promotions.reduce((acc, p) => acc + (p.usedCount || 0), 0),
            icon: Users,
            color: "bg-blue-500",
          },
          {
            label: "Expiring Soon",
            value: "3",
            icon: Clock,
            color: "bg-amber-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4"
          >
            <div className={`${stat.color} text-white p-4 rounded-2xl`}>
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by code or campaign title..."
            className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 font-medium"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex bg-gray-50 p-1.5 rounded-2xl gap-1">
          {(["ALL", "PLATFORM", "PROVIDER"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setSponsorFilter(type)}
              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                sponsorFilter === type
                  ? "bg-white text-primary shadow-sm shadow-black/5"
                  : "text-gray-400 hover:text-gray-900"
              }`}
            >
              {type === "ALL" ? "All Sources" : type}
            </button>
          ))}
        </div>
      </div>

      {/* Promotion Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
            Loading campaigns...
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promo) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={promo.id}
              className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-black/5 overflow-hidden group hover:border-primary/30 transition-all"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 rounded-2xl ${promo.discountType === "PERCENTAGE" ? "bg-indigo-50 text-indigo-600" : "bg-green-50 text-green-600"}`}
                  >
                    {promo.discountType === "PERCENTAGE" ? (
                      <Percent size={24} />
                    ) : (
                      <CreditCard size={24} />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${promo.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {promo.isActive ? "Active" : "Global Inactive"}
                    </span>
                    <span
                      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${promo.sponsorType === "PLATFORM" ? "bg-indigo-100 text-indigo-700" : "bg-amber-100 text-amber-700"}`}
                    >
                      {promo.sponsorType}
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-xs font-black uppercase tracking-tighter text-gray-400 mb-1">
                    PROMO CODE
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black tracking-widest text-primary font-mono">
                      {promo.code}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-xl font-black text-gray-900">
                      {promo.title || "Flash Sale Campaign"}
                    </p>
                    <p className="text-sm font-medium text-gray-500">
                      {promo.discountType === "PERCENTAGE"
                        ? `Save ${promo.discountValue}% up to ${promo.maxDiscountAmount?.toLocaleString() || "∞"} VND`
                        : `Direct deduction of ${promo.discountValue.toLocaleString()} VND`}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-gray-400 font-bold text-xs uppercase tracking-widest">
                      <Calendar size={14} />
                      {new Date(promo.validTo).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 text-gray-900 font-black">
                      <Users size={14} className="text-primary" />
                      {promo.usedCount}/{promo.usageLimit || "∞"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex text-white font-black text-xs uppercase tracking-widest mt-0 border-t border-gray-100">
                <button
                  onClick={() => handleOpenEditModal(promo)}
                  className="flex-[1] py-5 bg-gray-100 text-gray-900 border-r border-gray-200 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => navigate(`/admin/promotions/${promo.id}`)}
                  className="flex-[2] py-5 bg-white text-gray-900 group-hover:bg-primary group-hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  Manage Details <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPromotions;
