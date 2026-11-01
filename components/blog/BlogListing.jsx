"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import BlogListingView from "./BlogListingView";
import { PAGE_SIZE, resolveTag } from "@/lib/blog/posts";
import { useLenis } from "@/utils/lenis";
import { navHeight, scrollBelowNav } from "@/utils/scroll";

const SEARCH_DELAY = 250;

// Space left between the navbar and the top of the grid after scrolling to it.
const GRID_GAP = 24;

export default function BlogListing({ summaries, tags }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lenis = useLenis();

  const tag = resolveTag(searchParams.get("tag"), tags);
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const [limit, setLimit] = useState(PAGE_SIZE);

  const container = useRef(null);
  const timer = useRef(null);
  const tagRef = useRef(tag);
  const scrollPending = useRef(false);

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

  const handleTag = (slug) => {
    if (slug === tag) return;
    setLimit(PAGE_SIZE);
    scrollPending.current = true;
    writeUrl(slug, q);
  };

  const handleQuery = (value) => {
    setLimit(PAGE_SIZE);
    setQ(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => writeUrl(tagRef.current, value), SEARCH_DELAY);
  };

  const handleClear = () => {
    setLimit(PAGE_SIZE);
    clearTimeout(timer.current);
    setQ("");
    writeUrl(null, "");
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
