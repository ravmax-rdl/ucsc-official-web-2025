import Image from "next/image";

import InlineText from "./InlineText";

function Figure({ src, alt, caption, className = "" }) {
  return (
    <figure className={`post-block ${className}`}>
      <div className="post-image overflow-hidden bg-secondary-white">
        <Image src={src} alt={alt} width={1600} height={1000} className="h-auto w-full" />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-secondary-blue/80">
          <InlineText text={caption} />
        </figcaption>
      )}
    </figure>
  );
}

function Block({ block }) {
  switch (block.type) {
    case "p":
      return (
        <p className="post-block text-lg leading-relaxed">
          <InlineText text={block.text} />
        </p>
      );
    case "h2":
      return (
        <h2
          id={block.id}
          className="post-block mt-8 scroll-mt-[calc(var(--nav-height)+1.5rem)] text-3xl font-semibold leading-tight"
        >
          {block.text}
        </h2>
      );
    case "h3":
      return <h3 className="post-block mt-4 text-xl font-semibold">{block.text}</h3>;
    case "image":
      return <Figure {...block} />;
    case "gallery":
      return (
        <figure className="post-block">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {block.images.map((image) => (
              <div key={image.src} className="post-image aspect-[4/3] overflow-hidden bg-secondary-white">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
          {block.caption && (
            <figcaption className="mt-2 text-sm text-secondary-blue/80">
              <InlineText text={block.caption} />
            </figcaption>
          )}
        </figure>
      );
    case "quote":
      return (
        <blockquote className="post-block border-l-2 border-primary-blue pl-6 text-2xl font-medium leading-snug">
          <p>
            <InlineText text={block.text} />
          </p>
          {block.cite && <footer className="mt-3 text-sm font-normal">— {block.cite}</footer>}
        </blockquote>
      );
    case "list": {
      const List = block.ordered ? "ol" : "ul";
      return (
        <List className={`post-block space-y-2 pl-6 text-lg ${block.ordered ? "list-decimal" : "list-disc"}`}>
          {block.items.map((item, i) => (
            <li key={i}>
              <InlineText text={item} />
            </li>
          ))}
        </List>
      );
    }
    case "code":
      return (
        <div className="post-block relative">
          {block.language && (
            <span className="absolute right-3 top-2 text-xs uppercase text-primary-white/60">
              {block.language}
            </span>
          )}
          <pre className="overflow-x-auto rounded-sm bg-secondary-blue p-5 pt-8 text-sm text-primary-white">
            <code>{block.code}</code>
          </pre>
        </div>
      );
    case "callout":
      return (
        <aside className="post-block rounded-sm bg-primary-blue/8 p-5">
          {block.title && <p className="mb-1 font-semibold">{block.title}</p>}
          <p>
            <InlineText text={block.text} />
          </p>
        </aside>
      );
    case "divider":
      return <hr className="post-block mx-auto my-6 w-16 border-t-2 border-primary-blue/40" />;
    default:
      return null;
  }
}

export default function PostBody({ blocks }) {
  return (
    <div className="post-body flex flex-col gap-6 text-secondary-blue">
      {blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
