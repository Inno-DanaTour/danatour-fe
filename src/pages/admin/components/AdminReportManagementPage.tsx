import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Eye,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { useAdminReportManagement } from "../hooks/useAdminReportManagement";
import AdminTourDetailModal from "./AdminTourDetailModal";
import { ReportStatus } from "../types/report.types";

const AdminReportManagementPage: React.FC = () => {
  const [selectedTourId, setSelectedTourId] = useState<number | string | null>(
    null,
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const {
    reports,
    loading,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    handleUpdateStatus,
    stats,
  } = useAdminReportManagement();

  const getStatusColor = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return "text-amber-500 bg-amber-50 border-amber-100";
      case "RESOLVED":
        return "text-emerald-500 bg-emerald-50 border-emerald-100";
      case "DISMISSED":
        return "text-gray-500 bg-gray-50 border-gray-100";
      default:
        return "text-gray-500 bg-gray-50 border-gray-100";
    }
  };

  const getStatusIcon = (status: ReportStatus) => {
    switch (status) {
      case "PENDING":
        return <Clock size={14} />;
      case "RESOLVED":
        return <CheckCircle2 size={14} />;
      case "DISMISSED":
        return <XCircle size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                  <AlertTriangle size={24} />
                </div>
                Tour Reports
              </h1>
              <p className="text-slate-500 mt-1">
                Manage and resolve user-submitted reports for tours
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                {(["ALL", "PENDING", "RESOLVED", "DISMISSED"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        statusFilter === status
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {status.charAt(0) + status.slice(1).toLowerCase()}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Filter size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Total Reports
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.total}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Pending
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.pending}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Resolved
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {stats.resolved}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all hover:shadow-md">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                <TrendingDown size={20} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Report Rate
                </p>
                <p className="text-xl font-bold text-slate-900">0.2%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-8 mt-8">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Reporter
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Reported Tour
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-8 py-5 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-8 py-12 text-center text-slate-400 font-medium"
                      >
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          Loading reports...
                        </div>
                      </td>
                    </tr>
                  ) : reports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-8 py-12 text-center text-slate-400 font-medium"
                      >
                        No reports found
                      </td>
                    </tr>
                  ) : (
                    reports.map((report) => (
                      <motion.tr
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={report.id}
                        className="group hover:bg-slate-50/50 transition-all duration-200"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 overflow-hidden border border-slate-200 shadow-sm">
                              {report.reporter.avatarUrl ? (
                                <img
                                  src={report.reporter.avatarUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                                  <User size={20} />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                {report.reporter.fullName ||
                                  report.reporter.username}
                              </p>
                              <p className="text-xs text-slate-500">
                                @{report.reporter.username}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">
                              {report.tour.title}
                            </span>
                            <span className="text-xs text-slate-400 font-medium mt-0.5">
                              #{report.tour.tourCode}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="max-w-[300px]">
                            <p className="text-sm text-slate-600 line-clamp-2 italic">
                              "{report.reason}"
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-700">
                              {new Date(report.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(report.createdAt).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" },
                              )}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${getStatusColor(report.status)}`}
                          >
                            {getStatusIcon(report.status)}
                            {report.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            {report.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(report.id, "RESOLVED")
                                  }
                                  className="p-2.5 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all shadow-sm shadow-emerald-500/5 bg-white border border-slate-100"
                                  title="Mark as Resolved"
                                >
                                  <CheckCircle2 size={18} />
                                </button>
                                <button
                                  onClick={() =>
                                    handleUpdateStatus(report.id, "DISMISSED")
                                  }
                                  className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all shadow-sm bg-white border border-slate-100"
                                  title="Dismiss Report"
                                >
                                  <XCircle size={18} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => {
                                setSelectedTourId(report.tour.id);
                                setIsDetailModalOpen(true);
                              }}
                              className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all bg-white border border-slate-100"
                              title="View Tour Details"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">
                Page{" "}
                <span className="text-slate-900 font-bold">
                  {currentPage + 1}
                </span>{" "}
                of{" "}
                <span className="text-slate-900 font-bold">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="p-2.5 text-slate-600 hover:bg-white hover:text-primary rounded-xl transition-all disabled:opacity-30 disabled:hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-200"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  disabled={currentPage === totalPages - 1}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2.5 text-slate-600 hover:bg-white hover:text-primary rounded-xl transition-all disabled:opacity-30 disabled:hover:text-slate-600 shadow-sm border border-transparent hover:border-slate-200"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <AdminTourDetailModal
        tourId={selectedTourId}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTourId(null);
        }}
      />
    </div>
  );
};

export default AdminReportManagementPage;
