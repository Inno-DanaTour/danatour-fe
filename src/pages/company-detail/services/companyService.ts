import { api } from "../../../configs/api";
import { Company, ToggleFollowResponse, UserProviderResponse } from "../types";

export const companyService = {
  getCompanyById: (id: string | number): Promise<Company> => {
    return api.get<Company>(`/companies/${id}`);
  },

  toggleFollow: (id: string | number): Promise<ToggleFollowResponse> => {
    return api.post<ToggleFollowResponse>(`/companies/${id}/follow`, {});
  },

  getAllCompanies: (): Promise<Company[]> => {
    return api.get<Company[]>("/companies");
  },

  getMyProviderInfo: async (): Promise<UserProviderResponse> => {
    return api.get<UserProviderResponse>("/user-providers/me");
  },
};
