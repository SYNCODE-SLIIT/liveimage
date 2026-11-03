"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  ArrowRight,
  Star,
  Images,
  Video,
  Camera,
  Users,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { useLiveImage } from "@/context/LiveImageContext";
import {
  INITIAL_CAMERA_FEEDS,
  MediaProject,
} from "@/data/seedData";
import {
  VideoPlayerModal,
  PhotoLightboxModal,
} from "@/components/MediaModals";
import {
  RulerCarousel,
  type CarouselItem,
} from "@/components/ui/ruler-carousel";
import { CameraPortalSection } from "@/components/CameraPortalSection";
import { ContactStudioDockSection } from "@/components/ContactStudioDockSection";

const HOW_IT_WORKS_STEPS = [
  {
    num: "01",
    title: "Tell us about it",
    desc: "Share your event date, venue and how many cameras or streams you need.",
  },
  {
    num: "02",
    title: "Site plan",
    desc: "We plan camera positions, crane/drone angles, sound matrix & bonded internet.",
  },
  {
    num: "03",
    title: "Event day",
    desc: "Our crew sets up early, films, switches angles live & streams in real time.",
  },
  {
    num: "04",
    title: "Delivery",
    desc: "Edited 4K highlight reels & full master multi-camera recording delivered fast.",
  },
];

export default function HomePage() {
  const { settings, projects, testimonials } = useLiveImage();
  const [showreelOpen, setShowreelOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<MediaProject | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<MediaProject | null>(null);

  const heroCam = INITIAL_CAMERA_FEEDS[0];

  const featuredProjects = projects.filter(
    (p) => p.featuredOnHome && p.status === "Live"
  );
  const mainFeatured = featuredProjects[0] || projects[0];
  const secondaryFeatured = featuredProjects.slice(1, 5);

  const clientCarouselItems: CarouselItem[] = (
    settings.clientLogos && settings.clientLogos.length >= 6
      ? [
          ...settings.clientLogos,
          ...(settings.clientLogos.length < 9
            ? ["SWARNAVAHINI", "ROYAL COLLEGE", "SHANGRI-LA"]
            : []),
        ]
      : [
          "RDB BANK",
          "VOI FOODS",
          "AI NATIONAL EXPO",
          "CPL 2026",
          "RIDEERAYAK LIVE",
          "UDUGAMA PERAHARA",
          "SWARNAVAHINI",
          "ROYAL COLLEGE",
          "SHANGRI-LA",
        ]
  ).map((title, idx) => ({
    id: idx + 1,
    title,
  }));

  const renderHeadlineWithAccent = (headline: string) => {
    if (headline.endsWith("Live.")) {
      const mainPart = headline.slice(0, -5);
      return (
        <>
          {mainPart}
          <span className="text-rec inline-block relative">
            Live.
            <span className="absolute -top-1 -right-3 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rec opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rec" />
            </span>
          </span>
        </>
      );
    }
    return headline;
  };

  const handleProjectClick = (proj: MediaProject) => {
    if (proj.type === "photos") {
      setSelectedAlbum(proj);
    } else {
      setSelectedVideo(proj);
    }
  };

  const trustCards = [
    {
      stat: settings.eventsFilmed,
      label: "Events filmed",
      icon: Video,
      iconColor: "text-[#E8332B]",
      glowColor: "from-[#E8332B]/20",
    },
    {
      stat: settings.cameraSetups,
      label: "Camera setups",
      icon: Camera,
      iconColor: "text-[#818CF8]",
      glowColor: "from-[#818CF8]/20",
    },
    {
      stat: settings.liveViewers,
      label: "Live viewers reached",
      icon: Users,
      iconColor: "text-[#F87171]",
      glowColor: "from-[#F87171]/20",
    },
    {
      stat: settings.yearsInProduction,
      label: "In production",
      icon: Calendar,
      iconColor: "text-[#FB7185]",
      glowColor: "from-[#FB7185]/20",
    },
  ];

  return (
    <div className="bg-night text-paper">
      {/* 1. FIRST HERO SCREEN: PURE FULL-SCREEN LIVE VIDEO + HEADLINE ONLY */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Full-Bleed Live Background Video */}
        <div className="absolute inset-0 z-0 bg-night">
          <video
            autoPlay
            muted
            loop
            playsInline
            poster={heroCam.thumbnailUrl}
            className="w-full h-full object-cover opacity-60 scale-[1.02]"
          >
            <source src={heroCam.videoStreamUrl} type="video/mp4" />
          </video>

          {/* Cinema Spotlight & Deep Vignette */}
          <div className="absolute inset-0 stage-spotlight-bg mix-blend-screen opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-transparent to-night" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0B0B0E_100%)] opacity-75" />
        </div>

        {/* Pure Editorial Center Hero Copy (No buttons or clutter in 1st screen) */}
        <div className="relative z-10 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h1 className="font-heading font-extrabold text-4xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-paper drop-shadow-2xl">
              {renderHeadlineWithAccent(settings.heroHeadline)}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-paper/80 max-w-2xl mx-auto leading-relaxed font-normal">
              {settings.heroSubheadline}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. "OUR IMPACT" — TURNING MOMENTS INTO LASTING STORIES + 4 ICON STAT CARDS */}
      <section className="relative z-20 py-20 sm:py-28 overflow-hidden border-y border-white/5">
        {/* Atmospheric Stage & Broadcast Camera Rig Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1800&q=80"
            alt="Live Production Stage"
            className="w-full h-full object-cover object-right opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0E] via-[#0B0B0E]/90 to-[#0B0B0E]/65" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0E] via-transparent to-[#0B0B0E]" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-rec/15 rounded-full blur-[120px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: OUR IMPACT + Heading + Copy + Two Pill Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 space-y-5"
            >
              {/* Eyebrow with Horizontal Line */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-heading font-semibold uppercase tracking-[0.24em] text-muted">
                  OUR IMPACT
                </span>
                <span className="h-[1px] w-16 bg-gradient-to-r from-white/25 to-transparent" />
              </div>

              {/* Heading */}
              <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-[42px] leading-[1.14] tracking-tight text-paper">
                Turning Moments
                <br />
                Into <span className="text-rec">Lasting Stories</span>
              </h2>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted/90 leading-relaxed max-w-md">
                From intimate gatherings to large-scale productions, we bring
                your vision to life with professional filming, cutting-edge
                technology and a passionate team.
              </p>

              {/* Two Pill Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2.5 bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs sm:text-sm px-6 py-3 rounded-full shadow-lg shadow-rec/30 transition-all hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>Book Your Event</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  type="button"
                  onClick={() => setShowreelOpen(true)}
                  className="inline-flex items-center gap-2.5 bg-[#121217]/80 hover:bg-stage text-paper border border-white/15 hover:border-white/30 font-heading font-medium text-xs sm:text-sm px-5 py-3 rounded-full transition-all hover:scale-[1.03]"
                >
                  <span className="w-4 h-4 rounded-full bg-rec/20 flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 text-rec fill-current ml-0.5" />
                  </span>
                  <span>Watch Showreel</span>
                </button>
              </div>
            </motion.div>

            {/* Right Column: 4 Floating Dark Icon Stat Cards */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
              {trustCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.55,
                      delay: idx * 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ y: -7 }}
                    className="group relative rounded-2xl bg-[#111116]/90 backdrop-blur-xl border border-white/[0.08] hover:border-white/20 px-4 py-7 flex flex-col items-center justify-center text-center shadow-2xl transition-colors overflow-hidden"
                  >
                    {/* Subtle Top Radial Icon Glow */}
                    <div
                      className={`absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full bg-gradient-to-b ${card.glowColor} to-transparent blur-xl opacity-75 group-hover:opacity-100 transition-opacity pointer-events-none`}
                    />

                    <div className="relative z-10 mb-3.5">
                      <Icon
                        className={`w-6 h-6 ${card.iconColor} stroke-[1.75]`}
                      />
                    </div>

                    <div className="relative z-10 font-heading font-bold text-2xl sm:text-3xl text-paper tracking-tight">
                      {card.stat}
                    </div>

                    <div className="relative z-10 text-[11px] sm:text-xs text-muted mt-1.5 font-normal">
                      {card.label}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 3D SCROLL-DRIVEN CAMERA LENS PORTAL ("Production built around your event") */}
      <CameraPortalSection />

      {/* 4. LATEST WORK — Recent productions (Floating Dynamic Bento Grid) */}
      <section className="py-16 sm:py-24 bg-[#0E0E12] border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
                LATEST WORK
              </span>
              <h2 className="mt-2 font-heading font-bold text-2xl sm:text-4xl text-paper">
                Recent productions
              </h2>
            </div>
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 text-sm font-heading font-semibold text-paper hover:text-rec transition"
            >
              <span>View full portfolio</span>
              <ArrowRight className="w-4 h-4 text-rec" />
            </Link>
          </motion.div>

          {/* Bento Grid: 1 Large Featured Video Left + 2x2 Grid Right */}
          {mainFeatured && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Large Primary Card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
                whileHover={{ y: -6 }}
                onClick={() => handleProjectClick(mainFeatured)}
                className="lg:col-span-6 group cursor-pointer bg-stage border border-white/10 hover:border-rec/50 rounded-2xl overflow-hidden flex flex-col justify-between transition shadow-2xl"
              >
                <div className="relative aspect-[16/11] sm:aspect-[16/10] lg:aspect-auto lg:h-full min-h-[320px] overflow-hidden bg-night">
                  <img
                    src={mainFeatured.thumbnailUrl}
                    alt={mainFeatured.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />

                  {/* Top-left Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    {mainFeatured.type !== "photos" ? (
                      <span className="px-2.5 py-1 rounded bg-rec text-white text-xs font-heading font-bold tracking-wider">
                        VIDEO · {mainFeatured.duration || "3:42"}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-stage/90 border border-white/15 text-paper text-xs font-heading font-bold">
                        PHOTOS · {mainFeatured.photoCount}
                      </span>
                    )}
                  </div>

                  {/* Center Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="w-15 h-15 p-4 rounded-full bg-white/95 group-hover:bg-rec text-night group-hover:text-white flex items-center justify-center shadow-2xl transition-all group-hover:scale-110">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </span>
                  </div>

                  {/* Bottom Caption Overlay */}
                  <div className="absolute bottom-0 inset-x-0 p-6">
                    <span className="text-xs font-semibold uppercase tracking-wider text-rec">
                      {mainFeatured.category}
                    </span>
                    <h3 className="mt-1 font-heading font-bold text-xl sm:text-2xl text-paper">
                      {mainFeatured.title}
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted">
                      {mainFeatured.subtitle}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right 2x2 Grid Cards */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {secondaryFeatured.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.55, delay: (idx + 1) * 0.08 }}
                    whileHover={{ y: -6 }}
                    onClick={() => handleProjectClick(item)}
                    className="group cursor-pointer bg-stage border border-white/10 hover:border-rec/50 rounded-2xl overflow-hidden flex flex-col justify-between transition shadow-xl"
                  >
                    <div className="relative aspect-video overflow-hidden bg-night">
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stage/90 via-transparent to-transparent" />

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        {item.type !== "photos" ? (
                          <span className="px-2 py-0.5 rounded bg-rec text-white text-[11px] font-heading font-bold">
                            VIDEO · {item.duration || "3:42"}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-black/75 border border-white/15 text-paper text-[11px] font-heading font-semibold">
                            PHOTOS · {item.photoCount}
                          </span>
                        )}
                      </div>

                      {/* Play Circle */}
                      <div className="absolute bottom-3 right-3">
                        <span className="w-9 h-9 rounded-full bg-white/90 group-hover:bg-rec text-night group-hover:text-white flex items-center justify-center shadow-lg transition">
                          {item.type === "photos" ? (
                            <Images className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-heading font-bold text-base text-paper group-hover:text-rec transition line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">
                        {item.subtitle}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. HOW IT WORKS — From enquiry to final film (4 Floating Step Cards) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55 }}
          className="mb-10 sm:mb-12"
        >
          <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
            HOW IT WORKS
          </span>
          <h2 className="mt-2 font-heading font-bold text-2xl sm:text-4xl text-paper">
            From enquiry to final film
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS_STEPS.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: idx * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-stage border border-white/10 hover:border-rec/40 rounded-2xl p-6 space-y-3 relative overflow-hidden shadow-lg transition-colors"
            >
              <span className="font-heading font-bold text-xs tracking-widest text-rec">
                {step.num}
              </span>
              <h3 className="font-heading font-bold text-lg text-paper">
                {step.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CAMERA FOCUS ROLLER CLIENT CAROUSEL (RulerCarousel) */}
      <section className="py-12 sm:py-16 border-t border-white/10 bg-night relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-2">
          <span className="text-[11px] font-heading font-bold uppercase tracking-[0.24em] text-rec">
            OUR PARTNERS &amp; BROADCAST CLIENTS
          </span>
          <p className="text-xs sm:text-sm text-muted mt-1">
            Trusted by leading Sri Lankan corporations, broadcasters &amp; event
            organizers
          </p>
        </div>

        <RulerCarousel originalItems={clientCarouselItems} />
      </section>

      {/* 7. CLIENT STORIES — Trusted on the big days (Floating Testimonials) */}
      <section className="py-16 sm:py-20 bg-[#0E0E12] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55 }}
            className="mb-10"
          >
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
              CLIENT STORIES
            </span>
            <h2 className="mt-2 font-heading font-bold text-2xl sm:text-4xl text-paper">
              Trusted on the big days
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: idx * 0.12 }}
                whileHover={{ y: -6 }}
                className="bg-stage border border-white/10 hover:border-white/25 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-xl transition-colors"
              >
                <div className="space-y-4">
                  {/* 5 Stars in Spotlight Gold (#F2B544) */}
                  <div className="flex items-center gap-1 text-spotlight">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-base sm:text-lg text-paper leading-relaxed font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-2">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-heading font-bold text-sm text-night shrink-0"
                    style={{ backgroundColor: t.avatarColor || "#E8332B" }}
                  >
                    {t.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-heading font-bold text-sm text-paper">
                      {t.clientName}
                    </div>
                    <div className="text-xs text-muted">{t.clientRole}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE MACOS STUDIO CONTACT & BOOKING DOCK */}
      <ContactStudioDockSection />

      {/* Showreel Modal */}
      <VideoPlayerModal
        isOpen={showreelOpen}
        onClose={() => setShowreelOpen(false)}
        title="LIVE IMAGE LK — Official 4K Multi-Camera Showreel"
        subtitle="12 Cameras · OB Control Room · Drone & Jib · Live Broadcast"
        description="Highlights from concerts, weddings, corporate expos, cultural peraharas and sports championships across Sri Lanka."
        videoUrl={settings.heroVideoUrl}
        thumbnailUrl={heroCam.thumbnailUrl}
        cameraCount={12}
        duration="3:42"
        category="Showreel"
      />

      {/* Selected Project Video Modal */}
      {selectedVideo && (
        <VideoPlayerModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          title={selectedVideo.title}
          subtitle={selectedVideo.subtitle}
          description={selectedVideo.description}
          videoUrl={selectedVideo.videoUrl || settings.heroVideoUrl}
          thumbnailUrl={selectedVideo.thumbnailUrl}
          cameraCount={selectedVideo.cameraCount}
          duration={selectedVideo.duration}
          category={selectedVideo.category}
        />
      )}

      {/* Selected Photo Album Lightbox */}
      <PhotoLightboxModal
        project={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
}
