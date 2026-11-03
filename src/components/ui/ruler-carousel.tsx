"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Rewind, FastForward } from "lucide-react";

export interface CarouselItem {
  id: number | string;
  title: string;
}

// Create infinite items by triplicating the array
const createInfiniteItems = (originalItems: CarouselItem[]) => {
  const items: Array<{
    id: string;
    title: string;
    originalIndex: number;
  }> = [];
  for (let i = 0; i < 3; i++) {
    originalItems.forEach((item, index) => {
      items.push({
        ...item,
        id: `${i}-${item.id}`,
        originalIndex: index,
      });
    });
  }
  return items;
};

const RulerLines = ({
  top = true,
  totalLines = 101,
}: {
  top?: boolean;
  totalLines?: number;
}) => {
  const lines = [];
  const lineSpacing = 100 / (totalLines - 1);

  for (let i = 0; i < totalLines; i++) {
    const isFifth = i % 5 === 0;
    const isCenter = i === Math.floor(totalLines / 2);

    let height = "h-2.5";
    let color = "bg-white/20";

    if (isCenter) {
      height = "h-7 sm:h-8";
      color = "bg-rec shadow-[0_0_10px_#E8332B]";
    } else if (isFifth) {
      height = "h-4";
      color = "bg-paper/75";
    }

    const positionClass = top ? "top-0" : "bottom-0";

    lines.push(
      <div
        key={i}
        className={`absolute w-[1.5px] rounded-full transition-colors ${height} ${color} ${positionClass}`}
        style={{ left: `${i * lineSpacing}%` }}
      />
    );
  }

  return <div className="relative w-full h-8 px-4 overflow-hidden">{lines}</div>;
};

export function RulerCarousel({
  originalItems,
  autoPlay = true,
  fullScreen = false,
}: {
  originalItems: CarouselItem[];
  autoPlay?: boolean;
  fullScreen?: boolean;
}) {
  const safeItems =
    originalItems.length > 0
      ? originalItems
      : [
          { id: 1, title: "RDB BANK" },
          { id: 2, title: "VOI FOODS" },
          { id: 3, title: "AI NATIONAL EXPO" },
          { id: 4, title: "CPL 2026" },
          { id: 5, title: "RIDEERAYAK LIVE" },
          { id: 6, title: "UDUGAMA PERAHARA" },
          { id: 7, title: "SWARNAVAHINI" },
          { id: 8, title: "ROYAL COLLEGE" },
          { id: 9, title: "SHANGRI-LA" },
        ];

  const infiniteItems = createInfiniteItems(safeItems);
  const itemsPerSet = safeItems.length;
  const initialOffset = Math.min(4, Math.floor(itemsPerSet / 2));

  // Start in the middle set
  const [activeIndex, setActiveIndex] = useState(itemsPerSet + initialOffset);
  const [isResetting, setIsResetting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const previousIndexRef = useRef(itemsPerSet + initialOffset);

  const handleItemClick = (newIndex: number) => {
    if (isResetting) return;

    const targetOriginalIndex =
      ((newIndex % itemsPerSet) + itemsPerSet) % itemsPerSet;

    const possibleIndices = [
      targetOriginalIndex,
      targetOriginalIndex + itemsPerSet,
      targetOriginalIndex + itemsPerSet * 2,
    ];

    let closestIndex = possibleIndices[0];
    let smallestDistance = Math.abs(possibleIndices[0] - activeIndex);

    for (const index of possibleIndices) {
      const distance = Math.abs(index - activeIndex);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestIndex = index;
      }
    }

    previousIndexRef.current = activeIndex;
    setActiveIndex(closestIndex);
  };

  const handlePrevious = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    if (isResetting) return;
    setActiveIndex((prev) => prev + 1);
  };

  // Auto-advance camera focus roller
  useEffect(() => {
    if (!autoPlay || isPaused || isResetting) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => prev + 1);
    }, 2800);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, isResetting]);

  // Handle seamless infinite loop wrapping
  useEffect(() => {
    if (isResetting) return;

    if (activeIndex < itemsPerSet) {
      setIsResetting(true);
      const t = setTimeout(() => {
        setActiveIndex((prev) => prev + itemsPerSet);
        setIsResetting(false);
      }, 280);
      return () => clearTimeout(t);
    } else if (activeIndex >= itemsPerSet * 2) {
      setIsResetting(true);
      const t = setTimeout(() => {
        setActiveIndex((prev) => prev - itemsPerSet);
        setIsResetting(false);
      }, 280);
      return () => clearTimeout(t);
    }
  }, [activeIndex, itemsPerSet, isResetting]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isResetting) return;
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => prev - 1);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((prev) => prev + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isResetting]);

  // Item slot width: 340px + 80px gap = 420px step
  const STEP = 420;
  const centerIndex = ( infiniteItems.length - 1 ) / 2;
  const targetX = (centerIndex - activeIndex) * STEP;

  const currentPage =
    (((activeIndex % itemsPerSet) + itemsPerSet) % itemsPerSet) + 1;
  const totalPages = itemsPerSet;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`w-full ${
        fullScreen ? "h-screen" : "py-8 sm:py-12"
      } flex flex-col items-center justify-center bg-transparent select-none`}
    >
      <div className="w-full h-[185px] sm:h-[210px] flex flex-col justify-between relative">
        {/* Top Camera Focus Ruler Lines */}
        <div className="flex items-center justify-center relative">
          <RulerLines top />
        </div>

        {/* Center Camera Roller Track */}
        <div className="flex items-center justify-center w-full flex-1 relative overflow-hidden">
          {/* Left & Right Edge Cinema Vignette Fade */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-44 bg-gradient-to-r from-night via-night/80 to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-44 bg-gradient-to-l from-night via-night/80 to-transparent z-10" />

          {/* Center Red Focus Hairline Indicator */}
          <div className="pointer-events-none absolute inset-y-2 left-1/2 -translate-x-1/2 w-[1px] bg-rec/25 z-0" />

          <motion.div
            className="flex items-center gap-[80px]"
            animate={{
              x: targetX,
            }}
            transition={
              isResetting
                ? { duration: 0 }
                : {
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                    mass: 0.9,
                  }
            }
          >
            {infiniteItems.map((item, index) => {
              const isActive = index === activeIndex;

              return (
                <motion.button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(index)}
                  className={`text-2xl sm:text-4xl md:text-5xl font-heading font-extrabold tracking-wider whitespace-nowrap cursor-pointer flex items-center justify-center transition-colors ${
                    isActive
                      ? "text-paper drop-shadow-[0_0_25px_rgba(232,51,43,0.35)]"
                      : "text-muted/40 hover:text-muted/75"
                  }`}
                  animate={{
                    scale: isActive ? 1 : 0.72,
                    opacity: isActive ? 1 : 0.35,
                  }}
                  transition={
                    isResetting
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        }
                  }
                  style={{
                    width: "340px",
                  }}
                >
                  {item.title}
                </motion.button>
              );
            })}
          </motion.div>
        </div>

        {/* Bottom Camera Focus Ruler Lines */}
        <div className="flex items-center justify-center relative">
          <RulerLines top={false} />
        </div>
      </div>

      {/* Camera Roller Transport Controls (Rewind / Page Counter / FastForward) */}
      <div className="flex items-center justify-center gap-5 mt-6">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={isResetting}
          className="w-9 h-9 rounded-full bg-stage border border-white/10 hover:border-rec/50 flex items-center justify-center cursor-pointer text-paper/80 hover:text-rec transition"
          aria-label="Previous client"
        >
          <Rewind className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5 font-mono text-xs px-3.5 py-1.5 rounded-full bg-stage/80 border border-white/10">
          <span className="w-1.5 h-1.5 rounded-full bg-rec animate-pulse mr-1" />
          <span className="font-bold text-paper">
            {currentPage.toString().padStart(2, "0")}
          </span>
          <span className="text-muted/60">/</span>
          <span className="font-medium text-muted">
            {totalPages.toString().padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          onClick={handleNext}
          disabled={isResetting}
          className="w-9 h-9 rounded-full bg-stage border border-white/10 hover:border-rec/50 flex items-center justify-center cursor-pointer text-paper/80 hover:text-rec transition"
          aria-label="Next client"
        >
          <FastForward className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
