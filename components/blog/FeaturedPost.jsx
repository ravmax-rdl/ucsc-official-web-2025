import Image from "next/image";

import TransitionLink from "@/components/helpers/TransitionLink";

export default function FeaturedPost({ post }) {
  return (
    <TransitionLink
      href={`/blog/${post.slug}/`}
      className="featured-post group relative block aspect-[4/5] overflow-hidden bg-primary-blue text-primary-white md:aspect-video lg:aspect-[21/8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-blue"
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
            "linear-gradient(to top, rgba(5,30,50,.85), rgba(5,30,50,.05) 60%)",
        }}
      />
      <div className="absolute inset-x-6 bottom-6 flex max-w-4xl flex-col gap-3 md:inset-x-10 md:bottom-10">
        <p className="text-xs font-semibold uppercase">
          {["Featured", ...post.tags.map((tag) => tag.label)].join(" · ")}
        </p>
        <h2 className="text-3xl font-semibold uppercase leading-[1.05] [overflow-wrap:anywhere] md:text-5xl xl:text-6xl">
          {post.title}
        </h2>
        <p className="text-sm">
          {post.displayDate} · {post.readingTime} min read
        </p>
      </div>
    </TransitionLink>
  );
}
