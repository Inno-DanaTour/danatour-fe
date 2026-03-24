import { useState, useEffect } from "react";
import { promotionService } from "../../promotions/services/promotionService";
import { PromotionResponse } from "../../promotions/types";

export const useAdminPromotions = () => {
  const [promotions, setPromotions] = useState<PromotionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<PromotionResponse | null>(
    null,
  );
  const [sponsorFilter, setSponsorFilter] = useState<
    "ALL" | "PLATFORM" | "PROVIDER"
  >("ALL");

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      setLoading(true);
      const data = await promotionService.getAdminPromotions();
      setPromotions(data.content);
    } catch (error: any) {
      console.error("Failed to fetch promotions", error);
      const serverMsg = error.response?.data?.message || error.message;
      alert(`Error: ${serverMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredPromotions = promotions.filter((p) => {
    const matchesSearch =
      p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSponsor =
      sponsorFilter === "ALL" || p.sponsorType === sponsorFilter;
    return matchesSearch && matchesSponsor;
  });

  const handleOpenCreateModal = () => {
    setEditingPromo(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo: PromotionResponse) => {
    setEditingPromo(promo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  return {
    promotions,
    loading,
    searchQuery,
    setSearchQuery,
    isModalOpen,
    setIsModalOpen,
    editingPromo,
    setEditingPromo,
    sponsorFilter,
    setSponsorFilter,
    filteredPromotions,
    fetchPromotions,
    handleOpenCreateModal,
    handleOpenEditModal,
    handleCloseModal,
  };
};
