import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Filter,
  AlertCircle,
  Loader2,
  CheckCircle,
  XCircle,
  Palmtree,
  Lock,
  Unlock,
  Eye,
  TrendingUp,
  Clock,
  CheckSquare,
  ShieldAlert,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { tourService } from "../../tours/services/tourService";
import {
  TourListItem,
  PagedResponse,
  TourStatusUpdateRequest,
} from "../../../types/types";
import { Link } from "react-router-dom";

const AdminTourManagementPage: React.FC = () => {
  const [toursData, setToursData] =
    useState<PagedResponse<TourListItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTours();
  }, [page, statusFilter]);

  const fetchTours = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await tourService.getTours(page, 10);
      setToursData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load tours.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (tourId: number, status: string) => {
    try {
      const request: TourStatusUpdateRequest = {
        status: status,
        lockReason: status === "LOCKED" ? "Administrative Lock" : undefined,
      };
      await tourService.updateTourStatus(tourId, request);
      fetchTours();
    } catch (err: any) {
      alert(err.message || "Failed to update tour status.");
    }
  };

  const stats = useMemo(() => {
    if (!toursData) return null;
    return {
      total: toursData.totalElements,
      pending: toursData.content.filter((t) => t.status === "PENDING").length,
      active: toursData.content.filter((t) => t.status === "ACTIVE").length,
      locked: toursData.content.filter((t) => t.status === "LOCKED").length,
    };
  }, [toursData]);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      PENDING: {
        bg: "bg-amber-500/10",
        text: "text-amber-600",
        icon: Clock,
        label: "Pending Review",
      },
      ACTIVE: {
        bg: "bg-emerald-500/10",
        text: "text-emerald-600",
        icon: CheckCircle,
        label: "Active",
      },
      LOCKED: {
        bg: "bg-rose-500/10",
        text: "text-rose-600",
        icon: ShieldAlert,
        label: "Locked",
      },
    };

    const variant = variants[status] || {
      bg: "bg-gray-500/10",
      text: "text-gray-600",
      icon: AlertCircle,
      label: status,
    };
    const Icon = variant.icon;

    return (
      <span
        className={`${variant.bg} ${variant.text} px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-2 w-fit border border-current/10`}
      >
        <Icon size={12} strokeWidth={3} />
        {variant.label}
      </span>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-8 max-w-7xl mx-auto pb-20 p-4 md:p-0"
    >
      {/* Header with Glassmorphism */}
      <motion.header variants={itemVariants} className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
              Tour <span className="text-primary">Ecosystem</span>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                PRO
              </div>
            </h1>
            <p className="text-gray-500 font-bold mt-2 flex items-center gap-2">
              <TrendingUp className="text-emerald-500" size={18} />
              Central control unit for tour moderation and quality assurance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchTours}
              className="px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-black/5 font-black text-xs uppercase tracking-widest hover:scale-105 transition-all text-gray-600 active:scale-95"
            >
              Sync Data
            </button>
          </div>
        </div>
      </motion.header>

      {/* Stats Cards - Premium Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {[
          {
            label: "Total Tours",
            value: stats?.total || 0,
            icon: Palmtree,
            color: "text-primary",
            bg: "bg-primary/10",
            glow: "shadow-primary/20",
          },
          {
            label: "Pending",
            value: stats?.pending || 0,
            icon: Clock,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            glow: "shadow-amber-500/20",
          },
          {
            label: "Active Ecosystem",
            value: stats?.active || 0,
            icon: CheckSquare,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            glow: "shadow-emerald-500/20",
          },
          {
            label: "Administrative Locks",
            value: stats?.locked || 0,
            icon: ShieldAlert,
            color: "text-rose-500",
            bg: "bg-rose-500/10",
            glow: "shadow-rose-500/20",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`bg-white p-6 rounded-[2rem] border border-gray-100 shadow-2xl ${stat.glow} flex items-center justify-between group hover:-translate-y-1 transition-all duration-300`}
          >
            <div>
              <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className={`text-3xl font-black ${stat.color}`}>
                {stat.value}
              </h3>
            </div>
            <div
              className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}
            >
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </motion.div>

      {/* Filters & Search - Glassmorphic Bar */}
      <motion.div
        variants={itemVariants}
        className="backdrop-blur-xl bg-white/70 p-4 rounded-3xl shadow-2xl shadow-black/5 border border-white/50 flex flex-col lg:flex-row gap-4 justify-between items-center relative z-10"
      >
        <div className="relative w-full lg:w-[400px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search within the ecosystem..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-bold placeholder:text-gray-400"
          />
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="flex-1 lg:flex-none relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full lg:w-auto pl-10 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-black text-gray-600 text-[10px] uppercase tracking-widest cursor-pointer hover:bg-white transition-colors"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Approval</option>
              <option value="ACTIVE">System Active</option>
              <option value="LOCKED">Administratively Locked</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Data Table Container */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 overflow-hidden relative"
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-32"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 rounded-full animate-pulse"></div>
                <Loader2 className="w-16 h-16 animate-spin text-primary absolute inset-0" />
              </div>
              <p className="mt-6 text-gray-400 font-black text-xs uppercase tracking-widest animate-bounce">
                Synthesizing Data...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 px-6"
            >
              <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={40} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">{error}</h3>
              <p className="text-gray-500 font-bold mb-8">
                Communications breakdown within the grid.
              </p>
              <button
                onClick={fetchTours}
                className="px-10 py-4 bg-rose-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all"
              >
                Re-establish Link
              </button>
            </motion.div>
          ) : toursData?.content.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32"
            >
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
                <Palmtree size={48} />
              </div>
              <h3 className="text-xl font-black text-gray-400">
                The Ecosystem is Empty
              </h3>
              <p className="text-gray-400 mt-2 font-bold italic">
                Scanning for new data signals...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="table"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto"
            >
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">
                  <tr>
                    <th className="px-8 py-6">Identity & Intel</th>
                    <th className="px-8 py-6 text-center">Location Node</th>
                    <th className="px-8 py-6 text-center">Market Valuation</th>
                    <th className="px-8 py-6">Status Marker</th>
                    <th className="px-8 py-6 text-right">Moderation Hub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {toursData?.content.map((tour, index) => (
                    <motion.tr
                      key={tour.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: index * 0.05 },
                      }}
                      className="group hover:bg-primary/[0.02] transition-colors cursor-default"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-5">
                          <div className="relative group/img">
                            <div className="w-16 h-16 rounded-[1.25rem] bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden border-2 border-white shadow-xl group-hover/img:scale-110 transition-transform duration-500">
                              {tour.thumbnailUrl ? (
                                <img
                                  src={tour.thumbnailUrl}
                                  alt={tour.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Palmtree size={24} className="text-gray-300" />
                              )}
                            </div>
                          </div>
                          <div>
                            <p className="font-black text-gray-900 group-hover:text-primary transition-colors text-lg tracking-tight">
                              {tour.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-black bg-gray-100 text-gray-500 px-2 py-0.5 rounded-md uppercase tracking-wider border border-gray-200">
                                UUID: {tour.id}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <p className="text-xs font-black text-gray-900 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100 w-fit mx-auto group-hover:bg-white transition-colors">
                          {tour.placeName}
                        </p>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                            Standard Rate
                          </span>
                          <p className="text-xl font-black text-primary drop-shadow-sm">
                            ${tour.adultPrice}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {getStatusBadge(tour.status)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                          <Link
                            to={`/tours/${tour.id}`}
                            className="w-10 h-10 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-white hover:text-primary hover:shadow-xl hover:shadow-primary/10 transition-all active:scale-90"
                            title="Visual Scan"
                          >
                            <Eye size={18} strokeWidth={2.5} />
                          </Link>

                          {tour.status === "PENDING" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(tour.id, "ACTIVE")
                              }
                              className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center hover:bg-emerald-500 hover:text-white hover:shadow-xl hover:shadow-emerald-500/30 transition-all active:scale-90"
                              title="Authorize Entry"
                            >
                              <CheckCircle size={18} strokeWidth={2.5} />
                            </button>
                          )}

                          {tour.status === "ACTIVE" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(tour.id, "LOCKED")
                              }
                              className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-500 hover:text-white hover:shadow-xl hover:shadow-rose-500/30 transition-all active:scale-90"
                              title="Restrict Access"
                            >
                              <Lock size={18} strokeWidth={2.5} />
                            </button>
                          )}

                          {tour.status === "LOCKED" && (
                            <button
                              onClick={() =>
                                handleStatusUpdate(tour.id, "ACTIVE")
                              }
                              className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-500 hover:text-white hover:shadow-xl hover:shadow-indigo-500/30 transition-all active:scale-90"
                              title="Re-activate Node"
                            >
                              <Unlock size={18} strokeWidth={2.5} />
                            </button>
                          )}
                          
                          <button className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-gray-100 transition-all active:scale-90">
                             <MoreVertical size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Premium Pagination */}
        {toursData && toursData.totalPages > 1 && (
          <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30 relative z-10">
            <div className="flex items-center gap-4">
               <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
               <p className="text-xs font-black text-gray-400 uppercase tracking-[0.15em]">
                Page {toursData.page} of {toursData.totalPages}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                disabled={toursData.first}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all group active:scale-95"
              >
                Prev Grid
              </button>
              <button
                disabled={toursData.last}
                onClick={() => setPage((p) => p + 1)}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-xs font-black uppercase tracking-widest text-gray-600 flex items-center gap-2 hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:border-gray-200 transition-all group active:scale-95"
              >
                Next Node
                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default AdminTourManagementPage;
