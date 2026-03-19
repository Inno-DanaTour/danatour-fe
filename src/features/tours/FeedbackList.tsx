import React, { useState, useEffect } from "react";
import { Star, Filter, ChevronLeft, ChevronRight, Loader2, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { tourService } from "../../pages/tours/services/tourService.ts";
import { FeedbackResponse } from "../../pages/tours/types";
import { PagedResponse } from "../../types/common";
import { motion, AnimatePresence } from "framer-motion";
import { getUserIdFromToken, parseJwt, getToken } from "../../configs/api";

interface FeedbackListProps {
    tourId: number | string;
}

interface Toast {
    id: number;
    type: "success" | "error";
    message: string;
}

let toastCounter = 0;

const FeedbackList: React.FC<FeedbackListProps> = ({ tourId }) => {
    const [rating, setRating] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<PagedResponse<FeedbackResponse> | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const token = getToken();
    const currentUserId: number | null = getUserIdFromToken();
    const isAdmin = token ? (parseJwt(token)?.roles || []).includes("ROLE_ADMIN") : false;

    const addToast = (type: "success" | "error", message: string) => {
        const id = ++toastCounter;
        setToasts(prev => [...prev, { id, type, message }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3500);
    };

    const fetchFeedbacks = async () => {
        try {
            setLoading(true);
            const response = await tourService.getTourFeedbacks(tourId, {
                rating,
                page,
                size: 5,
                sort: "createdAt,desc"
            });
            setData(response);
        } catch (error) {
            console.error("Failed to fetch feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, [tourId, rating, page]);

    const handleRatingFilter = (r: number | undefined) => {
        setRating(r);
        setPage(1);
    };

    const handleDelete = async (feedbackId: number) => {
        if (!window.confirm("Bạn có chắc muốn xóa đánh giá này không?")) return;
        try {
            setDeletingId(feedbackId);
            await tourService.deleteFeedback(feedbackId);
            addToast("success", "Đánh giá đã được xóa thành công!");
            await fetchFeedbacks();
        } catch (error) {
            console.error("Failed to delete feedback:", error);
            addToast("error", "Không thể xóa đánh giá. Vui lòng thử lại.");
        } finally {
            setDeletingId(null);
        }
    };

    const canDelete = (feedback: FeedbackResponse): boolean => {
        if (isAdmin) return true;
        return currentUserId !== null && feedback.userId === currentUserId;
    };

    if (loading && !data) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 relative">

            {/* Toast Notifications */}
            <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 80, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 80, scale: 0.9 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                            className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-xl pointer-events-auto border text-sm font-bold
                                ${toast.type === "success"
                                    ? "bg-white border-green-100 text-green-700"
                                    : "bg-white border-red-100 text-red-600"
                                }`}
                            style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                        >
                            {toast.type === "success"
                                ? <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                                : <XCircle size={20} className="text-red-500 shrink-0" />
                            }
                            {toast.message}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-wider px-2">
                    <Filter size={16} />
                    <span>Filter:</span>
                </div>
                <button
                    onClick={() => handleRatingFilter(undefined)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${rating === undefined ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                >
                    All Reviews
                </button>
                {[5, 4, 3, 2, 1].map((r) => (
                    <button
                        key={r}
                        onClick={() => handleRatingFilter(r)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${rating === r ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                    >
                        {r} <Star size={14} fill={rating === r ? "white" : "currentColor"} className={rating === r ? "text-white" : "text-yellow-500"} />
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="relative min-h-[200px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center rounded-2xl">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {data && data.content.length > 0 ? (
                        <motion.div
                            key={`${rating}-${page}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            {data.content.map((feedback) => (
                                <div key={feedback.id} className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex gap-4 md:gap-6">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shrink-0 shadow-inner bg-gray-100">
                                        <img
                                            src={feedback.reviewerAvatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(feedback.reviewerName)}&background=random`}
                                            alt={feedback.reviewerName}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div>
                                                <h5 className="font-black text-gray-900 text-base md:text-lg" style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}>{feedback.reviewerName}</h5>
                                                <span className="text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-widest">
                                                    {new Date(feedback.createdAt).toLocaleDateString("vi-VN", {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className="flex gap-0.5">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            size={16}
                                                            fill={i < feedback.rating ? "#f59e0b" : "none"}
                                                            className={i < feedback.rating ? "text-yellow-500" : "text-gray-200"}
                                                        />
                                                    ))}
                                                </div>
                                                {canDelete(feedback) && (
                                                    <button
                                                        onClick={() => handleDelete(feedback.id)}
                                                        disabled={deletingId === feedback.id}
                                                        title="Xóa đánh giá"
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-red-100 text-red-500 bg-red-50 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                        style={{ fontFamily: "'Be Vietnam Pro', sans-serif" }}
                                                    >
                                                        {deletingId === feedback.id ? (
                                                            <Loader2 size={13} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={13} />
                                                        )}
                                                        Xóa
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm md:text-base leading-relaxed font-medium pt-1">
                                            {feedback.comment}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : !loading && (
                        <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100">
                            <Star className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-bold">No reviews found for this filter.</p>
                            <button
                                onClick={() => handleRatingFilter(undefined)}
                                className="mt-4 text-primary font-bold text-sm hover:underline"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {data && data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setPage(prev => Math.max(1, prev - 1))}
                        disabled={data.first}
                        className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: data.totalPages }).map((_, i) => {
                            const pageNum = i + 1;
                            if (
                                pageNum === 1 ||
                                pageNum === data.totalPages ||
                                (pageNum >= page - 1 && pageNum <= page + 1)
                            ) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setPage(pageNum)}
                                        className={`w-10 h-10 rounded-xl font-bold transition-all ${page === pageNum ? "bg-primary text-white shadow-lg shadow-primary/20" : "bg-white text-gray-500 hover:bg-gray-100"}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            } else if (pageNum === 2 || pageNum === data.totalPages - 1) {
                                return <span key={pageNum} className="px-1 text-gray-300">...</span>;
                            }
                            return null;
                        })}
                    </div>
                    <button
                        onClick={() => setPage(prev => Math.min(data.totalPages, prev + 1))}
                        disabled={data.last}
                        className="p-3 rounded-2xl bg-white border border-gray-100 text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default FeedbackList;
