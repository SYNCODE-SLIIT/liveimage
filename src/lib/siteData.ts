import { prisma } from "@/lib/prisma";
import {
  INITIAL_MEDIA_PROJECTS,
  INITIAL_PACKAGES,
  INITIAL_SITE_SETTINGS,
  INITIAL_TESTIMONIALS,
  MediaProject,
  ServicePackage,
  SiteSettings,
  Testimonial,
} from "@/data/seedData";

export interface SiteData {
  settings: SiteSettings;
  projects: MediaProject[];
  packages: ServicePackage[];
  testimonials: Testimonial[];
}

function timeAgo(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) {
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

// Loads the content shown across the site. Visitors only get Live projects;
// signed-in admins also get drafts and hidden items.
export async function getSiteData(includeUnpublished: boolean): Promise<SiteData> {
  const [settingsRow, projectRows, packageRows, testimonialRows] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    prisma.mediaProject.findMany({
      where: includeUnpublished ? undefined : { status: "Live" },
      orderBy: { createdAt: "desc" },
    }),
    prisma.servicePackage.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  let settings = INITIAL_SITE_SETTINGS;
  if (settingsRow) {
    const { id, updatedAt, ...rest } = settingsRow;
    settings = rest;
  }

  const projects: MediaProject[] = projectRows.map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    type: p.type,
    eventDate: p.eventDate,
    description: p.description,
    subtitle: p.subtitle,
    thumbnailUrl: p.thumbnailUrl,
    videoUrl: p.videoUrl ?? undefined,
    duration: p.duration ?? undefined,
    photoCount: p.photoCount,
    photos: p.photos,
    cameraCount: p.cameraCount,
    featuredOnHome: p.featuredOnHome,
    autoCompress: p.autoCompress,
    addWatermark: p.addWatermark,
    status: p.status,
    fileSizeMB: p.fileSizeMB,
    uploadedAgo: timeAgo(p.createdAt),
    visualTheme: p.visualTheme as MediaProject["visualTheme"],
  }));

  const packages: ServicePackage[] = packageRows.map((p) => ({
    id: p.id,
    tierName: p.tierName,
    cameraCount: p.cameraCount,
    subtitle: p.subtitle,
    priceLKR: p.priceLKR,
    features: p.features,
    highlighted: p.highlighted,
  }));

  const testimonials: Testimonial[] = testimonialRows.map((t) => ({
    id: t.id,
    clientName: t.clientName,
    clientRole: t.clientRole,
    quote: t.quote,
    rating: t.rating,
    avatarColor: t.avatarColor,
  }));

  return { settings, projects, packages, testimonials };
}

// Used only if the database cannot be reached, so the site still renders
export function getFallbackSiteData(includeUnpublished: boolean): SiteData {
  return {
    settings: INITIAL_SITE_SETTINGS,
    projects: includeUnpublished
      ? INITIAL_MEDIA_PROJECTS
      : INITIAL_MEDIA_PROJECTS.filter((p) => p.status === "Live"),
    packages: INITIAL_PACKAGES,
    testimonials: INITIAL_TESTIMONIALS,
  };
}
