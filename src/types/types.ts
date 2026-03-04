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
  price: number;
  duration: string;
  rating: number;
  reviewCount: number;
  zone: ZoneType;
  highlights: string[];
  itinerary: ItineraryItem[];
  reviews: Review[];
  companyId: number;
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
