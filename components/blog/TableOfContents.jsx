"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { FiChevronDown } from "react-icons/fi";

import { useLenis } from "@/utils/lenis";
import { prefersReducedMotion } from "@/utils/motion";
import { navHeight, scrollBelowNav } from "@/utils/scroll";

// Space left between the navbar and a heading scrolled into place.
const HEADING_GAP = 24;

export default function TableOfContents({ items, variant }) {
  const [active, setActive] = useState(items[0]?.id);
  const [open, setOpen] = useState(false);

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

  const go = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    // Close the panel first: it sits above the headings, so measuring while it
    // is open would overshoot by its height.
    flushSync(() => setOpen(false));
    scrollBelowNav(lenis, target, { gap: HEADING_GAP, immediate: prefersReducedMotion() });
    window.history.replaceState(null, "", `#${id}`);
  };

  const list = (
    <ul className={variant === "rail" ? "toc-list relative space-y-2 border-l border-secondary-white" : "space-y-3 pb-4"}>
      {items.map(({ id, text }) => {
        const isActive = active === id;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={(e) => go(e, id)}
              aria-current={isActive ? "location" : undefined}
              className={`block -ml-px border-l-2 pl-4 transition-colors ${
                isActive
                  ? "border-primary-blue font-semibold text-primary-blue"
                  : "border-transparent hover:text-primary-blue"
              }`}
            >
              {text}
            </a>
          </li>
        );
      })}
    </ul>
  );

  if (variant === "rail") {
    return (
      <nav
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
      <div id="toc-panel-list" hidden={!open}>
        {list}
      </div>
    </nav>
  );
}
