import { CategoryResponse, PlaceResponse } from "../../../types/common";
import { ZoneType, ItineraryItem, Review } from "../../home/types";

export interface Tour {
  id: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  adultPrice: number;
  childrenPrice: number;
  duration: string;
  rating: number;
  reviewCount: number;
  zone: ZoneType;
  highlights: string[];
  itinerary: ItineraryItem[];
  reviews: Review[];
  schedules?: TourSchedule[];
  companyId?: number;
}

export interface TourListItem {
  id: number;
  title: string;
  adultPrice: number;
  childrenPrice: number;
  thumbnailUrl: string;
  placeName: string;
  rating?: number;
  durationDays: number;
  durationNights: number;
  status: string;
  lockReason?: string;
  lockedBy?: string;
}

export interface TourDetail {
  id: number;
  title: string;
  description: string;
  itinerary: string;
  adultPrice: number;
  childrenPrice: number;
  durationDays: number;
  durationNights: number;
  status: string;
  category: CategoryResponse;
  place: PlaceResponse;
  images: TourImage[];
  schedules: TourSchedule[];
  companyId: number;
  lockReason?: string;
  lockedBy?: string;
  averageRating: number;
  reviewCount: number;
}

export interface TourSummaryResponse {
  id: number;
  title: string;
  thumbnail: string;
  adultPrice: number;
  durationDays: number;
  durationNights: number;
  categoryName: string;
  placeName: string;
  status: string;
  viewCount: number;
  lockReason?: string;
  lockedBy?: string;
  averageRating: number;
  reviewCount: number;
}

export interface TourStatusUpdateRequest {
  status: string;
  lockReason?: string;
}

export interface TourImage {
  imageUrl: string;
  isThumbnail: boolean;
}

export interface TourSchedule {
  id: number;
  startDate: string;
  endDate: string;
  capacity: number;
  availableSlots: number;
}

export interface FeedbackResponse {
  id: number;
  userId: number;
  tourId: number;
  bookingId: number;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAvatarUrl?: string;
  createdAt: string;
}

export interface FeedbackParams {
  rating?: number;
  page?: number;
  size?: number;
  sort?: string;
}

export interface TourReportRequest {
  reason: string;
}
