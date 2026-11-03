"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Play, Images, Camera, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveImage } from "@/context/LiveImageContext";
import { MediaProject } from "@/data/seedData";
import {
  VideoPlayerModal,
  PhotoLightboxModal,
} from "@/components/MediaModals";

type FilterOption =
  | "All"
  | "Concerts"
  | "Weddings"
  | "Corporate"
  | "Sports"
  | "Videos only";

const FILTER_PILLS: FilterOption[] = [
  "All",
  "Concerts",
  "Weddings",
  "Corporate",
  "Sports",
  "Videos only",
];

export default function PortfolioPage() {
  const { projects, settings } = useLiveImage();
  const [activeFilter, setActiveFilter] = useState<FilterOption>("All");
  const [selectedVideo, setSelectedVideo] = useState<MediaProject | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<MediaProject | null>(null);

  // Only show Live items on the public portfolio
  const liveProjects = projects.filter((p) => p.status === "Live");

  const filteredProjects = liveProjects.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Videos only")
      return item.type === "video" || item.type === "both";
    return item.category === activeFilter;
  });

  const handleCardClick = (item: MediaProject) => {
    if (item.type === "photos") {
      setSelectedAlbum(item);
    } else {
      setSelectedVideo(item);
    }
  };

  return (
    <div className="bg-night text-paper min-h-screen">
      {/* 1. HEADER */}
      <section className="relative overflow-hidden border-b border-white/10 py-16 sm:py-24">
        <div className="absolute inset-0 stage-spotlight-bg opacity-80" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-medium text-muted mb-3">
            <Link href="/" className="hover:text-paper transition">
              Home
            </Link>{" "}
            / <span className="text-paper">Portfolio</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl lg:text-6xl text-paper">
            Our Work
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl">
            Photos and videos from recent events — updated every month.
          </p>

          {/* 2. INTERACTIVE 1-TAP CATEGORY FILTER PILLS */}
          <div className="mt-8 flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {FILTER_PILLS.map((pill) => {
              const isActive = activeFilter === pill;
              return (
                <button
                  key={pill}
                  type="button"
                  onClick={() => setActiveFilter(pill)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-heading font-semibold transition shrink-0 ${
                    isActive
                      ? "bg-paper text-night shadow-lg"
                      : "bg-stage text-muted border border-white/10 hover:text-paper hover:border-white/25"
                  }`}
                >
                  {pill}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. MEDIA GRID */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((item) => {
              const isVideo = item.type === "video" || item.type === "both";
              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  key={item.id}
                  onClick={() => handleCardClick(item)}
                  className="group cursor-pointer bg-stage border border-white/10 hover:border-rec/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl transition-all hover:-translate-y-1"
                >
                  {/* Thumbnail Area */}
                  <div className="relative aspect-[16/10] bg-night overflow-hidden">
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />

                    {/* Top-Left Badge */}
                    <div className="absolute top-3.5 left-3.5 flex items-center gap-2">
                      {isVideo ? (
                        <span className="px-2.5 py-1 rounded bg-rec text-white text-[11px] font-heading font-bold tracking-wider uppercase shadow">
                          VIDEO
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-black/80 border border-white/15 text-paper text-[11px] font-heading font-bold tracking-wider uppercase">
                          PHOTOS
                        </span>
                      )}

                      {item.type === "both" && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAlbum(item);
                          }}
                          className="px-2.5 py-1 rounded bg-black/80 hover:bg-paper hover:text-night border border-white/20 text-paper text-[11px] font-heading font-semibold transition flex items-center gap-1"
                        >
                          <Images className="w-3 h-3" />
                          <span>+{item.photoCount} Photos</span>
                        </button>
                      )}
                    </div>

                    {/* Center Hover Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="w-14 h-14 rounded-full bg-rec text-white flex items-center justify-center shadow-2xl shadow-rec/50">
                        {isVideo ? (
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        ) : (
                          <Images className="w-6 h-6" />
                        )}
                      </span>
                    </div>

                    {/* Bottom-Right Duration Pill or Photo Count */}
                    <div className="absolute bottom-3 right-3">
                      {isVideo ? (
                        <span className="px-2.5 py-1 rounded bg-black/85 border border-white/15 text-xs font-mono font-semibold text-paper">
                          {item.duration || "3:42"}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded bg-black/85 border border-white/15 text-xs font-mono text-paper">
                          {item.photoCount} photos
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base text-paper group-hover:text-rec transition truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted mt-0.5 truncate">
                        {item.subtitle}
                      </p>
                    </div>
                    <span className="text-xs text-muted font-medium shrink-0 px-2.5 py-1 rounded-full bg-night border border-white/10">
                      {item.category}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 p-8 rounded-2xl bg-stage border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="font-heading font-bold text-xl text-paper">
              Want your event filmed like this?
            </h3>
            <p className="text-sm text-muted mt-1">
              Check date availability and camera packages with Damith &amp; the crew.
            </p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-sm px-6 py-3.5 rounded-full shadow-lg shadow-rec/25 transition shrink-0"
          >
            <span>Request a Quote</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Video Player Modal */}
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

      {/* Photo Lightbox Modal */}
      <PhotoLightboxModal
        project={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
      />
    </div>
  );
}
