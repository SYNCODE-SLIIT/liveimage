"use client";

import React from "react";

interface LiveImageLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  adminBadge?: boolean;
}

export function LiveImageLogo({
  className = "",
  size = "md",
  adminBadge = false,
}: LiveImageLogoProps) {
  const dimensions = {
    sm: "h-8 sm:h-9",
    md: "h-10 sm:h-11",
    lg: "h-12 sm:h-14",
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      <img
        src="/liveimage-logo-transparent.png"
        alt="LIVE IMAGE LK"
        className={`${dimensions} w-auto object-contain`}
      />

      {adminBadge && (
        <span className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-[10px] font-heading font-bold tracking-widest uppercase text-muted">
          ADMIN
        </span>
      )}
    </div>
  );
}
