import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { tourService } from "../services/tourService";
import { TourImage } from "../types";
import { CategoryResponse, PlaceResponse } from "../../../types/common";

export const useTourForm = (mode: "create" | "edit") => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === "edit");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [itinerary, setItinerary] = useState("");
  const [adultPrice, setAdultPrice] = useState<number>(0);
  const [childrenPrice, setChildrenPrice] = useState<number>(0);
  const [durationDays, setDurationDays] = useState<number>(1);
  const [durationNights, setDurationNights] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [placeId, setPlaceId] = useState<number | "">("");

  // Dynamic Lists State
  const [schedules, setSchedules] = useState<
    { id?: number; startDate: string; endDate: string; capacity: number }[]
  >([]);
  const [existingImages, setExistingImages] = useState<TourImage[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  // Metadata State
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [places, setPlaces] = useState<PlaceResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, pls] = await Promise.all([
          tourService.getCategories(),
          tourService.getPlaces(),
        ]);
        setCategories(cats || []);
        setPlaces(pls || []);

        if (mode === "edit" && id) {
          const tour = await tourService.getTourDetail(id);
          setTitle(tour.title);
          setDescription(tour.description);
          setItinerary(tour.itinerary);
          setAdultPrice(tour.adultPrice);
          setChildrenPrice(tour.childrenPrice);
          setDurationDays(tour.durationDays);
          setDurationNights(tour.durationNights);
          setCategoryId(tour.category.id);
          setPlaceId(tour.place.id);
          setSchedules(
            tour.schedules.map((s) => ({
              id: s.id,
              startDate: s.startDate.split("T")[0],
              endDate: s.endDate.split("T")[0],
              capacity: s.capacity,
            })),
          );
          setExistingImages(tour.images);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
        if (mode === "edit") setError("Failed to load tour data");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchData();
  }, [id, mode]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const totalImages =
        existingImages.length + newImages.length + files.length;
      if (totalImages > 10) {
        alert("Maximum 10 images allowed");
        return;
      }
      setNewImages([...newImages, ...files]);
      const previews = files.map((file) => URL.createObjectURL(file as any));
      setNewPreviews([...newPreviews, ...previews]);
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(newPreviews[index]);
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addSchedule = () => {
    setSchedules([...schedules, { startDate: "", endDate: "", capacity: 20 }]);
  };

  const updateSchedule = (index: number, field: string, value: any) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const removeSchedule = (index: number) => {
    setSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (
    e?: React.FormEvent,
    status: "PENDING" | "DRAFT" = "PENDING",
  ) => {
    if (e) e.preventDefault();

    if (existingImages.length === 0 && newImages.length === 0) {
      setError("Please upload at least 1 image");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const requestData: any = {
        title,
        description,
        itinerary,
        adultPrice,
        childrenPrice,
        durationDays,
        durationNights,
        categoryId: Number(categoryId),
        placeId: Number(placeId),
        schedules: schedules
          .filter((s) => s.startDate && s.endDate)
          .map((s) => ({
            ...s,
            startDate: s.startDate.split("T")[0],
            endDate: s.endDate.split("T")[0],
          })),
      };

      if (mode === "create") {
        requestData.status = status;
      } else {
        requestData.retainedImageUrls = existingImages.map(
          (img) => img.imageUrl,
        );
      }

      const formData = new FormData();
      formData.append(
        "request",
        new Blob([JSON.stringify(requestData)], { type: "application/json" }),
      );

      if (mode === "create") {
        newImages.forEach((img) => formData.append("images", img));
        await tourService.createTour(formData);
      } else {
        newImages.forEach((img) => formData.append("newImages", img));
        await tourService.updateTour(id!, formData);
      }

      setSuccess(true);
      setTimeout(() => navigate("/tours/manage"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          `An error occurred while ${mode === "create" ? "creating" : "updating"} the tour`,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    itinerary,
    setItinerary,
    adultPrice,
    setAdultPrice,
    childrenPrice,
    setChildrenPrice,
    durationDays,
    setDurationDays,
    durationNights,
    setDurationNights,
    categoryId,
    setCategoryId,
    placeId,
    setPlaceId,
    schedules,
    setSchedules,
    existingImages,
    setExistingImages,
    newImages,
    setNewImages,
    newPreviews,
    setNewPreviews,
    categories,
    places,
    loading,
    initialLoading,
    error,
    success,
    handleImageChange,
    removeExistingImage,
    removeNewImage,
    addSchedule,
    updateSchedule,
    removeSchedule,
    handleSubmit,
    navigate,
  };
};
