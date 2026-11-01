"use client";

import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { useLenis } from "@/utils/lenis";
import { prefersReducedMotion } from "@/utils/motion";
import { navHeight, scrollBelowNav } from "@/utils/scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Space left between the navbar and a heading scrolled into place.
const HEADING_GAP = 24;

export default function TableOfContents({ items, variant }) {
  const [active, setActive] = useState(items[0]?.id);
  const [open, setOpen] = useState(false);
  const rail = useRef(null);
  const panel = useRef(null);

  const updateActive = () => {
    const line = navHeight() + HEADING_GAP;
    let current = items[0]?.id;
    for (const { id } of items) {
      const heading = document.getElementById(id);
      if (heading && heading.getBoundingClientRect().top - line <= 1) current = id;
    }
    setActive(current);
  };

  const lenis = useLenis(updateActive, [items]);

  useEffect(() => {
    const frame = requestAnimationFrame(updateActive);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rail: slide the indicator to the active entry.
  useGSAP(
    () => {
      if (variant !== "rail") return;
      const link = rail.current?.querySelector(`a[href="#${active}"]`);
      if (!link) return;
      gsap.to(".toc-indicator", {
        y: link.offsetTop,
        height: link.offsetHeight,
        duration: prefersReducedMotion() ? 0 : 0.35,
        ease: "power2.out",
      });
    },
    { dependencies: [active], scope: rail },
  );

  // Panel: animate its height open and closed.
  useGSAP(
    () => {
      if (variant !== "panel") return;
      const duration = prefersReducedMotion() ? 0 : 0.35;
      if (open) {
        gsap.set(panel.current, { display: "block" });
        gsap.fromTo(
          panel.current,
          { height: 0 },
          { height: "auto", duration, ease: "power2.out", onComplete: () => ScrollTrigger.refresh() },
        );
      } else {
        gsap.to(panel.current, {
          height: 0,
          duration,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(panel.current, { display: "none" });
            ScrollTrigger.refresh();
          },
        });
      }
    },
    { dependencies: [open], scope: panel },
  );

  const go = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    // Collapse the panel at once: it sits above the headings, so measuring
    // while it is open (or still closing) would overshoot by its height.
    if (panel.current) {
      gsap.killTweensOf(panel.current);
      gsap.set(panel.current, { height: 0, display: "none" });
    }
    setOpen(false);
    scrollBelowNav(lenis, target, { gap: HEADING_GAP, immediate: prefersReducedMotion() });
    window.history.replaceState(null, "", `#${id}`);
  };

  const isRail = variant === "rail";

  const list = (
    <ul className={isRail ? "toc-list relative space-y-2 border-l border-secondary-white" : "space-y-3 pb-4"}>
      {isRail && <li aria-hidden className="toc-indicator absolute -left-px top-0 w-0.5 bg-primary-blue" />}
      {items.map(({ id, text }) => {
        const isActive = active === id;
        const marker = isRail
          ? ""
          : `-ml-px border-l-2 ${isActive ? "border-primary-blue" : "border-transparent"}`;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => go(e, id)}
              aria-current={isActive ? "location" : undefined}
              className={`block pl-4 transition-colors ${marker} ${
                isActive ? "font-semibold text-primary-blue" : "hover:text-primary-blue"
              }`}
            >
              {text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (isRail) {
    return (
      <nav
        ref={rail}
        aria-label="On this page"
        className="sticky top-[calc(var(--nav-height)+1.5rem)] text-sm text-secondary-blue"
      >
        <p className="mb-3 text-xs font-semibold uppercase">On this page</p>
        {list}
      </nav>
    );
  }

  return (
    <nav aria-label="On this page" className="mb-8 border-y border-secondary-white text-secondary-blue lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="toc-panel-list"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between py-4 text-sm font-semibold uppercase"
      >
        On this page
        <FiChevronDown aria-hidden className={`motion-safe:transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id="toc-panel-list" ref={panel} className="hidden h-0 overflow-hidden" inert={!open}>
        {list}
      </div>
    </nav>
  );
}
