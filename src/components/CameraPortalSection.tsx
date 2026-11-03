"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";
import {
  ArrowRight,
  Radio,
  Sparkles,
  Heart,
  Building2,
  CheckCircle2,
} from "lucide-react";

interface LensService {
  id: string;
  cam: string;
  focal: string;
  shutter: string;
  title: string;
  subtitle: string;
  description: string;
  specs: string[];
  image: string;
  icon: React.ComponentType<{ className?: string }>;
}

const LENS_SERVICES: LensService[] = [
  {
    id: "multicam",
    cam: "01 / 04",
    focal: "24mm WIDE · F1.6",
    shutter: "1/120s · ISO 800",
    title: "Multi-Camera Events",
    subtitle: "CONCERTS · FESTIVALS · ARENA SHOWS",
    description:
      "Up to 12 synchronized 4K URSA & Sony XDCAM broadcast chains with live hardware switching, jib cranes, wireless Tally, and instant LED wall IMAG feed.",
    specs: ["Up to 12× 4K SDI Chains", "Live ATEM Constellation", "40ft Jimmy Jib & Steadicam"],
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1600&auto=format&fit=crop&q=80",
    icon: Sparkles,
  },
  {
    id: "streaming",
    cam: "02 / 04",
    focal: "35mm PRIME · F1.8",
    shutter: "1/60s · ISO 640",
    title: "Broadcast Live Streaming",
    subtitle: "YOUTUBE · FACEBOOK · ZOOM · CUSTOM RTMP",
    description:
      "Multi-SIM bonded 4G/5G + fiber SRT/RTMP encoding with custom lower-thirds, scoreboard graphics, and crystal-clear digital soundboard audio.",
    specs: ["1080p60 / 4K60 Master Stream", "Bonded Cellular Redundancy", "Live Graphics & Overlays"],
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1600&auto=format&fit=crop&q=80",
    icon: Radio,
  },
  {
    id: "weddings",
    cam: "03 / 04",
    focal: "50mm CINE · F1.4",
    shutter: "1/50s · ISO 400",
    title: "Weddings & Overseas Streams",
    subtitle: "PORUWA · RECEPTIONS · GLOBAL FAMILY LINKS",
    description:
      "Cinematic multi-angle wedding films paired with private real-time HD/4K broadcasts so family in the UK, Australia, Canada, and Middle East never miss a moment.",
    specs: ["Unobtrusive Cinema Rigs", "Same-Day Highlight Edit", "Global Private Live Link"],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=80",
    icon: Heart,
  },
  {
    id: "corporate",
    cam: "04 / 04",
    focal: "85mm TELE · F2.0",
    shutter: "1/100s · ISO 500",
    title: "Corporate, Expos & Sports",
    subtitle: "SUMMITS · AGMS · TOURNAMENTS · AWARDS",
    description:
      "Turnkey broadcast production for Colombo conferences, hybrid townhalls, school big matches, and stadium tournaments with instant slow-motion replay.",
    specs: ["Instant Slow-Mo Replay", "Hybrid Zoom/Teams Bridge", "Multi-Track ISO Recording"],
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80",
    icon: Building2,
  },
];

export function CameraPortalSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Fast, responsive spring so transitions into and out of the camera feel crisp
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.3,
  });

  // Switch the 4 service frames while inside the camera (0.18 -> 0.82)
  useMotionValueEvent(smoothProgress, "change", (v) => {
    if (v < 0.35) {
      if (activeIndex !== 0) setActiveIndex(0);
    } else if (v < 0.51) {
      if (activeIndex !== 1) setActiveIndex(1);
    } else if (v < 0.67) {
      if (activeIndex !== 2) setActiveIndex(2);
    } else {
      if (activeIndex !== 3) setActiveIndex(3);
    }
  });

  // =========================================================
  // STAGE 1: `back.png` STOPS AT CRISP NATURAL SIZE, THEN QUICKLY STEPS INSIDE [0.00 -> 0.17]
  // Never over-scales `back.png` (max 2.15x during the quick transition) so image quality stays 100% sharp!
  // =========================================================
  const backScale = useTransform(
    smoothProgress,
    [0.0, 0.08, 0.17],
    [0.92, 1.0, 2.15]
  );
  const backX = useTransform(
    smoothProgress,
    [0.0, 0.08, 0.17],
    ["0%", "0%", "1.5%"]
  );
  const backY = useTransform(
    smoothProgress,
    [0.0, 0.08, 0.17],
    ["0%", "0%", "6.5%"]
  );
  const backOpacity = useTransform(
    smoothProgress,
    [0.0, 0.11, 0.165],
    [1, 1, 0]
  );

  // =========================================================
  // STAGE 2: QUICKLY MOVE INSIDE THE CAMERA — 4 SERVICE FRAMES [0.11 -> 0.88]
  // =========================================================
  const portalOpacity = useTransform(
    smoothProgress,
    [0.10, 0.16, 0.83, 0.89],
    [0, 1, 1, 0]
  );
  const portalScale = useTransform(
    smoothProgress,
    [0.10, 0.17, 0.82, 0.89],
    [0.08, 1, 1, 0.08]
  );

  const lensRingRotate = useTransform(
    smoothProgress,
    [0.16, 0.35, 0.51, 0.67, 0.83],
    [0, 45, 95, 145, 195]
  );
  const lensRingReverse = useTransform(
    smoothProgress,
    [0.16, 0.35, 0.51, 0.67, 0.83],
    [0, -35, -75, -120, -165]
  );

  // =========================================================
  // STAGE 3: QUICKLY ZOOM OUT TO CRISP `front.png` & STOP CLEANLY [0.83 -> 1.00]
  // Never over-scales `front.png` (starts at 2.15x -> stops cleanly at 1.0x sharp natural size)
  // =========================================================
  const frontScale = useTransform(
    smoothProgress,
    [0.83, 0.91, 1.0],
    [2.15, 1.0, 0.96]
  );
  const frontX = useTransform(
    smoothProgress,
    [0.83, 0.91, 1.0],
    ["1.5%", "0%", "0%"]
  );
  const frontY = useTransform(
    smoothProgress,
    [0.83, 0.91, 1.0],
    ["-7.5%", "0%", "0%"]
  );
  const frontOpacity = useTransform(
    smoothProgress,
    [0.83, 0.88, 1.0],
    [0, 1, 1]
  );

  const activeService = LENS_SERVICES[activeIndex];

  return (
    <section
      ref={containerRef}
      className="relative h-[300vh] bg-[#0B0B0E] select-none"
    >
      {/* Sticky Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center bg-[#0B0B0E]">
        {/* Studio stage ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(232,51,43,0.08)_0%,rgba(11,11,14,0)_65%)] pointer-events-none" />

        {/* =========================================================
            ENTRY CAMERA: `back.png` (Crisp studio size, stops, then quickly moves inside)
            ========================================================= */}
        <motion.div
          style={{
            scale: backScale,
            x: backX,
            y: backY,
            opacity: backOpacity,
            transformOrigin: "47.5% 38.7%",
          }}
          className="absolute z-20 w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[55%] h-8 bg-black/90 blur-xl rounded-full" />
          <img
            src="/camera-angles/back.png"
            alt="Sony XDCAM Rear Viewfinder"
            draggable={false}
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_28px_55px_rgba(0,0,0,0.95)]"
          />
        </motion.div>

        {/* =========================================================
            EXIT CAMERA: `front.png` (Quickly zooms out from front lens and stops at crisp studio size)
            ========================================================= */}
        <motion.div
          style={{
            scale: frontScale,
            x: frontX,
            y: frontY,
            opacity: frontOpacity,
            transformOrigin: "47.2% 63.1%",
          }}
          className="absolute z-20 w-[240px] h-[240px] sm:w-[300px] sm:h-[300px] md:w-[350px] md:h-[350px] flex items-center justify-center pointer-events-none"
        >
          <div className="absolute bottom-[6%] left-1/2 -translate-x-1/2 w-[58%] h-8 bg-black/90 blur-xl rounded-full" />
          <img
            src="/camera-angles/front.png"
            alt="Sony XDCAM Front Lens"
            draggable={false}
            className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_28px_55px_rgba(0,0,0,0.95)]"
          />
        </motion.div>

        {/* =========================================================
            INSIDE THE CAMERA: 4 PRODUCTION FRAMES
            ========================================================= */}
        <motion.div
          style={{
            opacity: portalOpacity,
            scale: portalScale,
          }}
          className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
        >
          {/* Outer Dark Vignette Mask around the Circular Sony Lens G Barrel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, transparent 36%, rgba(5,5,7,0.88) 49%, #0B0B0E 60%)",
            }}
          />

          {/* Main Circular Optical Lens Portal */}
          <div className="relative w-[92vw] h-[92vw] max-w-[760px] max-h-[760px] rounded-full flex items-center justify-center">
            {/* Outer Brushed Anodized Sony Lens G Barrel Ring */}
            <motion.div
              style={{ rotate: lensRingRotate }}
              className="absolute inset-0 rounded-full border-[16px] sm:border-[24px] border-[#14151B] shadow-[0_0_120px_rgba(0,0,0,0.98),inset_0_0_60px_rgba(0,0,0,0.95)]"
            >
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1.5px]"
                  style={{ transform: `rotate(${i * 10}deg)` }}
                >
                  <div
                    className={`w-full ${
                      i % 3 === 0 ? "h-3.5 bg-white/30" : "h-2 bg-white/10"
                    }`}
                  />
                </div>
              ))}
            </motion.div>

            {/* Inner Counter-Rotating Aperture Ring with Sony Lens G Markings */}
            <motion.div
              style={{ rotate: lensRingReverse }}
              className="absolute inset-[18px] sm:inset-[28px] rounded-full border-[10px] sm:border-[16px] border-[#0E0F14] shadow-[inset_0_0_45px_rgba(0,0,0,0.95)]"
            >
              <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-mono tracking-[0.35em] text-white/35 uppercase">
                SONY LENS G · 20× OPTICAL ZOOM
              </span>
              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] sm:text-[10px] font-mono tracking-[0.35em] text-rec/50 uppercase">
                f=4.3-86mm 1:1.6 · CARL ZEISS
              </span>
            </motion.div>

            {/* Core Circular Glass Viewport Showing the 4 Services Inside the Camera */}
            <div className="relative w-[calc(100%-56px)] h-[calc(100%-56px)] sm:w-[calc(100%-88px)] sm:h-[calc(100%-88px)] rounded-full overflow-hidden bg-[#07070A] border border-white/15 shadow-[inset_0_0_90px_rgba(0,0,0,0.95)] pointer-events-auto">
              {/* All 4 Service Slides Pre-Mounted for Smooth Optical Focus Pull */}
              {LENS_SERVICES.map((service, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <motion.div
                    key={service.id}
                    initial={false}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 1.1,
                      filter: isActive ? "blur(0px)" : "blur(10px)",
                    }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0"
                    style={{ pointerEvents: isActive ? "auto" : "none" }}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover object-center brightness-[0.58] contrast-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07070A] via-[#07070A]/55 to-[#07070A]/40" />
                  </motion.div>
                );
              })}

              {/* Realistic Multi-Coated Lens Glass Reflections */}
              <div className="absolute -top-1/4 -left-1/4 w-[90%] h-[90%] rounded-full bg-[radial-gradient(circle,rgba(96,165,250,0.12)_0%,rgba(232,51,43,0.06)_45%,transparent_70%)] pointer-events-none mix-blend-screen" />
              <div className="absolute inset-4 sm:inset-6 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute inset-8 sm:inset-12 rounded-full border border-dashed border-white/10 pointer-events-none" />

              {/* Content Inside the Camera Lens */}
              <div className="relative z-10 w-full h-full flex flex-col items-center justify-between text-center px-8 py-10 sm:px-16 sm:py-14">
                {/* Top Optical HUD Telemetry */}
                <div className="flex items-center gap-2.5 px-3.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-mono text-paper/90">
                  <span className="w-2 h-2 rounded-full bg-rec animate-pulse shadow-[0_0_8px_#E8332B]" />
                  <span className="text-rec font-semibold">REC</span>
                  <span className="text-white/25">|</span>
                  <span>LENS {activeService.cam}</span>
                  <span className="hidden sm:inline text-white/25">|</span>
                  <span className="hidden sm:inline text-gold">
                    {activeService.focal}
                  </span>
                </div>

                {/* Center Service Story Inside the Camera */}
                <motion.div
                  key={activeService.id}
                  initial={{ opacity: 0, y: 14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="max-w-lg mx-auto flex flex-col items-center"
                >
                  <p className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-gold mb-2">
                    {activeService.subtitle}
                  </p>
                  <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold text-paper tracking-tight leading-[1.1] mb-3 sm:mb-4">
                    {activeService.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-paper/80 leading-relaxed mb-5 sm:mb-6 line-clamp-3">
                    {activeService.description}
                  </p>

                  {/* Spec Pills */}
                  <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 mb-6">
                    {activeService.specs.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 border border-white/15 text-[11px] text-paper/90 backdrop-blur-md"
                      >
                        <CheckCircle2 className="w-3 h-3 text-rec shrink-0" />
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href="/services"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rec hover:bg-rec/90 text-white font-heading font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-rec/30"
                    >
                      Explore Service
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-paper border border-white/15 font-heading font-semibold text-xs sm:text-sm backdrop-blur-md transition-all"
                    >
                      Book Now
                    </Link>
                  </div>
                </motion.div>

                {/* Bottom Optical Progress Dots */}
                <div className="flex items-center gap-2.5">
                  {LENS_SERVICES.map((s, idx) => (
                    <span
                      key={s.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeIndex
                          ? "w-7 bg-rec shadow-[0_0_10px_#E8332B]"
                          : "w-2 bg-white/25"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CameraPortalSection;
