import Image from "next/image";

import TransitionLink from "@/components/helpers/TransitionLink";
import { LONG_TITLE } from "@/lib/blog/posts";

export default function FeaturedPost({ post }) {
  const titleSize =
    post.title.length > LONG_TITLE
      ? "text-2xl md:text-4xl xl:text-5xl"
      : "text-3xl md:text-5xl xl:text-6xl";

  return (
    // overflow-clip, not overflow-hidden: the aspect ratio stays a minimum
    // height, so a title that still doesn't fit makes the hero taller.
    <TransitionLink
      href={`/blog/${post.slug}/`}
      className="featured-post group relative flex aspect-[4/5] flex-col justify-end overflow-clip bg-primary-blue text-primary-white md:aspect-video lg:aspect-[21/8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue"
    >
      <div className="featured-media absolute inset-x-0 -top-[8%] -bottom-[8%]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={1600}
          height={900}
          priority
          style={{ objectPosition: post.imageFocus }}
          className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-700 ease-out group-hover:scale-103"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to top, rgba(5,30,50,.9), rgba(5,30,50,.55) 50%, rgba(5,30,50,.1))",
        }}
      />
      <div className="relative flex max-w-4xl flex-col gap-3 p-6 md:p-10">
        <p className="text-xs font-semibold uppercase">
          {["Featured", ...post.tags.map((tag) => tag.label)].join(" · ")}
        </p>
        <h2 className={`${titleSize} font-semibold uppercase leading-[1.05] [overflow-wrap:anywhere]`}>
          {post.title}
        </h2>
        <p className="text-sm">
          {post.displayDate} · {post.readingTime} min read
        </p>
      </div>
    </TransitionLink>
  );
}
