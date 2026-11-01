import { parseInline } from "./inline.js";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const REQUIRED_FIELDS = ["slug", "title", "date", "excerpt", "image", "imageAlt"];

// Required text fields and inline-formatted fields for each block type.
const BLOCKS = {
  p: { required: ["text"], inline: ["text"] },
  h2: { required: ["text"] },
  h3: { required: ["text"] },
  image: { required: ["src", "alt"], inline: ["caption"] },
  gallery: { required: [], inline: ["caption"] },
  quote: { required: ["text"], inline: ["text"] },
  list: { required: [] },
  code: { required: ["code"] },
  callout: { required: ["text"], inline: ["text"] },
  divider: { required: [] },
};

const isFilled = (value) => typeof value === "string" && value.trim() !== "";

const isRealDate = (value) => {
  if (!ISO_DATE.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
};

const unsafeLinks = (tokens) =>
  tokens.flatMap((token) => {
    if (token.type === "link") return token.safe ? [] : [token.href];
    return token.children ? unsafeLinks(token.children) : [];
  });

export function validatePosts(posts, tags, { imageExists, postFiles } = {}) {
  const errors = [];

  const tagSlugs = new Set();
  for (const tag of tags) {
    if (tagSlugs.has(tag.slug)) errors.push(`tags.js: duplicate tag "${tag.slug}"`);
    tagSlugs.add(tag.slug);
  }

  const slugs = new Set();
  const featured = [];

  posts.forEach((post, index) => {
    const label = isFilled(post.slug) ? post.slug : `post #${index + 1}`;
    const report = (message) => errors.push(`${label}: ${message}`);

    const checkImage = (field, src) => {
      if (!isFilled(src)) return;
      if (!src.startsWith("/")) {
        report(`${field} must start with "/" (a path under public/)`);
      } else if (imageExists && !imageExists(src)) {
        report(`${field}: image file not found: ${src}`);
      }
    };
    const checkInline = (field, text) => {
      if (typeof text !== "string") return;
      for (const href of unsafeLinks(parseInline(text))) {
        report(`${field}: link "${href}" is not allowed`);
      }
    };

    for (const field of REQUIRED_FIELDS) {
      if (!isFilled(post[field])) report(`${field} is required`);
    }

    if (isFilled(post.slug)) {
      if (!SLUG.test(post.slug)) report("slug must be lowercase letters, numbers and single hyphens");
      if (slugs.has(post.slug)) report(`duplicate slug "${post.slug}"`);
      slugs.add(post.slug);
    }
    if (isFilled(post.date) && !isRealDate(post.date)) {
      report(`date must be a real date in YYYY-MM-DD form, got "${post.date}"`);
    }
    checkImage("image", post.image);

    if (!Array.isArray(post.tags) || post.tags.length === 0) {
      report("tags must list at least one tag");
    } else {
      post.tags.forEach((tag, i) => {
        if (!tagSlugs.has(tag)) report(`tags[${i}]: unknown tag "${tag}"`);
      });
    }

    if (post.imageFocus !== undefined && !isFilled(post.imageFocus)) {
      report('imageFocus must be a CSS object-position value such as "50% 30%"');
    }
    if (post.author !== undefined && !isFilled(post.author?.name)) {
      report("author.name is required when author is set");
    }
    if (post.featured) featured.push(label);

    if (!Array.isArray(post.body) || post.body.length === 0) {
      report("body must contain at least one block");
      return;
    }

    post.body.forEach((block, i) => {
      const at = `body[${i}]`;
      const rule = BLOCKS[block?.type];
      if (!rule) {
        report(`${at}: unknown block type "${block?.type}"`);
        return;
      }
      for (const field of rule.required) {
        if (!isFilled(block[field])) report(`${at}.${field} is required`);
      }
      for (const field of rule.inline ?? []) checkInline(`${at}.${field}`, block[field]);

      if (block.type === "image") checkImage(`${at}.src`, block.src);

      if (block.type === "gallery") {
        const images = Array.isArray(block.images) ? block.images : [];
        if (images.length < 2 || images.length > 4) {
          report(`${at}: gallery needs 2–4 images, got ${images.length}`);
        }
        images.forEach((image, j) => {
          if (!isFilled(image?.src)) report(`${at}.images[${j}].src is required`);
          if (!isFilled(image?.alt)) report(`${at}.images[${j}].alt is required`);
          checkImage(`${at}.images[${j}].src`, image?.src);
        });
      }

      if (block.type === "list") {
        if (!Array.isArray(block.items) || block.items.length === 0) {
          report(`${at}.items must list at least one item`);
        } else {
          block.items.forEach((item, j) => {
            if (!isFilled(item)) report(`${at}.items[${j}] must be non-empty text`);
            checkInline(`${at}.items[${j}]`, item);
          });
        }
      }
    });
  });

  if (featured.length > 1) {
    errors.push(`only one post can be featured, found: ${featured.join(", ")}`);
  }

  if (postFiles) {
    const files = new Set(postFiles);
    for (const file of postFiles) {
      if (!slugs.has(file)) {
        errors.push(
          `content/blog/posts/${file}.js is not listed in content/blog/index.js (or its slug differs from the file name)`,
        );
      }
    }
    for (const slug of slugs) {
      if (!files.has(slug)) {
        errors.push(`${slug}: no file content/blog/posts/${slug}.js (the slug must match the file name)`);
      }
    }
  }

  return errors;
}
