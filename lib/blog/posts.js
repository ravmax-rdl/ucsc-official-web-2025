import { inlineToPlain } from "./inline.js";

export const PAGE_SIZE = 9;

// Titles longer than this get a smaller type size in the image heroes.
export const LONG_TITLE = 60;

const WORDS_PER_MINUTE = 200;
const DEFAULT_FOCUS = "50% 50%";
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const normalizeText = (text = "") =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

export const formatDate = (iso) => {
  const [year, month, day] = iso.split("-");
  return `${MONTHS[Number(month) - 1]} ${day} ${year}`;
};

const blockText = (block) => {
  switch (block.type) {
    case "p":
      return inlineToPlain(block.text);
    case "h2":
    case "h3":
      return block.text;
    case "quote":
      return `${inlineToPlain(block.text)} ${block.cite ?? ""}`;
    case "list":
      return block.items.map(inlineToPlain).join(" ");
    case "callout":
      return `${block.title ?? ""} ${inlineToPlain(block.text)}`;
    case "code":
      return block.code;
    case "image":
    case "gallery":
      return block.caption ? inlineToPlain(block.caption) : "";
    default:
      return "";
  }
};

export const readingTime = (body) => {
  const count = body.map(blockText).join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(count / WORDS_PER_MINUTE));
};

const slugify = (text) =>
  normalizeText(text).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";

export const withHeadingIds = (body) => {
  const used = new Set();
  return body.map((block) => {
    if (block.type !== "h2") return block;
    const base = slugify(block.text);
    let id = base;
    for (let n = 2; used.has(id); n += 1) id = `${base}-${n}`;
    used.add(id);
    return { ...block, id };
  });
};

export const getToc = (body) =>
  withHeadingIds(body)
    .filter((block) => block.type === "h2")
    .map(({ id, text }) => ({ id, text }));

export const toSummary = (post, tags) => {
  const labels = new Map(tags.map((tag) => [tag.slug, tag.label]));
  return {
    slug: post.slug,
    title: post.title,
    date: post.date,
    displayDate: formatDate(post.date),
    excerpt: post.excerpt,
    image: post.image,
    imageAlt: post.imageAlt,
    imageFocus: post.imageFocus ?? DEFAULT_FOCUS,
    tags: post.tags.map((slug) => ({ slug, label: labels.get(slug) ?? slug })),
    author: post.author ?? null,
    featured: Boolean(post.featured),
    readingTime: readingTime(post.body),
  };
};

export const sortPosts = (posts) =>
  [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

// Expects a list already sorted newest first.
export const pickFeatured = (sorted) => sorted.find((post) => post.featured) ?? sorted[0] ?? null;

export const resolveTag = (param, tags) => {
  const slug = param?.toLowerCase();
  return slug && tags.some((tag) => tag.slug === slug) ? slug : null;
};

export const filterPosts = (summaries, { tag = null, q = "" } = {}) => {
  const query = normalizeText(q);
  return summaries.filter((post) => {
    if (tag && !post.tags.some((t) => t.slug === tag)) return false;
    if (!query) return true;
    const haystack = [post.title, post.excerpt, ...post.tags.map((t) => t.label), post.author?.name ?? ""];
    return normalizeText(haystack.join(" ")).includes(query);
  });
};

export const getListingState = (summaries, { tag = null, q = "", limit = PAGE_SIZE } = {}) => {
  const filtering = Boolean(tag) || normalizeText(q) !== "";
  const featured = filtering ? null : pickFeatured(summaries);
  const matches = filterPosts(summaries, { tag, q }).filter((post) => post.slug !== featured?.slug);
  return {
    featured,
    visible: matches.slice(0, limit),
    hasMore: matches.length > limit,
    count: matches.length + (featured ? 1 : 0),
  };
};

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

export const countLabel = ({ count, tagLabel = null, q = "" }) => {
  const query = q.trim();
  const base = query ? `${plural(count, "result")} for "${query}"` : plural(count, "post");
  return tagLabel ? `${base} in ${tagLabel}` : base;
};
