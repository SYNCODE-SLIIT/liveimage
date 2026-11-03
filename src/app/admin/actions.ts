"use server";

import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Testimonial, UserRole } from "@/data/seedData";

export type ActionResult<T = undefined> =
  | { ok: true; data: T }
  | { ok: false; error: string };

class ActionError extends Error {}

async function requireRole(roles: UserRole[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new ActionError("Your session has expired. Please sign in again.");
  if (!roles.includes(session.user.role)) {
    throw new ActionError("Your account is not allowed to do this.");
  }
  return session;
}

// Runs an action and turns failures into a message the admin UI can show
async function run<T>(fn: () => Promise<T>): Promise<ActionResult<T>> {
  try {
    const data = await fn();
    revalidatePath("/", "layout");
    return { ok: true, data };
  } catch (e) {
    if (e instanceof ActionError) return { ok: false, error: e.message };
    if (e instanceof z.ZodError) {
      return { ok: false, error: e.issues[0]?.message ?? "Invalid data" };
    }
    console.error("Admin action failed", e);
    return { ok: false, error: "Could not save. Please try again." };
  }
}

const text = (max: number) => z.string().trim().max(max);
const url = z.union([z.literal(""), z.string().trim().url().max(500)]);

const ids = z.array(z.string().min(1)).min(1).max(500);
const category = z.enum(["Concerts", "Weddings", "Corporate", "Sports", "Other"]);
const publishStatus = z.enum(["Live", "Draft", "Hidden"]);

/* ---------------------------- Site settings ---------------------------- */

const settingsSchema = z
  .object({
    heroBadge: text(80),
    heroHeadline: text(160),
    heroSubheadline: text(400),
    heroVideoUrl: url,
    eventsFilmed: text(20),
    cameraSetups: text(20),
    liveViewers: text(20),
    yearsInProduction: text(20),
    showPackagePrices: z.boolean(),
    phone: text(40),
    whatsappNumber: z.string().trim().regex(/^[0-9]{6,20}$/, "WhatsApp number must be digits only, e.g. 94770377342"),
    email: z.string().trim().email("Please enter a valid email").max(200),
    address: text(200),
    facebookUrl: url,
    facebookPersonalUrl: url,
    youtubeUrl: url,
    instagramUrl: url,
    tiktokUrl: url,
    clientLogos: z.array(text(60)).max(50),
  })
  .partial();

export async function saveSettings(input: unknown) {
  return run(async () => {
    await requireRole(["owner"]);
    const data = settingsSchema.parse(input);
    await prisma.siteSettings.update({ where: { id: "default" }, data });
  });
}

/* ------------------------------- Packages ------------------------------ */

const packageSchema = z
  .object({
    tierName: text(60),
    cameraCount: text(40),
    subtitle: text(200),
    priceLKR: text(40),
    features: z.array(text(200)).max(30),
    highlighted: z.boolean(),
  })
  .partial();

export async function savePackage(id: string, input: unknown) {
  return run(async () => {
    await requireRole(["owner"]);
    await prisma.servicePackage.update({ where: { id }, data: packageSchema.parse(input) });
  });
}

/* ----------------------------- Testimonials ---------------------------- */

const testimonialSchema = z.object({
  clientName: text(100).min(1, "Client name is required"),
  clientRole: text(100),
  quote: text(1000).min(1, "Review text is required"),
  rating: z.number().int().min(1).max(5),
  avatarColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export async function addTestimonial(input: unknown) {
  return run(async (): Promise<Testimonial> => {
    await requireRole(["owner"]);
    const row = await prisma.testimonial.create({ data: testimonialSchema.parse(input) });
    return {
      id: row.id,
      clientName: row.clientName,
      clientRole: row.clientRole,
      quote: row.quote,
      rating: row.rating,
      avatarColor: row.avatarColor,
    };
  });
}

export async function deleteTestimonial(id: string) {
  return run(async () => {
    await requireRole(["owner"]);
    await prisma.testimonial.delete({ where: { id } });
  });
}

/* ------------------------------- Projects ------------------------------ */

const projectSchema = z.object({
  title: text(160).min(1, "Project title is required"),
  category,
  type: z.enum(["video", "photos", "both"]),
  eventDate: text(40),
  description: text(2000),
  subtitle: text(200),
  thumbnailUrl: z.string().trim().max(1000),
  videoUrl: z.string().trim().max(1000).optional(),
  duration: text(20).optional(),
  photoCount: z.number().int().min(0).max(100_000),
  photos: z.array(z.string().max(1000)).max(500),
  cameraCount: z.number().int().min(0).max(100),
  featuredOnHome: z.boolean(),
  autoCompress: z.boolean(),
  addWatermark: z.boolean(),
  status: publishStatus,
  fileSizeMB: z.number().min(0).max(1_000_000),
  visualTheme: z.enum([
    "stage-beams",
    "wedding-warm",
    "corporate-blue",
    "sports-green",
    "studio-amber",
    "perahara-gold",
    "control-room",
  ]),
});

export async function createProject(input: unknown) {
  return run(async (): Promise<string> => {
    await requireRole(["owner", "staff"]);
    const row = await prisma.mediaProject.create({ data: projectSchema.parse(input) });
    return row.id;
  });
}

export async function updateProject(id: string, input: unknown) {
  return run(async () => {
    await requireRole(["owner"]);
    await prisma.mediaProject.update({ where: { id }, data: projectSchema.partial().parse(input) });
  });
}

export async function updateProjects(input: unknown, patch: unknown) {
  return run(async () => {
    await requireRole(["owner"]);
    const data = z
      .object({ featuredOnHome: z.boolean(), status: publishStatus, category })
      .partial()
      .parse(patch);
    await prisma.mediaProject.updateMany({ where: { id: { in: ids.parse(input) } }, data });
  });
}

export async function deleteProjects(input: unknown) {
  return run(async () => {
    await requireRole(["owner"]);
    await prisma.mediaProject.deleteMany({ where: { id: { in: ids.parse(input) } } });
  });
}

/* ------------------------------- Bookings ------------------------------ */

export async function updateBookingStatus(id: string, status: unknown) {
  return run(async () => {
    await requireRole(["owner"]);
    await prisma.bookingRequest.update({
      where: { id },
      data: { status: z.enum(["New", "Quoted", "Confirmed", "Completed"]).parse(status) },
    });
  });
}

export async function deleteBooking(id: string) {
  return run(async () => {
    await requireRole(["owner"]);
    await prisma.bookingRequest.delete({ where: { id } });
  });
}
