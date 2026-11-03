"use client";

import React from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Camera,
  Radio,
  Sparkles,
  Trophy,
  Sliders,
} from "lucide-react";
import { useLiveImage } from "@/context/LiveImageContext";

const DETAILED_SERVICES = [
  {
    id: "multi-cam",
    num: "01 · EVENTS",
    title: "Multi-Camera Event Coverage",
    bookingParam: "Concert",
    description:
      "Concerts, award nights, dramas and stage shows filmed from every angle with a live vision mixer. We bring a full portable broadcast control room so every wide crane shot, close-up and crowd reaction is captured in 4K.",
    chips: [
      "Up to 12 cameras",
      "4K Live switching",
      "Drone & Jimmy Jib",
      "LED Wall feed",
    ],
    image:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "live-streaming",
    num: "02 · STREAMING",
    title: "Broadcast Live Streaming",
    bookingParam: "Concert",
    description:
      "Broadcast-quality streams to YouTube, Facebook, Zoom or a private link — with custom lower-third graphics, sponsor overlays and a dedicated backup bonded 4G/5G internet channel.",
    chips: [
      "YouTube & Facebook Live",
      "Zoom / Teams Hybrid",
      "Custom RTMP",
      "Bonded 4G/5G Internet",
      "Lower thirds & logos",
    ],
    image:
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "weddings",
    num: "03 · WEDDINGS",
    title: "Wedding Films & Live Streams",
    bookingParam: "Wedding",
    description:
      "Cinematic highlight film plus a multi-camera live broadcast so family and friends overseas in Australia, the UK, Europe or the Middle East never miss the Poruwa ceremony or speeches.",
    chips: [
      "Highlight Film",
      "Live stream for overseas family",
      "Multi-cam ceremony",
      "2-cam or 4-cam setup",
    ],
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "corporate",
    num: "04 · CORPORATE & SPORTS",
    title: "Corporate, Expos & Sports",
    bookingParam: "Corporate",
    description:
      "Reliable multi-camera production for conferences, AGMs, product launches, school sports meets, cricket championships and cultural peraharas — complete with instant replay and live scoreboard graphics.",
    chips: [
      "Conferences & AGMs",
      "Sports Broadcast & Replay",
      "Cultural Pageants",
      "Presentation PIP feed",
    ],
    image:
      "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function ServicesPage() {
  const { packages, settings } = useLiveImage();

  return (
    <div className="bg-night text-paper">
      {/* 1. INNER PAGE BANNER */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-24">
        <div className="absolute inset-0 stage-spotlight-bg opacity-80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-medium text-muted mb-3">
            <Link href="/" className="hover:text-paper transition">
              Home
            </Link>{" "}
            / <span className="text-paper">Services</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-paper">
            Our Services
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl leading-relaxed">
            Full multi-camera production — cameras, crew, switching, sound and
            streaming in one package.
          </p>
        </div>
      </section>

      {/* 2. ALTERNATING DETAILED SERVICE SECTIONS */}
      <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {DETAILED_SERVICES.map((svc, idx) => {
          const isReversed = idx % 2 === 1;
          return (
            <div
              key={svc.id}
              id={svc.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center scroll-mt-24"
            >
              {/* Visual Column */}
              <div
                className={`lg:col-span-6 ${
                  isReversed ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-stage border border-white/10 shadow-2xl group">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
                </div>
              </div>

              {/* Copy & Feature Chips Column */}
              <div
                className={`lg:col-span-6 space-y-5 ${
                  isReversed ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
                  {svc.num}
                </span>
                <h2 className="font-heading font-bold text-2xl sm:text-4xl text-paper">
                  {svc.title}
                </h2>
                <p className="text-sm sm:text-base text-muted leading-relaxed">
                  {svc.description}
                </p>

                {/* Scan-friendly Feature Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {svc.chips.map((chip) => (
                    <span
                      key={chip}
                      className="px-3.5 py-1.5 rounded-lg bg-stage border border-white/10 text-xs font-medium text-paper"
                    >
                      {chip}
                    </span>
                  ))}
                </div>

                {/* Crucial UX Rule: Routes to /contact?service=SERVICE_NAME */}
                <div className="pt-3">
                  <Link
                    href={`/contact?service=${encodeURIComponent(
                      svc.bookingParam
                    )}&topic=${encodeURIComponent(svc.title)}`}
                    className="inline-flex items-center gap-2 bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-sm px-6 py-3 rounded-full shadow-lg shadow-rec/25 transition-all hover:scale-[1.02]"
                  >
                    <span>Get a quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* 3. SIMPLE PACKAGES SECTION (3-COLUMN PRICING / CAMERA TIERS) */}
      <section
        id="packages"
        className="py-16 sm:py-24 bg-[#0E0E12] border-t border-white/10 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-heading font-bold uppercase tracking-widest text-rec">
                PACKAGES
              </span>
              <h2 className="mt-2 font-heading font-bold text-2xl sm:text-4xl text-paper">
                Simple packages
              </h2>
            </div>
            <p className="text-sm text-muted max-w-md">
              Every event is different — these are starting points we tailor to
              your venue, camera count and streaming requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => {
              const cameraParam = pkg.cameraCount.includes("2")
                ? "2 Cameras"
                : pkg.cameraCount.includes("4")
                ? "4 Cameras"
                : "6+ Cameras";

              return (
                <div
                  key={pkg.id}
                  className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between transition ${
                    pkg.highlighted
                      ? "bg-stage border-2 border-rec shadow-2xl shadow-rec/10 relative"
                      : "bg-stage border border-white/10"
                  }`}
                >
                  {pkg.highlighted && (
                    <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full bg-rec text-white text-[11px] font-heading font-bold uppercase tracking-wider">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-5">
                    <div>
                      <span
                        className={`text-xs font-heading font-semibold ${
                          pkg.highlighted ? "text-rec" : "text-muted"
                        }`}
                      >
                        {pkg.tierName}
                      </span>
                      <h3 className="mt-1 font-heading font-bold text-2xl sm:text-3xl text-paper">
                        {pkg.cameraCount}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-muted">
                        {pkg.subtitle}
                      </p>
                    </div>

                    {/* Dynamic Admin Toggle for Package Prices */}
                    <div className="py-3 px-4 rounded-xl bg-night/70 border border-white/10">
                      {settings.showPackagePrices ? (
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-muted block">
                            Starting from
                          </span>
                          <span className="font-heading font-bold text-xl text-spotlight">
                            {pkg.priceLKR}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-muted">
                            Tailored to your venue &amp; duration
                          </span>
                          <span className="text-xs font-heading font-bold text-paper">
                            Custom Quote
                          </span>
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 pt-1">
                      {pkg.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2.5 text-sm text-paper/90"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-rec mt-2 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      href={`/contact?cameras=${encodeURIComponent(
                        cameraParam
                      )}&package=${encodeURIComponent(pkg.tierName)}`}
                      className={`w-full inline-flex items-center justify-center gap-2 py-3.5 px-5 rounded-full font-heading font-semibold text-sm transition ${
                        pkg.highlighted
                          ? "bg-rec hover:bg-[#d12820] text-white shadow-lg shadow-rec/25"
                          : "bg-night hover:bg-white/10 text-paper border border-white/15"
                      }`}
                    >
                      <span>Inquire</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
