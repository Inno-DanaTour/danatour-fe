import { Article, Testimonial, FAQItemType, FeatureType } from "../types/home.types";

export const ARTICLES: Article[] = [
  {
    id: "1",
    title: "The Silent Stones of Marble Mountains",
    category: "History",
    image: "https://media.istockphoto.com/id/1146072386/photo/marble-mountain-pagoda-at-danang-city-vietnam.jpg?s=612x612&w=0&k=20&c=UwVv8eYAEsFMmq4zuDtC7dWP4hy_t020Tkzyc-q3gdM=",
    gridClass: "md:col-span-4 md:row-span-3",
    description: "Centuries of spiritual history carved into the heart of Da Nang's most iconic peaks.",
    speed: 0.1,
  },
  {
    id: "2",
    title: "Midnight Street Food Guide",
    category: "Cuisine",
    image: "https://booking.muongthanh.com/upload_images/images/mi-quang-da-nang-2.jpg",
    gridClass: "md:col-span-3 md:col-start-5 md:row-span-2",
    description: "Where the locals eat when the city lights reflect on Han River.",
    speed: 0.2,
  },
  {
    id: "3",
    title: "The Secret Beach of Son Tra",
    category: "Nature",
    image: "https://cdn.nhandan.vn/images/1ef398c4e2fb4bf07980a2ded785b3efab4e898d9f237859c4d9d0452b6dd6779ec197c71d0477bd1cfc64d269b9b777fc6c3b8eeb204aaeef0a7f5eed967fcc/img-1438-5187.jpg",
    gridClass: "md:col-span-3 md:row-span-3 md:col-start-2",
    description: "A hidden cove where the jungle meets the emerald sea.",
    speed: 0.15,
  },
  {
    id: "4",
    title: "Central Vietnam's Rainy Allure",
    category: "Travel",
    image: "https://asialegend.travel/wp-content/uploads/2024/02/Vietnam-rainy-season-in-Central-is-from-September-to-December-brings-occasional-downpours-and-beach-friendly-weather.jpg",
    gridClass: "md:col-span-2 md:col-start-6 md:row-span-2",
    description: "Finding beauty in the misty seasons of the coast.",
    speed: 0.25,
  },
  {
    id: "5",
    title: "Evolution of the Dragon Bridge",
    category: "Architecture",
    image: "https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:format(webp):quality(75)/cau_rong_phun_lua_may_gio_thumb_21f6fc8dae.jpg",
    gridClass: "md:col-span-3 md:col-start-4 md:row-span-2",
    description: "How a bridge became the living soul of a modern city.",
    speed: 0.12,
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Travel Blogger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    content: "DanaTour completely transformed how I experience Vietnam. The AI-powered recommendations led me to hidden gems I would never have found on my own. Absolutely magical!",
    rating: 5,
    location: "Singapore",
  },
  {
    id: "2",
    name: "Marcus Weber",
    role: "Photographer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    content: "As a professional photographer, I need unique locations. DanaTour's curated paths took me to breathtaking spots at the perfect times. The Marble Mountains at dawn was unforgettable.",
    rating: 5,
    location: "Germany",
  },
  {
    id: "3",
    name: "Yuki Tanaka",
    role: "Digital Nomad",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    content: "I've used many travel apps, but nothing compares to DanaTour. The personalized itineraries feel like having a local friend show you around. The seafood tour was incredible!",
    rating: 5,
    location: "Japan",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Adventure Seeker",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    content: "From Son Tra Peninsula hikes to midnight street food runs - DanaTour planned the perfect adventure. Their local guides are knowledgeable and passionate.",
    rating: 5,
    location: "USA",
  },
];

export const FAQS: FAQItemType[] = [
  {
    question: "What's the best time to visit Da Nang?",
    answer: "The best time is usually from February to May. The weather is warm and dry, perfect for beach activities and exploring the mountains without heavy rain.",
  },
  {
    question: "Are your tours suitable for families with children?",
    answer: "Absolutely! We offer many family-friendly options like the Ba Na Hills tour and Monkey Mountain exploration. We also provide child seats and specialized guides.",
  },
  {
    question: "Do you offer private, customized itineraries?",
    answer: "Yes, we specialize in tailor-made experiences. Whether you want a private romantic sunset dinner or a rugged mountain trek, our experts can design it just for you.",
  },
  {
    question: "What's your cancellation policy?",
    answer: "We offer a flexible cancellation policy. Most tours can be cancelled up to 48 hours in advance for a full refund. Specific details are provided at the time of booking.",
  },
  {
    question: "How does the AI personalization work?",
    answer: "Our AI analyzes your preferences—like travel style, interests, and time available—to create a unique itinerary. You can chat naturally or use our form, and the system will suggest the perfect route for you.",
  },
];

export const FEATURES: FeatureType[] = [
  {
    title: "Expert Local Guides",
    description: "Our guides are born and raised in Da Nang, offering insights you won't find in any guidebook.",
    image: "https://images.unsplash.com/photo-1595860293946-d3e5e6c3fe37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGhvaSUyMGFuJTIwdmlldG5hbXxlbnwwfHwwfHx8MA%3D%3D",
    delay: 0.1,
    gradient: "from-sky-400 to-emerald-400",
  },
  {
    title: "Premium Comfort",
    description: "Travel in style with our fleet of modern, air-conditioned luxury vehicles equipped with amenities.",
    image: "https://images.unsplash.com/photo-1505018620898-92616e1849cc?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    delay: 0.2,
    gradient: "from-purple-400 to-pink-400",
  },
  {
    title: "Unique Experiences",
    description: "From secret caves to midnight street food, we curate tours that go beyond the ordinary.",
    image: "https://images.unsplash.com/photo-1574736048210-5cd4c2689079?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    delay: 0.3,
    gradient: "from-amber-400 to-orange-400",
  },
];

export const travelAnimationData = {
  v: "5.5.7",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "travel",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "plane",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [-10], h: 0, o: { x: 0.5, y: 0 }, i: { x: 0.5, y: 1 } },
            { t: 30, s: [10], h: 0, o: { x: 0.5, y: 0 }, i: { x: 0.5, y: 1 } },
            { t: 60, s: [-10] },
          ],
        },
        p: {
          a: 1,
          k: [
            { t: 0, s: [80, 120, 0], h: 0, o: { x: 0.5, y: 0 }, i: { x: 0.5, y: 1 } },
            { t: 30, s: [120, 80, 0], h: 0, o: { x: 0.5, y: 0 }, i: { x: 0.5, y: 1 } },
            { t: 60, s: [80, 120, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      shapes: [
        {
          ty: "gr",
          it: [
            { ty: "sr", sy: 1, d: 1, pt: { a: 0, k: 3 }, p: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 }, ir: { a: 0, k: 10 }, is: { a: 0, k: 0 }, or: { a: 0, k: 25 }, os: { a: 0, k: 0 } },
            { ty: "fl", c: { a: 0, k: [0.04, 0.65, 0.91, 1] }, o: { a: 0, k: 100 } },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } },
          ],
        },
      ],
    },
  ],
};
