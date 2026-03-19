import React from "react";
import {
  Plus,
  Edit3,
  Eye,
  Search,
  Filter,
  Calendar,
  Users,
  TrendingUp,
  Package,
  Loader2,
  MapPin,
  Lock,
  Unlock,
  X,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/layout/Header";
import { tourService } from "./services/tourService";
import { TourListItem } from "./types";
import { getUserIdFromToken } from "../../configs/api";

import { companyService } from "../company-detail/services/companyService";
import { useManageTours } from "./hooks/useManageTours";

const ManageTours: React.FC = () => {
  const {
    tours,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    isLockModalOpen,
    setIsLockModalOpen,
    isUnlockModalOpen,
    setIsUnlockModalOpen,
    selectedTourId,
    setSelectedTourId,
    selectedTourForUnlock,
    setSelectedTourForUnlock,
    lockReason,
    setLockReason,
    errorMessage,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isDeleting,
    handleStatusUpdate,
    handleDeleteTour,
    fetchMyTours,
    navigate,
  } = useManageTours();

  const getLockerName = (lockedBy?: string) => {
    if (!lockedBy) return "Unknown";
    if (lockedBy.startsWith("ADMIN:")) return "Administrator";
    if (lockedBy.startsWith("PROVIDER:")) return "You";
    return lockedBy;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header onBookClick={() => navigate("/tours")} />

      <main className="pt-24 md:pt-32 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
              My <span className="text-primary">Tours</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Manage and monitor your travel offerings
            </p>
          </div>
          <button
            onClick={() => navigate("/tours/create")}
            className="btn-primary py-4 px-8 shadow-xl shadow-primary/20 flex items-center gap-2 group"
          >
            <div className="bg-white/20 p-1 rounded-lg group-hover:rotate-90 transition-transform">
              <Plus size={20} />
            </div>
            Create New Tour
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          {[
            {
              label: "Total Tours",
              value: tours?.length || 0,
              icon: Package,
              color: "bg-primary",
            },
            {
              label: "Active Bookings",
              value: "124",
              icon: TrendingUp,
              color: "bg-cta",
            },
            {
              label: "Total Revenue",
              value: "45.2M",
              icon: Calendar,
              color: "bg-black",
            },
            {
              label: "Avg. Rating",
              value: "4.8",
              icon: Users,
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

        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl font-bold flex items-center gap-3"
          >
            <X className="shrink-0" size={20} />
            {errorMessage}
          </motion.div>
        )}

        <div className="bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location or category..."
              className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 focus:ring-2 focus:ring-primary/20 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 font-bold"
              >
                Clear
              </button>
            )}
          </div>
          <button className="flex items-center gap-2 px-6 py-4 bg-gray-50 rounded-2xl font-black text-sm uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
            <Filter size={18} /> Filter
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
              Syncing your data...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-10 rounded-[2.5rem] text-center border border-red-100">
            <p className="text-xl font-bold mb-4">{error}</p>
            <button
              onClick={() => fetchMyTours(0)}
              className="btn-primary py-3 px-8 mx-auto"
            >
              Try Again
            </button>
          </div>
        ) : tours.length === 0 ? (
          <div className="bg-gray-50 p-20 rounded-[3rem] text-center border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Package size={40} />
            </div>
            <h3 className="text-2xl font-black mb-2">No Tours Yet</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Start listing your amazing tours and reach thousands of travelers.
            </p>
            <button
              onClick={() => navigate("/tours/create")}
              className="btn-primary py-4 px-10"
            >
              Create Your First Tour
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Tour Information
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Price
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Location
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Status
                    </th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tours
                    .filter(
                      (tour) =>
                        tour.title
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()) ||
                        tour.placeName
                          .toLowerCase()
                          .includes(searchQuery.toLowerCase()),
                    )
                    .map((tour) => (
                      <tr
                        key={tour.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm relative">
                              <img
                                src={tour.thumbnailUrl}
                                alt={tour.title}
                                className="w-full h-full object-cover"
                              />
                              {(tour.status === "LOCKED" ||
                                tour.status === "REJECTED") && (
                                <div
                                  className={`absolute inset-0 ${tour.status === "LOCKED" ? "bg-black/40" : "bg-red-500/40"} flex flex-col items-center justify-center backdrop-blur-[2px]`}
                                >
                                  {tour.status === "LOCKED" ? (
                                    <Lock
                                      size={14}
                                      className="text-white mb-0.5"
                                    />
                                  ) : (
                                    <X
                                      size={14}
                                      className="text-white mb-0.5"
                                    />
                                  )}
                                  <span className="text-[8px] font-black tracking-widest text-white uppercase">
                                    {tour.status}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-black text-lg group-hover:text-primary transition-colors">
                                {tour.title}
                              </p>
                              <div className="flex flex-col gap-0.5">
                                <p className="text-sm text-gray-400 font-medium">
                                  ID: #{tour.id} • {tour.durationDays}D{" "}
                                  {tour.durationNights}N
                                </p>
                                {tour.status === "LOCKED" &&
                                  tour.lockReason && (
                                    <p className="text-[10px] text-rose-500 font-bold italic">
                                      Lock Reason: {tour.lockReason}
                                    </p>
                                  )}
                                {tour.status === "REJECTED" &&
                                  tour.rejectReason && (
                                    <p className="text-[10px] text-red-500 font-bold italic">
                                      Reject Reason: {tour.rejectReason}
                                    </p>
                                  )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-black text-cta text-lg">
                            {tour.adultPrice.toLocaleString()} VND
                          </p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-500 font-bold">
                            <MapPin size={16} className="text-primary" />
                            {tour.placeName}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                              tour.status === "ACTIVE"
                                ? "bg-green-100 text-green-700"
                                : tour.status === "PENDING"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : tour.status === "REJECTED"
                                    ? "bg-red-100 text-red-700"
                                    : tour.status === "DRAFT"
                                      ? "bg-gray-200 text-gray-700"
                                      : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            {tour.status || "PENDING"}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate(`/tours/${tour.id}`)}
                              className="p-3 bg-gray-100 hover:bg-black hover:text-white rounded-xl transition-all"
                              title="View Public Page"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => navigate(`/tours/${tour.id}/edit`)}
                              className="p-3 bg-gray-100 hover:bg-primary hover:text-white rounded-xl transition-all shadow-sm"
                              title="Edit Tour"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => {
                                if (tour.status === "LOCKED") {
                                  setSelectedTourForUnlock(tour);
                                  setIsUnlockModalOpen(true);
                                } else {
                                  setSelectedTourId(tour.id);
                                  setIsLockModalOpen(true);
                                }
                              }}
                              className={`p-3 bg-gray-100 rounded-xl transition-all shadow-sm ${tour.status === "LOCKED" ? "hover:bg-green-500 hover:text-white" : "hover:bg-red-500 hover:text-white"}`}
                              title={
                                tour.status === "LOCKED"
                                  ? "Unlock Tour"
                                  : "Lock Tour"
                              }
                            >
                              {tour.status === "LOCKED" ? (
                                <Unlock size={18} />
                              ) : (
                                <Lock size={18} />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedTourId(tour.id);
                                setIsDeleteModalOpen(true);
                              }}
                              className="p-3 bg-gray-100 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm"
                              title="Delete Tour (Lock)"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AnimatePresence>
        {isLockModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsLockModalOpen(false);
                  setLockReason("");
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2">Lock this Tour?</h2>
              <textarea
                value={lockReason}
                onChange={(e) => setLockReason(e.target.value)}
                placeholder="Enter reason for locking..."
                className="w-full bg-gray-50 border-none rounded-2xl p-4 font-medium min-h-[120px] focus:ring-2 focus:ring-red-500/20 mb-6 resize-none"
              />
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsLockModalOpen(false);
                    setLockReason("");
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-gray-100 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedTourId!, "LOCKED", lockReason)
                  }
                  disabled={!lockReason.trim()}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-red-500 text-white disabled:opacity-50"
                >
                  Confirm Lock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {isUnlockModalOpen && selectedTourForUnlock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => {
                  setIsUnlockModalOpen(false);
                  setSelectedTourForUnlock(null);
                }}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                <Unlock size={32} />
              </div>
              <h2 className="text-2xl font-black mb-2">Unlock Tour?</h2>
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                    Locked By
                  </p>
                  <p className="font-bold text-gray-900">
                    {getLockerName(selectedTourForUnlock.lockedBy)}
                  </p>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">
                  Reason
                </p>
                <p className="text-gray-600 font-medium italic">
                  {selectedTourForUnlock.lockReason || "No reason provided."}
                </p>
              </div>
              {selectedTourForUnlock.lockedBy?.startsWith("ADMIN:") && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl font-bold text-sm text-center">
                  Contact Admin to unlock.
                </div>
              )}
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setIsUnlockModalOpen(false);
                    setSelectedTourForUnlock(null);
                  }}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-gray-100 text-gray-900"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    handleStatusUpdate(selectedTourForUnlock.id, "ACTIVE")
                  }
                  disabled={selectedTourForUnlock.lockedBy?.startsWith(
                    "ADMIN:",
                  )}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-green-500 text-white disabled:opacity-50"
                >
                  Confirm Unlock
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative text-center"
            >
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <X size={24} />
              </button>
              <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Trash2 size={40} />
              </div>
              <h2 className="text-3xl font-black mb-4">Delete Tour?</h2>
              <p className="text-gray-500 mb-8 font-medium">
                Deleting this tour will mark it as{" "}
                <span className="text-rose-600 font-black">LOCKED</span>. It
                will no longer be visible to customers, but records will be kept
                for history.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-gray-100 text-gray-900"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTour(selectedTourId!)}
                  disabled={isDeleting}
                  className="flex-1 py-4 px-6 rounded-2xl font-bold bg-rose-600 text-white shadow-lg shadow-rose-200"
                >
                  {isDeleting ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageTours;
