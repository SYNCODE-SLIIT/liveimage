"use client";

import React, { useState } from "react";
import {
  Download,
  MessageCircle,
  Mail,
  Phone,
  CheckCircle2,
  X,
  Calendar,
  MapPin,
  Camera,
} from "lucide-react";
import { useLiveImage } from "@/context/LiveImageContext";
import { BookingRequest, BookingStatus } from "@/data/seedData";

type FilterStatus = "All" | BookingStatus;

const STATUS_SEQUENCE: BookingStatus[] = [
  "New",
  "Quoted",
  "Confirmed",
  "Completed",
];

export default function AdminBookingsCRMPage() {
  const { bookings, updateBookingStatus, deleteBooking, userRole } =
    useLiveImage();
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("All");
  const [selectedBooking, setSelectedBooking] =
    useState<BookingRequest | null>(null);

  const filteredBookings = bookings.filter((b) =>
    filterStatus === "All" ? true : b.status === filterStatus
  );

  const newCount = bookings.filter((b) => b.status === "New").length + 3;
  const quotedCount = bookings.filter((b) => b.status === "Quoted").length + 8;
  const confirmedCount =
    bookings.filter((b) => b.status === "Confirmed").length + 12;

  const cycleStatus = (bk: BookingRequest) => {
    const idx = STATUS_SEQUENCE.indexOf(bk.status);
    const next = STATUS_SEQUENCE[(idx + 1) % STATUS_SEQUENCE.length];
    updateBookingStatus(bk.id, next);
    if (selectedBooking?.id === bk.id) {
      setSelectedBooking({ ...bk, status: next });
    }
  };

  // Functional CSV Export Download
  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Client Name",
      "Phone",
      "Email",
      "Event Type",
      "Venue",
      "Event Date",
      "Cameras",
      "Live Stream",
      "Status",
      "Notes",
    ];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.clientName.replace(/"/g, '""')}"`,
      `"${b.phone}"`,
      `"${b.email}"`,
      b.eventType,
      `"${b.venue.replace(/"/g, '""')}"`,
      b.eventDate,
      `"${b.cameraSetup}"`,
      b.liveStream ? "Live" : "No",
      b.status,
      `"${(b.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `liveimage-lk-bookings-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadgeClasses = (status: BookingStatus) => {
    switch (status) {
      case "New":
        return "bg-rose-100 text-rec border-rose-200";
      case "Quoted":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getWhatsAppReplyUrl = (bk: BookingRequest) => {
    const cleanPhone = bk.phone.replace(/[^0-9]/g, "");
    const text = `Hi ${bk.clientName}, this is Damith from LIVE IMAGE LK regarding your ${bk.eventType} enquiry on ${bk.eventDate} (${bk.cameraSetup}). Here is your production quote...`;
    return `https://wa.me/${cleanPhone || "94770377342"}?text=${encodeURIComponent(
      text
    )}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER & EXPORT CSV */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            Booking Requests
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Every enquiry from the website &ldquo;Book Your Event&rdquo; form
            lands here — with an email &amp; WhatsApp alert.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 font-heading font-semibold text-xs text-gray-800 shadow-sm transition self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-rec" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* 2. TOP 4 METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-gray-500 block">New</span>
          <div className="mt-1.5 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            {newCount}
          </div>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-gray-500 block">Quoted</span>
          <div className="mt-1.5 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            {quotedCount}
          </div>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-gray-500 block">
            Confirmed (Oct–Dec)
          </span>
          <div className="mt-1.5 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            {confirmedCount}
          </div>
        </div>
        <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-sm">
          <span className="text-xs text-gray-500 block">Avg. response time</span>
          <div className="mt-1.5 font-heading font-bold text-2xl sm:text-3xl text-gray-900">
            3.2 h
          </div>
        </div>
      </div>

      {/* 3. STATUS FILTER PILLS */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {(["All", "New", "Quoted", "Confirmed", "Completed"] as FilterStatus[]).map(
          (st) => {
            const active = filterStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-4 py-2 rounded-xl text-xs font-heading font-semibold transition ${
                  active
                    ? "bg-[#0B0B0E] text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {st}
              </button>
            );
          }
        )}
      </div>

      {/* 4. INTERACTIVE BOOKINGS TABLE */}
      <div className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[11px] font-heading font-bold uppercase tracking-wider text-gray-400">
                <th className="py-3.5 px-5">Client</th>
                <th className="py-3.5 px-4">Event</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Cameras / Stream</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs sm:text-sm">
              {filteredBookings.map((bk) => (
                <tr
                  key={bk.id}
                  className="hover:bg-gray-50/80 transition group"
                >
                  <td className="py-4 px-5">
                    <div className="font-heading font-bold text-gray-900">
                      {bk.clientName}
                    </div>
                    <div className="text-xs text-gray-400">{bk.phone}</div>
                  </td>
                  <td className="py-4 px-4 text-gray-700 font-medium">
                    {bk.eventType} — {bk.venue.split("—")[0].trim()}
                  </td>
                  <td className="py-4 px-4 text-gray-600">{bk.eventDate}</td>
                  <td className="py-4 px-4 text-gray-600">
                    {bk.cameraSetup.replace(" Cameras", " cams")} ·{" "}
                    {bk.liveStream ? "Live" : "No"}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => cycleStatus(bk)}
                      title="Click to advance status (New → Quoted → Confirmed → Completed)"
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition hover:scale-105 ${getStatusBadgeClasses(
                        bk.status
                      )}`}
                    >
                      {bk.status}
                    </button>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(bk)}
                      className="font-heading font-bold text-xs text-gray-900 hover:text-rec transition"
                    >
                      Open
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SELECTED BOOKING DETAIL DRAWER / MODAL */}
      {selectedBooking && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-[#0B0B0E] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-rec">
                  Booking Enquiry Detail
                </span>
                <h3 className="font-heading font-bold text-lg">
                  {selectedBooking.clientName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 text-xs block">Event Type</span>
                  <span className="font-heading font-bold text-gray-900">
                    {selectedBooking.eventType}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Event Date</span>
                  <span className="font-heading font-bold text-gray-900">
                    {selectedBooking.eventDate}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">Venue</span>
                  <span className="font-medium text-gray-800">
                    {selectedBooking.venue}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-xs block">
                    Camera Setup &amp; Stream
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedBooking.cameraSetup} ·{" "}
                    {selectedBooking.liveStream ? "Live Stream" : "Record Only"}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-gray-500 block mb-1">
                  Client Notes
                </span>
                <p className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-gray-700">
                  {selectedBooking.notes || "No additional notes provided."}
                </p>
              </div>

              {/* Status Switcher */}
              <div>
                <span className="text-xs font-semibold text-gray-500 block mb-2">
                  Update Pipeline Status
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {STATUS_SEQUENCE.map((st) => {
                    const active = selectedBooking.status === st;
                    return (
                      <button
                        key={st}
                        type="button"
                        onClick={() => {
                          updateBookingStatus(selectedBooking.id, st);
                          setSelectedBooking({
                            ...selectedBooking,
                            status: st,
                          });
                        }}
                        className={`py-2 rounded-xl text-xs font-heading font-bold border transition ${
                          active
                            ? "bg-rec text-white border-rec shadow-sm"
                            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {st}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reply Actions */}
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <a
                    href={getWhatsAppReplyUrl(selectedBooking)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-night font-heading font-bold text-xs shadow-sm transition"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Reply on WhatsApp</span>
                  </a>
                  <a
                    href={`mailto:${selectedBooking.email}?subject=LIVE IMAGE LK Quote — ${selectedBooking.eventType}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-heading font-semibold text-xs transition"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Email Quote</span>
                  </a>
                </div>

                {userRole === "owner" && (
                  <button
                    type="button"
                    onClick={() => {
                      deleteBooking(selectedBooking.id);
                      setSelectedBooking(null);
                    }}
                    className="text-xs text-rec hover:underline font-medium"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
