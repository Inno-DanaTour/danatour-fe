import { api } from "../configs/api";

export interface ProviderApplicationInfo {
  companyName: string;
  taxCode: string;
  citizenId: string;
  businessAddress: string;
  contactEmail: string;
  contactPhone: string;
  description: string;
  websiteUrl?: string;
  representativeName: string;
  representativePosition: string;
}

export interface ProviderApplicationResponse {
  id: number;
  companyId: number;
  companyName: string;
  documentType: string;
  documentUrl: string;
  verificationStatus: string;
  verifiedById?: number;
  verifiedByName?: string;
  verifiedAt?: string;
  uploadedAt: string;
}

export interface TourCompanyResponse {
  id: number;
  name: string;
  taxCode: string;
  citizenId: string;
  description: string;
  logoUrl?: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  averageRating: number;
  totalTours: number;
  status: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyProviderApplicationResponse {
  company: TourCompanyResponse | null;
  documents: ProviderApplicationResponse[];
}

export const providerService = {
  submitApplication: async (
    info: ProviderApplicationInfo,
    files: Record<string, File | null>,
  ) => {
    const payload = new FormData();

    // Append info as a JSON blob
    payload.append(
      "info",
      new Blob([JSON.stringify(info)], { type: "application/json" }),
    );

    // Append available files
    // The keys here must match the @RequestPart names in the backend controller
    const fieldMap: Record<string, string> = {
      TAX_NUMBER: "taxNumber",
      CITIZEN_ID: "representativeIdCard",
      BUSINESS_LICENSE: "businessLicense",
      TRAVEL_LICENSE: "travelLicense",
    };

    Object.entries(files).forEach(([docType, file]) => {
      if (file && fieldMap[docType]) {
        payload.append(fieldMap[docType], file);
      }
    });

    return api.postMultipart<ProviderApplicationResponse>(
      "/provider-applications",
      payload,
    );
  },

  getMyApplications: async (): Promise<MyProviderApplicationResponse> => {
    return api.get<MyProviderApplicationResponse>("/provider-applications/me");
  },
};
