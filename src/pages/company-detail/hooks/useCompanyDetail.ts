import React, { useState, useEffect } from "react";
import { companyService } from "../services/companyService";
import { tourService } from "../../tours/services/tourService";
import { Company } from "../types";
import { Tour } from "../../tours/types";
import { getToken } from "../../../configs/api";

export const useCompanyDetail = (id: string | undefined) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [activeTours, setActiveTours] = useState<Tour[]>([]);
  const [otherTours, setOtherTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const fetchTours = async (companyId: number | string) => {
    try {
      // Fetch tours for this company
      const companyData = await tourService.getTours(1, 10, Number(companyId));
      const mappedCompanyTours: Tour[] = companyData.content.map(item => ({
        id: String(item.id),
        name: item.title,
        description: `Experience the best of ${item.placeName}.`,
        image: item.thumbnail || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80",
        gallery: [],
        adultPrice: item.adultPrice,
        childrenPrice: 0,
        duration: `${item.durationDays}D / ${item.durationNights}N`,
        rating: 4.5, // Mock rating if not available
        reviewCount: 0,
        zone: item.placeName as any,
        highlights: [],
        itinerary: [],
        reviews: [],
        companyId: Number(companyId)
      }));
      setActiveTours(mappedCompanyTours);

      // Fetch some other tours for variety
      const otherData = await tourService.searchTours(1, 6);
      const mappedOtherTours: Tour[] = otherData.content
        .filter(item => String(item.id) !== String(companyId)) // Just a simple filter if possible
        .map(item => ({
          id: String(item.id),
          name: item.title,
          description: `Discover ${item.placeName}.`,
          image: item.thumbnail || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80",
          gallery: [],
          adultPrice: item.adultPrice,
          childrenPrice: 0,
          duration: `${item.durationDays}D / ${item.durationNights}N`,
          rating: item.averageRating || 4.0,
          reviewCount: item.reviewCount || 0,
          zone: item.placeName as any,
          highlights: [],
          itinerary: [],
          reviews: [],
        }));
      
      // Filter out tours that are already in activeTours
      const finalOtherTours = mappedOtherTours.filter(ot => 
        !mappedCompanyTours.some(ct => ct.id === ot.id)
      ).slice(0, 3);
      
      setOtherTours(finalOtherTours);
    } catch (err) {
      console.error("Failed to fetch tours:", err);
    }
  };

  const fetchCompanyData = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await companyService.getCompanyById(id);
      setCompany(data);
      setIsFollowed(!!data.isFollowed);
      
      await fetchTours(id);
    } catch (err: any) {
      setError(err.message || "Failed to load company details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [id]);

  const handleToggleFollow = async () => {
    if (!id) return;
    
    if (!getToken()) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 5000);
      return;
    }

    const previousFollowStatus = isFollowed;
    // Optimistic update
    setIsFollowed(!previousFollowStatus);

    try {
      const response = await companyService.toggleFollow(id);
      // Backend might return 'isFollowing' or 'following' 
      const isFollowing = typeof response.isFollowing === 'boolean' 
        ? response.isFollowing 
        : (response as any).following;

      if (typeof isFollowing === 'boolean') {
        setIsFollowed(isFollowing);
      }
      
      // Re-fetch everything to ensure state is in sync (satisfies "reset trang" requirement)
      await fetchCompanyData();
    } catch (err: any) {
      // Rollback on error
      setIsFollowed(previousFollowStatus);
      setError(err.message || "Failed to toggle follow status");
    }
  };

  return {
    company,
    isFollowed,
    activeTours,
    otherTours,
    isLoading,
    error,
    showLoginPrompt,
    setShowLoginPrompt,
    handleToggleFollow,
    fetchCompanyData,
  };
};
