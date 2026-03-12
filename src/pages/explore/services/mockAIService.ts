import { LocationData, ZoneType } from "../../../types/types";
import { LOCATIONS } from "../../../constants/constants";

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

const TRAVEL_STYLE_DESCRIPTIONS: Record<string, string> = {
  adventure: "thrilling experiences and outdoor activities",
  relaxation: "peaceful spots perfect for unwinding",
  culture: "rich historical and cultural heritage sites",
  photography: "stunning views and Instagram-worthy locations",
  food: "local culinary delights and food markets",
};

const DURATION_LIMITS: Record<string, number> = {
  "half-day": 3,
  "full-day": 6,
  "2-days": 10,
};

const DURATION_TIMES: Record<string, string> = {
  "half-day": "~4-5 hours",
  "full-day": "~8-10 hours",
  "2-days": "~16-20 hours",
};

// Keywords for NLP parsing
const STYLE_KEYWORDS: Record<string, string[]> = {
  adventure: [
    "adventure",
    "exciting",
    "thrill",
    "active",
    "explore",
    "hiking",
    "surfing",
    "sports",
    "mạo hiểm",
    "phiêu lưu",
    "khám phá",
  ],
  relaxation: [
    "relax",
    "peaceful",
    "calm",
    "rest",
    "quiet",
    "chill",
    "spa",
    "beach",
    "thư giãn",
    "nghỉ ngơi",
    "yên tĩnh",
  ],
  culture: [
    "culture",
    "history",
    "temple",
    "pagoda",
    "heritage",
    "traditional",
    "museum",
    "local",
    "văn hóa",
    "lịch sử",
    "chùa",
    "đền",
  ],
  photography: [
    "photo",
    "picture",
    "instagram",
    "scenic",
    "view",
    "beautiful",
    "sunset",
    "sunrise",
    "chụp ảnh",
    "cảnh đẹp",
  ],
  food: [
    "food",
    "eat",
    "cuisine",
    "restaurant",
    "market",
    "street food",
    "seafood",
    "local food",
    "ẩm thực",
    "ăn uống",
    "đặc sản",
  ],
};

const ZONE_KEYWORDS: Record<ZoneType, string[]> = {
  [ZoneType.SEA]: [
    "beach",
    "sea",
    "ocean",
    "coast",
    "water",
    "surf",
    "swim",
    "biển",
    "bờ biển",
    "đại dương",
  ],
  [ZoneType.CITY]: [
    "city",
    "urban",
    "downtown",
    "night",
    "market",
    "bridge",
    "shopping",
    "thành phố",
    "đô thị",
    "chợ",
    "cầu",
  ],
  [ZoneType.MOUNTAIN]: [
    "mountain",
    "hill",
    "nature",
    "forest",
    "green",
    "ba na",
    "marble",
    "hoi an",
    "núi",
    "thiên nhiên",
    "rừng",
  ],
};

const DURATION_KEYWORDS: Record<string, string[]> = {
  "half-day": [
    "half day",
    "few hours",
    "morning",
    "afternoon",
    "nửa ngày",
    "buổi sáng",
    "buổi chiều",
    "vài giờ",
  ],
  "full-day": [
    "full day",
    "whole day",
    "all day",
    "one day",
    "1 day",
    "cả ngày",
    "một ngày",
    "1 ngày",
  ],
  "2-days": [
    "2 days",
    "two days",
    "weekend",
    "couple days",
    "2 ngày",
    "hai ngày",
    "cuối tuần",
  ],
};

// Parse natural language input to extract preferences
function parseNaturalLanguage(input: string): UserPreferences {
  const lowerInput = input.toLowerCase();

  // Detect travel style
  let detectedStyle: UserPreferences["travelStyle"] = "adventure"; // default
  let maxStyleScore = 0;

  for (const [style, keywords] of Object.entries(STYLE_KEYWORDS)) {
    const score = keywords.filter((keyword) =>
      lowerInput.includes(keyword),
    ).length;
    if (score > maxStyleScore) {
      maxStyleScore = score;
      detectedStyle = style as UserPreferences["travelStyle"];
    }
  }

  // Detect zones
  const detectedZones: ZoneType[] = [];
  for (const [zone, keywords] of Object.entries(ZONE_KEYWORDS)) {
    const hasMatch = keywords.some((keyword) => lowerInput.includes(keyword));
    if (hasMatch) {
      detectedZones.push(zone as ZoneType);
    }
  }

  // Default to all zones if none detected
  if (detectedZones.length === 0) {
    detectedZones.push(ZoneType.SEA, ZoneType.CITY, ZoneType.MOUNTAIN);
  }

  // Detect duration
  let detectedDuration: UserPreferences["duration"] = "full-day"; // default
  for (const [duration, keywords] of Object.entries(DURATION_KEYWORDS)) {
    const hasMatch = keywords.some((keyword) => lowerInput.includes(keyword));
    if (hasMatch) {
      detectedDuration = duration as UserPreferences["duration"];
      break;
    }
  }

  return {
    travelStyle: detectedStyle,
    preferredZones: detectedZones,
    duration: detectedDuration,
  };
}

// Mock AI logic that filters & ranks locations based on preferences
function filterAndRankLocations(prefs: UserPreferences): LocationData[] {
  // Filter by selected zones
  let filtered = LOCATIONS.filter((loc) =>
    prefs.preferredZones.includes(loc.zone),
  );

  // If no zones match, return all as fallback
  if (filtered.length === 0) {
    filtered = [...LOCATIONS];
  }

  // Limit by duration
  const limit = DURATION_LIMITS[prefs.duration];
  return filtered.slice(0, limit);
}

function generateExplanation(
  prefs: UserPreferences,
  locations: LocationData[],
): string {
  const styleDesc = TRAVEL_STYLE_DESCRIPTIONS[prefs.travelStyle];
  const zoneNames = prefs.preferredZones.join(", ");
  const locationNames = locations
    .slice(0, 3)
    .map((l) => l.name)
    .join(", ");

  return `Based on your preference for ${styleDesc} and interest in ${zoneNames} zones, we've curated a personalized journey featuring ${locationNames}${locations.length > 3 ? ` and ${locations.length - 3} more amazing spots` : ""}. Enjoy your adventure!`;
}

function generateChatExplanation(
  input: string,
  prefs: UserPreferences,
  locations: LocationData[],
): string {
  const styleDesc = TRAVEL_STYLE_DESCRIPTIONS[prefs.travelStyle];
  const locationNames = locations
    .slice(0, 3)
    .map((l) => l.name)
    .join(", ");

  return `I understood you're looking for ${styleDesc}! Based on your request, I've created a customized route with ${locations.length} amazing destinations including ${locationNames}${locations.length > 3 ? ` and more` : ""}. Let's make your Da Nang trip unforgettable! 🌟`;
}

export async function getPersonalizedRoute(
  prefs: UserPreferences,
): Promise<AIRecommendation> {
  // Simulate AI processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const locations = filterAndRankLocations(prefs);
  const explanation = generateExplanation(prefs, locations);
  const estimatedTime = DURATION_TIMES[prefs.duration];

  return {
    locations,
    explanation,
    estimatedTime,
  };
}

// New function: Get route from chat input
export async function getRouteFromChat(
  chatInput: string,
): Promise<AIRecommendation> {
  // Simulate AI processing delay (longer for "thinking")
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Parse natural language
  const prefs = parseNaturalLanguage(chatInput);

  const locations = filterAndRankLocations(prefs);
  const explanation = generateChatExplanation(chatInput, prefs, locations);
  const estimatedTime = DURATION_TIMES[prefs.duration];

  return {
    locations,
    explanation,
    estimatedTime,
  };
}

// Parse chat input and return preferences only (for confirmation step)
export async function parsePreferencesFromChat(
  chatInput: string,
): Promise<UserPreferences> {
  // Simulate AI thinking delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return parseNaturalLanguage(chatInput);
}
