import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    TicketPercent,
    Calendar,
    Users,
    TrendingUp,
    ArrowLeft,
    Trash2,
    ToggleLeft as Toggle,
    Loader2,
    Package,
    ChevronRight,
    CreditCard,
    Percent,
    MapPin,
    AlertCircle,
    Edit
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../../components/layout/Header";
import PromotionModal from "../../components/promotions/PromotionModal";
import { promotionService } from "./services/promotionService";
import { PromotionResponse, PromotionUsageResponse } from "../../types/types";

const PromotionDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isAdminView = location.pathname.startsWith("/admin");
    const [promotion, setPromotion] = useState<PromotionResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteResult, setDeleteResult] = useState<"DELETED" | "DEACTIVATED" | null>(null);
    const [usages, setUsages] = useState<PromotionUsageResponse[]>([]);
    const [loadingUsages, setLoadingUsages] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id]);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const data = await promotionService.getPromotionById(id!);
            setPromotion(data);
            fetchUsage();
        } catch (err: any) {
            setError(err.message || "Failed to load promotion details");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsage = async () => {
        try {
            setLoadingUsages(true);
            const data = await promotionService.getPromotionUsage(id!, isAdminView);
            setUsages(data);
        } catch (err: any) {
            console.error("Failed to fetch usage:", err);
        } finally {
            setLoadingUsages(false);
        }
    };

    const handleToggleStatus = async () => {
        if (!promotion) return;
        try {
            await promotionService.togglePromotionStatus(promotion.id, !promotion.isActive);
            setPromotion({ ...promotion, isActive: !promotion.isActive });
        } catch (err: any) {
            alert("Failed to toggle status: " + err.message);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Bạn có chắc muốn xóa/tắt mã khuyến mãi này không?")) return;
        try {
            setIsDeleting(true);
            let result: string;
            if (isAdminView) {
                result = await promotionService.deleteAdminPromotion(id!);
            } else {
                result = await promotionService.deleteCompanyPromotion(id!);
            }
            setDeleteResult(result as "DELETED" | "DEACTIVATED");
            if (result === "DELETED") {
                setTimeout(() => navigate(-1), 2500);
            } else {
                // Refresh the data to reflect the new inactive state
                setTimeout(() => fetchDetail(), 2500);
                setTimeout(() => setDeleteResult(null), 2500);
            }
        } catch (err: any) {
            setError("Thao tác thất bại: " + (err.message || "Unknown error"));
            setIsDeleting(false);
        }
    };

    // Delete result overlay UI
    if (deleteResult) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl p-16 text-center max-w-lg w-full mx-4"
                >
                    {deleteResult === "DELETED" ? (
                        <>
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 size={40} className="text-green-600" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Đã xóa thành công!</h2>
                            <p className="text-gray-500">Mã khuyến mãi đã được xóa vĩnh viễn khỏi hệ thống.</p>
                        </>
                    ) : (
                        <>
                            <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Toggle size={40} className="text-amber-600" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Không thể xóa vĩnh viễn!</h2>
                            <p className="text-gray-500">Mã đã được sử dụng bởi khách hàng, nên đã được <strong>vô hiệu hóa</strong> thay thế để bảo toàn lịch sử đặt tour.</p>
                        </>
                    )}
                </motion.div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !promotion) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl text-center max-w-md">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black mb-2">Oops! Error</h2>
                    <p className="text-gray-500 mb-6">{error || "Promotion not found"}</p>
                    <button onClick={() => navigate(-1)} className="btn-primary w-full py-4">Go Back</button>
                </div>
            </div>
        );
    }

    const usagePercentage = promotion.usageLimit ? (promotion.usedCount / promotion.usageLimit) * 100 : 0;
    const isExpired = new Date(promotion.validTo) < new Date();

    return (
        <div className="min-h-screen bg-transparent pb-20">
            {!isAdminView && <Header onBookClick={() => navigate("/tours")} />}

            <main className={`${isAdminView ? 'pt-8' : 'pt-24 md:pt-32'} px-4 md:px-6 max-w-5xl mx-auto`}>
                {/* Navigation & Actions */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-400 hover:text-black font-black uppercase tracking-widest text-xs transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Dashboard
                    </button>

                    <div className="flex gap-3 w-full md:w-auto">
                        <button
                            onClick={handleToggleStatus}
                            className={`flex-1 md:flex-none px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${promotion.isActive
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                                }`}
                        >
                            <Toggle size={18} /> {promotion.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex-1 md:flex-none px-6 py-3 bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                        >
                            <Edit size={18} /> Edit
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="flex-1 md:flex-none px-6 py-3 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                        >
                            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                            Delete
                        </button>
                    </div>
                </div>

                {/* Main Stats Card */}
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl shadow-black/5 overflow-hidden mb-8">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row justify-between gap-8 mb-12">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${promotion.isActive && !isExpired ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                        }`}>
                                        {isExpired ? "Expired" : promotion.isActive ? "Active" : "Inactive"}
                                    </span>
                                    <span className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                        {promotion.sponsorType} Sponsored
                                    </span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">{promotion.title || "Special Promotion"}</h1>
                                <p className="text-xl text-gray-400 font-mono tracking-[0.2em]">{promotion.code}</p>
                            </div>

                            <div className="bg-primary text-white p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-primary/20 flex flex-col justify-center items-center md:items-start min-w-[240px]">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">Discount Value</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black">
                                        {promotion.discountType === 'PERCENTAGE' ? promotion.discountValue : promotion.discountValue.toLocaleString()}
                                    </span>
                                    <span className="text-xl font-black">{promotion.discountType === 'PERCENTAGE' ? '%' : 'VND'}</span>
                                </div>
                                {promotion.maxDiscountAmount && (
                                    <p className="text-xs font-bold mt-2 opacity-80 italic">Up to {promotion.maxDiscountAmount.toLocaleString()} VND</p>
                                )}
                            </div>
                        </div>

                        {/* Usage Progress */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Redemption Progress</p>
                                    <p className="text-2xl font-black">{promotion.usedCount} <span className="text-gray-300 text-lg">/ {promotion.usageLimit || '∞'}</span></p>
                                </div>
                                <p className="text-sm font-black text-primary">{Math.round(usagePercentage)}% Used</p>
                            </div>
                            <div className="h-4 bg-gray-50 rounded-full overflow-hidden p-1">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(usagePercentage, 100)}%` }}
                                    className="h-full bg-primary rounded-full shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-primary">
                                <Calendar size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Validity Period</p>
                                <p className="text-sm font-bold">{new Date(promotion.validFrom).toLocaleDateString()} - {new Date(promotion.validTo).toLocaleDateString()}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-cta">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Est. Savings</p>
                                <p className="text-sm font-bold">~ {(promotion.usedCount * (promotion.discountType === 'FIXED_AMOUNT' ? promotion.discountValue : 50000)).toLocaleString()} VND</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-blue-500">
                                <Users size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Redemption Stats</p>
                                <p className="text-sm font-bold">{promotion.usedCount} People Used</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Applied Tours Section */}
                <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <Package className="text-primary" size={24} />
                    Manage <span className="text-primary">Applied Tours</span>
                </h2>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-2 overflow-hidden">
                    {promotion.appliedTours && promotion.appliedTours.length > 0 ? (
                        <div className="flex flex-col">
                            {promotion.appliedTours.map((tour) => (
                                <div key={tour.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-all rounded-3xl group border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                                            {tour.thumbnailUrl ? (
                                                <img src={tour.thumbnailUrl} alt={tour.title} className="w-full h-full object-cover" />
                                            ) : (
                                                <MapPin className="text-gray-300" size={32} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Target Tour</p>
                                            <p className="text-xl font-black">{tour.title}</p>
                                            <p className="text-sm font-medium text-gray-400 text-xs italic">ID: #{tour.id}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/tours/${tour.id}`)}
                                        className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm"
                                    >
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 text-center">
                            <div className="w-20 h-20 bg-primary/5 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                                <TicketPercent size={40} />
                            </div>
                            <h3 className="text-xl font-black mb-2">Platform-wide Promotion</h3>
                            <p className="text-gray-500 max-w-sm mx-auto font-medium">
                                This code is applicable to all eligible tours across the Danatour platform.
                            </p>
                        </div>
                    )}
                </div>

                {/* Usage History Section */}
                <div className="mt-16">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
                        <Users className="text-primary" size={24} />
                        Detailed <span className="text-primary">User Usage History</span>
                    </h2>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        {loadingUsages ? (
                            <div className="p-20 text-center">
                                <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-4" />
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Fetching User Data...</p>
                            </div>
                        ) : usages.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100 text-left">
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">User Info</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Booking Code</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Date Used</th>
                                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Discount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {usages.map((usage, index) => (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-400">
                                                            {usage.fullName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-gray-900">{usage.fullName}</p>
                                                            <p className="text-xs text-gray-400">@{usage.username} • {usage.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className="font-mono text-sm font-bold bg-gray-100 px-3 py-1 rounded-lg text-gray-600 border border-gray-200">
                                                        {usage.bookingCode}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm font-bold text-gray-600">{new Date(usage.usedAt).toLocaleString()}</p>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="font-black text-primary">
                                                        -{usage.discountAmount.toLocaleString()} VND
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-20 text-center">
                                <div className="w-20 h-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <TrendingUp size={40} />
                                </div>
                                <h3 className="text-xl font-black mb-2 text-gray-400">No redemptions yet</h3>
                                <p className="text-gray-400 max-w-sm mx-auto font-medium">
                                    This promotion code has not been used by any customers yet.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <PromotionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchDetail(); // Refresh data after update
                }}
                initialData={promotion || undefined}
                mode="EDIT"
                role={isAdminView ? "ADMIN" : "COMPANY"}
            />
        </div>
    );
};

export default PromotionDetail;
