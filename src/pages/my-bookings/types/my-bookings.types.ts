export interface BookingHistoryResponse {
  id: number;
  tourId: number;
  bookingCode: string;
  tourTitle: string;
  thumbnail: string;
  startDate: string;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  hasFeedback: boolean;
  createdAt: string;
}

export interface Tab {
  label: string;
  value: string;
}
