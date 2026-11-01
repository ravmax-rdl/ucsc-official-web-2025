import { Fragment } from "react";
import Link from "next/link";

import { parseInline } from "@/lib/blog/inline";

const linkClass =
  "text-primary-blue underline underline-offset-4 hover:decoration-2";

function renderTokens(tokens) {
  return tokens.map((token, i) => {
    switch (token.type) {
      case "text":
        return <Fragment key={i}>{token.value}</Fragment>;
      case "strong":
        return (
          <strong key={i} className="font-semibold">
            {renderTokens(token.children)}
          </strong>
        );
      case "em":
        return <em key={i}>{renderTokens(token.children)}</em>;
      case "code":
        return (
          <code key={i} className="rounded-sm bg-secondary-white px-1.5 py-0.5 font-mono text-[0.9em]">
            {token.value}
          </code>
        );
      case "link":
        if (!token.safe) return <Fragment key={i}>{renderTokens(token.children)}</Fragment>;
        if (token.href.startsWith("/")) {
          return (
            <Link key={i} href={token.href} className={linkClass}>
              {renderTokens(token.children)}
            </Link>
          );
        }
        return (
          <a
            key={i}
            href={token.href}
            className={linkClass}
            {...(token.href.startsWith("mailto:")
              ? {}
              : { target: "_blank", rel: "noopener noreferrer" })}
          >
            {renderTokens(token.children)}
          </a>
        );
      default:
        return null;
    }
  });
}

export default function InlineText({ text }) {
  return <>{renderTokens(parseInline(text))}</>;
}
