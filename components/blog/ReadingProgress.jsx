"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { navHeight } from "@/utils/scroll";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ReadingProgress() {
  const bar = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".post-article",
          start: () => `top top+=${navHeight()}`,
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      },
    );
  });

  return (
    <div
      ref={bar}
      aria-hidden
      className="reading-progress fixed inset-x-0 top-(--nav-height) z-30 h-[2px] origin-left scale-x-0 bg-primary-blue"
    />
  );
}
