"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Shield, Phone, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveImage } from "@/context/LiveImageContext";
import { LiveImageLogo } from "./LiveImageLogo";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { settings, bookings } = useLiveImage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const newBookingsCount = bookings.filter((b) => b.status === "New").length;

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#0B0B0E]/92 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-black/50"
            : "bg-[#0B0B0E]/75 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Left: Official LIVE IMAGE Logo */}
          <Link
            href="/"
            className="flex items-center group focus:outline-none transition-transform hover:scale-[1.02]"
          >
            <LiveImageLogo size="md" />
          </Link>

          {/* Center (Desktop): Navigation links */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? "text-paper font-semibold"
                      : "text-muted hover:text-paper"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-rec rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Admin Quick Link + Pill-shaped #E8332B CTA button "Book a Shoot" */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-medium text-muted hover:text-paper px-3 py-2 rounded-full border border-white/10 hover:border-white/25 bg-stage/60 transition"
              title="Open Damith's Admin Control Panel"
            >
              <Shield className="w-3.5 h-3.5 text-rec" />
              <span>Admin</span>
              {newBookingsCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 bg-rec text-white text-[10px] font-bold rounded-full">
                  {newBookingsCount}
                </span>
              )}
            </Link>
            <Link
              href="/contact"
              className="bg-rec hover:bg-[#d12820] text-white font-heading font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-lg shadow-rec/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Book a Shoot
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/admin"
              className="flex items-center gap-1 text-xs font-medium text-muted hover:text-paper px-2.5 py-1.5 rounded-full border border-white/10 bg-stage/80"
            >
              <Shield className="w-3.5 h-3.5 text-rec" />
              <span>Admin</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
              className="p-2.5 rounded-xl bg-stage border border-white/10 text-paper hover:border-white/20"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Slide-Over Navigation Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "tween", duration: 0.25 }}
            className="fixed inset-0 z-50 bg-night flex flex-col justify-between p-6 md:hidden overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <Link href="/" onClick={() => setMobileOpen(false)}>
                  <LiveImageLogo size="md" />
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation menu"
                  className="p-2.5 rounded-xl bg-stage border border-white/10 text-paper"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col space-y-2">
                {NAV_LINKS.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between px-4 py-4 rounded-2xl text-xl font-heading font-semibold transition ${
                        isActive
                          ? "bg-stage text-paper border border-rec/40"
                          : "text-muted hover:text-paper hover:bg-stage/50"
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight
                        className={`w-5 h-5 ${
                          isActive ? "text-rec" : "text-muted/40"
                        }`}
                      />
                    </Link>
                  );
                })}
                <Link
                  href="/admin"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between px-4 py-4 rounded-2xl text-base font-medium text-muted hover:text-paper bg-stage/40 border border-white/10 mt-4"
                >
                  <span className="flex items-center gap-2.5">
                    <Shield className="w-5 h-5 text-rec" />
                    Damith&apos;s Admin Control Panel
                  </span>
                  {newBookingsCount > 0 && (
                    <span className="px-2 py-0.5 bg-rec text-white text-xs font-bold rounded-full">
                      {newBookingsCount} new
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <a
                href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-stage border border-white/10 text-paper font-medium text-sm"
              >
                <Phone className="w-4 h-4 text-rec" />
                Call Direct: {settings.phone}
              </a>
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-rec hover:bg-[#d12820] text-white font-heading font-bold text-sm shadow-lg shadow-rec/30"
              >
                <span>Book Your Event</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
