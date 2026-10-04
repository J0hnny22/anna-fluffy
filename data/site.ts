import {
  Bath,
  Bone,
  HeartHandshake,
  PackageCheck,
  ShoppingBag,
  Scissors,
  ShieldCheck,
  Sparkles,
  Sprout,
  Star,
  WandSparkles
} from "lucide-react";
import type {
  AvailabilityDay,
  CalendarSettings,
  GalleryItem,
  OpeningWindow,
  Product,
  Service,
  TeamMember,
  Testimonial
} from "@/types";

export const businessInfo = {
  name: "Anna & Fluffy's Grooming",
  shortName: "Anna & Fluffy's",
  tagline: "Peluquería canina · Cuidado profesional",
  description:
    "Peluquería canina profesional con atención personalizada, baño, corte y cuidados para tu perro. Reserva tu cita online.",
  address: "Dirección pendiente de confirmar",
  phone: "+34 000 000 000",
  whatsapp: "+34 000 000 000",
  email: "hola@annafluffys.example",
  instagram: "@annaandfluffys",
  areaServed: "Tu ciudad",
  logo: "/anna-fluffys-logo.png"
};

export const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Servicios", href: "#servicios" },
  { label: "Tienda", href: "#catalogo" },
  { label: "Cómo trabajamos", href: "#proceso" },
  { label: "Equipo", href: "#equipo" },
  { label: "Citas", href: "#citas" },
  { label: "Contacto", href: "#contacto" }
];

export const trustPoints = [
  {
    title: "Atención personalizada",
    copy: "Cada sesión se adapta al carácter, edad, raza y tipo de pelo.",
    icon: HeartHandshake
  },
  {
    title: "Cosmética y alimentación",
    copy: "Cuidados y productos seleccionados para bienestar diario.",
    icon: Sparkles
  },
  {
    title: "Trato amable",
    copy: "Trabajamos con paciencia, pausas y respeto por sus tiempos.",
    icon: ShieldCheck
  },
  {
    title: "Cuidado profesional",
    copy: "Valoramos el bienestar antes, durante y después del servicio.",
    icon: Star
  }
];

export const services: Service[] = [
  {
    id: "bano-secado",
    name: "Baño y secado",
    description: "Limpieza completa con productos adaptados al tipo de piel y pelo.",
    durationMinutes: 60,
    priceFrom: "Desde XX €",
    active: true,
    icon: Bath
  },
  {
    id: "corte-arreglo",
    name: "Corte y arreglo",
    description: "Corte personalizado según raza, estilo y necesidades.",
    durationMinutes: 60,
    priceFrom: "Desde XX €",
    active: true,
    icon: Scissors
  },
  {
    id: "deslanado",
    name: "Deslanado",
    description: "Eliminación del exceso de pelo y subpelo para mejorar confort y salud.",
    durationMinutes: 60,
    priceFrom: "Consultar",
    active: true,
    icon: Sprout
  },
  {
    id: "higiene-completa",
    name: "Higiene completa",
    description: "Uñas, oídos, zona higiénica y pequeños detalles de mantenimiento.",
    durationMinutes: 60,
    priceFrom: "Desde XX €",
    active: true,
    icon: ShieldCheck
  },
  {
    id: "cachorros",
    name: "Cachorros",
    description: "Primeras experiencias positivas para acostumbrarlos progresivamente al grooming.",
    durationMinutes: 60,
    priceFrom: "Desde XX €",
    active: true,
    icon: Bone
  },
  {
    id: "tratamientos",
    name: "Tratamientos especiales",
    description: "Cuidados específicos para piel sensible, pelo seco o necesidades concretas.",
    durationMinutes: 60,
    priceFrom: "Consultar",
    active: true,
    icon: WandSparkles
  }
];

export const processSteps = [
  {
    title: "Nos conocemos",
    copy: "Nos cuentas cómo es tu perro y qué necesita."
  },
  {
    title: "Valoramos",
    copy: "Revisamos pelo, piel, estado general y comportamiento."
  },
  {
    title: "Cuidamos",
    copy: "Realizamos el tratamiento con calma y atención."
  },
  {
    title: "Te avisamos",
    copy: "Te avisamos cuando esté listo para volver a casa."
  }
];

export const teamMembers: TeamMember[] = [
  {
    id: "anna",
    name: "Anna",
    role: "Groomer",
    bio: "Especialista en cortes personalizados, baños tranquilos y primeras experiencias de grooming.",
    specialties: ["Cortes de raza", "Piel sensible", "Cachorros"],
    active: true,
    availabilityStatus: "Agenda abierta"
  },
  {
    id: "fluffy-team",
    name: "Fluffy Team",
    role: "Groomer",
    bio: "Equipo de apoyo para baños, higiene completa, deslanado y mantenimiento entre cortes.",
    specialties: ["Baño y secado", "Deslanado", "Higiene"],
    active: true,
    availabilityStatus: "Plazas limitadas"
  }
];

export const availability: Record<string, AvailabilityDay[]> = {
  anna: [
    { date: "2026-10-05", slots: ["09:00", "10:30", "12:00", "16:00", "17:30"], booked: ["10:30"] },
    { date: "2026-10-06", slots: ["09:30", "11:00", "13:00", "16:30"], booked: ["13:00"] },
    { date: "2026-10-07", slots: ["10:00", "12:00", "15:30", "17:00"], booked: [] }
  ],
  "fluffy-team": [
    { date: "2026-10-05", slots: ["09:30", "11:00", "15:00", "16:30"], booked: ["15:00"] },
    { date: "2026-10-06", slots: ["10:00", "12:30", "15:30", "17:30"], booked: [] },
    { date: "2026-10-07", slots: ["09:00", "11:30", "16:00"], booked: ["09:00"] }
  ]
};

export const calendarSettings: CalendarSettings = {
  provider: "google-calendar",
  timezone: "Europe/Madrid",
  calendarIdEnv: "GOOGLE_CALENDAR_ID",
  serviceAccountEmailEnv: "GOOGLE_SERVICE_ACCOUNT_EMAIL",
  serviceAccountPrivateKeyEnv: "GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY",
  slotIntervalMinutes: 30,
  bookingWindowDays: 21,
  mode: "request"
};

export const openingWindows: OpeningWindow[] = [
  { weekday: 1, label: "Lunes", open: "10:00", close: "19:00" },
  { weekday: 2, label: "Martes", open: "10:00", close: "19:00" },
  { weekday: 3, label: "Miércoles", open: "10:00", close: "19:00" },
  { weekday: 4, label: "Jueves", open: "10:00", close: "19:00" },
  { weekday: 5, label: "Viernes", open: "10:00", close: "19:00" },
  { weekday: 6, label: "Sábado", open: "10:00", close: "14:00" }
];

export const products: Product[] = [
  {
    id: "pienso-pollo-mini",
    name: "Pienso natural pollo mini",
    category: "Alimento seco",
    description: "Receta diaria para perros pequeños con alta palatabilidad.",
    price: "XX,XX €",
    size: "2 kg",
    imageUrl: "/images/products/pienso-pollo-mini.svg",
    available: true,
    featured: true
  },
  {
    id: "pienso-salmon-sensitive",
    name: "Pienso salmón sensitive",
    category: "Piel sensible",
    description: "Opción suave para perros con piel delicada o pelo seco.",
    price: "XX,XX €",
    size: "3 kg",
    imageUrl: "/images/products/pienso-salmon-sensitive.svg",
    available: true,
    featured: true
  },
  {
    id: "humedo-pavo",
    name: "Comida húmeda de pavo",
    category: "Comida húmeda",
    description: "Textura jugosa para complementar la alimentación diaria.",
    price: "Consultar",
    size: "Pack 6 uds.",
    imageUrl: "/images/products/humedo-pavo.svg",
    featured: true,
    available: true
  },
  {
    id: "snacks-dentales",
    name: "Snacks dentales",
    category: "Premios",
    description: "Premios funcionales para rutina de higiene y recompensa.",
    price: "XX,XX €",
    size: "150 g",
    imageUrl: "/images/products/snacks-dentales.svg",
    available: true
  },
  {
    id: "aceite-salmon",
    name: "Aceite de salmón",
    category: "Suplemento",
    description: "Apoyo nutricional para brillo del pelo y cuidado de la piel.",
    price: "XX,XX €",
    size: "250 ml",
    imageUrl: "/images/products/aceite-salmon.svg",
    available: false
  },
  {
    id: "menu-cachorro",
    name: "Menú cachorro",
    category: "Cachorros",
    description: "Alimento completo para primeras etapas de crecimiento.",
    price: "XX,XX €",
    size: "1,5 kg",
    imageUrl: "/images/products/menu-cachorro.svg",
    available: true
  }
];

export const productHighlights = [
  {
    title: "Selección cuidada",
    copy: "Catálogo pensado para complementar el bienestar entre visitas.",
    icon: PackageCheck
  },
  {
    title: "Consulta en tienda",
    copy: "Precios y stock editables, con confirmación directa en el salón.",
    icon: ShoppingBag
  }
];

export const galleryItems: GalleryItem[] = [
  {
    pet: "Luna",
    treatment: "Corte y arreglo",
    tone: "rose"
  },
  {
    pet: "Milo",
    treatment: "Baño, secado y deslanado",
    tone: "sage"
  },
  {
    pet: "Nala",
    treatment: "Higiene completa",
    tone: "butter"
  }
];

// Sample testimonials. Replace with verified customer reviews before publishing.
export const testimonials: Testimonial[] = [
  {
    name: "Cliente de ejemplo",
    copy: "Se nota el cariño y la paciencia. Mi perro salió tranquilo, limpio y precioso."
  },
  {
    name: "Cliente de ejemplo",
    copy: "Nos explicaron todo con detalle y adaptaron el corte justo a lo que necesitábamos."
  },
  {
    name: "Cliente de ejemplo",
    copy: "Una experiencia muy cuidada desde la reserva hasta la recogida."
  }
];

export const faqs = [
  {
    question: "¿Cuánto dura una sesión?",
    answer: "Depende del tamaño, tipo de pelo, servicio y comportamiento. Te orientaremos antes de confirmar la cita."
  },
  {
    question: "¿Tengo que pedir cita previa?",
    answer: "Sí. Trabajamos con cita para dedicar a cada perro el tiempo y la calma que necesita."
  },
  {
    question: "¿Qué pasa si mi perro se pone nervioso?",
    answer: "Hacemos pausas, adaptamos el ritmo y priorizamos su bienestar. Si es necesario, te propondremos una sesión más corta."
  },
  {
    question: "¿Trabajáis con todas las razas?",
    answer: "Sí, valorando siempre tamaño, manto, necesidades de piel y estado general."
  },
  {
    question: "¿Cada cuánto debería traerlo?",
    answer: "Varía según raza y tipo de pelo. En la primera visita te recomendaremos una pauta de mantenimiento."
  },
  {
    question: "¿Qué tengo que llevar?",
    answer: "Su correa, información relevante sobre salud o comportamiento y cualquier indicación veterinaria si aplica."
  }
];

export const openingHours = [
  { day: "Lunes a viernes", hours: "10:00 - 19:00" },
  { day: "Sábado", hours: "10:00 - 14:00" },
  { day: "Domingo", hours: "Cerrado" }
];

export const adminPreview = {
  todaysAppointments: [
    { time: "10:30", pet: "Muestra", service: "Baño y secado", status: "pending" }
  ],
  pendingRequests: 1,
  upcomingAppointments: 4
};

export const structuredData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "PetStore"],
  name: businessInfo.name,
  description: businessInfo.description,
  image: businessInfo.logo,
  telephone: businessInfo.phone,
  email: businessInfo.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: businessInfo.address,
    addressLocality: businessInfo.areaServed,
    addressCountry: "ES"
  },
  openingHoursSpecification: openingHours.map((item) => ({
    "@type": "OpeningHoursSpecification",
    name: item.day,
    description: item.hours
  }))
};
