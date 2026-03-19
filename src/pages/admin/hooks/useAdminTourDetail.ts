import { useState, useEffect } from "react";
import { adminTourService } from "../services/adminTourService";
import { TourDetail } from "../../tours/types";

export const useAdminTourDetail = (tourId: number | string | null, isOpen: boolean) => {
  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "itinerary" | "schedules">("overview");

  useEffect(() => {
    if (isOpen && tourId) {
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const data = await adminTourService.getTourDetail(tourId);
          setTour(data);
          setError(null);
        } catch (err: any) {
          setError(err.message || "Failed to fetch tour details");
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    } else if (!isOpen) {
      setTour(null);
      setActiveTab("overview");
    }
  }, [isOpen, tourId]);

  const parseItinerary = (itineraryStr: string) => {
    if (!itineraryStr) return [];
    const lines = itineraryStr.split("\n").filter(line => line.trim() !== "");
    const mappedItinerary: { day: number; title: string; description: string }[] = [];
    
    if (lines.length > 0 && lines[0].toLowerCase().includes("day")) {
      let currentDay = 0;
      lines.forEach((line) => {
        if (line.toLowerCase().startsWith("day")) {
          currentDay++;
          const parts = line.split(":");
          mappedItinerary.push({
            day: currentDay,
            title: parts[0].trim(),
            description: parts.slice(1).join(":").trim() || "Activities for the day",
          });
        } else if (mappedItinerary.length > 0) {
          mappedItinerary[mappedItinerary.length - 1].description += " " + line.trim();
        }
      });
    } else {
      mappedItinerary.push({
        day: 1,
        title: "Full Journey",
        description: itineraryStr,
      });
    }
    return mappedItinerary;
  };

  const handleRetry = async () => {
    if (!tourId) return;
    try {
      setLoading(true);
      const data = await adminTourService.getTourDetail(tourId);
      setTour(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch tour details");
    } finally {
      setLoading(false);
    }
  };

  return {
    tour,
    loading,
    error,
    activeTab,
    setActiveTab,
    parseItinerary,
    handleRetry
  };
};
