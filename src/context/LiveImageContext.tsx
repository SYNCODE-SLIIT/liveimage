"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  BookingRequest,
  BookingStatus,
  INITIAL_BOOKINGS,
  INITIAL_MEDIA_PROJECTS,
  INITIAL_PACKAGES,
  INITIAL_SITE_SETTINGS,
  INITIAL_TESTIMONIALS,
  MediaCategory,
  MediaProject,
  PublishStatus,
  ServicePackage,
  SiteSettings,
  Testimonial,
  UserRole,
} from "@/data/seedData";

interface LiveImageContextType {
  settings: SiteSettings;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  projects: MediaProject[];
  addProject: (project: Omit<MediaProject, "id" | "uploadedAgo">) => MediaProject;
  updateProject: (id: string, partial: Partial<MediaProject>) => void;
  deleteProjects: (ids: string[]) => void;
  bulkToggleFeature: (ids: string[], featured?: boolean) => void;
  bulkSetStatus: (ids: string[], status: PublishStatus) => void;
  bulkMoveCategory: (ids: string[], category: MediaCategory) => void;
  bookings: BookingRequest[];
  addBooking: (
    booking: Omit<BookingRequest, "id" | "status" | "createdAt">,
    honeypot?: string
  ) => Promise<BookingRequest>;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  deleteBooking: (id: string) => void;
  packages: ServicePackage[];
  updatePackage: (id: string, partial: Partial<ServicePackage>) => void;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => void;
  deleteTestimonial: (id: string) => void;
  userRole: UserRole;
  resetDemoData: () => void;
  isHydrated: boolean;
}

const LiveImageContext = createContext<LiveImageContextType | undefined>(
  undefined
);

const STORAGE_KEYS = {
  SETTINGS: "liveimage_settings_v1",
  PROJECTS: "liveimage_projects_v1",
  BOOKINGS: "liveimage_bookings_v1",
  PACKAGES: "liveimage_packages_v1",
  TESTIMONIALS: "liveimage_testimonials_v1",
};

export function LiveImageProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [projects, setProjects] = useState<MediaProject[]>(
    INITIAL_MEDIA_PROJECTS
  );
  const [bookings, setBookings] = useState<BookingRequest[]>(INITIAL_BOOKINGS);
  const [packages, setPackages] = useState<ServicePackage[]>(INITIAL_PACKAGES);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    INITIAL_TESTIMONIALS
  );
  const { data: session } = useSession();
  // Role comes from the signed-in account; no session means least access
  const userRole: UserRole = session?.user?.role ?? "staff";
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setSettings(JSON.parse(savedSettings));

      const savedProjects = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (savedProjects) setProjects(JSON.parse(savedProjects));

      const savedBookings = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      if (savedBookings) setBookings(JSON.parse(savedBookings));

      const savedPackages = localStorage.getItem(STORAGE_KEYS.PACKAGES);
      if (savedPackages) setPackages(JSON.parse(savedPackages));

      const savedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
      if (savedTestimonials) setTestimonials(JSON.parse(savedTestimonials));
    } catch (e) {
      console.error("Failed to load state from localStorage", e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const updateSettings = (partial: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const saveProjects = (updater: (prev: MediaProject[]) => MediaProject[]) => {
    setProjects((prev) => {
      const next = updater(prev);
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addProject = (
    projectData: Omit<MediaProject, "id" | "uploadedAgo">
  ): MediaProject => {
    const newProject: MediaProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      uploadedAgo: "Just now",
    };
    saveProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, partial: Partial<MediaProject>) => {
    saveProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
  };

  const deleteProjects = (ids: string[]) => {
    saveProjects((prev) => prev.filter((p) => !ids.includes(p.id)));
  };

  const bulkToggleFeature = (ids: string[], featured?: boolean) => {
    saveProjects((prev) =>
      prev.map((p) => {
        if (!ids.includes(p.id)) return p;
        const nextVal = featured !== undefined ? featured : !p.featuredOnHome;
        return { ...p, featuredOnHome: nextVal };
      })
    );
  };

  const bulkSetStatus = (ids: string[], status: PublishStatus) => {
    saveProjects((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
    );
  };

  const bulkMoveCategory = (ids: string[], category: MediaCategory) => {
    saveProjects((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, category } : p))
    );
  };

  const addBooking = async (
    bookingData: Omit<BookingRequest, "id" | "status" | "createdAt">,
    honeypot?: string
  ): Promise<BookingRequest> => {
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...bookingData, website: honeypot }),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(result.error || "Could not send your booking. Please try again.");
    }
    const newBooking: BookingRequest = result.booking ?? {
      ...bookingData,
      id: `bk-${Date.now()}`,
      status: "New",
      createdAt: new Date().toISOString().split("T")[0],
    };
    // Admin pages still read local state until they move to the database
    setBookings((prev) => {
      const next = [newBooking, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
      } catch {}
      return next;
    });
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => {
      const next = prev.map((b) => (b.id === id ? { ...b, status } : b));
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => {
      const next = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const updatePackage = (id: string, partial: Partial<ServicePackage>) => {
    setPackages((prev) => {
      const next = prev.map((pkg) =>
        pkg.id === id ? { ...pkg, ...partial } : pkg
      );
      try {
        localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const addTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newT: Testimonial = {
      ...testimonial,
      id: `test-${Date.now()}`,
    };
    setTestimonials((prev) => {
      const next = [newT, ...prev];
      try {
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => {
      const next = prev.filter((t) => t.id !== id);
      try {
        localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const resetDemoData = () => {
    setSettings(INITIAL_SITE_SETTINGS);
    setProjects(INITIAL_MEDIA_PROJECTS);
    setBookings(INITIAL_BOOKINGS);
    setPackages(INITIAL_PACKAGES);
    setTestimonials(INITIAL_TESTIMONIALS);
    try {
      Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    } catch {}
  };

  return (
    <LiveImageContext.Provider
      value={{
        settings,
        updateSettings,
        projects,
        addProject,
        updateProject,
        deleteProjects,
        bulkToggleFeature,
        bulkSetStatus,
        bulkMoveCategory,
        bookings,
        addBooking,
        updateBookingStatus,
        deleteBooking,
        packages,
        updatePackage,
        testimonials,
        addTestimonial,
        deleteTestimonial,
        userRole,
        resetDemoData,
        isHydrated,
      }}
    >
      {children}
    </LiveImageContext.Provider>
  );
}

export function useLiveImage() {
  const context = useContext(LiveImageContext);
  if (!context) {
    throw new Error("useLiveImage must be used within a LiveImageProvider");
  }
  return context;
}
