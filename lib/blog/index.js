// Server only: reads the file system. Import it from server components,
// never from client components.
import fs from "node:fs";
import path from "node:path";

import { posts } from "../../content/blog/index.js";
import { tags } from "../../content/blog/tags.js";
import { sortPosts, toSummary } from "./posts.js";
import { validatePosts } from "./validate.js";

const root = process.cwd();
const postsDir = path.join(root, "content", "blog", "posts");

const errors = validatePosts(posts, tags, {
  imageExists: (src) => fs.existsSync(path.join(root, "public", src)),
  postFiles: fs
    .readdirSync(postsDir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => file.slice(0, -3)),
});

if (errors.length > 0) {
  throw new Error(`Invalid blog content:\n- ${errors.join("\n- ")}`);
}

const sorted = sortPosts(posts);
const summaries = sorted.map((post) => toSummary(post, tags));

export const getTags = () => tags;
export const getAllPosts = () => sorted;
export const getPost = (slug) => sorted.find((post) => post.slug === slug) ?? null;
export const getSummaries = () => summaries;
