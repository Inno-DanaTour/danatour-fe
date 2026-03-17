import { ZoneType } from "../../../types/types";

export type ViewType = "grid" | "list";

export interface SortOption {
    id: string;
    name: string;
}

export interface TourFilters {
    keyword?: string;
    zone?: ZoneType | "ALL";
    maxPrice?: number;
    sort?: string;
    minDuration?: number;
    maxDuration?: number;
}
