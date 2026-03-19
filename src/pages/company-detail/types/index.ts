export interface Company {
  id: number | string;
  name: string;
  logoUrl?: string;
  description: string;
  address: string;
  averageRating: number;
  totalTours: number;
  status?: string;
  contactEmail?: string;
  contactPhone?: string;
  isFollowed?: boolean;
}

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
