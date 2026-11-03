"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Star,
  FolderInput,
  EyeOff,
  Trash2,
  Check,
  Eye,
} from "lucide-react";
import { useLiveImage } from "@/context/LiveImageContext";
import { MediaCategory } from "@/data/seedData";

type LibraryTab = "All" | "Photos" | "Videos" | "Featured" | "Drafts";

const TABS: LibraryTab[] = ["All", "Photos", "Videos", "Featured", "Drafts"];

export default function AdminMediaLibraryPage() {
  const {
    projects,
    bulkToggleFeature,
    bulkSetStatus,
    bulkMoveCategory,
    deleteProjects,
    updateProject,
    userRole,
  } = useLiveImage();

  const [activeTab, setActiveTab] = useState<LibraryTab>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "proj-colombo-music-fest",
    "proj-nadeesha-ruwan",
  ]);
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (activeTab === "Photos") return p.type === "photos" || p.type === "both";
    if (activeTab === "Videos") return p.type === "video" || p.type === "both";
    if (activeTab === "Featured") return p.featuredOnHome;
    if (activeTab === "Drafts")
      return p.status === "Draft" || p.status === "Hidden";
    return true;
  });

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const totalUsedGB = (
    37.2 +
    projects.reduce((acc, p) => acc + (p.fileSizeMB || 120), 0) / 1024
  ).toFixed(1);

  return (
    <div className="space-y-6">
      {/* 1. HEADER & STORAGE METER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            Media Library
          </h1>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-xs sm:text-sm text-gray-500">
              {1274 + projects.length} items · {totalUsedGB} GB used of 100 GB
            </p>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden hidden sm:block">
              <div
                style={{ width: `${Math.min(100, Number(totalUsedGB))}%` }}
                className="h-full bg-rec rounded-full"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search photos & videos..."
              className="w-full sm:w-56 pl-9 pr-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-rec"
            />
          </div>
          <Link
            href="/admin/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs shadow-sm transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Upload</span>
          </Link>
        </div>
      </div>

      {/* 2. FILTER TABS & SORT */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {TABS.map((tab) => {
            const active = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition ${
                  active
                    ? "bg-[#0B0B0E] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        <div className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-medium text-gray-600">
          Sort: Newest ▾
        </div>
      </div>

      {/* Feedback Notice */}
      {actionMessage && (
        <div className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900">
          ✓ {actionMessage}
        </div>
      )}

      {/* 3. DARK BULK-ACTION BAR (Matches Page 12 of Proposal) */}
      {selectedIds.length > 0 && (
        <div className="bg-[#0B0B0E] text-white rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-heading font-bold px-2">
              {selectedIds.length} selected
            </span>

            {/* ★ Feature */}
            <button
              type="button"
              onClick={() => {
                bulkToggleFeature(selectedIds, true);
                triggerNotice(
                  `Featured ${selectedIds.length} item(s) on the public Home Page!`
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A21] hover:bg-white/15 border border-white/10 text-xs font-medium text-spotlight transition"
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Feature</span>
            </button>

            {/* Move to project / category */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMoveMenu((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A21] hover:bg-white/15 border border-white/10 text-xs font-medium text-white transition"
              >
                <FolderInput className="w-3.5 h-3.5" />
                <span>Move to project</span>
              </button>
              {showMoveMenu && (
                <div className="absolute left-0 mt-2 w-40 rounded-xl bg-[#1A1A21] border border-white/15 shadow-xl p-1.5 z-20 space-y-1">
                  {(
                    ["Concerts", "Weddings", "Corporate", "Sports"] as MediaCategory[]
                  ).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        bulkMoveCategory(selectedIds, cat);
                        setShowMoveMenu(false);
                        triggerNotice(
                          `Moved ${selectedIds.length} item(s) to ${cat}.`
                        );
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-paper hover:bg-rec transition"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hide from website */}
            <button
              type="button"
              onClick={() => {
                bulkSetStatus(selectedIds, "Draft");
                triggerNotice(
                  `Moved ${selectedIds.length} item(s) to Drafts (hidden from public site).`
                );
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A21] hover:bg-white/15 border border-white/10 text-xs font-medium text-white transition"
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>Hide from website</span>
            </button>

            {/* Delete */}
            <button
              type="button"
              disabled={userRole === "staff"}
              onClick={() => {
                deleteProjects(selectedIds);
                setSelectedIds([]);
                triggerNotice("Deleted selected media items.");
              }}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1A21] border border-white/10 text-xs font-medium transition ${
                userRole === "staff"
                  ? "opacity-40 cursor-not-allowed text-gray-400"
                  : "text-rec hover:bg-rec hover:text-white"
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setSelectedIds([])}
            className="text-xs text-gray-400 hover:text-white"
          >
            Clear selection
          </button>
        </div>
      )}

      {/* 4. MEDIA CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProjects.map((item) => {
          const isSelected = selectedIds.includes(item.id);
          const isVideo = item.type === "video" || item.type === "both";

          return (
            <div
              key={item.id}
              onClick={() => toggleSelect(item.id)}
              className={`group cursor-pointer bg-white rounded-2xl overflow-hidden border-2 transition shadow-sm ${
                isSelected
                  ? "border-rec ring-2 ring-rec/20"
                  : "border-gray-200/80 hover:border-gray-300"
              }`}
            >
              <div className="relative aspect-[16/10] bg-gray-900 overflow-hidden">
                <img
                  src={item.thumbnailUrl}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                {/* Top-Left VIDEO / PHOTO Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  {isVideo ? (
                    <span className="px-2 py-0.5 rounded bg-rec text-white text-[10px] font-heading font-bold uppercase">
                      ▶ VIDEO
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-black/75 text-white text-[10px] font-heading font-bold uppercase">
                      PHOTO
                    </span>
                  )}
                  {item.featuredOnHome && (
                    <span
                      title="Featured on Home Page"
                      className="px-1.5 py-0.5 rounded bg-spotlight text-night text-[10px] font-bold"
                    >
                      ★ HOME
                    </span>
                  )}
                </div>

                {/* Top-Right Multi-Select Checkbox */}
                <div
                  className={`absolute top-2.5 right-2.5 w-6 h-6 rounded-md flex items-center justify-center border transition ${
                    isSelected
                      ? "bg-rec border-rec text-white"
                      : "bg-black/50 border-white/60 text-transparent group-hover:border-white"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                {/* Status Badge if Draft */}
                {item.status !== "Live" && (
                  <span className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-amber-500 text-night text-[10px] font-bold uppercase">
                    {item.status}
                  </span>
                )}
              </div>

              <div className="p-3.5 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-heading font-bold text-xs sm:text-sm text-gray-900 truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                    {isVideo
                      ? `Video · ${item.duration || "3:42"}`
                      : `Photo · ${(item.fileSizeMB / 40).toFixed(1)} MB`}{" "}
                    · {item.category}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateProject(item.id, {
                      featuredOnHome: !item.featuredOnHome,
                    });
                  }}
                  title="Toggle Feature on Home Page"
                  className={`p-1.5 rounded-lg border transition shrink-0 ${
                    item.featuredOnHome
                      ? "bg-amber-50 border-amber-200 text-amber-600"
                      : "bg-gray-50 border-gray-200 text-gray-400 hover:text-gray-700"
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
