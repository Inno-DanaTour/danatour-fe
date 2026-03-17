import React, { useState, useEffect } from "react";
import { companyService } from "../services/companyService";
import { Company, Tour } from "../../../types/types";
import { TOURS } from "../../../constants/constants";
import { getToken } from "../../../configs/api";

export const useCompanyDetail = (id: string | undefined) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const [activeTours, setActiveTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const fetchCompanyData = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await companyService.getCompanyById(id);
      setCompany(data);
      setIsFollowed(!!data.isFollowed);
      // Still mocking tours for now as backend doesn't have tours per company yet
      setActiveTours(TOURS.slice(0, 3));
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

    try {
      const response = await companyService.toggleFollow(id);
      setIsFollowed(response.is_following);
    } catch (err: any) {
      setError(err.message || "Failed to toggle follow status");
    }
  };

  return {
    company,
    isFollowed,
    activeTours,
    isLoading,
    error,
    showLoginPrompt,
    setShowLoginPrompt,
    handleToggleFollow,
    fetchCompanyData,
  };
};
