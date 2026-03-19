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
