export type DiscountType = "PERCENTAGE" | "FIXED_AMOUNT";
export type SponsorType = "PLATFORM" | "PROVIDER";

export interface PromotionRequest {
  code: string;
  title?: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  tourIds?: number[];
}

export interface PromotionResponse {
  id: number;
  code: string;
  title: string;
  discountType: DiscountType;
  discountValue: number;
  maxDiscountAmount: number;
  validFrom: string;
  validTo: string;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  sponsorType: SponsorType;
  companyId?: number;
  appliedTours: PromotionTourResponse[];
}

export interface PromotionTourResponse {
  id: number;
  title: string;
  thumbnailUrl: string;
}

export interface PromotionUsageResponse {
  username: string;
  fullName: string;
  email: string;
  bookingCode: string;
  usedAt: string;
  discountAmount: number;
}
