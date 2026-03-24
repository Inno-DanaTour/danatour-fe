import { useState, useEffect, useMemo } from "react";
import { userService } from "../services/userService";
import { UserPagedResponse, UserResponse } from "../types/user.types";

export const useAdminUserManagement = () => {
  const [usersData, setUsersData] = useState<UserPagedResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [page, statusFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await userService.getUsers(page - 1, 10);
      setUsersData(data);
    } catch (err: any) {
      setError(err.message || "Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    
    setIsSubmitting(true);
    try {
      await userService.deleteUser(userId);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to deactivate user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateUser = async (data: any) => {
    setIsSubmitting(true);
    try {
      await userService.createUser(data);
      setIsCreateModalOpen(false);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to create user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (userId: number, data: any) => {
    setIsSubmitting(true);
    try {
      await userService.updateUser(userId, data);
      setIsEditModalOpen(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || "Failed to update user.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const openViewModal = (user: UserResponse) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleStatusFilterChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const filteredUsers = useMemo(() => {
    if (!usersData) return [];
    let content = usersData.content;
    
    if (statusFilter !== "ALL") {
      content = content.filter(u => u.status === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      content = content.filter(u => 
        u.email.toLowerCase().includes(query) || 
        (u.profile?.fullName || "").toLowerCase().includes(query) ||
        u.username.toLowerCase().includes(query)
      );
    }
    
    return content;
  }, [usersData, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    if (!usersData) return null;
    return {
      total: usersData.totalElements,
      active: usersData.content.filter(u => u.status === "ACTIVE").length,
      deleted: usersData.content.filter(u => u.status === "DELETED").length,
    };
  }, [usersData]);

  return {
    usersData,
    filteredUsers,
    isLoading,
    error,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    page,
    stats,
    fetchUsers,
    handleDeleteUser,
    handleCreateUser,
    handleUpdateUser,
    openEditModal,
    openViewModal,
    handlePageChange,
    handleStatusFilterChange,
    isSubmitting,
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    selectedUser,
    setSelectedUser,
  };
};
