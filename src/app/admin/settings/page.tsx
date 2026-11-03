"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Save,
  ExternalLink,
  Star,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle2,
  Shield,
  Home,
  Package,
  Phone,
  MessageSquareQuote,
} from "lucide-react";
import { useLiveImage } from "@/context/LiveImageContext";

export default function AdminSettingsPage() {
  const {
    settings,
    updateSettings,
    packages,
    updatePackage,
    testimonials,
    addTestimonial,
    deleteTestimonial,
    userRole,
    resetDemoData,
  } = useLiveImage();

  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  // New Testimonial State
  const [newClientName, setNewClientName] = useState("");
  const [newClientRole, setNewClientRole] = useState("");
  const [newQuote, setNewQuote] = useState("");

  const showSaved = (msg: string) => {
    setSavedNotice(msg);
    setTimeout(() => setSavedNotice(null), 3500);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim() || !newQuote.trim()) return;
    addTestimonial({
      clientName: newClientName.trim(),
      clientRole: newClientRole.trim() || "Event Client",
      quote: newQuote.trim(),
      rating: 5,
      avatarColor: "#E8332B",
    });
    setNewClientName("");
    setNewClientRole("");
    setNewQuote("");
    showSaved("New client review added and published to the Home Page!");
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            Page Content &amp; Site Settings
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Every change you make here updates liveimage.lk immediately.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              resetDemoData();
              showSaved("Demo seed data restored to defaults.");
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs shadow-sm transition"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-xs font-semibold text-emerald-900">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{savedNotice}</span>
        </div>
      )}

      {/* 1. HOME PAGE HERO & TRUST NUMBERS */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-rose-100 text-rec flex items-center justify-center">
              <Home className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900">
                Home Page Hero &amp; Trust Numbers
              </h2>
              <p className="text-xs text-gray-500">
                Edit the main headline, showreel video embed and 4 trust counters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              showSaved("Home page hero & trust numbers updated live!")
            }
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-heading font-semibold text-xs transition"
          >
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Hero Headline
            </label>
            <input
              type="text"
              value={settings.heroHeadline}
              onChange={(e) => updateSettings({ heroHeadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm font-medium text-gray-900 focus:outline-none focus:border-rec"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-gray-500">
              Showreel Video Embed URL (YouTube / MP4)
            </label>
            <input
              type="text"
              value={settings.heroVideoUrl}
              onChange={(e) => updateSettings({ heroVideoUrl: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-900 focus:outline-none focus:border-rec"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-gray-500">
            Hero Subheadline
          </label>
          <textarea
            rows={2}
            value={settings.heroSubheadline}
            onChange={(e) =>
              updateSettings({ heroSubheadline: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-rec"
          />
        </div>

        {/* 4 Editable Trust Numbers */}
        <div className="pt-2">
          <label className="block text-xs font-heading font-bold uppercase tracking-wider text-gray-400 mb-3">
            Trust Numbers Bar (4 Columns on Home Page)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] text-gray-500">Events filmed</span>
              <input
                type="text"
                value={settings.eventsFilmed}
                onChange={(e) =>
                  updateSettings({ eventsFilmed: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 font-heading font-bold text-sm text-gray-900 focus:outline-none focus:border-rec"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-gray-500">Camera setups</span>
              <input
                type="text"
                value={settings.cameraSetups}
                onChange={(e) =>
                  updateSettings({ cameraSetups: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 font-heading font-bold text-sm text-gray-900 focus:outline-none focus:border-rec"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-gray-500">
                Live viewers reached
              </span>
              <input
                type="text"
                value={settings.liveViewers}
                onChange={(e) =>
                  updateSettings({ liveViewers: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 font-heading font-bold text-sm text-gray-900 focus:outline-none focus:border-rec"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-gray-500">In production</span>
              <input
                type="text"
                value={settings.yearsInProduction}
                onChange={(e) =>
                  updateSettings({ yearsInProduction: e.target.value })
                }
                className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 font-heading font-bold text-sm text-gray-900 focus:outline-none focus:border-rec"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. SERVICES & PACKAGES + SHOW/HIDE PACKAGE PRICES TOGGLE */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-rose-100 text-rec flex items-center justify-center">
              <Package className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900">
                Services &amp; Camera Packages
              </h2>
              <p className="text-xs text-gray-500">
                Control whether starting LKR prices or &ldquo;Custom Quote&rdquo;
                appear on /services
              </p>
            </div>
          </div>

          {/* Dynamic Show / Hide Package Prices Toggle */}
          <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
            <span className="text-xs font-heading font-bold text-gray-800">
              Show Package Prices on Website
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={settings.showPackagePrices}
              onClick={() => {
                const next = !settings.showPackagePrices;
                updateSettings({ showPackagePrices: next });
                showSaved(
                  next
                    ? "Package starting prices are now VISIBLE on /services!"
                    : "Package prices are now HIDDEN ('Custom Quote' shown on /services)."
                );
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors ${
                settings.showPackagePrices ? "bg-rec" : "bg-gray-300"
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow transition-transform ${
                  settings.showPackagePrices ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-heading font-bold text-rec uppercase">
                  {pkg.tierName}
                </span>
                <span className="text-xs font-bold text-gray-900">
                  {pkg.cameraCount}
                </span>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500 block">
                  Starting Price (LKR)
                </label>
                <input
                  type="text"
                  value={pkg.priceLKR}
                  onChange={(e) =>
                    updatePackage(pkg.id, { priceLKR: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs font-bold text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-500 block">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={pkg.subtitle}
                  onChange={(e) =>
                    updatePackage(pkg.id, { subtitle: e.target.value })
                  }
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-xs text-gray-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CLIENT TESTIMONIALS MANAGER */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center gap-2.5 border-b border-gray-100 pb-4">
          <span className="w-8 h-8 rounded-lg bg-rose-100 text-rec flex items-center justify-center">
            <MessageSquareQuote className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-heading font-bold text-base text-gray-900">
              Client Testimonials
            </h2>
            <p className="text-xs text-gray-500">
              Reviews displayed under &ldquo;Trusted on the big days&rdquo; on
              the Home Page
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col justify-between gap-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTestimonial(t.id)}
                    className="text-gray-400 hover:text-rec transition"
                    title="Remove testimonial"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-800 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="text-xs font-bold text-gray-900">
                {t.clientName}{" "}
                <span className="font-normal text-gray-500">
                  · {t.clientRole}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Add New Testimonial Form */}
        <form
          onSubmit={handleAddReview}
          className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
        >
          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] text-gray-500 block">
              Client Name
            </label>
            <input
              type="text"
              value={newClientName}
              onChange={(e) => setNewClientName(e.target.value)}
              placeholder="e.g. Dilshan & Kavindi"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900"
            />
          </div>
          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] text-gray-500 block">
              Client Role / Event
            </label>
            <input
              type="text"
              value={newClientRole}
              onChange={(e) => setNewClientRole(e.target.value)}
              placeholder="e.g. Wedding client"
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900"
            />
          </div>
          <div className="sm:col-span-4 space-y-1">
            <label className="text-[11px] text-gray-500 block">
              Review Quote
            </label>
            <input
              type="text"
              value={newQuote}
              onChange={(e) => setNewQuote(e.target.value)}
              placeholder="5-star client feedback..."
              className="w-full px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-900"
            />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs transition"
            >
              + Add Review
            </button>
          </div>
        </form>
      </div>

      {/* 4. CONTACT, WHATSAPP & SOCIAL LINKS */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-rose-100 text-rec flex items-center justify-center">
              <Phone className="w-4 h-4" />
            </span>
            <div>
              <h2 className="font-heading font-bold text-base text-gray-900">
                Contact &amp; Social Media Links
              </h2>
              <p className="text-xs text-gray-500">
                Updates footer, Contact page and floating WhatsApp chat button
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => showSaved("Contact & social links saved!")}
            className="px-4 py-2 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-heading font-semibold text-xs transition"
          >
            Save Contact Info
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 block">
              Display Phone Number
            </label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => updateSettings({ phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 block">
              WhatsApp Number (Country code, no +)
            </label>
            <input
              type="text"
              value={settings.whatsappNumber}
              onChange={(e) =>
                updateSettings({ whatsappNumber: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 block">Email Address</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => updateSettings({ email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 block">
              Studio / Office Location
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => updateSettings({ address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 block">
              Facebook Page (LIVEIMAGE.lk)
            </label>
            <input
              type="url"
              value={settings.facebookUrl}
              onChange={(e) => updateSettings({ facebookUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 block">
              Facebook Page (Sadaruwan Video)
            </label>
            <input
              type="url"
              value={settings.facebookPersonalUrl}
              onChange={(e) =>
                updateSettings({ facebookPersonalUrl: e.target.value })
              }
              className="w-full px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-900"
            />
          </div>
        </div>
      </div>

      {/* 5. USERS & ACCESS PERMISSIONS (Page 13 Table) */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-lg bg-rose-100 text-rec flex items-center justify-center">
            <Shield className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-heading font-bold text-base text-gray-900">
              Users &amp; Staff Permissions
            </h2>
            <p className="text-xs text-gray-500">
              Each person signs in with their own account. New accounts are
              added with <code>npm run user:create</code>.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            className={`p-4 rounded-xl border-2 ${
              userRole === "owner"
                ? "border-rec bg-rose-50/40"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="font-heading font-bold text-sm text-gray-900">
              B Damith Sadaruwan (Owner)
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Full access to media, home page content, package prices, bookings
              export and site settings.
            </p>
          </div>

          <div
            className={`p-4 rounded-xl border-2 ${
              userRole === "staff"
                ? "border-amber-500 bg-amber-50/40"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="font-heading font-bold text-sm text-gray-900">
              Event Crew Login (Staff · Upload-Only)
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Limited access for crew to upload event photos &amp; videos from
              their phone without deleting items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
