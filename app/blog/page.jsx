import { Suspense } from "react";

import BlogListing from "@/components/blog/BlogListing";
import BlogListingView from "@/components/blog/BlogListingView";
import { getSummaries, getTags } from "@/lib/blog";

export const metadata = {
  title: "Blog | IEEE Student Branch of UCSC",
  description:
    "Event recaps, technical articles and news from the IEEE Student Branch of UCSC.",
  openGraph: {
    title: "Blog | IEEE Student Branch of UCSC",
    images: [{ url: "/images/6.jpg", alt: "IEEE Student Branch of UCSC" }],
    locale: "en_US",
    type: "website",
  },
};

export default function BlogPage() {
  const summaries = getSummaries();
  const tags = getTags();

  return (
    <main className="pb-24 pt-[calc(var(--nav-height)+3rem)]">
      <Suspense fallback={<BlogListingView summaries={summaries} tags={tags} />}>
        <BlogListing summaries={summaries} tags={tags} />
      </Suspense>
    </main>
  );
}
