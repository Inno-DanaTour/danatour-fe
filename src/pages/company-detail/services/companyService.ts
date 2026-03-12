import { api } from "../../../configs/api";
import { Company } from "../../../types/types";

export interface ToggleFollowResponse {
  is_following: boolean;
  message: string;
}

export interface UserProviderResponse {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  companyId: number;
  companyName: string;
  role: string;
  createdAt: string;
}

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
