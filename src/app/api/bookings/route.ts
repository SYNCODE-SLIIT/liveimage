import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendBookingNotification } from "@/lib/notify";
import { toBooking } from "@/lib/siteData";

const bookingSchema = z.object({
  clientName: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9\s\-()]{7,20}$/, "Please enter a valid phone number"),
  email: z.union([z.literal(""), z.string().trim().email().max(200)]).default(""),
  eventType: z.enum(["Wedding", "Concert", "Corporate", "Sports", "Other"]),
  eventDate: z.string().trim().max(40).default("TBD"),
  venue: z.string().trim().max(200).default(""),
  cameraSetup: z.enum(["2 Cameras", "4 Cameras", "6+ Cameras", "Not sure yet"]),
  liveStream: z.boolean().default(true),
  notes: z.string().trim().max(2000).default(""),
  // Honeypot: hidden field real visitors never fill in
  website: z.string().optional(),
});

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const parsed = bookingSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? "Invalid booking details";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const { website, ...data } = parsed.data;

  // Bots that fill the honeypot get a fake success and nothing is stored
  if (website) {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const row = await prisma.bookingRequest.create({
    data: {
      ...data,
      email: data.email || null,
      notes: data.notes || null,
    },
  });

  const booking = toBooking(row);

  // A failed email must not lose the booking, which is already saved
  try {
    await sendBookingNotification(booking);
  } catch (e) {
    console.error("Booking notification failed", e);
  }

  return NextResponse.json({ ok: true, booking }, { status: 201 });
}
