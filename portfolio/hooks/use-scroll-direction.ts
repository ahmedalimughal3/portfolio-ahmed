"use client";

import { useEffect, useState } from "react";

export function useScrollDirection() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let previousY = window.scrollY;
    let scheduled = false;

    const updateVisibility = () => {
      const currentY = window.scrollY;
      if (currentY < 48 || currentY < previousY - 8) {
        setIsVisible(true);
      } else if (currentY > previousY + 8) {
        setIsVisible(false);
      }
      previousY = currentY;
      scheduled = false;
    };

    const handleScroll = () => {
      if (!scheduled) {
        window.requestAnimationFrame(updateVisibility);
        scheduled = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return isVisible;
}
