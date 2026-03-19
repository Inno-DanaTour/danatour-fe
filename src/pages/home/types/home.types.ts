export interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  gridClass: string;
  description: string;
  speed: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
  location: string;
}

export interface FAQItemType {
  question: string;
  answer: string;
}

export interface FeatureType {
  title: string;
  description: string;
  image: string;
  delay: number;
  gradient: string;
}
