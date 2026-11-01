"use client";

import { useEffect } from "react";

import { useLenis } from "@/utils/lenis";

// Stops Lenis while body.no-scroll is set (page wipe, Preloader). The CSS class
// only hides the scrollbar; Lenis scrolls the page itself, so it has to stop too.
export default function ScrollLock() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const sync = () =>
      document.body.classList.contains("no-scroll") ? lenis.stop() : lenis.start();
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [lenis]);

  return null;
}
