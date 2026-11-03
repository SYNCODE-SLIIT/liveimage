"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  Calendar as CalendarIcon,
  CheckCircle2,
  Copy,
  Check,
  Send,
  MessageCircle,
  Play,
  Pause,
  Volume2,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import MacOSDock, { DockApp } from "@/components/ui/mac-os-dock";
import { useLiveImage } from "@/context/LiveImageContext";
import { BookingRequest } from "@/data/seedData";

const PHONE_ICON_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#34D399"/>
        <stop offset="100%" stop-color="#059669"/>
      </linearGradient>
    </defs>
    <rect x="8" y="8" width="104" height="104" rx="24" fill="url(#g)"/>
    <rect x="9" y="9" width="102" height="102" rx="23" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <path d="M43.5 34.5c2.2 0 4.2 1.3 5.1 3.3l4.2 9.4c.8 1.8.4 3.9-1.1 5.2l-4.8 4.2c2.9 5.9 7.6 10.6 13.5 13.5l4.2-4.8c1.3-1.5 3.4-1.9 5.2-1.1l9.4 4.2c2 .9 3.3 2.9 3.3 5.1v4.8c0 3.9-3.2 7.1-7.1 7.1C49.6 85.4 34.6 70.4 34.6 44.6c0-3.9 3.2-7.1 7.1-7.1h1.8z" fill="#FFFFFF"/>
  </svg>`
)}`;

export const STUDIO_DOCK_APPS: DockApp[] = [
  {
    id: "phone",
    name: "Phone",
    icon: PHONE_ICON_SVG,
  },
  {
    id: "notes",
    name: "Notes",
    icon: "https://cdn.21st.dev/assets/mirror/cb/cbfa4e5db383bbb86683edc2f7d309e9fd7000d07833f6449837be51b77558fa.png",
  },
  {
    id: "calendar",
    name: "Calendar",
    icon: "https://cdn.21st.dev/assets/mirror/e1/e1e93987488d4a904f4b7273213d36319c73d81ca9680b440c144f69af5a7f9a.png",
  },
  {
    id: "mail",
    name: "Mail",
    icon: "https://cdn.21st.dev/assets/mirror/7b/7bb8671183d2a2bbb8a3858b1971cc5699ba0103673b011590d22f0fa309bb87.png",
  },
  {
    id: "photos",
    name: "Photos",
    icon: "https://cdn.21st.dev/assets/mirror/45/45c61147b702b2765802969df55878aa5f69e27abe656174339dc661d0f9a31d.png",
  },
  {
    id: "music",
    name: "Showreel",
    icon: "https://cdn.21st.dev/assets/mirror/03/035600d3c05ccbfc974888a3319fa721dac7321dd18734a5d0405af1fd259c41.png",
  },
  {
    id: "calculator",
    name: "Estimator",
    icon: "https://cdn.21st.dev/assets/mirror/96/9639bd0ec3bae0b56bd8812f61c39d72123c6de272922e5bc7f3a24264112953.png",
  },
  {
    id: "safari",
    name: "Location",
    icon: "https://cdn.21st.dev/assets/mirror/d5/d558230225bb0dd1897db6c7cf0d03b29506eef8078fe25313c48cd8f72d05ad.png",
  },
  {
    id: "terminal",
    name: "Specs",
    icon: "https://cdn.21st.dev/assets/mirror/11/11d8587bae8852b8232d1f37e318c4b0fbbd2b0f2b61c71a79dbae327b4fa0c1.webp",
  },
];

const SHOWREEL_TRACKS = [
  {
    id: "t1",
    title: "Nelum Pokuna 12-Camera Symphony Broadcast",
    subtitle: "4K 60fps Master · 48-Channel Dante Audio Mix",
    duration: "03:42",
    camCount: "12 Cameras",
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "t2",
    title: "Shangri-La Colombo Grand Poruwa & Reception",
    subtitle: "6-Camera Cinema Rig + UK & Australia Live Stream",
    duration: "04:15",
    camCount: "6 Cameras",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "t3",
    title: "BMICH National Corporate Summit & Awards",
    subtitle: "8-Camera SDI Switching · LED Wall IMAG",
    duration: "02:58",
    camCount: "8 Cameras",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&auto=format&fit=crop&q=80",
  },
  {
    id: "t4",
    title: "Sugathadasa Stadium Championship Final",
    subtitle: "10-Camera High-Speed Broadcast + Slow-Motion Replay",
    duration: "03:19",
    camCount: "10 Cameras",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1200&auto=format&fit=crop&q=80",
  },
];

const NOTE_TEMPLATES = [
  {
    id: "quote",
    title: "Event Brief & Quote",
    date: "Template",
    body: `Event Type: Wedding / Concert / Corporate
Preferred Date: 
Venue / City: Colombo
Cameras Needed: 4 Cameras (4K) + Live Stream
Notes: LED Wall feed, Jimmy Jib crane, Overseas YouTube link.`,
  },
  {
    id: "checklist",
    title: "Production Checklist",
    date: "Technical",
    body: `- OB Van arrival & 4K SDI fiber cabling: 4 hrs prior to doors
- Direct soundboard XLR matrix feed + ambient crowd microphones
- Bonded 4G/5G + Venue Fiber SRT backup stream verification
- Full ISO recording on all cameras + live switched PGM master`,
  },
  {
    id: "hotline",
    title: "Studio Contact Details",
    date: "Directory",
    body: `LIVE IMAGE (PVT) LTD
Founder & Technical Director: B Damith Sadaruwan
Phone / WhatsApp: +94 77 037 7342
Email: hello@liveimage.lk
Studio: Dehiwala / Colombo, Sri Lanka`,
  },
];

interface ContactStudioDockProps {
  initialApp?: string;
  initialEventType?: BookingRequest["eventType"];
  initialCameraSetup?: BookingRequest["cameraSetup"];
  initialNote?: string;
}

export function ContactStudioDockSection({
  initialApp = "phone",
  initialEventType,
  initialCameraSetup,
  initialNote,
}: ContactStudioDockProps) {
  const { settings, projects, addBooking } = useLiveImage();

  const [activeApp, setActiveApp] = useState<string>(initialApp);
  const [openApps, setOpenApps] = useState<string[]>([
    "phone",
    "notes",
    "calendar",
    "mail",
  ]);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [eventType, setEventType] = useState<BookingRequest["eventType"]>(
    initialEventType || "Wedding"
  );
  const [cameraSetup, setCameraSetup] = useState<BookingRequest["cameraSetup"]>(
    initialCameraSetup || "4 Cameras"
  );
  const [liveStream, setLiveStream] = useState(true);
  const [eventDate, setEventDate] = useState("");
  const [venue, setVenue] = useState("");

  const [selectedNoteId, setSelectedNoteId] = useState("quote");
  const [noteText, setNoteText] = useState(
    initialNote || NOTE_TEMPLATES[0].body
  );
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");

  const [mailSubject, setMailSubject] = useState(
    "4K Multi-Camera Production & Live Stream Inquiry"
  );
  const [mailBody, setMailBody] = useState(
    "Hi Damith,\n\nWe are planning an upcoming event and would like to request a multi-camera production and live streaming quote from LIVE IMAGE (PVT) LTD.\n\nPlease let us know your availability."
  );

  const [galleryFilter, setGalleryFilter] = useState<string>("All");
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const [calcCams, setCalcCams] = useState<number>(4);
  const [calcStream, setCalcStream] = useState<boolean>(true);
  const [calcJib, setCalcJib] = useState<boolean>(true);
  const [calcLed, setCalcLed] = useState<boolean>(false);
  const [calcDrone, setCalcDrone] = useState<boolean>(false);

  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "LIVE IMAGE (PVT) LTD — OB VAN BROADCAST SYSTEM",
    "Director: B Damith Sadaruwan | Dehiwala / Colombo",
    "----------------------------------------------------------------",
    "[READY] 12x 4K SDI Optical Chains (Blackmagic URSA G2 & Sony XDCAM)",
    "[READY] ATEM Constellation 8K M/E Switcher",
    "[READY] Multi-SIM Bonded 5G/4G + Fiber SRT/RTMP Encoder",
  ]);

  useEffect(() => {
    if (initialApp) setActiveApp(initialApp);
  }, [initialApp]);

  useEffect(() => {
    if (initialEventType) setEventType(initialEventType);
  }, [initialEventType]);

  useEffect(() => {
    if (initialCameraSetup) setCameraSetup(initialCameraSetup);
  }, [initialCameraSetup]);

  useEffect(() => {
    if (initialNote) setNoteText(initialNote);
  }, [initialNote]);

  const handleDockAppClick = (appId: string) => {
    setActiveApp(appId);
    if (!openApps.includes(appId)) {
      setOpenApps((prev) => [...prev, appId]);
    }
  };

  const triggerSuccessToast = (msg: string) => {
    setErrorToast(null);
    setSavedToast(msg);
    setTimeout(() => setSavedToast(null), 4500);
  };

  const triggerErrorToast = (msg: string) => {
    setSavedToast(null);
    setErrorToast(msg);
    setTimeout(() => setErrorToast(null), 6000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(settings.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSaveBookingFromApp = async (
    sourceLabel: string,
    customNotes: string
  ) => {
    if (isSubmitting) return;
    if (clientName.trim().length < 2 || clientPhone.trim().length < 7) {
      triggerErrorToast("Please enter your name and phone / WhatsApp number.");
      return;
    }

    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "TBD";

    setIsSubmitting(true);
    try {
      await addBooking(
        {
          clientName: clientName.trim(),
          phone: clientPhone.trim(),
          email: clientEmail.trim(),
          eventType,
          eventDate: formattedDate,
          venue: venue.trim() || "Colombo, Sri Lanka",
          cameraSetup,
          liveStream,
          notes: `[${sourceLabel}] ${customNotes}`,
        },
        honeypot
      );
      triggerSuccessToast(
        `Inquiry sent. We will contact ${clientPhone.trim()} shortly.`
      );
    } catch (e) {
      triggerErrorToast(
        e instanceof Error ? e.message : "Could not send your booking."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedLkr =
    calcCams * 35000 +
    (calcStream ? 45000 : 0) +
    (calcJib ? 40000 : 0) +
    (calcLed ? 35000 : 0) +
    (calcDrone ? 30000 : 0);

  const filteredGallery =
    galleryFilter === "All"
      ? projects.slice(0, 6)
      : projects
          .filter(
            (p) => p.category.toLowerCase() === galleryFilter.toLowerCase()
          )
          .slice(0, 6);

  const currentAppMeta =
    STUDIO_DOCK_APPS.find((a) => a.id === activeApp) || STUDIO_DOCK_APPS[0];

  return (
    <section className="py-12 sm:py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mb-4 mx-auto max-w-xl px-4 py-3 rounded-xl bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-xs sm:text-sm font-medium flex items-center justify-between gap-3 backdrop-blur-md"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{savedToast}</span>
            </div>
          </motion.div>
        )}
        {errorToast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            role="alert"
            className="mb-4 mx-auto max-w-xl px-4 py-3 rounded-xl bg-rec/15 border border-rec/40 text-red-200 text-xs sm:text-sm font-medium backdrop-blur-md"
          >
            {errorToast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Honeypot: hidden from people, bots tend to fill it in */}
      <input
        type="text"
        name="website"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] w-px h-px opacity-0"
      />

      {/* Active macOS Window */}
      <motion.div
        key={activeApp}
        initial={{ opacity: 0, y: 10, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="w-full rounded-2xl overflow-hidden border border-white/10 bg-[#121217] shadow-[0_25px_80px_rgba(0,0,0,0.85)]"
      >
        {/* Window Title Bar */}
        <div className="px-4 py-3 bg-[#1A1A22] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F] inline-block" />
            <div className="ml-3 flex items-center gap-2">
              <img
                src={currentAppMeta.icon}
                alt={currentAppMeta.name}
                className="w-4 h-4 object-contain"
              />
              <span className="font-heading font-semibold text-xs sm:text-sm text-paper">
                {currentAppMeta.name} — LIVE IMAGE (PVT) LTD
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-muted hidden sm:inline">
            {settings.phone}
          </span>
        </div>

        {/* =========================================================
            1. PHONE & WHATSAPP (`phone`)
            ========================================================= */}
        {activeApp === "phone" && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 space-y-4">
              <span className="text-[11px] font-heading font-semibold uppercase tracking-[0.2em] text-muted block">
                Direct Production Line
              </span>
              <h3 className="font-heading font-bold text-2xl sm:text-3xl text-paper leading-tight">
                Talk directly with B Damith Sadaruwan
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                For multi-camera availability, OB van routing, or live broadcast
                scheduling, call or message our Dehiwala / Colombo studio directly.
              </p>

              <div className="p-4 rounded-xl bg-night border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-muted uppercase tracking-wider block">
                    Mobile &amp; WhatsApp
                  </span>
                  <span className="font-heading font-bold text-xl sm:text-2xl text-paper">
                    {settings.phone}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyPhone}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-heading font-medium text-paper transition"
                >
                  {copiedPhone ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rec hover:bg-rec/90 text-white font-heading font-semibold text-xs sm:text-sm transition"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {settings.phone}</span>
                </a>
                <a
                  href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
                    "Hi Damith, I would like to request a multi-camera production quote."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-paper border border-white/15 font-heading font-semibold text-xs sm:text-sm transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-6 bg-night border border-white/10 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-heading font-semibold text-sm text-paper">
                  Request a Callback
                </span>
                <span className="text-[11px] text-muted">
                  Dehiwala / Colombo
                </span>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stage border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec"
                />
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Phone / WhatsApp (+94 77 ...)"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-stage border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleSaveBookingFromApp(
                      "Callback",
                      `Callback requested by ${clientName || "Client"} (${
                        clientPhone || settings.phone
                      })`
                    )
                  }
                  className="w-full py-3 rounded-lg bg-rec hover:bg-rec/90 text-white font-heading font-semibold text-xs sm:text-sm transition flex items-center justify-center gap-2"
                >
                  <span>Request Callback</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            2. NOTES (`notes`)
            ========================================================= */}
        {activeApp === "notes" && (
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
            <div className="md:col-span-4 bg-[#16161E] border-r border-white/10 p-4 space-y-2">
              <div className="text-[11px] font-heading font-semibold uppercase tracking-wider text-muted px-2 mb-2">
                Notes
              </div>
              {NOTE_TEMPLATES.map((tpl) => {
                const active = selectedNoteId === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => {
                      setSelectedNoteId(tpl.id);
                      setNoteText(tpl.body);
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition ${
                      active
                        ? "bg-white/10 border-white/25 text-paper"
                        : "bg-night/50 border-white/5 text-muted hover:text-paper"
                    }`}
                  >
                    <div className="font-heading font-semibold text-xs sm:text-sm text-paper">
                      {tpl.title}
                    </div>
                    <div className="text-[11px] text-muted mt-0.5">
                      {tpl.date}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="md:col-span-8 p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
                  <span className="font-heading font-semibold text-sm sm:text-base text-paper">
                    Event Production Brief
                  </span>
                  <span className="text-[11px] font-mono text-muted">
                    {settings.phone}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Your Name"
                    className="px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec"
                  />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="Phone / WhatsApp"
                    className="px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec"
                  />
                </div>

                <textarea
                  rows={6}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-3.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper font-mono leading-relaxed focus:outline-none focus:border-rec"
                />
              </div>

              <div className="flex items-center justify-end pt-1">
                <button
                  type="button"
                  onClick={() => handleSaveBookingFromApp("Notes", noteText)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rec hover:bg-rec/90 text-white font-heading font-semibold text-xs sm:text-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Note</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            3. CALENDAR BOOKING (`calendar`)
            ========================================================= */}
        {activeApp === "calendar" && (
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-muted block">
                  Production Schedule
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-paper mt-0.5">
                  Book Event Date &amp; Camera Setup
                </h3>
              </div>
              <span className="text-xs font-mono text-muted">
                {settings.phone}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(
                [
                  "Wedding",
                  "Concert",
                  "Corporate",
                  "Sports",
                  "Other",
                ] as BookingRequest["eventType"][]
              ).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setEventType(t)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-heading font-semibold border transition ${
                    eventType === t
                      ? "bg-rec text-white border-rec"
                      : "bg-night border-white/10 text-muted hover:text-paper"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Your Name"
                className="px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec"
              />
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="Phone / WhatsApp"
                className="px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec"
              />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec [color-scheme:dark]"
              />
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Venue / City"
                className="px-3.5 py-2.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper focus:outline-none focus:border-rec"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    "2 Cameras",
                    "4 Cameras",
                    "6+ Cameras",
                    "Not sure yet",
                  ] as BookingRequest["cameraSetup"][]
                ).map((setup) => (
                  <button
                    key={setup}
                    type="button"
                    onClick={() => setCameraSetup(setup)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold border transition ${
                      cameraSetup === setup
                        ? "bg-white/15 border-white/30 text-paper"
                        : "bg-night border-white/10 text-muted"
                    }`}
                  >
                    {setup}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setLiveStream((v) => !v)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold border transition ${
                    liveStream
                      ? "bg-rec/20 border-rec text-paper"
                      : "bg-night border-white/10 text-muted"
                  }`}
                >
                  {liveStream ? "Live Stream Included" : "Recording Only"}
                </button>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleSaveBookingFromApp(
                    "Calendar",
                    `${eventType} on ${eventDate || "TBD"} at ${
                      venue || "Colombo"
                    } (${cameraSetup})`
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rec hover:bg-rec/90 text-white font-heading font-semibold text-xs sm:text-sm transition"
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Confirm Booking</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            4. MAIL COMPOSER (`mail`)
            ========================================================= */}
        {activeApp === "mail" && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="space-y-2 border-b border-white/10 pb-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted w-16">To:</span>
                <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-paper font-mono text-xs">
                  {settings.email}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Your Name"
                  className="px-3 py-2 rounded-lg bg-night border border-white/10 text-xs text-paper focus:outline-none focus:border-rec"
                />
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="Your Email"
                  className="px-3 py-2 rounded-lg bg-night border border-white/10 text-xs text-paper focus:outline-none focus:border-rec"
                />
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Phone (+94 ...)"
                  className="px-3 py-2 rounded-lg bg-night border border-white/10 text-xs text-paper focus:outline-none focus:border-rec"
                />
              </div>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-muted w-16">Subject:</span>
                <input
                  type="text"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-night border border-white/10 text-xs text-paper focus:outline-none focus:border-rec"
                />
              </div>
            </div>

            <textarea
              rows={5}
              value={mailBody}
              onChange={(e) => setMailBody(e.target.value)}
              className="w-full p-3.5 rounded-lg bg-night border border-white/10 text-xs sm:text-sm text-paper leading-relaxed focus:outline-none focus:border-rec"
            />

            <div className="flex flex-wrap items-center justify-between gap-3">
              <a
                href={`mailto:${settings.email}?subject=${encodeURIComponent(
                  mailSubject
                )}&body=${encodeURIComponent(mailBody)}`}
                className="text-xs text-muted hover:text-paper underline inline-flex items-center gap-1"
              >
                <span>Open in Mail App</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={() =>
                  handleSaveBookingFromApp(
                    "Mail",
                    `${mailSubject} — ${mailBody}`
                  )
                }
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-rec hover:bg-rec/90 text-white font-heading font-semibold text-xs sm:text-sm transition"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            5. 4K GALLERY (`photos`)
            ========================================================= */}
        {activeApp === "photos" && (
          <div className="p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-muted block">
                  Portfolio Archive
                </span>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-paper">
                  Recent Multi-Camera Productions
                </h3>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {["All", "Concerts", "Weddings", "Corporate", "Sports"].map(
                  (cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setGalleryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-heading font-semibold border transition ${
                        galleryFilter === cat
                          ? "bg-rec text-white border-rec"
                          : "bg-night text-muted border-white/10 hover:text-paper"
                      }`}
                    >
                      {cat}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredGallery.map((item) => (
                <Link
                  key={item.id}
                  href="/portfolio"
                  className="group relative rounded-lg overflow-hidden border border-white/10 bg-night aspect-video block"
                >
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-3 flex flex-col justify-end">
                    <span className="text-[10px] font-mono text-muted uppercase">
                      {item.category}
                    </span>
                    <span className="font-heading font-semibold text-xs text-paper line-clamp-1">
                      {item.title}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================
            6. SHOWREEL & AUDIO (`music`)
            ========================================================= */}
        {activeApp === "music" && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-5 relative rounded-xl overflow-hidden border border-white/15 bg-night aspect-video md:aspect-square flex flex-col justify-end p-4">
              <img
                src={SHOWREEL_TRACKS[activeTrackIndex].image}
                alt={SHOWREEL_TRACKS[activeTrackIndex].title}
                className="absolute inset-0 w-full h-full object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="relative z-10 space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 text-paper text-[10px] font-mono">
                  <Volume2 className="w-3 h-3" />
                  <span>48kHz / 24-bit Master</span>
                </div>
                <h4 className="font-heading font-bold text-base text-paper">
                  {SHOWREEL_TRACKS[activeTrackIndex].title}
                </h4>
                <p className="text-xs text-paper/75">
                  {SHOWREEL_TRACKS[activeTrackIndex].subtitle}
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-night font-heading font-semibold text-xs"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3.5 h-3.5 fill-current" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Play</span>
                      </>
                    )}
                  </button>
                  <span className="text-xs font-mono text-muted">
                    {SHOWREEL_TRACKS[activeTrackIndex].duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="md:col-span-7 space-y-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-heading font-semibold uppercase tracking-wider text-muted">
                  Broadcast Feeds
                </span>
                <span className="text-[11px] font-mono text-muted">
                  Dante / XLR Matrix
                </span>
              </div>
              {SHOWREEL_TRACKS.map((trk, idx) => {
                const active = idx === activeTrackIndex;
                return (
                  <button
                    key={trk.id}
                    type="button"
                    onClick={() => {
                      setActiveTrackIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`w-full text-left p-3 rounded-lg border flex items-center justify-between gap-3 transition ${
                      active
                        ? "bg-white/10 border-white/25 text-paper"
                        : "bg-night/70 border-white/10 text-muted hover:text-paper"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-[11px] font-mono text-paper shrink-0">
                        0{idx + 1}
                      </span>
                      <div className="truncate">
                        <div className="font-heading font-semibold text-xs sm:text-sm text-paper truncate">
                          {trk.title}
                        </div>
                        <div className="text-[11px] text-muted truncate">
                          {trk.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-muted shrink-0">
                      {trk.camCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* =========================================================
            7. COST ESTIMATOR (`calculator`)
            ========================================================= */}
        {activeApp === "calculator" && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-4">
              <div>
                <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-muted block">
                  Production Estimator
                </span>
                <h3 className="font-heading font-bold text-xl sm:text-2xl text-paper">
                  Configure Camera &amp; Streaming Setup
                </h3>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted block">
                  4K Broadcast Cameras:
                </label>
                <div className="flex flex-wrap gap-2">
                  {[2, 4, 6, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCalcCams(num)}
                      className={`px-4 py-2 rounded-lg text-xs font-heading font-semibold border transition ${
                        calcCams === num
                          ? "bg-rec text-white border-rec"
                          : "bg-night text-muted border-white/10 hover:text-paper"
                      }`}
                    >
                      {num} Cameras
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                {[
                  {
                    label: "4K/HD Live Streaming",
                    active: calcStream,
                    toggle: () => setCalcStream((v) => !v),
                  },
                  {
                    label: "40ft Jimmy Jib Crane",
                    active: calcJib,
                    toggle: () => setCalcJib((v) => !v),
                  },
                  {
                    label: "LED Wall IMAG Feed",
                    active: calcLed,
                    toggle: () => setCalcLed((v) => !v),
                  },
                  {
                    label: "4K Aerial Drone Unit",
                    active: calcDrone,
                    toggle: () => setCalcDrone((v) => !v),
                  },
                ].map((addon) => (
                  <button
                    key={addon.label}
                    type="button"
                    onClick={addon.toggle}
                    className={`p-3 rounded-lg border text-left text-xs font-heading font-medium transition flex items-center justify-between ${
                      addon.active
                        ? "bg-white/10 border-white/30 text-paper"
                        : "bg-night border-white/10 text-muted"
                    }`}
                  >
                    <span>{addon.label}</span>
                    <span className="text-[11px] font-mono">
                      {addon.active ? "Included" : "Add"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-5 bg-night border border-white/10 rounded-xl p-5 space-y-4 text-center">
              <span className="text-[11px] font-mono uppercase tracking-wider text-muted">
                Estimated Package
              </span>
              <div className="font-heading font-bold text-3xl text-paper">
                LKR {estimatedLkr.toLocaleString()}
              </div>
              <p className="text-xs text-muted">
                Includes {calcCams}× 4K cameras, hardware vision mixing, comms,
                and full ISO recording.
              </p>
              <button
                type="button"
                onClick={() => {
                  setCameraSetup(
                    calcCams <= 2
                      ? "2 Cameras"
                      : calcCams <= 4
                      ? "4 Cameras"
                      : "6+ Cameras"
                  );
                  setLiveStream(calcStream);
                  setNoteText(
                    `Selected Configuration: ${calcCams}x 4K Cameras | Live Stream: ${
                      calcStream ? "Yes" : "No"
                    } | Jimmy Jib: ${calcJib ? "Yes" : "No"} | LED Wall: ${
                      calcLed ? "Yes" : "No"
                    } | Drone: ${
                      calcDrone ? "Yes" : "No"
                    } | Estimate: LKR ${estimatedLkr.toLocaleString()}`
                  );
                  setActiveApp("notes");
                }}
                className="w-full py-3 rounded-full bg-rec hover:bg-rec/90 text-white font-heading font-semibold text-xs sm:text-sm transition"
              >
                Use Configuration in Notes
              </button>
            </div>
          </div>
        )}

        {/* =========================================================
            8. STUDIO LOCATION (`safari`)
            ========================================================= */}
        {activeApp === "safari" && (
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-6 space-y-3">
              <span className="text-[11px] font-mono text-muted block">
                liveimage.lk
              </span>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-paper">
                Dehiwala / Colombo Studio &amp; OB Unit
              </h3>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Based in <strong className="text-paper">{settings.address}</strong>.
                Our mobile multi-camera OB unit covers events across Colombo,
                Kandy, Galle, and island-wide.
              </p>
              <div className="space-y-2 pt-1 text-xs">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-night border border-white/10 hover:border-white/25 text-paper transition"
                >
                  <span>Facebook — LIVEIMAGE.lk</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted" />
                </a>
                <a
                  href={settings.facebookPersonalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-lg bg-night border border-white/10 hover:border-white/25 text-paper transition"
                >
                  <span>Facebook — Sadaruwan Video</span>
                  <ExternalLink className="w-3.5 h-3.5 text-muted" />
                </a>
              </div>
            </div>

            <div className="md:col-span-6 relative rounded-xl overflow-hidden border border-white/10 h-60 bg-night">
              <iframe
                title="Live Image LK Dehiwala Colombo Studio"
                src="https://www.openstreetmap.org/export/embed.html?bbox=79.8450%2C6.8350%2C79.8950%2C6.8750&layer=mapnik&marker=6.8511%2C79.8650"
                className="w-full h-full border-0 invert hue-rotate-180 contrast-90 opacity-80"
                loading="lazy"
              />
              <div className="absolute bottom-3 left-3 right-3 px-3.5 py-2 rounded-lg bg-night/90 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                <span className="font-medium text-paper">
                  {settings.address}
                </span>
                <a
                  href="https://maps.google.com/?q=Dehiwala,Colombo,Sri+Lanka"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-paper font-semibold hover:underline"
                >
                  Google Maps
                </a>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            9. OB VAN SPECS (`terminal`)
            ========================================================= */}
        {activeApp === "terminal" && (
          <div className="p-6 sm:p-8 bg-[#09090C] font-mono text-xs space-y-4">
            <div className="space-y-1.5 text-paper/85 max-h-48 overflow-y-auto">
              {terminalLogs.map((line, i) => (
                <div key={i} className="leading-relaxed">
                  {line}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() =>
                  setTerminalLogs((prev) => [
                    ...prev,
                    "Cameras: 12x 4K 60fps chains (Sony XDCAM + Blackmagic URSA Broadcast G2)",
                  ])
                }
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-paper transition"
              >
                Camera Inventory
              </button>
              <button
                type="button"
                onClick={() =>
                  setTerminalLogs((prev) => [
                    ...prev,
                    `Direct Line: ${settings.phone} | Email: ${settings.email}`,
                  ])
                }
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-paper transition"
              >
                Contact Info
              </button>
              <button
                type="button"
                onClick={() => setActiveApp("calendar")}
                className="px-3 py-1.5 rounded bg-rec text-white font-semibold transition"
              >
                Open Booking
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Bottom macOS Magnification Dock Only (No duplicate pills or captions) */}
      <div className="mt-6 flex justify-center">
        <div className="max-w-full overflow-x-auto py-3 px-2 flex justify-center">
          <MacOSDock
            apps={STUDIO_DOCK_APPS}
            onAppClick={handleDockAppClick}
            openApps={openApps}
            activeAppId={activeApp}
          />
        </div>
      </div>
    </section>
  );
}

export default ContactStudioDockSection;
