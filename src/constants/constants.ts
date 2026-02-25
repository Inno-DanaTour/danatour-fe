import { LocationData, ZoneType, Tour, ItineraryItem } from "../types/types";

export const LOCATIONS: LocationData[] = [
  {
    id: "my-khe",
    name: "My Khe Beach",
    description:
      "Voted as one of the most attractive beaches on the planet. Soft sands and gentle waves await.",
    image:
      "https://images.unsplash.com/photo-1708776480405-7ae14fe1d4c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8TXklMjBLaGUlMjBCZWFjaHxlbnwwfHwwfHx8MA%3D%3D",
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
      "https://images.unsplash.com/photo-1725500221821-c4c770db5290?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U29uJTIwVHJhJTIwUGVuaW5zdWxhfGVufDB8fDB8fHww",
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
      "https://images.unsplash.com/photo-1716903197911-0dc4fc141e4f?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    zone: ZoneType.MOUNTAIN,
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
      "https://images.unsplash.com/photo-1701396173275-835886dd72ce?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RHJhZ29uJTIwQnJpZGdlfGVufDB8fDB8fHww",
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
      "https://premier-village-danang.com/wp-content/uploads/sites/48/2025/09/Cho%CC%9B%CC%A3-%C4%90e%CC%82m-So%CC%9Bn-Tra%CC%80-%C4%90a%CC%80-Na%CC%86%CC%83ng.jpg",
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
    image: "https://diff.vn/wp-content/uploads/2025/03/cho-han-featured.png",
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
    image: "https://www.huynhbathostone.com/uploads/image/images/dSME7.jpg",
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
      "https://media.istockphoto.com/id/1201608983/photo/marble-mountains-vietnam.jpg?s=612x612&w=0&k=20&c=PF1uoi5U78bgpplMmGijxf273nGi_7ztdfXtYtUkH1A=",
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
      "https://www.victoriahotels.asia/wp-content/uploads/2025/04/Kham-pha-ve-dep-co-kinh-cua-Pho-co-Hoi-An.webp",
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
      "https://danangfantasticity.com/wp-content/uploads/2025/08/toan-canh-khu-du-lich-sun-world-ba-na-hills-1024x576.jpg",
    zone: ZoneType.MOUNTAIN,
    positionY: 92,
    alignment: "left",
    stats: [
      { label: "Altitude", value: "1487m" },
      { label: "Icon", value: "Golden Bridge" },
    ],
  },
];

export const TOURS: Tour[] = [
  {
    id: "1",
    name: "Da Nang Coastal Adventure",
    description:
      "Explore the most beautiful beaches and coastal landmarks of Da Nang, from My Khe to Son Tra Peninsula.",
    image:
      "https://excursionmania.com/cdn-cgi/image/quality=75,format=webp,w=auto,h=auto,fit=scale-down,trim=border/https://excursionmania.com/uploads/blog/gallery/4749/17654254351.jpg",
    gallery: [
      "https://paracelbeachhotel.com/wp-content/uploads/2025/02/da-nang-beach-tourism-9.jpg",
      "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-720x480/06/f1/35/8c.jpg",
      "https://images.prismic.io/travelfika/aN1_lp5xUNkB1YiV_danangbeach.jpg?auto=format,compress",
    ],
    price: 1200000,
    duration: "1 Day",
    rating: 4.8,
    reviewCount: 124,
    zone: ZoneType.SEA,
    highlights: ["My Khe Beach", "Son Tra Peninsula", "Linh Ung Pagoda"],
    itinerary: [
      {
        day: 1,
        title: "Beach Morning",
        description: "Start your day with a refresh swim at My Khe Beach.",
      },
      {
        day: 1,
        title: "Peninsula Tour",
        description: "Visit the Green Lung of Da Nang and Lady Buddha.",
      },
    ],
    reviews: [
      {
        id: "r1",
        user: "John Doe",
        avatar: "https://i.pravatar.cc/150?u=r1",
        rating: 5,
        comment: "Amazing experience! Highly recommend.",
        date: "2024-03-20",
      },
    ],
  },
  {
    id: "2",
    name: "Marble Mountains & Hoi An Evening",
    description:
      "Discover the spiritual beauty of Marble Mountains and the nostalgic charm of Hoi An Ancient Town at night.",
    image:
      "https://vietnam.travel/sites/default/files/inline-images/marble%20mountain%20da%20nang-5.jpg",
    gallery: [
      "https://danangfantasticity.com/wp-content/uploads/2015/09/di-tich-cap-quoc-gia-dac-biet-danh-thang-ngu-hanh-son.jpg",
      "https://vmtravel.com.vn/wp-content/uploads/2022/10/hoi_an_by_night.jpg",
      "https://vietnam.travel/sites/default/files/inline-images/292-Qu%E1%BA%A3ng%20Nam-tmluong50%40gmail.com-thuyen%20hoa.jpg",
    ],
    price: 1500000,
    duration: "10 Hours",
    rating: 4.9,
    reviewCount: 350,
    zone: ZoneType.MOUNTAIN,
    highlights: [
      "Marble Mountains",
      "Non Nuoc Stone Village",
      "Hoi An Ancient Town",
    ],
    itinerary: [
      {
        day: 1,
        title: "Stone Carving",
        description: "Visit the 300-year-old Non Nuoc village.",
      },
      {
        day: 1,
        title: "Mountain Climb",
        description: "Explore the caves and pagodas of Marble Mountains.",
      },
      {
        day: 1,
        title: "Lantern Town",
        description: "Walking tour in Hoi An and dinner by the river.",
      },
    ],
    reviews: [
      {
        id: "r2",
        user: "Jane Smith",
        avatar: "https://i.pravatar.cc/150?u=r2",
        rating: 5,
        comment: "Hoi An is magical!",
        date: "2024-03-15",
      },
    ],
  },
  {
    id: "3",
    name: "Ba Na Hills Cloud Tour",
    description:
      "Visit the French Village in the clouds and walk on the world-famous Golden Bridge.",
    image:
      "https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1295,h_720/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/d9lk2ymup6meiachybz8/TourNg%C3%A0yThamQuanB%C3%A0N%C3%A0HillsT%E1%BB%AB%C4%90%C3%A0N%E1%BA%B5ng.jpg",
    gallery: [
      "https://cdn.tripspoint.com/uploads/photos/12160/ba-na-hills-full-day-highlights-golden-bridge-french-village_Wt7WL.jpeg",
    ],
    price: 1800000,
    duration: "1 Day",
    rating: 4.7,
    reviewCount: 520,
    zone: ZoneType.MOUNTAIN,
    highlights: ["Golden Bridge", "French Village", "Cable Car"],
    itinerary: [
      {
        day: 1,
        title: "Cable Car Ride",
        description: "Take one of the longest cable cars in the world.",
      },
      {
        day: 1,
        title: "Golden Bridge",
        description: "Photography session at the iconic bridge.",
      },
    ],
    reviews: [],
  },
  {
    id: "4",
    name: "Da Nang City Night Life",
    description:
      "Experience the vibrant energy of Da Nang at night, including the Dragon Bridge show and night markets.",
    image:
      "https://thumbs.dreamstime.com/b/danang-city-nightlife-da-nang-night-lights-throughout-building-flamboyance-han-river-bridge-also-shine-57249487.jpg",
    gallery: [
      "https://cdn-i2.congthuong.vn/stores/news_dataimages/2023/052023/02/21/dasua-120230502214710.png?rt=20230502214744",
      "https://danangfantasticity.com/wp-content/uploads/2019/06/Helio-khu-Biadiem-qua-5-khu-cho-dem-noi-tieng-nhat-da-nang.jpg",
    ],
    price: 800000,
    duration: "5 Hours",
    rating: 4.6,
    reviewCount: 88,
    zone: ZoneType.CITY,
    highlights: ["Dragon Bridge Show", "Son Tra Night Market", "River Cruise"],
    itinerary: [
      {
        day: 1,
        title: "Night Market",
        description: "Enjoy local street food at Son Tra Night Market.",
      },
      {
        day: 1,
        title: "Dragon Bridge",
        description: "Watch the fire and water show at 9:00 PM.",
      },
    ],
    reviews: [],
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
