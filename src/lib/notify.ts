import type { BookingRequest } from "@/data/seedData";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Emails the owner about a new booking via Resend. Skipped when not configured.
export async function sendBookingNotification(booking: BookingRequest) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_NOTIFY_EMAIL;
  if (!apiKey || !to) {
    console.warn("RESEND_API_KEY / BOOKING_NOTIFY_EMAIL not set, skipping booking email");
    return;
  }

  const rows: [string, string][] = [
    ["Name", booking.clientName],
    ["Phone / WhatsApp", booking.phone],
    ["Email", booking.email || "—"],
    ["Event type", booking.eventType],
    ["Event date", booking.eventDate],
    ["Venue", booking.venue || "—"],
    ["Cameras", booking.cameraSetup],
    ["Live stream", booking.liveStream ? "Yes" : "No"],
    ["Notes", booking.notes || "—"],
  ];

  const html = `
    <h2>New booking request</h2>
    <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="color:#666">${label}</td><td><strong>${escapeHtml(value)}</strong></td></tr>`
        )
        .join("")}
    </table>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.BOOKING_FROM_EMAIL || "LIVE IMAGE <onboarding@resend.dev>",
      to: [to],
      reply_to: booking.email || undefined,
      subject: `New booking: ${booking.eventType} — ${booking.clientName}`,
      html,
    }),
  });

  if (!res.ok) {
    throw new Error(`Resend responded ${res.status}: ${await res.text()}`);
  }
}
