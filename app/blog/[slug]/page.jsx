import { notFound } from "next/navigation";

import PostBody from "@/components/blog/PostBody";
import PostHero from "@/components/blog/PostHero";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import TransitionLink from "@/components/helpers/TransitionLink";
import { getAllPosts, getPost, getTags } from "@/lib/blog";
import { getToc, toSummary, withHeadingIds } from "@/lib/blog/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: `${post.title} | IEEE UCSC Blog`,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: post.author ? [post.author.name] : undefined,
      images: [{ url: post.image, alt: post.imageAlt }],
      locale: "en_US",
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const summary = toSummary(post, getTags());
  const blocks = withHeadingIds(post.body);
  const toc = getToc(post.body);
  const showToc = toc.length >= 3;

  return (
    // Padding, not a margin on the hero: the margin would collapse through <main>
    // and move the desktop navbar, which is fixed without a top offset.
    <main className="pb-24 pt-(--nav-height)">
      <ReadingProgress />
      <PostHero post={summary} />

      <div className="mx-auto mt-12 max-w-7xl px-6 md:px-16 lg:grid lg:grid-cols-[220px_minmax(0,68ch)_220px] lg:justify-center lg:gap-12">
        <aside className="post-toc-rail hidden lg:block">
          {showToc && <TableOfContents items={toc} variant="rail" />}
        </aside>

        <article className="post-article min-w-0">
          {showToc && <TableOfContents items={toc} variant="panel" />}
          <PostBody blocks={blocks} />

          <TransitionLink
            href="/blog/"
            className="group mt-16 inline-flex items-center gap-2 text-sm font-semibold uppercase text-primary-blue"
          >
            <span aria-hidden className="inline-block motion-safe:transition-transform group-hover:-translate-x-1">
              ←
            </span>
            All posts
          </TransitionLink>
        </article>
      </div>
    </main>
  );
}
