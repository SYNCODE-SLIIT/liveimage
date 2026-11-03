"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ExternalLink,
  Plus,
  Upload,
  Play,
  Star,
  Edit3,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useLiveImage } from "@/context/LiveImageContext";
import { VISITOR_STATS_8_MONTHS } from "@/data/seedData";

export default function AdminDashboardOverview() {
  const { projects, bookings, updateProject } = useLiveImage();
  const { data: session } = useSession();
  const firstName = session?.user?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredMonth, setHoveredMonth] = useState<string | null>("Oct");

  const maxVisitors = Math.max(...VISITOR_STATS_8_MONTHS.map((m) => m.visitors));
  const latestBookings = bookings.slice(0, 4);
  const recentUploads = projects.slice(0, 3);

  const liveProjectsCount = projects.filter((p) => p.status === "Live").length;
  const newBookingsCount = bookings.filter((b) => b.status === "New").length;
  const weekAgo = new Date(Date.now() - 7 * 86_400_000).toISOString().split("T")[0];
  const bookingsThisWeek = bookings.filter((b) => b.createdAt >= weekAgo).length;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "New":
        return "bg-rose-100 text-rec border-rose-200";
      case "Quoted":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            {greeting}, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Here&apos;s what&apos;s happening with your website this month.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full sm:w-48 pl-9 pr-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-rec"
            />
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-700 transition"
          >
            <span>View website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/admin/upload"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Media</span>
          </Link>
        </div>
      </div>

      {/* 2. 4 KPI SNAPSHOT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-gray-500 block">
            Website visitors (Oct)
          </span>
          <div className="mt-2 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            8,420
          </div>
          <div className="mt-1.5 text-xs font-semibold text-emerald-600 flex items-center gap-1">
            <span>▲ 18% vs Sep</span>
          </div>
        </div>

        <Link
          href="/admin/bookings"
          className="bg-white border border-gray-200/80 hover:border-rec/40 rounded-2xl p-5 shadow-sm transition block"
        >
          <span className="text-xs text-gray-500 block">
            New booking requests
          </span>
          <div className="mt-2 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            {newBookingsCount}
          </div>
          <div className="mt-1.5 text-xs font-semibold text-emerald-600">
            {bookingsThisWeek} received this week
          </div>
        </Link>

        <Link
          href="/admin/media"
          className="bg-white border border-gray-200/80 hover:border-rec/40 rounded-2xl p-5 shadow-sm transition block"
        >
          <span className="text-xs text-gray-500 block">
            Projects live
          </span>
          <div className="mt-2 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            {liveProjectsCount}
          </div>
          <div className="mt-1.5 text-xs font-medium text-gray-500">
            {projects.length - liveProjectsCount} draft or hidden
          </div>
        </Link>

        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-gray-500 block">Video views</span>
          <div className="mt-2 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            15.2K
          </div>
          <div className="mt-1.5 text-xs font-semibold text-emerald-600">
            ▲ 31%
          </div>
        </div>
      </div>

      {/* 3. MIDDLE ROW: VISITORS BAR CHART (LAST 8 MONTHS) & LATEST BOOKING REQUESTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Visitors — Last 8 Months Interactive Bar Chart */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900">
                Visitors — last 8 months
              </h2>
              <p className="text-xs text-gray-500">
                Monthly traffic growth on liveimage.lk
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-rec hover:underline"
            >
              Full report →
            </Link>
          </div>

          <div className="h-52 flex items-end justify-between gap-2.5 sm:gap-4 pt-6 px-1">
            {VISITOR_STATS_8_MONTHS.map((stat) => {
              const heightPercent = Math.round(
                (stat.visitors / maxVisitors) * 100
              );
              const isCurrent = stat.current;
              const isHovered = hoveredMonth === stat.month;

              return (
                <div
                  key={stat.month}
                  onMouseEnter={() => setHoveredMonth(stat.month)}
                  className="flex-1 flex flex-col items-center gap-2 group cursor-pointer h-full justify-end"
                >
                  <div
                    className={`text-[10px] font-bold transition-opacity ${
                      isCurrent || isHovered
                        ? "opacity-100 text-gray-900"
                        : "opacity-0 group-hover:opacity-100 text-gray-500"
                    }`}
                  >
                    {(stat.visitors / 1000).toFixed(1)}k
                  </div>
                  <div className="w-full bg-gray-100 rounded-t-lg flex items-end h-36 overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isCurrent
                          ? "bg-rec shadow-md shadow-rec/30"
                          : "bg-gray-200 group-hover:bg-gray-300"
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[11px] font-medium ${
                      isCurrent ? "text-rec font-bold" : "text-gray-400"
                    }`}
                  >
                    {stat.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Booking Requests Widget */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-base text-gray-900">
              Latest booking requests
            </h2>
            <Link
              href="/admin/bookings"
              className="text-xs font-semibold text-rec hover:underline"
            >
              See all →
            </Link>
          </div>

          <div className="space-y-3.5">
            {latestBookings.map((bk) => {
              const avatarColors: Record<string, string> = {
                Wedding: "bg-rec text-white",
                Concert: "bg-orange-500 text-white",
                Corporate: "bg-amber-500 text-white",
                Sports: "bg-emerald-600 text-white",
              };
              const avatarClass =
                avatarColors[bk.eventType] || "bg-rec text-white";

              return (
                <Link
                  key={bk.id}
                  href="/admin/bookings"
                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-bold text-xs shrink-0 ${avatarClass}`}
                    >
                      {bk.eventType.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-heading font-bold text-xs sm:text-sm text-gray-900 truncate">
                        {bk.eventType} · {bk.cameraSetup.toLowerCase()}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate">
                        {bk.venue.split("—")[0].trim()} · {bk.eventDate}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${getStatusBadgeStyle(
                      bk.status
                    )}`}
                  >
                    {bk.status}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. BOTTOM ROW: QUICK ACTIONS BAR & RECENTLY UPLOADED LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Quick Actions (4 1-Click Shortcut Tiles) */}
        <div className="lg:col-span-7 bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <h2 className="font-heading font-bold text-base text-gray-900 mb-4">
            Quick actions
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/admin/upload?type=photos"
              className="p-4 rounded-xl bg-gray-50 hover:bg-rose-50/60 border border-gray-200/80 hover:border-rec/40 flex flex-col items-center justify-center gap-2.5 text-center transition group"
            >
              <span className="w-9 h-9 rounded-full bg-rose-100 text-rec flex items-center justify-center group-hover:scale-110 transition">
                <Upload className="w-4 h-4" />
              </span>
              <span className="font-heading font-semibold text-xs text-gray-800">
                Upload photos
              </span>
            </Link>

            <Link
              href="/admin/upload?type=video"
              className="p-4 rounded-xl bg-gray-50 hover:bg-rose-50/60 border border-gray-200/80 hover:border-rec/40 flex flex-col items-center justify-center gap-2.5 text-center transition group"
            >
              <span className="w-9 h-9 rounded-full bg-rose-100 text-rec flex items-center justify-center group-hover:scale-110 transition">
                <Play className="w-4 h-4 fill-current" />
              </span>
              <span className="font-heading font-semibold text-xs text-gray-800">
                Add a video
              </span>
            </Link>

            <Link
              href="/admin/media?filter=Featured"
              className="p-4 rounded-xl bg-gray-50 hover:bg-rose-50/60 border border-gray-200/80 hover:border-rec/40 flex flex-col items-center justify-center gap-2.5 text-center transition group"
            >
              <span className="w-9 h-9 rounded-full bg-rose-100 text-rec flex items-center justify-center group-hover:scale-110 transition">
                <Star className="w-4 h-4 fill-current" />
              </span>
              <span className="font-heading font-semibold text-xs text-gray-800">
                Feature on Home
              </span>
            </Link>

            <Link
              href="/admin/settings?tab=packages"
              className="p-4 rounded-xl bg-gray-50 hover:bg-rose-50/60 border border-gray-200/80 hover:border-rec/40 flex flex-col items-center justify-center gap-2.5 text-center transition group"
            >
              <span className="w-9 h-9 rounded-full bg-rose-100 text-rec flex items-center justify-center group-hover:scale-110 transition">
                <Edit3 className="w-4 h-4" />
              </span>
              <span className="font-heading font-semibold text-xs text-gray-800">
                Edit packages
              </span>
            </Link>
          </div>
        </div>

        {/* Recently Uploaded List */}
        <div className="lg:col-span-5 bg-white border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading font-bold text-base text-gray-900">
              Recently uploaded
            </h2>
            <Link
              href="/admin/media"
              className="text-xs font-semibold text-rec hover:underline"
            >
              Library →
            </Link>
          </div>

          <div className="space-y-3">
            {recentUploads.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-12 h-9 rounded-lg object-cover bg-gray-900 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="font-heading font-bold text-xs text-gray-900 truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-gray-500 truncate">
                      {item.type === "photos"
                        ? `Album (${item.photoCount} photos)`
                        : `Video · ${item.duration || "3:42"}`}{" "}
                      · {item.uploadedAgo}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    updateProject(item.id, {
                      status: item.status === "Live" ? "Draft" : "Live",
                    })
                  }
                  title="Click to toggle Live / Draft"
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 transition ${
                    item.status === "Live"
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-blue-100 text-blue-800 border-blue-200"
                  }`}
                >
                  {item.status}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
