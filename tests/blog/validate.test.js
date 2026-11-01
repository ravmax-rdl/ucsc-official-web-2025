import { test } from "node:test";
import assert from "node:assert/strict";

import { validatePosts } from "../../lib/blog/validate.js";

const tags = [
  { slug: "tech", label: "Tech" },
  { slug: "community", label: "Community" },
];
const makePost = (overrides = {}) => ({
  slug: "hello-world",
  title: "Hello",
  date: "2024-10-26",
  excerpt: "Excerpt",
  image: "/images/blog/hello-world/cover.webp",
  imageAlt: "Alt",
  tags: ["tech"],
  body: [{ type: "p", text: "Hi" }],
  ...overrides,
});
const run = (posts, options = {}, tagList = tags) =>
  validatePosts(posts, tagList, { imageExists: () => true, ...options });
const assertError = (errors, pattern) =>
  assert.ok(
    errors.some((error) => pattern.test(error)),
    `expected ${pattern} in:\n${errors.join("\n") || "(no errors)"}`,
  );

test("a valid post has no errors", () => {
  assert.deepEqual(run([makePost()]), []);
});

test("every block type validates", () => {
  const body = [
    { type: "p", text: "A **b** [c](/blog/)" },
    { type: "h2", text: "Heading" },
    { type: "h3", text: "Sub" },
    { type: "image", src: "/images/a.webp", alt: "a", caption: "*cap*" },
    { type: "gallery", images: [{ src: "/images/a.webp", alt: "a" }, { src: "/images/b.webp", alt: "b" }] },
    { type: "quote", text: "Quote", cite: "Someone" },
    { type: "list", ordered: true, items: ["one", "two"] },
    { type: "code", language: "js", code: "let a = 1;" },
    { type: "callout", title: "Note", text: "Text" },
    { type: "divider" },
  ];
  const post = makePost({ body, author: { name: "Media Team" }, imageFocus: "50% 30%", featured: true });
  assert.deepEqual(run([post]), []);
});

test("required fields", () => {
  assertError(run([makePost({ title: "" })]), /^hello-world: title is required$/);
  assertError(run([makePost({ slug: undefined })]), /^post #1: slug is required$/);
});

test("slug format and uniqueness", () => {
  assertError(run([makePost({ slug: "Hello World" })]), /slug must be lowercase/);
  assertError(run([makePost(), makePost()]), /duplicate slug "hello-world"/);
});

test("dates must be real ISO dates", () => {
  assertError(run([makePost({ date: "2024-02-30" })]), /date must be a real date/);
  assertError(run([makePost({ date: "26 Oct 2024" })]), /date must be a real date/);
});

test("tags must exist and be listed", () => {
  assertError(run([makePost({ tags: ["news"] })]), /tags\[0\]: unknown tag "news"/);
  assertError(run([makePost({ tags: [] })]), /tags must list at least one tag/);
  assertError(run([makePost()], {}, [...tags, { slug: "tech", label: "Again" }]), /duplicate tag "tech"/);
});

test("only one post can be featured", () => {
  const errors = run([makePost({ featured: true }), makePost({ slug: "second", featured: true })]);
  assertError(errors, /only one post can be featured, found: hello-world, second/);
});

test("optional fields must be well formed when present", () => {
  assertError(run([makePost({ author: { role: "Chair" } })]), /author\.name is required/);
  assertError(run([makePost({ imageFocus: "" })]), /imageFocus must be/);
});

test("body blocks", () => {
  assertError(run([makePost({ body: [] })]), /body must contain at least one block/);
  assertError(run([makePost({ body: [{ type: "video" }] })]), /body\[0\]: unknown block type "video"/);
  assertError(run([makePost({ body: [{ type: "image", src: "/images/a.webp" }] })]), /body\[0\]\.alt is required/);
  assertError(
    run([makePost({ body: [{ type: "gallery", images: [{ src: "/images/a.webp", alt: "a" }] }] })]),
    /gallery needs 2–4 images, got 1/,
  );
  const five = Array.from({ length: 5 }, () => ({ src: "/images/a.webp", alt: "a" }));
  assertError(run([makePost({ body: [{ type: "gallery", images: five }] })]), /gallery needs 2–4 images, got 5/);
  assertError(run([makePost({ body: [{ type: "list", items: [] }] })]), /body\[0\]\.items must list at least one item/);
});

test("image files must exist under public/", () => {
  const imageExists = (src) => !src.includes("missing");
  assertError(
    run([makePost({ image: "/images/blog/missing.webp" })], { imageExists }),
    /image: image file not found: \/images\/blog\/missing\.webp/,
  );
  assertError(
    run([makePost({ body: [{ type: "image", src: "/images/missing.webp", alt: "a" }] })], { imageExists }),
    /body\[0\]\.src: image file not found/,
  );
  assertError(run([makePost({ image: "images/cover.webp" })]), /image must start with "\/"/);
});

test("links must use an allowed link type", () => {
  assertError(
    run([makePost({ body: [{ type: "p", text: "[x](javascript:void)" }] })]),
    /body\[0\]\.text: link "javascript:void" is not allowed/,
  );
  assertError(
    run([makePost({ body: [{ type: "list", items: ["[x](ftp://a)"] }] })]),
    /body\[0\]\.items\[0\]: link "ftp:\/\/a" is not allowed/,
  );
  assertError(
    run([makePost({ body: [{ type: "image", src: "/images/a.webp", alt: "a", caption: "[x](data:x)" }] })]),
    /body\[0\]\.caption: link "data:x" is not allowed/,
  );
});

test("every post file is registered and every slug has a file", () => {
  assertError(run([makePost()], { postFiles: ["hello-world", "orphan"] }), /posts\/orphan\.js is not listed/);
  assertError(run([makePost()], { postFiles: [] }), /no file content\/blog\/posts\/hello-world\.js/);
  assert.deepEqual(run([makePost()], { postFiles: ["hello-world"] }), []);
});
