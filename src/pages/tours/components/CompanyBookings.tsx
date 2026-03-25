import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  FileText,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
} from "lucide-react";
import { bookingService } from "../../checkout/services/bookingService";
import { CompanyBookingResponse } from "../../checkout/types";
import Header from "../../../components/layout/Header";
import { useNavigate } from "react-router-dom";

const CompanyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<CompanyBookingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(1);
  const [size] = useState(10);

  // Filters
  const [search, setSearch] = useState("");
  const [tourName, setTourName] = useState("");
  const [status, setStatus] = useState<string>("");
  const [startDateFrom, setStartDateFrom] = useState("");
  const [startDateTo, setStartDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getCompanyBookings({
        page,
        size,
        search: search || undefined,
        tourName: tourName || undefined,
        status: status || undefined,
        startDateFrom: startDateFrom || undefined,
        startDateTo: startDateTo || undefined,
      });
      setBookings(data.content);
      setTotalElements(data.totalElements);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [page, status]); // Refetch on page or status change automatically

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchBookings();
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn thay đổi trạng thái đơn đặt tour này?",
      )
    ) {
      return;
    }

    try {
      await bookingService.updateBookingStatus(id, newStatus);
      fetchBookings(); // Refresh the list
    } catch (error) {
      console.error("Failed to update status:", error);
      alert("Cập nhật trạng thái thất bại. Vui lòng thử lại.");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-700 border-green-200";
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "REFUND_REQUESTED":
        return "bg-red-100 text-red-700 border-red-200";
      case "REFUNDED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "Chờ T.Toán";
      case "CONFIRMED":
        return "Đã X.Nhận";
      case "CANCELLED":
        return "Đã Hủy";
      case "COMPLETED":
        return "Hoàn thành";
      case "REFUND_REQUESTED":
        return "Đã Hủy";
      case "REFUNDED":
        return "Đã Hủy";
      default:
        return status;
    }
  };

  const totalPages = Math.ceil(totalElements / size);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Header onBookClick={() => navigate("/tours")} />
      <div className="max-w-7xl mx-auto pt-24 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Quản lý Đặt Tour
            </h1>
            <p className="mt-2 text-gray-600">
              Xem và quản lý danh sách khách hàng đặt tour của bạn.
            </p>
          </div>
          <button
            className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
            onClick={() => window.print()}
          >
            <Download size={18} />
            Xuất báo cáo
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-grow relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm theo tên khách hàng hoặc mã đơn..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-all ${showFilters ? "bg-blue-50 border-blue-200 text-blue-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                Bộ lọc
              </button>
              <button
                type="submit"
                className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition-colors"
              >
                Tìm kiếm
              </button>
            </div>
          </form>

          {/* Extended Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên Tour
                </label>
                <input
                  type="text"
                  placeholder="Lọc theo tên tour..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={tourName}
                  onChange={(e) => setTourName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="PENDING_PAYMENT">Chờ thanh toán</option>
                  <option value="CONFIRMED">Đã xác nhận</option>
                  <option value="COMPLETED">Hoàn thành</option>
                  <option value="CANCELLED">Đã hủy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Từ ngày
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={startDateFrom}
                  onChange={(e) => setStartDateFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đến ngày
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={startDateTo}
                  onChange={(e) => setStartDateTo(e.target.value)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Mã đơn / Khách hàng
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Thông tin Tour
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-center">
                    Số lượng
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-900 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td
                        colSpan={5}
                        className="px-6 py-8 h-20 bg-gray-50/20"
                      ></td>
                    </tr>
                  ))
                ) : bookings.length > 0 ? (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-mono text-sm font-medium text-blue-600">
                            {booking.bookingCode}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-gray-900 font-medium">
                            <User size={14} className="text-gray-400" />
                            {booking.customerName}
                          </div>
                          <span className="text-xs text-gray-500 mt-0.5">
                            {booking.customerPhone}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 line-clamp-1">
                            {booking.tourName}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500">
                            <Calendar size={13} />
                            Khởi hành:{" "}
                            {booking.startDate
                              ? new Date(booking.startDate).toLocaleDateString(
                                  "vi-VN",
                                )
                              : "N/A"}
                          </div>
                          <span className="text-[10px] text-gray-400 mt-0.5 italic">
                            Đặt ngày:{" "}
                            {new Date(booking.createdAt).toLocaleString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-sm font-semibold text-gray-900">
                            {booking.adults + booking.children}
                          </span>
                          <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                            {booking.adults}L / {booking.children}T
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-900">
                          {booking.totalAmount.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {booking.status === "PENDING_PAYMENT" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "CONFIRMED")
                                }
                                className="text-xs px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                              >
                                Xác nhận
                              </button>
                              <button
                                onClick={() =>
                                  handleStatusChange(booking.id, "CANCELLED")
                                }
                                className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                              >
                                Hủy
                              </button>
                            </>
                          )}
                          {booking.status === "CONFIRMED" && (
                            <button
                              onClick={() =>
                                handleStatusChange(booking.id, "COMPLETED")
                              }
                              className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                              Hoàn thành
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500">
                        <FileText size={48} className="text-gray-200 mb-4" />
                        <p className="text-lg font-medium">
                          Chưa có đơn đặt tour nào
                        </p>
                        <p className="text-sm">
                          Khi có khách hàng đặt tour, thông tin sẽ hiển thị tại
                          đây.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!loading && bookings.length > 0 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-medium">{(page - 1) * size + 1}</span> -{" "}
                <span className="font-medium">
                  {Math.min(page * size, totalElements)}
                </span>{" "}
                trên <span className="font-medium">{totalElements}</span> kết
                quả
              </span>
              <div className="flex gap-2">
                <button
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="flex items-center px-4 text-sm font-medium text-gray-700">
                  Trang {page} / {totalPages}
                </div>
                <button
                  className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyBookings;
