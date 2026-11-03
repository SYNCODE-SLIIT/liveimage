"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import type { SiteData } from "@/lib/siteData";
import * as actions from "@/app/admin/actions";
import type { ActionResult } from "@/app/admin/actions";
import {
  BookingRequest,
  BookingStatus,
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
  // Edits settings on screen only; saveSettings() stores them
  updateSettings: (partial: Partial<SiteSettings>) => void;
  saveSettings: (partial?: Partial<SiteSettings>) => Promise<boolean>;
  projects: MediaProject[];
  addProject: (
    project: Omit<MediaProject, "id" | "uploadedAgo">
  ) => Promise<MediaProject>;
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
  // Edits a package on screen only; savePackage() stores it
  updatePackage: (id: string, partial: Partial<ServicePackage>) => void;
  savePackage: (id: string) => Promise<boolean>;
  testimonials: Testimonial[];
  addTestimonial: (testimonial: Omit<Testimonial, "id">) => Promise<boolean>;
  deleteTestimonial: (id: string) => void;
  userRole: UserRole;
  isHydrated: boolean;
}

const LiveImageContext = createContext<LiveImageContextType | undefined>(
  undefined
);

export function LiveImageProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData: SiteData;
}) {
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(initialData.settings);
  const [projects, setProjects] = useState<MediaProject[]>(
    initialData.projects
  );
  const [bookings, setBookings] = useState<BookingRequest[]>(
    initialData.bookings
  );
  const [packages, setPackages] = useState<ServicePackage[]>(
    initialData.packages
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(
    initialData.testimonials
  );
  const { data: session } = useSession();
  // Role comes from the signed-in account; no session means least access
  const userRole: UserRole = session?.user?.role ?? "staff";
  const [isHydrated, setIsHydrated] = useState(false);

  // Latest values for saves that run after a state update
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const packagesRef = useRef(packages);
  packagesRef.current = packages;

  useEffect(() => setIsHydrated(true), []);

  // Fresh server data (after router.refresh or sign-in) replaces local state
  useEffect(() => {
    setSettings(initialData.settings);
    setProjects(initialData.projects);
    setBookings(initialData.bookings);
    setPackages(initialData.packages);
    setTestimonials(initialData.testimonials);
  }, [initialData]);

  // Changes show on screen straight away; if the server refuses one, tell the
  // admin and reload the real data so the screen matches the database.
  const persist = async <T,>(
    pending: Promise<ActionResult<T>>
  ): Promise<ActionResult<T>> => {
    let result: ActionResult<T>;
    try {
      result = await pending;
    } catch {
      result = { ok: false, error: "Could not reach the server. Please try again." };
    }
    if (!result.ok) {
      window.alert(result.error);
      router.refresh();
    }
    return result;
  };

  const updateSettings = (partial: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const saveSettings = async (partial?: Partial<SiteSettings>) => {
    const next = { ...settingsRef.current, ...partial };
    setSettings(next);
    return (await persist(actions.saveSettings(next))).ok;
  };

  const addProject = async (
    projectData: Omit<MediaProject, "id" | "uploadedAgo">
  ): Promise<MediaProject> => {
    const result = await persist(actions.createProject(projectData));
    if (!result.ok) throw new Error(result.error);
    const newProject: MediaProject = {
      ...projectData,
      id: result.data,
      uploadedAgo: "Today",
    };
    setProjects((prev) => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = (id: string, partial: Partial<MediaProject>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...partial } : p))
    );
    persist(actions.updateProject(id, partial));
  };

  const deleteProjects = (ids: string[]) => {
    setProjects((prev) => prev.filter((p) => !ids.includes(p.id)));
    persist(actions.deleteProjects(ids));
  };

  const bulkToggleFeature = (ids: string[], featured?: boolean) => {
    if (featured === undefined) {
      // Toggle each project individually
      projects
        .filter((p) => ids.includes(p.id))
        .forEach((p) =>
          updateProject(p.id, { featuredOnHome: !p.featuredOnHome })
        );
      return;
    }
    setProjects((prev) =>
      prev.map((p) =>
        ids.includes(p.id) ? { ...p, featuredOnHome: featured } : p
      )
    );
    persist(actions.updateProjects(ids, { featuredOnHome: featured }));
  };

  const bulkSetStatus = (ids: string[], status: PublishStatus) => {
    setProjects((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, status } : p))
    );
    persist(actions.updateProjects(ids, { status }));
  };

  const bulkMoveCategory = (ids: string[], category: MediaCategory) => {
    setProjects((prev) =>
      prev.map((p) => (ids.includes(p.id) ? { ...p, category } : p))
    );
    persist(actions.updateProjects(ids, { category }));
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
    // Only the owner's admin view lists bookings
    if (userRole === "owner") setBookings((prev) => [newBooking, ...prev]);
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    persist(actions.updateBookingStatus(id, status));
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
    persist(actions.deleteBooking(id));
  };

  const updatePackage = (id: string, partial: Partial<ServicePackage>) => {
    setPackages((prev) =>
      prev.map((pkg) => (pkg.id === id ? { ...pkg, ...partial } : pkg))
    );
  };

  const savePackage = async (id: string) => {
    const pkg = packagesRef.current.find((p) => p.id === id);
    if (!pkg) return false;
    const { id: _id, ...data } = pkg;
    return (await persist(actions.savePackage(id, data))).ok;
  };

  const addTestimonial = async (testimonial: Omit<Testimonial, "id">) => {
    const result = await persist(actions.addTestimonial(testimonial));
    if (result.ok) setTestimonials((prev) => [result.data, ...prev]);
    return result.ok;
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    persist(actions.deleteTestimonial(id));
  };

  return (
    <LiveImageContext.Provider
      value={{
        settings,
        updateSettings,
        saveSettings,
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
        savePackage,
        testimonials,
        addTestimonial,
        deleteTestimonial,
        userRole,
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
