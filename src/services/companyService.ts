import { api } from "../configs/api";

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
    getMyProviderInfo: async (): Promise<UserProviderResponse> => {
        return await api.get<UserProviderResponse>("/user-providers/me");
    }
};
