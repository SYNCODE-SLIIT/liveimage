"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BookingRequest } from "@/data/seedData";
import { ContactStudioDockSection } from "@/components/ContactStudioDockSection";

function ContactBookingContent() {
  const searchParams = useSearchParams();

  const serviceParam = searchParams.get("service");
  const camerasParam = searchParams.get("cameras");
  const topicParam = searchParams.get("topic") || searchParams.get("package");

  let initialEventType: BookingRequest["eventType"] = "Wedding";
  if (serviceParam) {
    const normalized = serviceParam.toLowerCase();
    if (normalized.includes("wedding")) initialEventType = "Wedding";
    else if (normalized.includes("concert") || normalized.includes("event"))
      initialEventType = "Concert";
    else if (normalized.includes("corporate")) initialEventType = "Corporate";
    else if (normalized.includes("sport")) initialEventType = "Sports";
    else initialEventType = "Other";
  }

  let initialCameraSetup: BookingRequest["cameraSetup"] = "4 Cameras";
  if (camerasParam) {
    if (camerasParam.includes("2")) initialCameraSetup = "2 Cameras";
    else if (camerasParam.includes("4")) initialCameraSetup = "4 Cameras";
    else if (camerasParam.includes("6")) initialCameraSetup = "6+ Cameras";
  }

  const hasBookingQuery = Boolean(serviceParam || camerasParam || topicParam);

  return (
    <div className="bg-night text-paper min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 py-14 sm:py-20">
        <div className="absolute inset-0 stage-spotlight-bg opacity-60" />
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs font-medium text-muted mb-3">
            <Link href="/" className="hover:text-paper transition">
              Home
            </Link>{" "}
            / <span className="text-paper">Contact</span>
          </div>
          <h1 className="font-heading font-bold text-3xl sm:text-5xl text-paper">
            Contact &amp; Booking
          </h1>
          <p className="mt-3 text-sm sm:text-base text-muted max-w-xl">
            Reach our Dehiwala / Colombo production desk directly or configure
            your event setup below.
          </p>
        </div>
      </section>

      {/* Studio Command Dock */}
      <ContactStudioDockSection
        initialApp={hasBookingQuery ? "calendar" : "phone"}
        initialEventType={initialEventType}
        initialCameraSetup={initialCameraSetup}
        initialNote={
          topicParam ? `Inquiring regarding: ${topicParam}` : undefined
        }
      />
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-night text-paper flex items-center justify-center text-sm text-muted">
          Loading...
        </div>
      }
    >
      <ContactBookingContent />
    </Suspense>
  );
}
