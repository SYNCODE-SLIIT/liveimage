"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, ExternalLink, Trash2 } from "lucide-react";
import { useLiveImage } from "@/context/LiveImageContext";
import { MediaCategory, PublishStatus } from "@/data/seedData";
import { createUploadUrls } from "@/app/admin/actions";
import {
  prepareImage,
  toEmbedUrl,
  uploadWithProgress,
} from "@/lib/imageProcessing";

interface QueuedFile {
  id: string;
  name: string;
  progress: number;
  type: "image" | "video";
  thumbnail: string;
  status: "uploading" | "done" | "error";
  error?: string;
  // Public URL once a photo is stored
  url?: string;
  sizeMB?: number;
}

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const VIDEO_ITEM_ID = "q-video";

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

  const [queue, setQueue] = useState<QueuedFile[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<MediaCategory>("Concerts");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  const [youtubeLink, setYoutubeLink] = useState("");
  const [videoEmbed, setVideoEmbed] = useState<{
    embedUrl: string;
    thumbnail?: string;
  } | null>(null);
  const [showYoutubeInput, setShowYoutubeInput] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // 3 Toggle Switches
  const [featuredOnHome, setFeaturedOnHome] = useState(true);
  const [autoCompress, setAutoCompress] = useState(true);
  const [addWatermark, setAddWatermark] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [publishedToast, setPublishedToast] = useState<{
    status: PublishStatus;
    title: string;
  } | null>(null);

  const updateItem = (id: string, patch: Partial<QueuedFile>) =>
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));

  const handleFilesAdded = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setFormError(null);
    const files = Array.from(fileList);
    const images = files.filter((f) => ACCEPTED_IMAGE_TYPES.includes(f.type));

    if (files.some((f) => f.type.startsWith("video"))) {
      setFormError(
        "Video files are too large to store here. Upload the video to YouTube or Vimeo and add the link instead."
      );
    } else if (images.length < files.length) {
      setFormError("Only JPG, PNG and WebP photos can be uploaded.");
    }
    if (images.length === 0) return;

    const items: QueuedFile[] = images.map((file, i) => ({
      id: `q-${Date.now()}-${i}`,
      name: file.name,
      progress: 0,
      type: "image",
      thumbnail: URL.createObjectURL(file),
      status: "uploading",
    }));
    setQueue((prev) => [...items, ...prev]);

    let prepared: Blob[];
    try {
      prepared = await Promise.all(
        images.map((file) =>
          prepareImage(file, { compress: autoCompress, watermark: addWatermark })
        )
      );
    } catch {
      items.forEach((item) =>
        updateItem(item.id, { status: "error", error: "Could not read photo" })
      );
      return;
    }

    const result = await createUploadUrls(
      prepared.map((blob) => ({ type: blob.type, size: blob.size }))
    ).catch(() => null);
    if (!result || !result.ok) {
      const error =
        result && !result.ok ? result.error : "Could not start the upload";
      items.forEach((item) => updateItem(item.id, { status: "error", error }));
      return;
    }

    await Promise.all(
      items.map(async (item, i) => {
        const { uploadUrl, publicUrl } = result.data[i];
        try {
          await uploadWithProgress(uploadUrl, prepared[i], (progress) =>
            updateItem(item.id, { progress })
          );
          updateItem(item.id, {
            status: "done",
            progress: 100,
            url: publicUrl,
            sizeMB: prepared[i].size / (1024 * 1024),
          });
        } catch (e) {
          updateItem(item.id, {
            status: "error",
            error: e instanceof Error ? e.message : "Upload failed",
          });
        }
      })
    );
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
    if (id === VIDEO_ITEM_ID) setVideoEmbed(null);
  };

  const handleAddYoutube = () => {
    const embed = toEmbedUrl(youtubeLink);
    if (!embed) {
      setFormError("Please paste a YouTube or Vimeo video link.");
      return;
    }
    setFormError(null);
    setVideoEmbed(embed);
    setQueue((prev) => [
      {
        id: VIDEO_ITEM_ID,
        name: `Video: ${youtubeLink.trim()}`,
        progress: 100,
        type: "video",
        thumbnail: embed.thumbnail || "/liveimage-logo.png",
        status: "done",
      },
      ...prev.filter((q) => q.id !== VIDEO_ITEM_ID),
    ]);
    setYoutubeLink("");
    setShowYoutubeInput(false);
  };

  const handleSaveOrPublish = async (status: PublishStatus) => {
    setFormError(null);
    if (!title.trim()) {
      setFormError("Please enter a project / album name.");
      return;
    }
    if (queue.some((q) => q.status === "uploading")) {
      setFormError("Please wait until all photos finish uploading.");
      return;
    }
    const photos = queue.filter((q) => q.type === "image" && q.url);
    if (photos.length === 0 && !videoEmbed) {
      setFormError("Add at least one photo or a YouTube / Vimeo link.");
      return;
    }

    // Queue shows newest first; keep the photos in the order they were added
    const photoUrls = photos.map((q) => q.url as string).reverse();
    const totalMB = photos.reduce((sum, q) => sum + (q.sizeMB ?? 0), 0);

    setIsSaving(true);
    try {
      await addProject({
        title: title.trim(),
        category,
        type:
          videoEmbed && photos.length > 0
            ? "both"
            : videoEmbed
            ? "video"
            : "photos",
        eventDate: eventDate.trim() || "TBD",
        description: description.trim(),
        subtitle: `${category} · ${
          videoEmbed ? "Multi-cam 4K Video" : `${photos.length} Photos`
        }`,
        thumbnailUrl:
          photoUrls[0] || videoEmbed?.thumbnail || "/liveimage-logo.png",
        videoUrl: videoEmbed?.embedUrl,
        photoCount: photos.length,
        photos: photoUrls,
        cameraCount: 4,
        featuredOnHome,
        autoCompress,
        addWatermark,
        status,
        fileSizeMB: Math.round(totalMB * 10) / 10,
        visualTheme: "stage-beams",
      });
    } catch {
      // addProject already told the user what went wrong
      return;
    } finally {
      setIsSaving(false);
    }

    setPublishedToast({ status, title: title.trim() });
    setQueue([]);
    setVideoEmbed(null);
    setTitle("");
    setEventDate("");
    setDescription("");
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
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-60 font-heading font-semibold text-xs text-gray-700 transition"
          >
            Save as draft
          </button>
          <button
            type="button"
            onClick={() => handleSaveOrPublish("Live")}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-rec hover:bg-[#d12820] disabled:opacity-60 text-white font-heading font-semibold text-xs shadow-md shadow-rec/25 transition"
          >
            Publish to website
          </button>
        </div>
      </div>

      {formError && (
        <div
          role="alert"
          className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-900"
        >
          {formError}
        </div>
      )}

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
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => {
                handleFilesAdded(e.target.files);
                e.target.value = "";
              }}
            />
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rec flex items-center justify-center mx-auto mb-3">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm sm:text-base text-gray-900">
              Drag &amp; drop photos here
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              JPG, PNG, WebP · up to 20 MB per photo · for videos, add a
              YouTube or Vimeo link
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
            <h3 className="font-heading font-bold text-sm text-gray-900">
              Files in this project ({queue.length})
            </h3>

            <div className="space-y-3.5">
              {queue.length === 0 && (
                <p className="text-xs text-gray-400">
                  No files yet. Add photos or a video link above.
                </p>
              )}
              {queue.map((item) => {
                const isDone = item.status === "done";
                const isError = item.status === "error";
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
                            isError
                              ? "bg-rose-100 text-rose-800"
                              : isDone
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {isError
                            ? "Failed"
                            : isDone
                            ? "Done"
                            : `${item.progress}%`}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${item.progress}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${
                            isError ? "bg-rose-300" : "bg-rec"
                          }`}
                        />
                      </div>
                      {isError && (
                        <p className="text-[11px] text-rose-700 mt-1">
                          {item.error}
                        </p>
                      )}
                    </div>
                    {item.status !== "uploading" && (
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-rec hover:bg-rose-50 shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
              placeholder="e.g. Sunset Live — Kandy 2026"
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
              placeholder="e.g. 18 Oct 2026"
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
              placeholder="e.g. 6-camera coverage with live stream on YouTube"
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
                  Keeps the website fast on 4G · applies to photos added next
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
                  Live Image LK logo overlay · applies to photos added next
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
