import { useState, useEffect } from "react";
import { tourService } from "../services/tourService";
import { Tour, ZoneType } from "../../../types/types";
import { ViewType } from "../types/tours.types";

export const useTours = () => {
    const [viewType, setViewType] = useState<ViewType>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedZone, setSelectedZone] = useState<ZoneType | "ALL">("ALL");
    const [priceRange, setPriceRange] = useState(50000000);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string>("id,desc");
    const [selectedDurations, setSelectedDurations] = useState<string[]>([]);
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                setLoading(true);

                const filters: any = {
                    keyword: searchQuery || undefined,
                    zone: selectedZone !== "ALL" ? selectedZone : undefined,
                    maxPrice: priceRange < 50000000 ? priceRange : undefined,
                    sort: sortBy
                };

                if (selectedDurations.length > 0) {
                    const ranges = selectedDurations.map(d => {
                        if (d === "1-3 Days") return { min: 1, max: 3 };
                        if (d === "4-7 Days") return { min: 4, max: 7 };
                        if (d === "> 7 Days") return { min: 8, max: 100 };
                        return { min: 1, max: 100 };
                    });
                    filters.minDuration = Math.min(...ranges.map(r => r.min));
                    filters.maxDuration = Math.max(...ranges.map(r => r.max));
                }

                const data = await tourService.searchTours(1, 100, filters);

                const mappedTours: Tour[] = data.content.map(item => ({
                    id: String(item.id),
                    name: item.title,
                    description: `Discover the beauty of ${item.placeName}.`,
                    image: item.thumbnail || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80",
                    gallery: [],
                    adultPrice: item.adultPrice,
                    childrenPrice: 0,
                    duration: `${item.durationDays}D / ${item.durationNights}N`,
                    rating: item.averageRating || 0,
                    reviewCount: item.reviewCount || 0,
                    zone: item.placeName as any,
                    highlights: [],
                    itinerary: [],
                    reviews: [],
                    capacity: item.capacity,
                    availableSlots: item.availableSlots
                }));
                setTours(mappedTours);
            } catch (err) {
                console.error("Failed to fetch tours:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTours();
    }, [searchQuery, selectedZone, priceRange, sortBy, selectedDurations]);

    return {
        viewType,
        setViewType,
        searchQuery,
        setSearchQuery,
        selectedZone,
        setSelectedZone,
        priceRange,
        setPriceRange,
        isFilterOpen,
        setIsFilterOpen,
        sortBy,
        setSortBy,
        selectedDurations,
        setSelectedDurations,
        tours,
        loading,
    };
};
