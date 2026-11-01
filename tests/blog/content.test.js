import { test } from "node:test";
import assert from "node:assert/strict";

test("the blog content passes every build check", async () => {
  const { getAllPosts, getSummaries, getPost } = await import("../../lib/blog/index.js");
  const posts = getAllPosts();
  assert.ok(posts.length > 0);
  assert.equal(getSummaries().length, posts.length);
  assert.equal(getPost(posts[0].slug), posts[0]);
  assert.equal(getPost("does-not-exist"), null);
});
