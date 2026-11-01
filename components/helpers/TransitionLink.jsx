"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import gsap from "gsap";

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// "/blog/" and "/blog" are the same page.
const normalizePath = (path) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

const TransitionLink = ({ children, href, className, ...props }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Resolves once the wipe has finished and scrolling is enabled again.
  const playTransition = () =>
    new Promise((resolve) => {
      const timeline = gsap.timeline({ onComplete: resolve });

      document.body.classList.add("no-scroll"); //Disable scrolling

      timeline.fromTo(
        "#transition",
        {
          y: "100%",
          duration: 0.75,
        },
        {
          y: "0%",
          duration: 0.75,
          ease: "power2.in",
        }
      );

      timeline.to("#transition", {
        delay: 0.5,
        y: "-100%",
        duration: 0.75,
        ease: "power2.out",
        onComplete: () => {
          document.body.classList.remove("no-scroll");
        }, //enable scrolling
      });
    });

  const navigate = async (target) => {
    const finished = playTransition();
    await sleep(1000);
    router.push(target);
    return finished;
  };

  const handleTransition = (e) => {
    // Let the browser handle new-tab and new-window clicks.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
      return;
    }

    e.preventDefault();

    if (href.startsWith("#")) {
      if (normalizePath(pathname) === "/") {
        // Scroll to the element instead of reloading
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      } else {
        // The page can't scroll while the wipe holds body.no-scroll, so jump
        // to the section once it has finished.
        navigate(`/${href}`).then(() => {
          document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
        });
      }
      return;
    }

    if (normalizePath(pathname) !== normalizePath(href)) {
      navigate(href);
    }
  };

  return (
    <Link
      {...props}
      onClick={handleTransition}
      href={href}
      prefetch={false}
      className={className}
    >
      {children}
    </Link>
  );
};

export default TransitionLink;
