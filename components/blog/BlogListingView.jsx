"use client";

import BlogCard from "./BlogCard";
import FeaturedPost from "./FeaturedPost";
import SearchField from "./SearchField";
import TagChips from "./TagChips";
import { PAGE_SIZE, countLabel, getListingState } from "@/lib/blog/posts";

const buttonClass =
  "rounded-sm border border-primary-blue px-6 py-2 text-sm font-semibold uppercase text-primary-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue";

export default function BlogListingView({
  summaries,
  tags,
  tag = null,
  q = "",
  limit = PAGE_SIZE,
  onTagChange,
  onQueryChange,
  onClear,
  onLoadMore,
}) {
  const { featured, visible, hasMore, count } = getListingState(summaries, { tag, q, limit });
  const tagLabel = tags.find((t) => t.slug === tag)?.label ?? null;

  return (
    <div className="mx-auto max-w-7xl px-6 text-secondary-blue md:px-16">
      <header className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1 className="blog-heading text-6xl font-semibold leading-none md:text-8xl">
          Blog
        </h1>
        <SearchField value={q} onChange={onQueryChange} />
      </header>

      {featured && <FeaturedPost post={featured} />}

      <div
        data-blog-grid-top
        className="mb-6 mt-10 flex scroll-mt-28 flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between"
      >
        <TagChips tags={tags} active={tag} onChange={onTagChange} />
        <p aria-live="polite" className="shrink-0 text-sm">
          {countLabel({ count, tagLabel, q })}
        </p>
      </div>

      {visible.length > 0 ? (
        <ul className="blog-grid grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((post) => (
            <li key={post.slug} data-flip-id={post.slug} className="blog-card">
              <BlogCard post={post} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="space-y-4 py-24 text-center">
          <p className="text-lg">No posts match your search.</p>
          <button type="button" onClick={onClear} className={`${buttonClass} hover:bg-primary-blue/10`}>
            Clear filters
          </button>
        </div>
      )}

      {hasMore && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className={`load-more ${buttonClass} bg-[linear-gradient(var(--color-primary-blue),var(--color-primary-blue))] bg-no-repeat bg-[length:0%_100%] motion-safe:transition-[background-size,color] motion-safe:duration-300 hover:bg-[length:100%_100%] hover:text-primary-white`}
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
