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
