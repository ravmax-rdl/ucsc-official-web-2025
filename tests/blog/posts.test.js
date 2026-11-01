import { test } from "node:test";
import assert from "node:assert/strict";

import {
  PAGE_SIZE,
  countLabel,
  filterPosts,
  formatDate,
  getListingState,
  getToc,
  normalizeText,
  pickFeatured,
  readingTime,
  resolveTag,
  sortPosts,
  toSummary,
  withHeadingIds,
} from "../../lib/blog/posts.js";

const words = (n) => Array.from({ length: n }, () => "word").join(" ");
const tags = [
  { slug: "tech", label: "Tech" },
  { slug: "workshops", label: "Workshops" },
];
const makeSummary = (overrides = {}) => ({
  slug: "post",
  title: "Post",
  date: "2024-01-01",
  excerpt: "",
  tags: [{ slug: "tech", label: "Tech" }],
  author: null,
  featured: false,
  ...overrides,
});

test("formatDate matches the Past Events style", () => {
  assert.equal(formatDate("2024-09-02"), "Sep 02 2024");
  assert.equal(formatDate("2024-10-26"), "Oct 26 2024");
});

test("readingTime rounds up at 200 words a minute, minimum 1", () => {
  assert.equal(readingTime([{ type: "p", text: words(450) }]), 3);
  assert.equal(readingTime([{ type: "divider" }]), 1);
});

test("readingTime counts every text-bearing block", () => {
  const body = [
    { type: "h2", text: words(50) },
    { type: "quote", text: words(50), cite: "x" },
    { type: "list", items: [words(50)] },
    { type: "callout", title: "t", text: words(48) },
    { type: "code", code: words(1) },
    { type: "image", src: "/a.webp", alt: "a", caption: words(1) },
  ];
  // 50 + 51 + 50 + 49 + 1 + 1 = 202 words → 2 minutes
  assert.equal(readingTime(body), 2);
});

test("withHeadingIds gives h2 headings unique, readable ids", () => {
  const body = [
    { type: "h2", text: "Results" },
    { type: "p", text: "x" },
    { type: "h2", text: "Results" },
    { type: "h2", text: "Ünïcode & More!" },
    { type: "h2", text: "Results 2" },
  ];
  const result = withHeadingIds(body);
  assert.deepEqual(
    result.filter((b) => b.type === "h2").map((b) => b.id),
    ["results", "results-2", "unicode-more", "results-2-2"],
  );
  assert.equal(body[0].id, undefined, "input is not mutated");
  assert.equal(result[1], body[1], "non-heading blocks are passed through");
});

test("getToc lists h2 headings with their ids", () => {
  assert.deepEqual(
    getToc([{ type: "h2", text: "The setup" }, { type: "h3", text: "Detail" }]),
    [{ id: "the-setup", text: "The setup" }],
  );
});

test("normalizeText folds case and accents", () => {
  assert.equal(normalizeText("  Café ÉVENT "), "cafe event");
});

test("toSummary derives display fields and drops the body", () => {
  const summary = toSummary(
    {
      slug: "a",
      title: "A",
      date: "2024-10-26",
      excerpt: "e",
      image: "/i.webp",
      imageAlt: "alt",
      tags: ["workshops"],
      body: [{ type: "p", text: words(10) }],
    },
    tags,
  );
  assert.equal(summary.displayDate, "Oct 26 2024");
  assert.equal(summary.imageFocus, "50% 50%");
  assert.deepEqual(summary.tags, [{ slug: "workshops", label: "Workshops" }]);
  assert.equal(summary.author, null);
  assert.equal(summary.featured, false);
  assert.equal(summary.readingTime, 1);
  assert.equal("body" in summary, false);
});

test("sortPosts puts newest first and breaks ties by title", () => {
  const sorted = sortPosts([
    makeSummary({ slug: "old", date: "2023-01-01" }),
    makeSummary({ slug: "b", title: "B", date: "2024-05-01" }),
    makeSummary({ slug: "a", title: "A", date: "2024-05-01" }),
  ]);
  assert.deepEqual(sorted.map((p) => p.slug), ["a", "b", "old"]);
});

test("pickFeatured prefers the flag, then the newest", () => {
  const newest = makeSummary({ slug: "new" });
  const flagged = makeSummary({ slug: "flag", featured: true });
  assert.equal(pickFeatured([newest, flagged]), flagged);
  assert.equal(pickFeatured([newest]), newest);
  assert.equal(pickFeatured([]), null);
});

test("resolveTag accepts known tags in any case and rejects the rest", () => {
  assert.equal(resolveTag("workshops", tags), "workshops");
  assert.equal(resolveTag("WORKSHOPS", tags), "workshops");
  assert.equal(resolveTag("nope", tags), null);
  assert.equal(resolveTag(null, tags), null);
});

test("filterPosts by tag, by search, and by both", () => {
  const posts = [
    makeSummary({ slug: "x", title: "IEEEXtreme recap", tags: [{ slug: "tech", label: "Tech" }] }),
    makeSummary({ slug: "w", title: "Figma basics", tags: [{ slug: "workshops", label: "Workshops" }] }),
    makeSummary({ slug: "c", title: "Café meetup", excerpt: "Members met", author: { name: "Media Team" } }),
  ];
  const slugs = (list) => list.map((p) => p.slug);
  assert.deepEqual(slugs(filterPosts(posts, { tag: "workshops" })), ["w"]);
  assert.deepEqual(slugs(filterPosts(posts, { q: "xtreme" })), ["x"]);
  assert.deepEqual(slugs(filterPosts(posts, { q: "WORKSHOPS" })), ["w"], "tag labels match");
  assert.deepEqual(slugs(filterPosts(posts, { q: "media team" })), ["c"], "author matches");
  assert.deepEqual(slugs(filterPosts(posts, { q: "cafe" })), ["c"], "accents fold");
  assert.deepEqual(slugs(filterPosts(posts, { tag: "tech", q: "figma" })), []);
  assert.deepEqual(slugs(filterPosts(posts, {})), ["x", "w", "c"]);
});

test("getListingState shows the featured post only when not filtering", () => {
  const posts = Array.from({ length: 12 }, (_, i) =>
    makeSummary({ slug: `p${i}`, title: `Post ${i}`, featured: i === 3 }),
  );
  const all = getListingState(posts, { limit: PAGE_SIZE });
  assert.equal(all.featured.slug, "p3");
  assert.equal(all.visible.some((p) => p.slug === "p3"), false);
  assert.equal(all.visible.length, 9);
  assert.equal(all.hasMore, true);
  assert.equal(all.count, 12);

  const more = getListingState(posts, { limit: 18 });
  assert.equal(more.visible.length, 11);
  assert.equal(more.hasMore, false);

  const filtered = getListingState(posts, { tag: "tech", limit: PAGE_SIZE });
  assert.equal(filtered.featured, null);
  assert.equal(filtered.count, 12);
});

test("a whitespace-only query is not filtering", () => {
  const posts = [makeSummary({ slug: "a" }), makeSummary({ slug: "b" })];
  assert.equal(getListingState(posts, { q: "   " }).featured.slug, "a");
});

test("a search matching only the featured post shows it as a card", () => {
  const posts = [
    makeSummary({ slug: "f", title: "Featured story", featured: true }),
    makeSummary({ slug: "o", title: "Other" }),
  ];
  const state = getListingState(posts, { q: "featured story" });
  assert.equal(state.featured, null);
  assert.deepEqual(state.visible.map((p) => p.slug), ["f"]);
  assert.equal(state.count, 1);
});

test("countLabel wording", () => {
  assert.equal(countLabel({ count: 12 }), "12 posts");
  assert.equal(countLabel({ count: 1 }), "1 post");
  assert.equal(countLabel({ count: 3, tagLabel: "Workshops" }), "3 posts in Workshops");
  assert.equal(countLabel({ count: 2, q: " xtreme " }), '2 results for "xtreme"');
  assert.equal(countLabel({ count: 1, q: "x", tagLabel: "Tech" }), '1 result for "x" in Tech');
});
