"use client";

import React from "react";
import Link from "next/link";
import {
  Camera,
  Sliders,
  Radio,
  Compass,
  ArrowRight,
  Monitor,
  CheckCircle2,
} from "lucide-react";

const EQUIPMENT_SPECS = [
  {
    stat: "12",
    label: "Broadcast 4K Cameras",
    detail: "Sony FX9 / FX6, Blackmagic URSA Broadcast G2 & telephoto lenses",
  },
  {
    stat: "2",
    label: "Blackmagic ATEM Switchers",
    detail: "ATEM Constellation 8K & SDI/Fiber portable fly-away racks",
  },
  {
    stat: "4K",
    label: "Streaming & Recording",
    detail: "Hardware encoders, ISO multi-track recording & bonded 4G/5G net",
  },
  {
    stat: "3",
    label: "Cinema Drones & Jib Rigs",
    detail: "DJI Inspire / Mavic 3 Cine, 24ft Jimmy Jib & wireless gimbals",
  },
];

const CREW_MEMBERS = [
  {
    name: "B Damith Sadaruwan",
    role: "Founder & Technical Director",
    bio: "10+ years directing multi-camera concerts, national broadcasts, corporate expos and live streams across Sri Lanka.",
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=800&q=80",
    badge: "FOUNDER · DIRECTOR",
  },
  {
    name: "Camera Lead",
    role: "Director of Photography",
    bio: "Leads camera placement, cinema lighting, Jimmy Jib operations and wireless roaming stage coverage.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    badge: "CAMERA OPS",
  },
  {
    name: "Live Producer",
    role: "Switching & Graphics Operator",
    bio: "Manages real-time ATEM vision mixing, lower-thirds, scoreboard graphics, instant replay and multi-platform encoders.",
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
    badge: "VISION MIXING",
  },
  {
    name: "Lead Editor",
    role: "Post-Production & Color Grading",
    bio: "Cuts same-day wedding & corporate reels, multi-cam master edits and DaVinci Resolve 4K color grading.",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    badge: "POST & COLOR",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-night text-paper">
      {/* 1. PAGE BANNER */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-24">
        <div className="absolute inset-0 stage-spotlight-bg opacity-80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-medium text-muted mb-3">
            <Link href="/" className="hover:text-paper transition">
              Home
            </Link>{" "}
            / <span className="text-paper">About</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-paper">
            About Live Image LK
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            A Sri Lankan production team that brings broadcast-style coverage to
            every event.
          </p>
        </div>
      </section>

      {/* 2. STORY SECTION WITH MULTI-VIEW CONTROL ROOM VISUAL */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Control Room 6-Monitor Multi-View Wall Visual (Matching PDF page 7) */}
          <div className="lg:col-span-6">
            <div className="bg-stage border border-white/15 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-muted pb-1 border-b border-white/10">
                <span className="flex items-center gap-2 text-paper font-semibold">
                  <span className="w-2 h-2 rounded-full bg-rec animate-pulse" />
                  ATEM MULTI-VIEW CONTROL ROOM
                </span>
                <span>COLOMBO OB UNIT 01</span>
              </div>

              {/* 6-Screen Multi-View Monitor Grid */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-purple-900/80 via-night to-rec/60 border-2 border-rec">
                  <img
                    src="https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=600&q=80"
                    alt="PGM"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-rec text-[9px] font-mono font-bold text-white">
                    PGM · CAM 1
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-amber-600/50 via-night to-orange-900/60 border border-emerald-400/70">
                  <img
                    src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80"
                    alt="PVW"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-emerald-500 text-[9px] font-mono font-bold text-night">
                    PVW · CAM 2
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-blue-800/60 via-night to-indigo-950 border border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=600&q=80"
                    alt="CAM 3"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white">
                    CAM 3 · JIB
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-emerald-800/60 via-night to-teal-950 border border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=600&q=80"
                    alt="CAM 4"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white">
                    CAM 4 · DRONE
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-rose-800/60 via-night to-amber-950 border border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                    alt="CAM 5"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-white">
                    CAM 5 · GIMBAL
                  </span>
                </div>
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-cyan-800/60 via-night to-slate-900 border border-white/15">
                  <img
                    src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&q=80"
                    alt="AUDIO & STREAM"
                    className="w-full h-full object-cover opacity-80"
                  />
                  <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-spotlight">
                    STREAM · 4K 50P
                  </span>
                </div>
              </div>

              {/* Audio & Encoder Telemetry Bar */}
              <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-muted">
                <span>BITRATE: 18.4 Mbps (BONDED 5G)</span>
                <span className="text-emerald-400">STREAM HEALTH: EXCELLENT</span>
              </div>
            </div>
          </div>

          {/* Story Copy */}
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
              OUR STORY
            </span>
            <h2 className="font-heading font-bold text-2xl sm:text-4xl text-paper">
              Ten years of putting events on screen
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Founded by <strong className="text-paper">B Damith Sadaruwan</strong>,{" "}
              <strong className="text-paper">LIVE IMAGE (PVT) LTD</strong> started
              with two cameras and a passion for live broadcast engineering.
              Today we bring full multi-camera television-grade setups to
              concerts, weddings, corporate expos, cultural peraharas and sports
              across the island.
            </p>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Our crew handles everything in-house — 4K cameras, Jimmy Jib
              cranes, cinema drones, sound feeds, live ATEM vision switching and
              bonded internet streaming — so event organizers and families can
              enjoy the occasion with zero technical stress.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-paper">
                <CheckCircle2 className="w-4 h-4 text-rec" />
                <span>Dehiwala / Colombo Base · Island-wide Travel</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-paper">
                <CheckCircle2 className="w-4 h-4 text-rec" />
                <span>Dedicated OB Control Setup</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EQUIPMENT ON EVERY JOB (4 Spec Cards) */}
      <section
        id="equipment"
        className="py-16 sm:py-20 bg-[#0E0E12] border-y border-white/10 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
              OUR GEAR
            </span>
            <h2 className="mt-2 font-heading font-bold text-2xl sm:text-4xl text-paper">
              Equipment on every job
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EQUIPMENT_SPECS.map((item, idx) => (
              <div
                key={idx}
                className="bg-stage border border-white/10 rounded-2xl p-6 space-y-2"
              >
                <div className="font-heading font-bold text-3xl sm:text-4xl text-paper">
                  {item.stat}
                </div>
                <div className="font-heading font-semibold text-base text-rec">
                  {item.label}
                </div>
                <p className="text-xs sm:text-sm text-muted leading-relaxed">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. MEET THE CREW (4 Team Cards) */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
              THE TEAM
            </span>
            <h2 className="mt-2 font-heading font-bold text-2xl sm:text-4xl text-paper">
              Meet the crew
            </h2>
          </div>
          <p className="text-sm text-muted max-w-md">
            Experienced camera operators, vision mixers and broadcast engineers
            on every single call sheet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CREW_MEMBERS.map((member, idx) => (
            <div
              key={idx}
              className="bg-stage border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-night">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stage via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/75 border border-white/15 text-[10px] font-heading font-bold tracking-wider text-paper">
                    {member.badge}
                  </span>
                </div>
                <div className="p-5 space-y-1.5">
                  <h3 className="font-heading font-bold text-lg text-paper">
                    {member.name}
                  </h3>
                  <div className="text-xs font-semibold text-rec">
                    {member.role}
                  </div>
                  <p className="text-xs text-muted leading-relaxed pt-1">
                    {member.bio}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2.5 bg-rec hover:bg-[#d12820] text-white font-heading font-bold text-sm sm:text-base px-8 py-4 rounded-full shadow-xl shadow-rec/25 transition hover:scale-105"
          >
            <span>Book Damith &amp; The Crew</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
