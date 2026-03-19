export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  total?: number;
}

export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isLast: boolean;
}

export interface TourCompanyResponse {
  id: number;
  name: string;
  taxCode: string;
  citizenId: string;
  description: string;
  logoUrl: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  createdAt: string;
}

export interface ProviderApplicationDocument {
  id: number;
  documentType: string;
  documentUrl: string;
  verificationStatus: string;
  remarks: string;
  uploadedAt: string;
}

export interface AdminProviderApplicationDetailResponse {
  company: TourCompanyResponse;
  documents: ProviderApplicationDocument[];
}
