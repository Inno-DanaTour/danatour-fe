import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useScroll, useSpring } from "framer-motion";
import { tourService } from "../../tours/services/tourService";
import { companyService } from "../../company-detail/services/companyService";

import { Tour, ItineraryItem, Company, TourReportRequest } from "../../../types/types";
import { DetailTab, Toast, ToastType } from "../types/tour-detail.types";

export const useTourDetail = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
    });

    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const [company, setCompany] = useState<Company | null>(null);
    const [allCompanies, setAllCompanies] = useState<Company[]>([]);
    const [activeTab, setActiveTab] = useState<DetailTab>("overview");
    const [showReportModal, setShowReportModal] = useState(false);
    const [reportReason, setReportReason] = useState("");
    const [reportNote, setReportNote] = useState("");
    const [isReporting, setIsReporting] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);
    const [toastCounter, setToastCounter] = useState(0);

    const addToast = (type: ToastType, message: string) => {
        const toastId = toastCounter + 1;
        setToastCounter(toastId);
        setToasts((prev) => [...prev, { id: toastId, type, message }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== toastId));
        }, 4000);
    };

    const handleReportSubmit = async () => {
        if (!reportReason) {
            addToast("error", "Please select a reason for reporting");
            return;
        }

        if (!id) return;

        try {
            setIsReporting(true);
            const reason = reportNote ? `[${reportReason}] ${reportNote}` : reportReason;
            const request: TourReportRequest = { reason };
            await tourService.reportTour(id, request);
            addToast("success", "Tour reported successfully. Thank you for your feedback.");
            setShowReportModal(false);
            setReportReason("");
            setReportNote("");
        } catch (err) {
            console.error("Failed to report tour:", err);
            addToast("error", "Failed to report tour. Please try again later.");
        } finally {
            setIsReporting(false);
        }
    };

    useEffect(() => {
        const fetchDetail = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await tourService.getTourDetail(id);

                // Parse itinerary string into ItineraryItem[]
                let mappedItinerary: ItineraryItem[] = [];
                if (data.itinerary) {
                    const lines = data.itinerary
                        .split("\n")
                        .filter((line) => line.trim() !== "");
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
                        mappedItinerary = [
                            {
                                day: 1,
                                title: "Full Journey",
                                description: data.itinerary,
                            },
                        ];
                    }
                }

                const mappedTour: Tour = {
                    id: String(data.id),
                    name: data.title,
                    description: data.description,
                    image: data.images[0]?.imageUrl || "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&q=80",
                    gallery: data.images.map((img) => img.imageUrl),
                    adultPrice: data.adultPrice,
                    childrenPrice: data.childrenPrice,
                    duration: `${data.durationDays}D / ${data.durationNights}N`,
                    rating: data.averageRating || 0,
                    reviewCount: data.reviewCount || 0,
                    zone: data.place.name as any,
                    highlights: [
                        "Local Guide",
                        "Transportation",
                        "Entrance Fees",
                        "Lunch included",
                    ],
                    itinerary: mappedItinerary,
                    reviews: [],
                    schedules: data.schedules,
                    companyId: data.companyId,
                };
                setTour(mappedTour);

                if (data.companyId) {
                    try {
                        const companyData = await companyService.getCompanyById(data.companyId);
                        setCompany(companyData);
                    } catch (cErr) {
                        console.error("Failed to fetch company info:", cErr);
                    }
                }

                try {
                    const companies = await companyService.getAllCompanies();
                    setAllCompanies(companies);
                } catch (acErr) {
                    console.error("Failed to fetch all companies:", acErr);
                }
            } catch (err) {
                console.error("Failed to fetch tour detail:", err);
                navigate("/tours");
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id, navigate]);

    useEffect(() => {
        if (tour?.name) {
            document.title = `${tour.name} | DanaTour`;
        }
        return () => {
            document.title = "DanaTour | Authentic Local Experiences";
        };
    }, [tour]);

    return {
        id,
        tour,
        loading,
        company,
        allCompanies,
        activeTab,
        setActiveTab,
        showReportModal,
        setShowReportModal,
        reportReason,
        setReportReason,
        reportNote,
        setReportNote,
        isReporting,
        toasts,
        scaleX,
        handleReportSubmit,
        navigate,
    };
};
