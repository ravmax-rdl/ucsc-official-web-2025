"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import TransitionLink from "@/components/helpers/TransitionLink";
import { LONG_TITLE } from "@/lib/blog/posts";
import { onPageReady, prefersReducedMotion } from "@/utils/motion";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

const DETAILS = ".hero-tags, .hero-meta, .hero-back";

export default function PostHero({ post }) {
  const hero = useRef(null);
  const author = post.author
    ? ` · by ${post.author.name}${post.author.role ? `, ${post.author.role}` : ""}`
    : "";
  const titleSize =
    post.title.length > LONG_TITLE
      ? "text-2xl md:text-4xl xl:text-5xl"
      : "text-3xl md:text-5xl xl:text-6xl";

  // The entrance plays only when the page wipe covers the page at mount; on a
  // direct load the static HTML is already on screen, so it stays put.
  useGSAP(
    (context, safe) => {
      const reduced = prefersReducedMotion();
      const covered = document.body.classList.contains("no-scroll");

      const scrollEffects = () => {
        if (reduced) return;
        const scroll = { trigger: hero.current, start: 0, end: "bottom top", scrub: true };
        gsap.to(".hero-media", { yPercent: 15, ease: "none", scrollTrigger: scroll });
        gsap.to(".hero-dim", { opacity: 0.5, ease: "none", scrollTrigger: { ...scroll } });
      };

      if (!covered) {
        scrollEffects();
        return;
      }

      let split = null;
      if (reduced) {
        gsap.set(`.hero-title, ${DETAILS}`, { opacity: 0 });
      } else {
        split = SplitText.create(".hero-title", { type: "lines", mask: "lines" });
        gsap.set(split.lines, { yPercent: 100 });
        gsap.set(DETAILS, { opacity: 0, y: 12 });
        gsap.set(".hero-media img", { scale: 1.1 });
      }

      return onPageReady(
        safe(() => {
          if (reduced) {
            gsap.to(`.hero-title, ${DETAILS}`, { opacity: 1, duration: 0.2 });
            return;
          }
          gsap.to(".hero-media img", { scale: 1, duration: 1.2, ease: "power3.out" });
          gsap.to(split.lines, {
            yPercent: 0,
            stagger: 0.08,
            duration: 0.9,
            ease: "power3.out",
            delay: 0.15,
            // Back to plain text, so a later resize re-wraps the title normally.
            onComplete: () => split.revert(),
          });
          gsap.to(DETAILS, { opacity: 1, y: 0, duration: 0.6, delay: 0.5, stagger: 0.08 });
          scrollEffects();
        }),
      );
    },
    { scope: hero },
  );

  return (
    // overflow-clip, not overflow-hidden: the aspect ratio stays a minimum
    // height, so a title that still doesn't fit makes the hero taller.
    <header
      ref={hero}
      className="post-hero relative flex aspect-[4/5] flex-col justify-end overflow-clip bg-primary-blue text-primary-white md:aspect-video lg:aspect-[21/8]"
    >
      <div className="hero-media absolute inset-x-0 -top-[8%] -bottom-[8%]">
        <Image
          src={post.image}
          alt={post.imageAlt}
          width={1600}
          height={900}
          priority
          style={{ objectPosition: post.imageFocus }}
          className="h-full w-full object-cover"
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
      <div aria-hidden className="hero-dim absolute inset-0 bg-[rgb(5,30,50)] opacity-0" />

      <TransitionLink
        href="/blog/"
        className="hero-back group absolute left-6 top-6 z-10 text-xs font-semibold uppercase md:left-16"
      >
        <span aria-hidden className="inline-block motion-safe:transition-transform group-hover:-translate-x-1">
          ←
        </span>{" "}
        All posts
      </TransitionLink>

      {/* pt-16 keeps the title clear of the back link when the hero grows. */}
      <div className="relative flex max-w-5xl flex-col gap-3 px-6 pb-8 pt-16 md:px-16 md:pb-12">
        <p className="hero-tags text-xs font-semibold uppercase">
          {post.tags.map((tag) => tag.label).join(" · ")}
        </p>
        <h1 className={`hero-title ${titleSize} font-semibold uppercase leading-[1.05] [overflow-wrap:anywhere]`}>
          {post.title}
        </h1>
        <p className="hero-meta text-sm">
          {post.displayDate} · {post.readingTime} min read{author}
        </p>
      </div>
    </header>
  );
}
