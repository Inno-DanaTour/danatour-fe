import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { promotionService } from "../services/promotionService";
import { PromotionResponse, PromotionUsageResponse } from "../types/promotions.types";

export const usePromotionDetail = () => {
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

    const fetchUsage = useCallback(async () => {
        if (!id) return;
        try {
            setLoadingUsages(true);
            const data = await promotionService.getPromotionUsage(id, isAdminView);
            setUsages(data);
        } catch (err: any) {
            console.error("Failed to fetch usage:", err);
        } finally {
            setLoadingUsages(false);
        }
    }, [id, isAdminView]);

    const fetchDetail = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await promotionService.getPromotionById(id);
            setPromotion(data);
            fetchUsage();
        } catch (err: any) {
            setError(err.message || "Failed to load promotion details");
        } finally {
            setLoading(false);
        }
    }, [id, fetchUsage]);

    useEffect(() => {
        if (id) {
            fetchDetail();
        }
    }, [id, fetchDetail]);

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
                setTimeout(() => fetchDetail(), 2500);
                setTimeout(() => setDeleteResult(null), 2500);
            }
        } catch (err: any) {
            setError("Thao tác thất bại: " + (err.message || "Unknown error"));
            setIsDeleting(false);
        }
    };

    return {
        id,
        navigate,
        isAdminView,
        promotion,
        loading,
        error,
        isDeleting,
        deleteResult,
        usages,
        loadingUsages,
        isModalOpen,
        setIsModalOpen,
        handleToggleStatus,
        handleDelete,
        fetchDetail,
    };
};
