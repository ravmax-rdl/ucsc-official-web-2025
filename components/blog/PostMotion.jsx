"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { onPageReady, prefersReducedMotion } from "@/utils/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const belowFold = (element) => element.getBoundingClientRect().top > window.innerHeight;

// Scroll-in motion for article blocks. Renders nothing. Through the page wipe
// every block animates; on a direct load only blocks below the fold do, since
// the static HTML above it is already on screen.
export default function PostMotion() {
  useGSAP((context, safe) => {
    const reduced = prefersReducedMotion();
    const covered = document.body.classList.contains("no-scroll");
    let blocks = gsap.utils.toArray(".post-article .post-block");
    let frames = gsap.utils.toArray(".post-article .post-image");
    if (!covered) {
      blocks = blocks.filter(belowFold);
      frames = frames.filter(belowFold);
    }
    if (blocks.length === 0) return;

    gsap.set(blocks, { opacity: 0 });

    const enter = safe(() => {
      if (reduced) {
        gsap.to(blocks, { opacity: 1, duration: 0.2 });
        return;
      }

      gsap.set(blocks, { y: 24 });
      ScrollTrigger.batch(blocks, {
        once: true,
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: "power2.out" }),
      });

      frames.forEach((frame) => {
        const trigger = { trigger: frame, start: "top 85%", once: true };
        gsap.fromTo(
          frame,
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "power3.out", scrollTrigger: trigger },
        );
        gsap.fromTo(
          frame.querySelector("img"),
          { scale: 1.15 },
          { scale: 1, duration: 1.2, ease: "power3.out", scrollTrigger: { ...trigger } },
        );
      });
    });
    return onPageReady(enter);
  });

  return null;
}
