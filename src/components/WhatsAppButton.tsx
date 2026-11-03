"use client";

import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveImage } from "@/context/LiveImageContext";

export function WhatsAppButton() {
  const { settings } = useLiveImage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Only show floating WhatsApp icon after scrolling down past the first hero screen
      setVisible(window.scrollY > 380);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    "Hi Damith, I'd like to request a multi-camera production quote..."
  )}`;

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          initial={{ opacity: 0, y: 24, scale: 0.75 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.75 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          title="Chat on WhatsApp"
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-[#0B0B0E] flex items-center justify-center shadow-2xl shadow-black/80 border border-white/25 transition-transform hover:scale-110 active:scale-95"
        >
          <MessageCircle className="w-6 h-6 fill-current text-[#0B0B0E]" />
        </motion.a>
      )}
    </AnimatePresence>
  );
}
