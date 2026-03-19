export interface PaymentMethod {
  id: number;
  userId: number;
  provider: string;
  maskedNumber: string;
  bankBin?: string;
  bankShortName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  isDefault: boolean;
  status: string;
}

export interface PaymentMethodRequest {
  provider: string;
  cardNumber?: string;
  bankBin?: string;
  bankShortName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
}

export interface VietQRBank {
  id: number;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
}

export interface BookingRequest {
  scheduleId: number;
  adults: number;
  children: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  promoCode?: string;
}

export interface BookingResponse {
  id: number;
  bookingCode: string;
  scheduleId: number;
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  status: string;
  adults: number;
  children: number;
  startDate: string;
  createdAt: string;
}

export interface BookingHistoryResponse {
  id: number;
  bookingCode: string;
  tourTitle: string;
  thumbnail: string;
  startDate: string;
  totalAmount: number;
  status: string;
  hasFeedback: boolean;
  createdAt: string;
}

export interface CompanyBookingResponse {
  id: number;
  bookingCode: string;
  customerName: string;
  customerPhone: string;
  tourName: string;
  startDate: string;
  adults: number;
  children: number;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export interface RebookInfoResponse {
  tourId: number;
  adults: number;
  children: number;
}
