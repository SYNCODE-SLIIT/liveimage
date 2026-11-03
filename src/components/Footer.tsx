"use client";

import React from "react";
import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Video,
  Shield,
} from "lucide-react";
import { useLiveImage } from "@/context/LiveImageContext";
import { LiveImageLogo } from "./LiveImageLogo";

export function Footer() {
  const { settings } = useLiveImage();

  return (
    <footer className="bg-[#08080A] border-t border-white/10 text-paper">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Column 1: Brand Summary & Socials */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center">
              <LiveImageLogo size="md" />
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              Multi-camera 4K production, live broadcasting and event filming
              across Sri Lanka. Founded &amp; directed by{" "}
              <span className="text-paper font-medium">B Damith Sadaruwan</span>.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-2">
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="LIVE IMAGE LK Facebook"
                className="h-9 px-3 rounded-lg bg-stage border border-white/10 hover:border-rec/50 flex items-center gap-1.5 text-xs text-muted hover:text-paper transition"
              >
                <Facebook className="w-3.5 h-3.5 text-rec" />
                <span>LIVEIMAGE.lk</span>
              </a>
              <a
                href={settings.facebookPersonalUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Damith Sadaruwan Video Facebook"
                className="h-9 px-3 rounded-lg bg-stage border border-white/10 hover:border-rec/50 flex items-center gap-1.5 text-xs text-muted hover:text-paper transition"
              >
                <Facebook className="w-3.5 h-3.5 text-spotlight" />
                <span>Sadaruwan Video</span>
              </a>
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="h-9 w-9 rounded-lg bg-stage border border-white/10 hover:border-rec/50 flex items-center justify-center text-muted hover:text-paper transition"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="h-9 w-9 rounded-lg bg-stage border border-white/10 hover:border-rec/50 flex items-center justify-center text-muted hover:text-paper transition"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="h-9 w-9 rounded-lg bg-stage border border-white/10 hover:border-rec/50 flex items-center justify-center text-muted hover:text-paper transition"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-paper">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link
                  href="/services#multi-cam"
                  className="hover:text-paper transition"
                >
                  Multi-Camera Events
                </Link>
              </li>
              <li>
                <Link
                  href="/services#live-streaming"
                  className="hover:text-paper transition"
                >
                  Broadcast Live Streaming
                </Link>
              </li>
              <li>
                <Link
                  href="/services#weddings"
                  className="hover:text-paper transition"
                >
                  Wedding Films &amp; Live Streams
                </Link>
              </li>
              <li>
                <Link
                  href="/services#corporate"
                  className="hover:text-paper transition"
                >
                  Corporate, Expos &amp; Sports
                </Link>
              </li>
              <li>
                <Link
                  href="/services#packages"
                  className="hover:text-paper transition"
                >
                  Camera Packages (2 to 12 Cams)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-paper">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm text-muted">
              <li>
                <Link href="/about" className="hover:text-paper transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-paper transition">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link
                  href="/about#equipment"
                  className="hover:text-paper transition"
                >
                  Equipment &amp; OB Gear
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-paper transition">
                  Contact &amp; Book
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-rec hover:underline font-medium"
                >
                  <Shield className="w-3.5 h-3.5" />
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Get in touch */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-paper">
              Get in touch
            </h3>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, "")}`}
                  className="flex items-center gap-2.5 hover:text-paper transition"
                >
                  <Phone className="w-4 h-4 text-rec shrink-0" />
                  <span>{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-center gap-2.5 hover:text-paper transition"
                >
                  <Mail className="w-4 h-4 text-rec shrink-0" />
                  <span>{settings.email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-rec shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} LIVE IMAGE (PVT) LTD (liveimage.lk). All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/contact" className="hover:text-paper transition">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-paper transition">
              Terms of Broadcast
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
