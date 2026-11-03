"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Upload,
  CheckCircle2,
  Link as LinkIcon,
  FileVideo,
  FileImage,
  ExternalLink,
  Plus,
  Trash2,
} from "lucide-react";
import { useLiveImage } from "@/context/LiveImageContext";
import { MediaCategory, PublishStatus } from "@/data/seedData";

interface QueuedFile {
  id: string;
  name: string;
  sizeLabel?: string;
  progress: number;
  type: "image" | "video";
  thumbnail: string;
}

const INITIAL_QUEUE: QueuedFile[] = [
  {
    id: "q-1",
    name: "sunset-live-kandy-01.jpg",
    progress: 100,
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "q-2",
    name: "sunset-live-kandy-02.jpg",
    progress: 100,
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "q-3",
    name: "crowd-wide-03.jpg",
    progress: 68,
    type: "image",
    thumbnail:
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "q-4",
    name: "highlight-reel.mp4 · 412 MB",
    progress: 24,
    type: "video",
    thumbnail:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
  },
];

const CATEGORY_MAP: { label: string; value: MediaCategory }[] = [
  { label: "Concert", value: "Concerts" },
  { label: "Wedding", value: "Weddings" },
  { label: "Corporate", value: "Corporate" },
  { label: "Sports", value: "Sports" },
  { label: "Other", value: "Other" },
];

export default function AdminUploadMediaPage() {
  const { addProject } = useLiveImage();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [queue, setQueue] = useState<QueuedFile[]>(INITIAL_QUEUE);
  const [title, setTitle] = useState("Sunset Live — Kandy 2026");
  const [category, setCategory] = useState<MediaCategory>("Concerts");
  const [eventDate, setEventDate] = useState("18 Oct 2026");
  const [description, setDescription] = useState(
    "6-camera coverage with live stream on YouTube..."
  );
  const [youtubeLink, setYoutubeLink] = useState("");
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);

  // 3 Toggle Switches
  const [featuredOnHome, setFeaturedOnHome] = useState(true);
  const [autoCompress, setAutoCompress] = useState(true);
  const [addWatermark, setAddWatermark] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [publishedToast, setPublishedToast] = useState<{
    status: PublishStatus;
    title: string;
  } | null>(null);

  // Simulate realistic progress bar advancement
  useEffect(() => {
    const timer = setInterval(() => {
      setQueue((prev) =>
        prev.map((item) => {
          if (item.progress >= 100) return item;
          const next = Math.min(100, item.progress + 8);
          return { ...item, progress: next };
        })
      );
    }, 900);
    return () => clearInterval(timer);
  }, []);

  const handleFilesAdded = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const added: QueuedFile[] = Array.from(fileList).map((file, i) => {
      const isVideo = file.type.startsWith("video");
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return {
        id: `q-user-${Date.now()}-${i}`,
        name: isVideo ? `${file.name} · ${sizeMB} MB` : file.name,
        progress: 15,
        type: isVideo ? "video" : "image",
        thumbnail: isVideo
          ? "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=400&q=80"
          : "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
      };
    });
    setQueue((prev) => [...added, ...prev]);
  };

  const handleAddYoutube = () => {
    if (!youtubeLink.trim()) return;
    setQueue((prev) => [
      {
        id: `q-yt-${Date.now()}`,
        name: `YouTube Stream: ${youtubeLink.trim()}`,
        progress: 100,
        type: "video",
        thumbnail:
          "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80",
      },
      ...prev,
    ]);
    setShowYoutubeInput(false);
  };

  const handleSaveOrPublish = async (status: PublishStatus) => {
    if (!title.trim()) return;

    const hasVideo = queue.some((q) => q.type === "video") || !!youtubeLink;
    const imageItems = queue.filter((q) => q.type === "image");

    try {
      await addProject({
        title: title.trim(),
        category,
        type: hasVideo && imageItems.length > 0 ? "both" : hasVideo ? "video" : "photos",
        eventDate: eventDate.trim() || "18 Oct 2026",
        description:
          description.trim() ||
          "Multi-camera 4K live production and event coverage.",
        subtitle: `${category} · ${
          hasVideo ? "Multi-cam 4K Video" : `${imageItems.length || 24} Photos`
        }`,
        thumbnailUrl:
          queue[0]?.thumbnail ||
          "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1200&q=80",
        videoUrl: youtubeLink.trim()
          ? youtubeLink.trim()
          : "https://www.youtube.com/embed/aqz-KE-bpKQ?autoplay=1",
        duration: "3:42",
        photoCount: Math.max(imageItems.length * 12, 24),
        photos: queue.map((q) => q.thumbnail),
        cameraCount: 6,
        featuredOnHome,
        autoCompress,
        addWatermark,
        status,
        fileSizeMB: 412,
        visualTheme: "stage-beams",
      });
    } catch {
      // addProject already told the user what went wrong
      return;
    }

    setPublishedToast({ status, title: title.trim() });
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            Upload Media
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Add photos or videos to your portfolio. They appear on the website
            as soon as you publish.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleSaveOrPublish("Draft")}
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 font-heading font-semibold text-xs text-gray-700 transition"
          >
            Save as draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveOrPublish("Live")}
            className="px-5 py-2.5 rounded-xl bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs shadow-md shadow-rec/25 transition"
          >
            Publish to website
          </button>
        </div>
      </div>

      {/* Confirmation Banner */}
      {publishedToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-900">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>&ldquo;{publishedToast.title}&rdquo;</strong> has been{" "}
              {publishedToast.status === "Live"
                ? "published live to liveimage.lk"
                : "saved as a draft in your Media Library"}
              {featuredOnHome && publishedToast.status === "Live"
                ? " and featured on the Home Page!"
                : "."}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/admin/media"
              className="font-bold text-emerald-800 hover:underline"
            >
              Open Media Library →
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold"
            >
              <span>View Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}

      {/* 2. MAIN UPLOAD & DETAILS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Drag & Drop + Uploading Files List */}
        <div className="lg:col-span-7 space-y-5">
          {/* Interactive Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFilesAdded(e.dataTransfer.files);
            }}
            className={`rounded-2xl border-2 border-dashed p-8 text-center transition ${
              isDragging
                ? "border-rec bg-rose-50/50"
                : "border-rose-200 bg-[#FFFBFB]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => handleFilesAdded(e.target.files)}
            />
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rec flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900">
              Drag &amp; drop photos and videos here
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, MP4, MOV · up to 2 GB per video · or paste a YouTube
              link
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs shadow-sm transition"
              >
                Browse files
              </button>
              <button
                type="button"
                onClick={() => setShowYoutubeInput((prev) => !prev)}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-heading font-semibold text-xs transition"
              >
                Add YouTube / Vimeo link
              </button>
            </div>

            {showYoutubeInput && (
              <div className="mt-4 max-w-md mx-auto flex items-center gap-2">
                <input
                  type="url"
                  value={youtubeLink}
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-rec"
                />
                <button
                  type="button"
                  onClick={handleAddYoutube}
                  className="px-3.5 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold"
                >
                  Add Link
                </button>
              </div>
            )}
          </div>

          {/* Uploading Files Progress List */}
          <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-gray-900">
                Uploading ({queue.length} files)
              </h3>
              <button
                type="button"
                onClick={() =>
                  setQueue((prev) =>
                    prev.map((q) => ({ ...q, progress: 100 }))
                  )
                }
                className="text-[11px] font-semibold text-rec hover:underline"
              >
                Complete all now
              </button>
            </div>

            <div className="space-y-3.5">
              {queue.map((item) => {
                const isDone = item.progress >= 100;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3.5 p-2 rounded-xl hover:bg-gray-50"
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.name}
                      className="w-12 h-9 rounded-lg object-cover bg-gray-900 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-gray-800 truncate">
                          {item.name}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isDone
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isDone ? "Done" : `${item.progress}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.progress}%` }}
                          className="h-full bg-rec rounded-full transition-all duration-500"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Details Form & 3 Toggle Switches */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
          <h2 className="font-heading font-bold text-base text-gray-900">
            Details
          </h2>

          {/* Project / Album Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Project / album name
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-rec"
            />
          </div>

          {/* Category Pills */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_MAP.map((cat) => {
                const active = category === cat.value;
                return (
                  <button
                    key={cat.label}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-heading font-semibold transition ${
                      active
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Event Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Event date
            </label>
            <input
              type="text"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-rec"
            />
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Short description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-700 focus:outline-none focus:border-rec"
            />
          </div>

          {/* 3 Toggle Switches */}
          <div className="pt-2 border-t border-gray-100 space-y-4">
            {/* Toggle 1: Feature on Home page */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-heading font-bold text-xs text-gray-900">
                  Feature on Home page
                </div>
                <div className="text-[11px] text-gray-500">
                  Show in &ldquo;Recent productions&rdquo;
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={featuredOnHome}
                onClick={() => setFeaturedOnHome((prev) => !prev)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  featuredOnHome ? "bg-rec" : "bg-gray-200"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    featuredOnHome ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Auto-compress images */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-heading font-bold text-xs text-gray-900">
                  Auto-compress images
                </div>
                <div className="text-[11px] text-gray-500">
                  Keeps the website fast on 4G
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={autoCompress}
                onClick={() => setAutoCompress((prev) => !prev)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  autoCompress ? "bg-rec" : "bg-gray-200"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    autoCompress ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Add watermark */}
            <div className="flex items-center justify-between">
              <div>
                <div className="font-heading font-bold text-xs text-gray-900">
                  Add watermark
                </div>
                <div className="text-[11px] text-gray-500">
                  Live Image LK logo overlay
                </div>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={addWatermark}
                onClick={() => setAddWatermark((prev) => !prev)}
                className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                  addWatermark ? "bg-rec" : "bg-gray-200"
                }`}
              >
                <span
                  className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    addWatermark ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
