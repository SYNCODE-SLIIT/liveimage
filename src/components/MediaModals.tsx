"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Camera,
  Calendar,
  ArrowRight,
  Maximize2,
  Play,
  Images,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { MediaProject } from "@/data/seedData";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  description?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  cameraCount?: number;
  duration?: string;
  category?: string;
}

export function VideoPlayerModal({
  isOpen,
  onClose,
  title,
  subtitle,
  description,
  videoUrl,
  thumbnailUrl,
  cameraCount = 6,
  duration = "3:42",
  category = "Concerts",
}: VideoModalProps) {
  const [activeAngle, setActiveAngle] = useState<"PGM" | "CAM 1" | "CAM 2">(
    "PGM"
  );
  const [showEmbed, setShowEmbed] = useState(false);

  useEffect(() => {
    setShowEmbed(false);
    setActiveAngle("PGM");
  }, [isOpen, title]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-stage border border-white/15 rounded-2xl overflow-hidden shadow-2xl"
          >
            {/* Top Broadcast Monitor Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-night border-b border-white/10">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rec/20 border border-rec/40 text-rec text-xs font-bold tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-rec animate-pulse" />
                  4K MASTER REEL
                </span>
                <span className="text-xs font-mono text-muted hidden sm:inline">
                  {cameraCount} CAMERAS · {duration} · {activeAngle} FEED
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-stage hover:bg-white/10 text-muted hover:text-paper transition"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Stage */}
            <div className="relative aspect-video bg-night overflow-hidden">
              {showEmbed && videoUrl ? (
                <iframe
                  src={videoUrl}
                  title={title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="relative w-full h-full group">
                  <img
                    src={
                      thumbnailUrl ||
                      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1400&q=80"
                    }
                    alt={title}
                    className={`w-full h-full object-cover transition-transform duration-700 ${
                      activeAngle === "CAM 1"
                        ? "scale-105"
                        : activeAngle === "CAM 2"
                        ? "scale-125 object-center"
                        : "scale-100"
                    }`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent" />

                  {/* Broadcast HUD Overlays */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-rec text-white text-xs font-bold tracking-wider">
                      VIDEO · {duration}
                    </span>
                    <span className="px-2.5 py-1 rounded bg-black/70 border border-white/15 text-xs font-mono text-paper">
                      {activeAngle} · 3840×2160 50p
                    </span>
                  </div>

                  {/* Center Play Trigger */}
                  <button
                    type="button"
                    onClick={() => setShowEmbed(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-3 group/btn"
                  >
                    <span className="w-20 h-20 rounded-full bg-rec hover:bg-[#d12820] text-white flex items-center justify-center shadow-2xl shadow-rec/50 transition-transform group-hover/btn:scale-110">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </span>
                    <span className="px-4 py-1.5 rounded-full bg-black/75 border border-white/15 text-xs font-medium text-paper">
                      Click to stream 4K YouTube / Master Player
                    </span>
                  </button>

                  {/* Multi-Angle Preview Switcher inside Modal */}
                  <div className="absolute bottom-4 right-4 flex items-center gap-2">
                    {(["PGM", "CAM 1", "CAM 2"] as const).map((cam) => (
                      <button
                        key={cam}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveAngle(cam);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition ${
                          activeAngle === cam
                            ? "bg-rec text-white border-rec shadow-lg shadow-rec/30"
                            : "bg-black/75 text-muted border-white/15 hover:text-paper"
                        }`}
                      >
                        {cam}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Project Details */}
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stage">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs text-rec font-semibold uppercase tracking-wider">
                  <span>{category}</span>
                  {subtitle && (
                    <>
                      <span>·</span>
                      <span className="text-muted font-normal normal-case">
                        {subtitle}
                      </span>
                    </>
                  )}
                </div>
                <h3 className="font-heading font-bold text-xl text-paper">
                  {title}
                </h3>
                {description && (
                  <p className="text-sm text-muted max-w-2xl">{description}</p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/contact?service=${encodeURIComponent(category)}`}
                  onClick={onClose}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-sm transition"
                >
                  <span>Book Similar Shoot</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface PhotoLightboxProps {
  project: MediaProject | null;
  onClose: () => void;
}

export function PhotoLightboxModal({ project, onClose }: PhotoLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos =
    project && project.photos.length > 0
      ? project.photos
      : project
      ? [project.thumbnailUrl]
      : [];

  useEffect(() => {
    setCurrentIndex(0);
  }, [project]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!project) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight")
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      if (e.key === "ArrowLeft")
        setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [project, photos.length, onClose]);

  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex flex-col justify-between p-4 sm:p-6"
        onClick={onClose}
      >
        {/* Top Header */}
        <div
          className="max-w-7xl w-full mx-auto flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-stage border border-white/15 text-xs font-semibold text-paper flex items-center gap-1.5">
              <Images className="w-3.5 h-3.5 text-rec" />
              {currentIndex + 1} / {photos.length}
            </span>
            <div>
              <h3 className="font-heading font-bold text-sm sm:text-base text-paper">
                {project.title}
              </h3>
              <p className="text-xs text-muted">
                {project.category} · {project.photoCount} Photos in Album
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2.5 rounded-full bg-stage border border-white/15 text-paper hover:bg-rec hover:border-rec transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Center Swipeable Image Stage */}
        <div
          className="relative flex-1 flex items-center justify-center my-4 max-w-6xl w-full mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setCurrentIndex(
                  (prev) => (prev - 1 + photos.length) % photos.length
                )
              }
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-night/80 border border-white/15 text-paper hover:bg-rec transition"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          <div className="relative max-h-[70vh] w-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-night">
            <img
              src={photos[currentIndex]}
              alt={`${project.title} - Photo ${currentIndex + 1}`}
              className="max-h-[70vh] w-auto object-contain select-none"
            />
            {project.addWatermark && (
              <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/65 border border-white/10 text-[11px] font-heading font-bold tracking-wider text-white/80 flex items-center gap-1.5 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-rec" />
                LIVE IMAGE LK
              </div>
            )}
          </div>

          {photos.length > 1 && (
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((prev) => (prev + 1) % photos.length)
              }
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-night/80 border border-white/15 text-paper hover:bg-rec transition"
              aria-label="Next photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Bottom Thumbnail Strip */}
        <div
          className="max-w-3xl w-full mx-auto flex items-center justify-center gap-2.5 overflow-x-auto py-2"
          onClick={(e) => e.stopPropagation()}
        >
          {photos.map((photoUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              className={`relative h-14 w-20 rounded-lg overflow-hidden border-2 transition shrink-0 ${
                idx === currentIndex
                  ? "border-rec scale-105"
                  : "border-white/15 opacity-50 hover:opacity-80"
              }`}
            >
              <img
                src={photoUrl}
                alt={`Thumb ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
