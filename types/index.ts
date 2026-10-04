import type { LucideIcon } from "lucide-react";

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  priceFrom: string;
  active: boolean;
  icon: LucideIcon;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  specialties: string[];
  imageUrl?: string;
  active: boolean;
  availabilityStatus: string;
};

export type AvailabilityDay = {
  date: string;
  slots: string[];
  booked: string[];
};

export type OpeningWindow = {
  weekday: number;
  label: string;
  open: string;
  close: string;
};

export type CalendarSettings = {
  provider: "google-calendar";
  timezone: string;
  calendarIdEnv: string;
  serviceAccountEmailEnv: string;
  serviceAccountPrivateKeyEnv: string;
  slotIntervalMinutes: number;
  bookingWindowDays: number;
  mode: "request" | "confirmed";
};

export type Product = {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  size: string;
  imageUrl: string;
  available: boolean;
  featured?: boolean;
};

export type GalleryItem = {
  pet: string;
  treatment: string;
  tone: "rose" | "sage" | "butter";
  beforeImageUrl?: string;
  afterImageUrl?: string;
};

export type Testimonial = {
  name: string;
  copy: string;
};

export type EditableService = Omit<Service, "icon">;

export type EditableBusinessInfo = {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  areaServed: string;
  logo: string;
};

export type EditableContent = {
  businessInfo: EditableBusinessInfo;
  services: EditableService[];
  products: Product[];
  galleryItems: GalleryItem[];
  testimonials: Testimonial[];
};

export type AppointmentRequest = {
  ownerName: string;
  petName: string;
  phone: string;
  email: string;
  breed: string;
  petSize: string;
  serviceId: string;
  teamMemberId: string;
  date: string;
  time: string;
  notes: string;
};
