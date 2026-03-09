export enum ZoneType {
  SEA = "SEA",
  CITY = "CITY",
  MOUNTAIN = "MOUNTAIN",
}

export interface LocationData {
  id: string;
  name: string;
  description: string;
  image: string;
  videoPlaceholder?: string;
  zone: ZoneType;
  positionY: number; // Percentage down the page (0-100)
  alignment: "left" | "right";
  stats: {
    label: string;
    value: string;
  }[];
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

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

export interface AppState {
  currentZone: ZoneType;
  progress: number;
  collectedStamps: string[];
}

export interface Company {
  id: number | string;
  name: string;
  logoUrl?: string;
  description: string;
  address: string;
  averageRating: number;
  totalTours: number;
  status?: string;
  contactEmail?: string;
  contactPhone?: string;
  isFollowed?: boolean;
}

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  scheduleId: string;
  tourName: string;
  tourImage: string;
  guestCount: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  startDate: string;
}

export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  total: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
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

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface PlaceResponse {
  id: number;
  name: string;
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
}

export interface TourStatusUpdateRequest {
  status: string;
  lockReason?: string;
}
