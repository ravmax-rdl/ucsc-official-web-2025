import TransitionLink from "@/components/helpers/TransitionLink";

export const metadata = {
  title: "Page not found | IEEE Student Branch of UCSC",
};

const linkClass =
  "border border-primary-blue px-4 py-2 rounded-sm hover:bg-primary-blue/10 transition-colors";

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center gap-6 px-6 pt-28 pb-14 text-center text-secondary-blue">
      <p className="text-8xl md:text-[12rem] font-semibold leading-none text-primary-blue">
        404
      </p>
      <p className="text-lg md:text-xl">
        This page doesn&apos;t exist or has moved.
      </p>
      <div className="flex gap-4 uppercase font-semibold text-primary-blue">
        <TransitionLink href="/" className={linkClass}>
          Home
        </TransitionLink>
        <TransitionLink href="/blog/" className={linkClass}>
          Blog
        </TransitionLink>
      </div>
    </main>
  );
}
