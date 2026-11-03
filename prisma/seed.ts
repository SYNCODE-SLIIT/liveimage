import { PrismaClient } from "@prisma/client";
import {
  INITIAL_BOOKINGS,
  INITIAL_MEDIA_PROJECTS,
  INITIAL_PACKAGES,
  INITIAL_SITE_SETTINGS,
  INITIAL_TESTIMONIALS,
} from "../src/data/seedData";

const prisma = new PrismaClient();

// Turn demo labels like "2 days ago" / "1 month ago" / "Yesterday" into a date
function dateFromAgo(label: string): Date {
  const d = new Date();
  if (/yesterday/i.test(label)) {
    d.setDate(d.getDate() - 1);
    return d;
  }
  const m = label.match(/(\d+)\s+(day|week|month)/i);
  if (!m) return d;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === "day") d.setDate(d.getDate() - n);
  if (unit === "week") d.setDate(d.getDate() - n * 7);
  if (unit === "month") d.setMonth(d.getMonth() - n);
  return d;
}

async function main() {
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", ...INITIAL_SITE_SETTINGS },
  });

  for (const { uploadedAgo, ...project } of INITIAL_MEDIA_PROJECTS) {
    await prisma.mediaProject.upsert({
      where: { id: project.id },
      update: {},
      create: { ...project, createdAt: dateFromAgo(uploadedAgo) },
    });
  }

  for (let sortOrder = 0; sortOrder < INITIAL_PACKAGES.length; sortOrder++) {
    const pkg = INITIAL_PACKAGES[sortOrder];
    await prisma.servicePackage.upsert({
      where: { id: pkg.id },
      update: {},
      create: { ...pkg, sortOrder },
    });
  }

  for (const testimonial of INITIAL_TESTIMONIALS) {
    await prisma.testimonial.upsert({
      where: { id: testimonial.id },
      update: {},
      create: testimonial,
    });
  }

  for (const { createdAt, email, notes, ...booking } of INITIAL_BOOKINGS) {
    await prisma.bookingRequest.upsert({
      where: { id: booking.id },
      update: {},
      create: {
        ...booking,
        email: email || null,
        notes: notes || null,
        createdAt: new Date(createdAt),
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
