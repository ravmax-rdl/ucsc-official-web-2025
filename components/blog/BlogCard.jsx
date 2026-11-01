import Image from "next/image";

import TransitionLink from "@/components/helpers/TransitionLink";

export default function BlogCard({ post }) {
  return (
    <TransitionLink
      href={`/blog/${post.slug}/`}
      className="group flex flex-col gap-3 text-secondary-blue focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue"
    >
      <div className="aspect-[4/3] overflow-hidden bg-primary-blue">
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={1200}
          height={900}
          style={{ objectPosition: post.imageFocus }}
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-600 ease-out group-hover:scale-106"
        />
      </div>
      <p className="text-xs font-semibold uppercase text-primary-blue">
        {post.tags.map((tag) => tag.label).join(" · ")}
      </p>
      <h2 className="text-xl font-semibold leading-tight [overflow-wrap:anywhere] transition-colors group-hover:text-primary-blue">
        {post.title}
      </h2>
      <p className="text-xs">
        {post.displayDate} · {post.readingTime} min read
      </p>
      <span className="text-xs font-semibold uppercase text-primary-blue">
        Read{" "}
        <span
          aria-hidden
          className="inline-block motion-safe:transition-transform group-hover:translate-x-1.5"
        >
          →
        </span>
      </span>
    </TransitionLink>
  );
}
