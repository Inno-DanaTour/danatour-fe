export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
  total?: number;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface PlaceResponse {
  id: number;
  name: string;
}
