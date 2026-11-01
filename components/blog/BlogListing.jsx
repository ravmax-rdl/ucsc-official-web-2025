"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import BlogListingView from "./BlogListingView";
import { PAGE_SIZE, getListingState, resolveTag } from "@/lib/blog/posts";
import { useLenis } from "@/utils/lenis";
import { onPageReady, prefersReducedMotion } from "@/utils/motion";
import { navHeight, scrollBelowNav } from "@/utils/scroll";

gsap.registerPlugin(Flip, ScrollTrigger, useGSAP);

const SEARCH_DELAY = 250;

// Space left between the navbar and the top of the grid after scrolling to it.
const GRID_GAP = 24;

const FLIP_TARGETS = ".blog-card, .featured-post, [data-chip-indicator]";

export default function BlogListing({ summaries, tags }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenis = useLenis();

  const tag = resolveTag(searchParams.get("tag"), tags);
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const [limit, setLimit] = useState(PAGE_SIZE);
  const hasFeatured = getListingState(summaries, { tag, q, limit }).featured !== null;

  const container = useRef(null);
  const timer = useRef(null);
  const tagRef = useRef(tag);
  const scrollPending = useRef(false);
  const flipState = useRef(null);
  const exitTween = useRef(null);
  const firstRender = useRef(true);

  const { contextSafe } = useGSAP({ scope: container });

  // Cards fade and rise in as they scroll into view.
  const revealCards = contextSafe((cards) => {
    if (cards.length === 0) return;
    if (prefersReducedMotion()) {
      gsap.fromTo(cards, { opacity: 0 }, { opacity: 1, duration: 0.2 });
      return;
    }
    gsap.set(cards, { opacity: 0, y: 32 });
    ScrollTrigger.batch(cards, {
      once: true,
      start: "top 92%",
      onEnter: (batch) =>
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }),
    });
  });

  // Cards not yet animated; marks them so they are only animated once.
  const takeNewCards = () => {
    const fresh = gsap.utils.toArray(".blog-card:not([data-entered])", container.current);
    fresh.forEach((card) => card.setAttribute("data-entered", ""));
    return fresh;
  };

  // Entrance. Through the page wipe the page is still covered at mount, so the
  // cards are hidden now and revealed once the wipe has lifted. On a direct
  // load the static HTML is already on screen: only cards below the fold animate.
  useGSAP(
    (context, safe) => {
      const cards = takeNewCards();
      const covered = document.body.classList.contains("no-scroll");

      if (!covered) {
        revealCards(cards.filter((card) => card.getBoundingClientRect().top > window.innerHeight));
        return;
      }

      const reduced = prefersReducedMotion();
      if (reduced) gsap.set(".featured-post", { opacity: 0 });
      gsap.set(cards, { opacity: 0 });

      return onPageReady(
        safe(() => {
          if (reduced) gsap.to(".featured-post", { opacity: 1, duration: 0.2 });
          revealCards(cards);
        }),
      );
    },
    { scope: container },
  );

  // Featured image parallax, set up again whenever the featured post re-mounts.
  useGSAP(
    () => {
      if (!hasFeatured || prefersReducedMotion()) return;
      gsap.fromTo(
        ".featured-media",
        { yPercent: -8 },
        {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: ".featured-post", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { dependencies: [hasFeatured], scope: container },
  );

  // Flip the grid after a filter or search change.
  useLayoutEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const state = flipState.current;
    flipState.current = null;
    // Cards rendered by this change are handled by Flip, not by revealCards.
    takeNewCards();
    if (!state) return;

    Flip.from(state, {
      targets: container.current.querySelectorAll(FLIP_TARGETS),
      duration: 0.5,
      ease: "power2.inOut",
      absolute: true,
      onEnter: (elements) =>
        gsap.fromTo(elements, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  }, [tag, q]);

  // "Load more": new cards rise in. PAGE_SIZE is the initial or reset state.
  useGSAP(
    () => {
      if (limit === PAGE_SIZE) return;
      revealCards(takeNewCards());
      ScrollTrigger.refresh();
    },
    { dependencies: [limit], scope: container, revertOnUpdate: false },
  );

  // Scroll after the filtered grid has rendered: filtering removes the featured
  // post above the grid, so a target measured before the render is wrong.
  useEffect(() => {
    tagRef.current = tag;
    if (!scrollPending.current) return;
    scrollPending.current = false;

    const top = container.current?.querySelector("[data-blog-grid-top]");
    // Only scroll when the top of the grid is hidden under the navbar.
    if (!top || top.getBoundingClientRect().top >= navHeight()) return;
    scrollBelowNav(lenis, top, { gap: GRID_GAP });
  }, [tag, lenis]);

  useEffect(() => () => clearTimeout(timer.current), []);

  // Native history calls stay in sync with useSearchParams and don't refetch the page.
  const writeUrl = (nextTag, nextQ) => {
    const params = new URLSearchParams();
    if (nextTag) params.set("tag", nextTag);
    if (nextQ.trim()) params.set("q", nextQ.trim());
    const query = params.toString();
    window.history.replaceState(null, "", query ? `${pathname}?${query}` : pathname);
  };

  const captureFlip = () => {
    if (!prefersReducedMotion()) {
      flipState.current = Flip.getState(container.current.querySelectorAll(FLIP_TARGETS));
    }
  };

  const fadeOut = contextSafe((elements, onComplete) =>
    gsap.to(elements, { opacity: 0, scale: 0.95, duration: 0.25, ease: "power1.in", onComplete }),
  );

  // Tag changes and clearing: fade out what is leaving, then commit. A newer
  // change cancels an exit still in progress, so the last click wins.
  const withExit = (next, commit) => {
    if (exitTween.current) {
      const targets = exitTween.current.targets();
      exitTween.current.kill();
      exitTween.current = null;
      gsap.set(targets, { clearProps: "opacity,scale" });
    }
    if (prefersReducedMotion()) return commit();

    const { featured, visible } = getListingState(summaries, { ...next, limit: PAGE_SIZE });
    const staying = new Set(visible.map((post) => post.slug));
    const leaving = gsap.utils
      .toArray(".blog-card", container.current)
      .filter((card) => !staying.has(card.dataset.flipId));
    const featuredEl = container.current.querySelector(".featured-post");
    if (featuredEl && !featured) leaving.unshift(featuredEl);
    if (leaving.length === 0) {
      captureFlip();
      return commit();
    }
    exitTween.current = fadeOut(leaving, () => {
      exitTween.current = null;
      captureFlip();
      commit();
    });
  };

  const handleTag = (slug) => {
    if (slug === tag) return;
    withExit({ tag: slug, q }, () => {
      setLimit(PAGE_SIZE);
      scrollPending.current = true;
      writeUrl(slug, q);
    });
  };

  const handleQuery = (value) => {
    captureFlip();
    setLimit(PAGE_SIZE);
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => writeUrl(tagRef.current, value), SEARCH_DELAY);
  };

  const handleClear = () => {
    withExit({ tag: null, q: "" }, () => {
      clearTimeout(timer.current);
      setQ("");
      setLimit(PAGE_SIZE);
      writeUrl(null, "");
    });
  };

  const handleLoadMore = () => {
    const first = limit; // index of the first new card
    setLimit((current) => current + PAGE_SIZE);
    requestAnimationFrame(() => {
      container.current?.querySelectorAll(".blog-card a")[first]?.focus({ preventScroll: true });
    });
  };

  return (
    <div ref={container}>
      <BlogListingView
        summaries={summaries}
        tags={tags}
        tag={tag}
        q={q}
        limit={limit}
        onTagChange={handleTag}
        onQueryChange={handleQuery}
        onClear={handleClear}
        onLoadMore={handleLoadMore}
      />
    </div>
  );
}
