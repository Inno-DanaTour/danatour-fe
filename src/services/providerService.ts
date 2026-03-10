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
  success?: boolean;
  message?: string;
  [key: string]: any;
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

  getMyApplications: async (): Promise<any[]> => {
    return api.get<any[]>("/provider-applications/my");
  },
};
