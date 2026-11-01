// Inline formatting for blog text: **bold**, *italic*, `code` and [text](url).
// Produces tokens, never HTML. Unsafe links are kept but marked, so the
// content checker can report them and the renderer can show plain text.

const SAFE_HREF = /^(?:https?:\/\/|mailto:|\/(?!\/))/i;
const LINK = /^\[([^\]]+)\]\(([^)\s]+)\)/;

export const isSafeHref = (href) => SAFE_HREF.test(href);

// Finds the closing single "*", skipping "**" pairs and spaced stars.
const findClosingStar = (text, from) => {
  for (let j = from; j < text.length; j += 1) {
    if (text[j] !== "*") continue;
    if (text[j + 1] === "*") {
      j += 1;
      continue;
    }
    if (text[j - 1] !== " ") return j;
  }
  return -1;
};

export function parseInline(text = "", { links = true } = {}) {
  const tokens = [];
  let buffer = "";
  const flush = () => {
    if (buffer) tokens.push({ type: "text", value: buffer });
    buffer = "";
  };

  let i = 0;
  while (i < text.length) {
    const char = text[i];

    if (char === "`") {
      const end = text.indexOf("`", i + 1);
      if (end > i + 1) {
        flush();
        tokens.push({ type: "code", value: text.slice(i + 1, end) });
        i = end + 1;
        continue;
      }
    } else if (text.startsWith("**", i)) {
      const end = text.indexOf("**", i + 2);
      if (end > i + 2) {
        flush();
        tokens.push({
          type: "strong",
          children: parseInline(text.slice(i + 2, end), { links }),
        });
        i = end + 2;
        continue;
      }
      buffer += "**";
      i += 2;
      continue;
    } else if (char === "*" && text[i + 1] !== " ") {
      const end = findClosingStar(text, i + 1);
      if (end > i + 1) {
        flush();
        tokens.push({
          type: "em",
          children: parseInline(text.slice(i + 1, end), { links }),
        });
        i = end + 1;
        continue;
      }
    } else if (char === "[" && links) {
      const match = LINK.exec(text.slice(i));
      if (match) {
        flush();
        const [whole, label, href] = match;
        tokens.push({
          type: "link",
          href,
          safe: isSafeHref(href),
          children: parseInline(label, { links: false }),
        });
        i += whole.length;
        continue;
      }
    }

    buffer += char;
    i += 1;
  }

  flush();
  return tokens;
}

const toPlain = (tokens) =>
  tokens.map((token) => (token.children ? toPlain(token.children) : token.value)).join("");

export const inlineToPlain = (text) => toPlain(parseInline(text));
