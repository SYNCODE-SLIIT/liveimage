"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Upload,
  Image as ImageIcon,
  FolderKanban,
  Home,
  Package,
  MessageSquareQuote,
  CalendarCheck,
  Settings,
  Plus,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useLiveImage } from "@/context/LiveImageContext";
import { LiveImageLogo } from "@/components/LiveImageLogo";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { bookings, userRole } = useLiveImage();
  const { data: session } = useSession();

  const newBookingsCount = bookings.filter((b) => b.status === "New").length;
  const isOwner = userRole === "owner";
  // Must match STAFF_PATHS in src/middleware.ts
  const staffCanOpen = (href: string) =>
    isOwner || ["/admin/upload", "/admin/media"].includes(href.split("?")[0]);
  const displayName = session?.user?.name || session?.user?.email || "";
  const handleSignOut = () => signOut({ callbackUrl: "/admin/login" });

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const mainNav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/admin/upload", label: "Upload Media", icon: Upload },
    { href: "/admin/media", label: "Media Library", icon: ImageIcon },
    {
      href: "/admin/media?view=projects",
      label: "Portfolio Projects",
      icon: FolderKanban,
    },
  ];

  const contentNav = [
    { href: "/admin/settings?tab=home", label: "Home Page", icon: Home },
    {
      href: "/admin/settings?tab=packages",
      label: "Services & Packages",
      icon: Package,
    },
    {
      href: "/admin/settings?tab=testimonials",
      label: "Testimonials",
      icon: MessageSquareQuote,
    },
  ];

  const clientNav = [
    {
      href: "/admin/bookings",
      label: "Bookings",
      icon: CalendarCheck,
      badge: newBookingsCount,
    },
  ];

  const settingsNav = [
    {
      href: "/admin/settings?tab=contact",
      label: "Site Settings",
      icon: Settings,
    },
  ];

  const isActiveLink = (href: string, exact?: boolean) => {
    const baseHref = href.split("?")[0];
    if (exact) return pathname === baseHref;
    return pathname === baseHref;
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8F9FA] text-[#111827] font-sans">
      {/* DESKTOP DARK SIDEBAR (#0B0B0E) */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-[#0B0B0E] text-[#F4F2EE] border-r border-white/10 select-none z-30">
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <Link href="/admin" className="flex items-center">
            <LiveImageLogo size="sm" adminBadge />
          </Link>
          <Link
            href="/"
            className="text-[11px] text-muted hover:text-paper flex items-center gap-1"
            title="View public website"
          >
            <span>Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-5 space-y-6 text-xs">
          {/* MAIN */}
          <div>
            <div className="px-3 mb-2 text-[10px] font-heading font-bold uppercase tracking-widest text-muted/60">
              Main
            </div>
            <nav className="space-y-1">
              {mainNav.filter((item) => staffCanOpen(item.href)).map((item) => {
                const Icon = item.icon;
                const active =
                  item.label === "Portfolio Projects"
                    ? false
                    : isActiveLink(item.href, item.exact);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition ${
                      active
                        ? "bg-[#1A1A21] text-white border-l-2 border-rec"
                        : "text-muted hover:text-paper hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-rec" : "text-muted"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* CONTENT */}
          {isOwner && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-heading font-bold uppercase tracking-widest text-muted/60">
              Content
            </div>
            <nav className="space-y-1">
              {contentNav.filter((item) => staffCanOpen(item.href)).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium text-muted hover:text-paper hover:bg-white/5 transition"
                  >
                    <Icon className="w-4 h-4 text-muted" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          )}

          {/* CLIENTS */}
          {isOwner && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-heading font-bold uppercase tracking-widest text-muted/60">
              Clients
            </div>
            <nav className="space-y-1">
              {clientNav.filter((item) => staffCanOpen(item.href)).map((item) => {
                const Icon = item.icon;
                const active = isActiveLink(item.href);
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition ${
                      active
                        ? "bg-[#1A1A21] text-white border-l-2 border-rec"
                        : "text-muted hover:text-paper hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4 h-4 ${
                          active ? "text-rec" : "text-muted"
                        }`}
                      />
                      <span>{item.label}</span>
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-rec text-white text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          )}

          {/* SETTINGS */}
          {isOwner && (
          <div>
            <div className="px-3 mb-2 text-[10px] font-heading font-bold uppercase tracking-widest text-muted/60">
              Settings
            </div>
            <nav className="space-y-1">
              {settingsNav.filter((item) => staffCanOpen(item.href)).map((item) => {
                const Icon = item.icon;
                const active = isActiveLink("/admin/settings");
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-medium transition ${
                      active
                        ? "bg-[#1A1A21] text-white border-l-2 border-rec"
                        : "text-muted hover:text-paper hover:bg-white/5"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 ${
                        active ? "text-rec" : "text-muted"
                      }`}
                    />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          )}
        </div>

        {/* Bottom Profile & Sign Out */}
        <div className="p-4 border-t border-white/10 bg-[#121217] space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-sm text-white shrink-0 ${
                isOwner ? "bg-rec" : "bg-amber-600"
              }`}
            >
              {(displayName[0] || "?").toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-heading font-bold text-xs text-paper truncate">
                {displayName}
              </div>
              <div className="text-[11px] text-muted truncate">
                {isOwner ? "Owner · Full Access" : "Staff · Upload-Only"}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full py-2 rounded-lg bg-night border border-white/10 text-[11px] font-medium text-muted hover:text-paper flex items-center justify-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR (Matches Page 13 "Admin on your phone") */}
      <header className="lg:hidden sticky top-0 z-30 bg-[#0B0B0E] text-paper px-4 py-3 flex items-center justify-between border-b border-white/10">
        <Link href="/admin" className="flex items-center">
          <LiveImageLogo size="sm" adminBadge />
        </Link>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSignOut}
            className="px-2.5 py-1 rounded-full bg-stage border border-white/15 text-[11px] font-medium text-paper flex items-center gap-1"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign out</span>
          </button>
          <Link
            href="/"
            className="px-2.5 py-1 rounded-full bg-white/10 text-[11px] font-medium text-paper flex items-center gap-1"
          >
            <span>Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* MAIN CONTENT CANVAS (#F8F9FA) */}
      <div className="flex-1 lg:pl-64 pb-24 lg:pb-12">
        {userRole === "staff" && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs text-amber-900">
            <span>
              <strong>Staff Upload-Only Access:</strong> You can upload and
              browse event photos &amp; videos. Bookings, pricing, deletion &amp;
              site settings are restricted to the owner.
            </span>
          </div>
        )}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </div>

      {/* MOBILE FLOATING RED "+" QUICK-UPLOAD BUTTON (Page 13) */}
      <Link
        href="/admin/upload"
        aria-label="Quick upload photos or video"
        className="lg:hidden fixed bottom-20 right-4 z-40 w-13 h-13 p-3.5 rounded-full bg-rec hover:bg-[#d12820] text-white shadow-2xl shadow-rec/50 flex items-center justify-center transition-transform active:scale-95"
      >
        <Plus className="w-6 h-6" />
      </Link>

      {/* MOBILE BOTTOM-NAV ADMIN BAR (Page 13) */}
      <nav className={`lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 px-2 py-2 grid ${isOwner ? "grid-cols-5" : "grid-cols-2"} text-[11px] font-medium text-gray-500`}>
        {isOwner && (
        <Link
          href="/admin"
          className={`flex flex-col items-center gap-1 py-1 ${
            pathname === "/admin" ? "text-rec font-bold" : ""
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Home</span>
        </Link>
        )}
        <Link
          href="/admin/media"
          className={`flex flex-col items-center gap-1 py-1 ${
            pathname === "/admin/media" ? "text-rec font-bold" : ""
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Media</span>
        </Link>
        {isOwner && (
        <Link
          href="/admin/bookings"
          className={`flex flex-col items-center gap-1 py-1 relative ${
            pathname === "/admin/bookings" ? "text-rec font-bold" : ""
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Bookings</span>
          {newBookingsCount > 0 && (
            <span className="absolute top-0.5 right-4 w-4 h-4 rounded-full bg-rec text-white text-[9px] font-bold flex items-center justify-center">
              {newBookingsCount}
            </span>
          )}
        </Link>
        )}
        {isOwner && (
        <Link
          href="/admin/settings"
          className={`flex flex-col items-center gap-1 py-1 ${
            pathname === "/admin/settings" ? "text-rec font-bold" : ""
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Content</span>
        </Link>
        )}
        <Link
          href="/admin/upload"
          className={`flex flex-col items-center gap-1 py-1 ${
            pathname === "/admin/upload" ? "text-rec font-bold" : ""
          }`}
        >
          <Upload className="w-4 h-4" />
          <span>Upload</span>
        </Link>
      </nav>
    </div>
  );
}
