export interface LoginRequest {
  identifier?: string;
  password?: string;
}

export interface IntrospectResponse {
  valid: boolean;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  authenticated: boolean;
}

export interface RegisterRequest {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  phone?: string;
}

export interface RegisterResponse {
  email: string;
  fullName: string;
}

export interface ChangePasswordRequest {
  password: string;
  confirmPassword: string;
}

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

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}
