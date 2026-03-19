import { LocationData, ZoneType } from "../../home/types";

export interface UserPreferences {
  travelStyle: "adventure" | "relaxation" | "culture" | "photography" | "food";
  preferredZones: ZoneType[];
  duration: "half-day" | "full-day" | "2-days";
}

export interface AIRecommendation {
  locations: LocationData[];
  explanation: string;
  estimatedTime: string;
}
