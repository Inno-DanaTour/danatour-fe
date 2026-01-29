import { LocationData, ZoneType } from "./types";

export const LOCATIONS: LocationData[] = [
  {
    id: "my-khe",
    name: "My Khe Beach",
    description:
      "Voted as one of the most attractive beaches on the planet. Soft sands and gentle waves await.",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.SEA,
    positionY: 8,
    alignment: "right",
    stats: [
      { label: "Rating", value: "4.8/5" },
      { label: "Activity", value: "Surfing" },
    ],
  },
  {
    id: "son-tra-peninsula",
    name: "Son Tra Peninsula",
    description:
      'Known as the "Green Lung" of Da Nang, offering pristine primitive forests and diverse wildlife.',
    image:
      "https://images.unsplash.com/photo-1626776984260-156324a0d923?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.SEA,
    positionY: 17,
    alignment: "left",
    stats: [
      { label: "Nature", value: "Reserve" },
      { label: "Spot", value: "Monkey Mtn" },
    ],
  },
  {
    id: "linh-ung",
    name: "Linh Ung Pagoda",
    description:
      "Home to the majestic Lady Buddha statue, overlooking the East Sea with spiritual calmness.",
    image:
      "https://images.unsplash.com/photo-1599708153386-629864227f2f?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.SEA,
    positionY: 26,
    alignment: "right",
    stats: [
      { label: "Height", value: "67m" },
      { label: "Vibe", value: "Serene" },
    ],
  },
  {
    id: "dragon-bridge",
    name: "Dragon Bridge",
    description:
      "A symbol of power and nobility. Watch it breathe fire and water every weekend night.",
    image:
      "https://images.unsplash.com/photo-1616386861226-f4d25725d2b6?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.CITY,
    positionY: 36,
    alignment: "left",
    stats: [
      { label: "Length", value: "666m" },
      { label: "Show", value: "9:00 PM" },
    ],
  },
  {
    id: "son-tra-night-market",
    name: "Son Tra Night Market",
    description:
      "A vibrant nightlife spot near Dragon Bridge with hundreds of food stalls and souvenir shops.",
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.CITY,
    positionY: 44,
    alignment: "right",
    stats: [
      { label: "Open", value: "6:00 PM" },
      { label: "Food", value: "Seafood" },
    ],
  },
  {
    id: "han-market",
    name: "Han Market",
    description:
      "The beating heart of Da Nang commerce. Taste local delicacies and find unique souvenirs.",
    image:
      "https://images.unsplash.com/photo-1632717326615-585315570183?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.CITY,
    positionY: 53,
    alignment: "left",
    stats: [
      { label: "Type", value: "Local Market" },
      { label: "Must Try", value: "Mi Quang" },
    ],
  },
  {
    id: "non-nuoc-village",
    name: "Non Nuoc Stone Village",
    description:
      "A traditional craft village with a 300-year history of stone carving at the foot of Marble Mountains.",
    image:
      "https://images.unsplash.com/photo-1598555850935-d232537233f2?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.MOUNTAIN,
    positionY: 64,
    alignment: "right",
    stats: [
      { label: "Craft", value: "Sculpture" },
      { label: "Est.", value: "18th Century" },
    ],
  },
  {
    id: "marble-mountains",
    name: "Marble Mountains",
    description:
      "A cluster of five limestone and marble hills representing the five elements.",
    image:
      "https://images.unsplash.com/photo-1644315266453-62b10a905260?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.MOUNTAIN,
    positionY: 73,
    alignment: "left",
    stats: [
      { label: "Elements", value: "5" },
      { label: "Climb", value: "Moderate" },
    ],
  },
  {
    id: "hoi-an",
    name: "Hoi An Ancient Town",
    description:
      "A UNESCO World Heritage site known for its exceptionally well-preserved ancient architecture and lanterns.",
    image:
      "https://images.unsplash.com/photo-1559828477-d64e43e2a537?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.MOUNTAIN,
    positionY: 82,
    alignment: "right",
    stats: [
      { label: "Vibe", value: "Nostalgic" },
      { label: "Icon", value: "Lanterns" },
    ],
  },
  {
    id: "ba-na-hills",
    name: "Ba Na Hills",
    description:
      "A french village in the clouds. Experience the world-famous Golden Bridge held by giant hands.",
    image:
      "https://images.unsplash.com/photo-1575880998344-996417531742?q=80&w=800&auto=format&fit=crop",
    zone: ZoneType.MOUNTAIN,
    positionY: 92,
    alignment: "left",
    stats: [
      { label: "Altitude", value: "1487m" },
      { label: "Icon", value: "Golden Bridge" },
    ],
  },
];

export const COLORS = {
  [ZoneType.SEA]: {
    bg: "#004E89", // Deep Ocean
    accent: "#4FD1C5", // Teal
    text: "#E0F2FE",
  },
  [ZoneType.CITY]: {
    bg: "#1A103C", // Dark Purple
    accent: "#D946EF", // Neon Pink
    text: "#FAE8FF",
  },
  [ZoneType.MOUNTAIN]: {
    bg: "#064E3B", // Deep Green
    accent: "#FFC857", // Gold
    text: "#ECFCCB",
  },
};
