import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Filter,
  MoreHorizontal,
  UserX,
  ShieldCheck,
  Mail,
  Phone,
  Calendar,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Eye,
  Settings2,
} from "lucide-react";
import { useAdminUserManagement } from "../hooks/useAdminUserManagement";
import UserModal from "./UserModal";

const AdminUserManagementPage: React.FC = () => {
  const {
    usersData,
    filteredUsers,
    isLoading,
    statusFilter,
    searchQuery,
    setSearchQuery,
    page,
    stats,
    handleDeleteUser,
    handleCreateUser,
    handleUpdateUser,
    openEditModal,
    openViewModal,
    handlePageChange,
    handleStatusFilterChange,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    selectedUser,
    isSubmitting,
  } = useAdminUserManagement();

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return (
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold border border-emerald-500/20 flex items-center gap-1 w-fit">
            <ShieldCheck size={12} /> ACTIVE
          </span>
        );
      case "DELETED":
        return (
          <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-xs font-bold border border-rose-500/20 flex items-center gap-1 w-fit">
            <UserX size={12} /> DELETED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-xs font-bold border border-amber-500/20 flex items-center gap-1 w-fit">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Stats Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-2"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900">
              User Management
            </h1>
          </motion.div>
          <p className="text-gray-500 font-medium ml-15">
            Monitor and manage all system users
          </p>
        </div>

        <div className="flex gap-4">
          <div className="p-4 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center gap-4 min-w-[160px]">
            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
              <Users size={20} />
            </div>
            <div>
              <div className="text-2xl font-black text-gray-900 leading-none">
                {stats?.total || 0}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                Total Users
              </div>
            </div>
          </div>
          <div className="p-4 rounded-[2rem] bg-white border border-gray-100 shadow-sm flex items-center gap-4 min-w-[160px]">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-500">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-600 leading-none">
                {stats?.active || 0}
              </div>
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-1">
                Active Now
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
        {/* Filters Bar */}
        <div className="p-6 border-b border-gray-50 bg-gray-50/30 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, email or username..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex bg-white p-1.5 rounded-2xl border border-gray-200 gap-1 w-full md:w-auto">
              {["ALL", "ACTIVE", "DELETED"].map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    statusFilter === status
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <button className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
              <Filter size={18} />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  User Details
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Contact
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Joined Date
                </th>
                <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                  Status
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={`skeleton-${i}`} className="animate-pulse">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100" />
                          <div className="space-y-2">
                            <div className="w-32 h-4 bg-gray-100 rounded" />
                            <div className="w-24 h-3 bg-gray-50 rounded" />
                          </div>
                        </div>
                      </td>
                      <td
                        colSpan={4}
                        className="px-6 py-6 font-medium text-gray-400"
                      >
                        Loading user data...
                      </td>
                    </tr>
                  ))
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user.username}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4 text-left">
                          <div className="relative w-12 h-12 shrink-0">
                            <img
                              src={
                                user.profile?.avatarUrl ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.profile?.fullName || user.username)}&background=random`
                              }
                              alt={user.profile?.fullName}
                              className="w-full h-full rounded-2xl object-cover ring-2 ring-white shadow-sm"
                            />
                            {user.emailVerified && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white">
                                <ShieldCheck size={10} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <div className="text-left">
                            <div className="font-black text-gray-900 group-hover:text-primary transition-colors">
                              {user.profile?.fullName || "Anonymous User"}
                            </div>
                            <div className="text-xs font-bold text-gray-400 flex items-center gap-1.5 mt-0.5 lowercase text-left">
                              @{user.username}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                            <Mail size={12} className="text-gray-400" />
                            {user.email}
                          </div>
                          {user.profile?.phone && (
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                              <Phone size={12} className="text-gray-400" />
                              {user.profile.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openViewModal(user)}
                            className="p-2.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-xl transition-all"
                            title="Edit User"
                          >
                            <Settings2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2.5 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all shadow-sm shadow-rose-500/5"
                            title="Deactivate user"
                          >
                            <UserX size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-3xl bg-gray-50 flex items-center justify-center text-gray-300">
                          <Users size={32} />
                        </div>
                        <p className="text-gray-400 font-bold">
                          No users found matching your criteria.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-6 border-t border-gray-50 bg-gray-50/10 flex items-center justify-between">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Showing{" "}
            <span className="text-gray-900">{filteredUsers.length}</span> of{" "}
            <span className="text-gray-900">{stats?.total || 0}</span> users
          </p>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
              >
                <ChevronLeft size={18} />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: usersData?.totalPages || 1 }).map(
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() => handlePageChange(i + 1)}
                      className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                        page === i + 1
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-gray-400 hover:bg-white hover:text-gray-900"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ),
                )}
              </div>

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === (usersData?.totalPages || 1)}
                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-white hover:border-primary hover:text-primary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:border-gray-200 disabled:hover:text-gray-500 transition-all"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsCreateModalOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-white rounded-[1.5rem] shadow-2xl shadow-primary/40 flex items-center justify-center z-50 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <UserPlus size={24} />
      </motion.button>

      {/* CRUD Modals */}
      <UserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSubmit={handleCreateUser}
        isLoading={isSubmitting}
      />

      <UserModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        user={selectedUser}
        onSubmit={(data) => selectedUser && handleUpdateUser(selectedUser.id, data)}
        isLoading={isSubmitting}
      />

      <UserModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        mode="view"
        user={selectedUser}
      />
    </div>
  );
};

export default AdminUserManagementPage;
