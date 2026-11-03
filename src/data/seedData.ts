export type MediaCategory = "Concerts" | "Weddings" | "Corporate" | "Sports" | "Other";
export type MediaType = "video" | "photos" | "both";
export type PublishStatus = "Live" | "Draft" | "Hidden";
export type BookingStatus = "New" | "Quoted" | "Confirmed" | "Completed";
export type UserRole = "owner" | "staff";

export interface MediaProject {
  id: string;
  title: string;
  category: MediaCategory;
  type: MediaType;
  eventDate: string;
  description: string;
  subtitle: string;
  thumbnailUrl: string;
  videoUrl?: string;
  duration?: string;
  photoCount: number;
  photos: string[];
  cameraCount: number;
  featuredOnHome: boolean;
  autoCompress: boolean;
  addWatermark: boolean;
  status: PublishStatus;
  fileSizeMB: number;
  uploadedAgo: string;
  visualTheme: "stage-beams" | "wedding-warm" | "corporate-blue" | "sports-green" | "studio-amber" | "perahara-gold" | "control-room";
}

export interface BookingRequest {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  eventType: "Wedding" | "Concert" | "Corporate" | "Sports" | "Other";
  eventDate: string;
  venue: string;
  cameraSetup: "2 Cameras" | "4 Cameras" | "6+ Cameras" | "Not sure yet";
  liveStream: boolean;
  notes: string;
  status: BookingStatus;
  createdAt: string;
}

export interface ServicePackage {
  id: string;
  tierName: string;
  cameraCount: string;
  subtitle: string;
  priceLKR: string;
  features: string[];
  highlighted: boolean;
}

export interface Testimonial {
  id: string;
  clientName: string;
  clientRole: string;
  quote: string;
  rating: number;
  avatarColor: string;
}

export interface SiteSettings {
  heroBadge: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroVideoUrl: string;
  eventsFilmed: string;
  cameraSetups: string;
  liveViewers: string;
  yearsInProduction: string;
  showPackagePrices: boolean;
  phone: string;
  whatsappNumber: string;
  email: string;
  address: string;
  facebookUrl: string;
  facebookPersonalUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  clientLogos: string[];
}

export interface CameraFeed {
  id: string;
  label: string;
  angleName: string;
  specs: string;
  timecode: string;
  thumbnailUrl: string;
  videoStreamUrl: string;
  theme: "stage-beams" | "wedding-warm" | "control-room";
  videoDescription: string;
}

export const INITIAL_CAMERA_FEEDS: CameraFeed[] = [
  {
    id: "cam-1",
    label: "CAM 1",
    angleName: "Stage Wide",
    specs: "4K 60fps · Wide Jib",
    timecode: "01:14:28:09",
    thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1600&q=80",
    videoStreamUrl: "https://assets.mixkit.co/videos/preview/mixkit-stage-lights-at-a-concert-4169-large.mp4",
    theme: "stage-beams",
    videoDescription: "Colombo Music Festival — 10-Camera Live Switching Feed (Wide Crane Shot)",
  },
  {
    id: "cam-2",
    label: "CAM 2",
    angleName: "Close-Up",
    specs: "4K 60fps · Cinema Telephoto",
    timecode: "01:14:28:09",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1600&q=80",
    videoStreamUrl: "https://assets.mixkit.co/videos/preview/mixkit-crowd-cheering-at-a-concert-14098-large.mp4",
    theme: "wedding-warm",
    videoDescription: "Live Performance & Vocalist Tracking — Gimbal + Telephoto Isolations",
  },
  {
    id: "cam-3",
    label: "CAM 3",
    angleName: "Live Stream",
    specs: "PGM OUT · Multi-View",
    timecode: "01:14:28:09",
    thumbnailUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
    videoStreamUrl: "https://assets.mixkit.co/videos/preview/mixkit-dj-playing-music-at-a-nightclub-43442-large.mp4",
    theme: "control-room",
    videoDescription: "Damith Sadaruwan — Live ATEM Constellation 8K Director's Cut & Audio Matrix",
  },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  heroBadge: "MULTI-CAMERA PRODUCTION",
  heroHeadline: "Every angle. Every moment. Live.",
  heroSubheadline:
    "Concerts, weddings, corporate events and sports — filmed with up to 12 cameras in 4K and streamed in real time to audiences anywhere.",
  heroVideoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1&rel=0",
  eventsFilmed: "850+",
  cameraSetups: "12",
  liveViewers: "1.2M",
  yearsInProduction: "10 yrs",
  showPackagePrices: false,
  phone: "+94 77 037 7342",
  whatsappNumber: "94770377342",
  email: "hello@liveimage.lk",
  address: "Dehiwala / Colombo, Sri Lanka",
  facebookUrl: "https://facebook.com/LIVEIMAGE.lk",
  facebookPersonalUrl: "https://facebook.com/sadaruwanvideo",
  youtubeUrl: "https://youtube.com/@liveimagelk",
  instagramUrl: "https://instagram.com/liveimagelk",
  tiktokUrl: "https://tiktok.com/@liveimagelk",
  clientLogos: [
    "RDB BANK",
    "VOI FOODS",
    "AI NATIONAL EXPO",
    "CPL 2026",
    "RIDEERAYAK LIVE",
    "UDUGAMA PERAHARA",
    "SWARNAVAHINI",
    "ROYAL COLLEGE",
    "SHANGRI-LA",
  ],
};

export const INITIAL_MEDIA_PROJECTS: MediaProject[] = [
  {
    id: "proj-colombo-music-fest",
    title: "Colombo Music Festival / Ridee Rayak Stage Broadcast",
    category: "Concerts",
    type: "video",
    eventDate: "10 Oct 2026",
    description:
      "Full 10-camera 4K broadcast production, Jimmy Jib crane, wireless roaming gimbal, LED wall PGM feed and live YouTube/Facebook simulcast.",
    subtitle: "10 cameras · Live stream · 40K viewers",
    thumbnailUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "3:42",
    photoCount: 28,
    photos: [
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 10,
    featuredOnHome: true,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 412,
    uploadedAgo: "2 days ago",
    visualTheme: "stage-beams",
  },
  {
    id: "proj-nadeesha-ruwan",
    title: "Nadeesha & Ruwan Wedding",
    category: "Weddings",
    type: "both",
    eventDate: "04 Oct 2026",
    description:
      "Cinematic 4-camera Poruwa ceremony & reception coverage with dedicated HD live stream for relatives watching in Melbourne and Sydney.",
    subtitle: "Wedding film & overseas stream · 42 photos",
    thumbnailUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "5:10",
    photoCount: 42,
    photos: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 4,
    featuredOnHome: true,
    autoCompress: true,
    addWatermark: false,
    status: "Live",
    fileSizeMB: 318,
    uploadedAgo: "4 days ago",
    visualTheme: "wedding-warm",
  },
  {
    id: "proj-cpl-2026",
    title: "CPL 2026 — Main Championship",
    category: "Sports",
    type: "video",
    eventDate: "28 Sep 2026",
    description:
      "8-camera stadium sports broadcast complete with live scoreboard graphics, slow-motion instant replay, boundary cameras and drone aerials.",
    subtitle: "Sports broadcast · 8 cameras",
    thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "1:58",
    photoCount: 18,
    photos: [
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 8,
    featuredOnHome: true,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 275,
    uploadedAgo: "1 week ago",
    visualTheme: "sports-green",
  },
  {
    id: "proj-ai-national-expo",
    title: "AI National Expo Sri Lanka",
    category: "Corporate",
    type: "video",
    eventDate: "19 Sep 2026",
    description:
      "6-camera 4K multi-production & keynote live stream at BMICH Colombo with picture-in-picture presentation slide feeds and crystal-clear stage audio.",
    subtitle: "Corporate · 6-Cam 4K Multi-Production",
    thumbnailUrl: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "3:42",
    photoCount: 30,
    photos: [
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 6,
    featuredOnHome: true,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 390,
    uploadedAgo: "2 weeks ago",
    visualTheme: "corporate-blue",
  },
  {
    id: "proj-studio-session",
    title: "Studio Session — Live Multi-Cam Broadcast",
    category: "Concerts",
    type: "video",
    eventDate: "12 Sep 2026",
    description:
      "Intimate 4-camera 4K cinema lighting studio session mixed live on Blackmagic ATEM with multi-track isolated audio recording.",
    subtitle: "Music video · 4:05",
    thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "4:05",
    photoCount: 12,
    photos: [
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 4,
    featuredOnHome: true,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 210,
    uploadedAgo: "3 weeks ago",
    visualTheme: "studio-amber",
  },
  {
    id: "proj-rdb-bank",
    title: "Regional Development Bank (RDB) Opening Ceremony",
    category: "Corporate",
    type: "video",
    eventDate: "02 Sep 2026",
    description:
      "Executive multi-camera coverage, VIP speeches, ribbon-cutting live feed to branch screens and fast-turnaround highlight reel.",
    subtitle: "Corporate Highlight Reel · 2:45",
    thumbnailUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "2:45",
    photoCount: 24,
    photos: [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 4,
    featuredOnHome: false,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 195,
    uploadedAgo: "1 month ago",
    visualTheme: "corporate-blue",
  },
  {
    id: "proj-udugama-perahara",
    title: "Udugama Maha Perahara 2026",
    category: "Concerts",
    type: "video",
    eventDate: "21 Aug 2026",
    description:
      "Cultural island-wide live broadcast with 8 low-light 4K cameras, elevated crane angles, and bonded 4G/5G uplink streaming to 150K+ viewers.",
    subtitle: "Cultural Broadcast · Multi-Cam Live Stream",
    thumbnailUrl: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "5:10",
    photoCount: 54,
    photos: [
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 8,
    featuredOnHome: false,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 520,
    uploadedAgo: "1 month ago",
    visualTheme: "perahara-gold",
  },
  {
    id: "proj-voi-foods",
    title: "VOI Foods Corporate Event Highlights",
    category: "Corporate",
    type: "photos",
    eventDate: "14 Aug 2026",
    description:
      "Annual awards night & product launch filmed with 6 cameras, live stage projection, and complete event photography album.",
    subtitle: "Corporate · 36 Photos & Multi-Cam",
    thumbnailUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80",
    photoCount: 36,
    photos: [
      "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 6,
    featuredOnHome: false,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 142,
    uploadedAgo: "2 months ago",
    visualTheme: "corporate-blue",
  },
  {
    id: "proj-sunset-kandy",
    title: "Sunset Live Kandy",
    category: "Concerts",
    type: "photos",
    eventDate: "05 Aug 2026",
    description:
      "Open-air concert multi-camera stage lighting & crowd photography album from Kandy lakefront arena.",
    subtitle: "Concert · 48 Photos",
    thumbnailUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80",
    photoCount: 48,
    photos: [
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 6,
    featuredOnHome: false,
    autoCompress: true,
    addWatermark: true,
    status: "Live",
    fileSizeMB: 164,
    uploadedAgo: "2 months ago",
    visualTheme: "stage-beams",
  },
  {
    id: "proj-football-final-draft",
    title: "Football Final — Reel",
    category: "Sports",
    type: "video",
    eventDate: "15 Oct 2026",
    description:
      "Schools Football Final 6-camera highlight reel currently in post-production color grading.",
    subtitle: "Video · draft",
    thumbnailUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
    duration: "1:58",
    photoCount: 10,
    photos: [
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=1400&q=80",
    ],
    cameraCount: 6,
    featuredOnHome: false,
    autoCompress: true,
    addWatermark: true,
    status: "Draft",
    fileSizeMB: 188,
    uploadedAgo: "Yesterday",
    visualTheme: "sports-green",
  },
];

export const INITIAL_PACKAGES: ServicePackage[] = [
  {
    id: "pkg-essential",
    tierName: "Essential",
    cameraCount: "2 Cameras",
    subtitle: "Small events & ceremonies",
    priceLKR: "LKR 85,000",
    features: [
      "2 Broadcast 4K cameras & operators",
      "Clean multi-cam live switching",
      "Direct board audio capture",
      "Full master recording delivered",
    ],
    highlighted: false,
  },
  {
    id: "pkg-professional",
    tierName: "Professional",
    cameraCount: "4 Cameras",
    subtitle: "Weddings & concerts",
    priceLKR: "LKR 165,000",
    features: [
      "4 Broadcast 4K cameras + roaming gimbal",
      "Full HD / 4K Live stream (YouTube / FB)",
      "1-min & 5-min cinematic highlight edit",
      "Wireless lapel & stage audio matrix",
    ],
    highlighted: true,
  },
  {
    id: "pkg-broadcast",
    tierName: "Broadcast",
    cameraCount: "6–12 Cameras",
    subtitle: "Festivals, expos & sports",
    priceLKR: "LKR 340,000",
    features: [
      "Full OB van / ATEM control room setup",
      "Cinema Drone + Jimmy Jib crane",
      "LED wall feed, lower-thirds & instant replay",
      "Bonded 4G/5G multi-SIM live streaming",
    ],
    highlighted: false,
  },
];

export const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    clientName: "Nadeesha P.",
    clientRole: "Wedding client",
    quote:
      "Our relatives in Australia watched the whole ceremony live, and it looked like a TV broadcast.",
    rating: 5,
    avatarColor: "#E8332B",
  },
  {
    id: "test-2",
    clientName: "Marketing Manager",
    clientRole: "Corporate client",
    quote:
      "Six cameras, zero stress. The live switching made our product launch feel world-class.",
    rating: 5,
    avatarColor: "#F2B544",
  },
];

export const INITIAL_BOOKINGS: BookingRequest[] = [
  {
    id: "bk-1",
    clientName: "Kasun Perera",
    phone: "+94 77 123 4567",
    email: "kasun@example.lk",
    eventType: "Wedding",
    eventDate: "14 Dec 2026",
    venue: "Kandy — Earls Regency",
    cameraSetup: "4 Cameras",
    liveStream: true,
    notes: "Poruwa ceremony + reception with live stream link for family in Melbourne.",
    status: "New",
    createdAt: "2026-10-15",
  },
  {
    id: "bk-2",
    clientName: "Events Lanka",
    phone: "+94 77 889 4412",
    email: "events@example.lk",
    eventType: "Concert",
    eventDate: "02 Jan 2027",
    venue: "Colombo — Nelum Pokuna Outdoor",
    cameraSetup: "6+ Cameras",
    liveStream: true,
    notes: "8 cameras + Jimmy Jib + LED backdrop feed + YouTube Live.",
    status: "New",
    createdAt: "2026-10-15",
  },
  {
    id: "bk-3",
    clientName: "ABC Holdings",
    phone: "+94 71 222 3344",
    email: "corporate@abcholdings.lk",
    eventType: "Corporate",
    eventDate: "20 Nov 2026",
    venue: "Colombo — Shangri-La Ballroom",
    cameraSetup: "4 Cameras",
    liveStream: true,
    notes: "Corporate AGM with hybrid Zoom & YouTube unlisted stream.",
    status: "Quoted",
    createdAt: "2026-10-13",
  },
  {
    id: "bk-4",
    clientName: "Royal College",
    phone: "+94 76 555 1212",
    email: "sports@royal.lk",
    eventType: "Sports",
    eventDate: "08 Nov 2026",
    venue: "Galle International Stadium",
    cameraSetup: "6+ Cameras",
    liveStream: true,
    notes: "School Sports Meet — 6 cameras, drone, instant replay and scoreboard overlays.",
    status: "Confirmed",
    createdAt: "2026-10-10",
  },
  {
    id: "bk-5",
    clientName: "Sachini & Amal",
    phone: "+94 70 987 6543",
    email: "sachini@example.lk",
    eventType: "Wedding",
    eventDate: "29 Nov 2026",
    venue: "Negombo — Jetwing Blue",
    cameraSetup: "2 Cameras",
    liveStream: false,
    notes: "2-camera coverage for church & reception, recording + highlight edit only.",
    status: "Confirmed",
    createdAt: "2026-10-08",
  },
  {
    id: "bk-6",
    clientName: "Tech Summit",
    phone: "+94 77 300 9911",
    email: "info@example.lk",
    eventType: "Corporate",
    eventDate: "12 Oct 2026",
    venue: "Colombo — BMICH Main Hall",
    cameraSetup: "4 Cameras",
    liveStream: true,
    notes: "Conference — Colombo 4 cams + live LED screen switching.",
    status: "Completed",
    createdAt: "2026-10-01",
  },
];

export const VISITOR_STATS_8_MONTHS = [
  { month: "Mar", visitors: 3850, bookings: 9 },
  { month: "Apr", visitors: 4320, bookings: 12 },
  { month: "May", visitors: 4980, bookings: 14 },
  { month: "Jun", visitors: 5410, bookings: 15 },
  { month: "Jul", visitors: 6120, bookings: 17 },
  { month: "Aug", visitors: 6780, bookings: 19 },
  { month: "Sep", visitors: 7135, bookings: 19 },
  { month: "Oct", visitors: 8420, bookings: 23, current: true },
];
