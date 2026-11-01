import { test } from "node:test";
import assert from "node:assert/strict";

import { inlineToPlain, isSafeHref, parseInline } from "../../lib/blog/inline.js";

const text = (value) => ({ type: "text", value });

test("plain text is a single text token", () => {
  assert.deepEqual(parseInline("Hello world"), [text("Hello world")]);
});

test("empty input returns no tokens", () => {
  assert.deepEqual(parseInline(""), []);
});

test("bold, italic and code", () => {
  assert.deepEqual(parseInline("a **b** *c* `d`"), [
    text("a "),
    { type: "strong", children: [text("b")] },
    text(" "),
    { type: "em", children: [text("c")] },
    text(" "),
    { type: "code", value: "d" },
  ]);
});

test("italic inside bold and bold inside italic", () => {
  assert.deepEqual(parseInline("**a *b* c**"), [
    {
      type: "strong",
      children: [text("a "), { type: "em", children: [text("b")] }, text(" c")],
    },
  ]);
  assert.deepEqual(parseInline("*a **b** c*"), [
    {
      type: "em",
      children: [text("a "), { type: "strong", children: [text("b")] }, text(" c")],
    },
  ]);
});

test("code content is not parsed", () => {
  assert.deepEqual(parseInline("`**x**`"), [{ type: "code", value: "**x**" }]);
});

test("unclosed or spaced markers stay literal", () => {
  assert.deepEqual(parseInline("2 * 3 and **bold"), [text("2 * 3 and **bold")]);
  assert.deepEqual(parseInline("2 * 3 * 4"), [text("2 * 3 * 4")]);
  assert.deepEqual(parseInline("run `npm"), [text("run `npm")]);
  assert.deepEqual(parseInline("[unclosed]("), [text("[unclosed](")]);
});

test("safe links", () => {
  assert.deepEqual(parseInline("see [the rules](https://ieee.org/x) now"), [
    text("see "),
    { type: "link", href: "https://ieee.org/x", safe: true, children: [text("the rules")] },
    text(" now"),
  ]);
  assert.equal(parseInline("[blog](/blog/)")[0].safe, true);
  assert.equal(parseInline("[mail](mailto:ucscieee@gmail.com)")[0].safe, true);
});

test("link text can contain formatting", () => {
  assert.deepEqual(parseInline("[**bold** link](/blog/)"), [
    {
      type: "link",
      href: "/blog/",
      safe: true,
      children: [{ type: "strong", children: [text("bold")] }, text(" link")],
    },
  ]);
});

test("blocked link types are marked unsafe", () => {
  const [link] = parseInline("[x](javascript:void)");
  assert.equal(link.type, "link");
  assert.equal(link.safe, false);
  assert.equal(isSafeHref("//evil.example"), false);
  assert.equal(isSafeHref("ftp://files.example"), false);
  assert.equal(isSafeHref("data:text/html,hi"), false);
});

test("inlineToPlain strips markers", () => {
  assert.equal(inlineToPlain("**a** [b](/x) `c` *d*"), "a b c d");
});
