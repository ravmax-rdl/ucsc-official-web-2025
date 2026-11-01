<p align="center">
  <a href="https://ucscieee.lk">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/logo-white.svg">
      <img src="public/logo-blue.svg" alt="UCSC IEEE Student Branch" width="360">
    </picture>
  </a>
</p>

<h1 align="center">IEEE Student Branch of UCSC</h1>

<p align="center">
  The website of the IEEE Student Branch of the<br>
  University of Colombo School of Computing.
</p>

<p align="center">
  <a href="https://ucscieee.lk">Visit the website</a> ·
  <a href="https://www.linkedin.com/company/ucscieeesb/">LinkedIn</a> ·
  <a href="https://www.instagram.com/ucsc.ieee/">Instagram</a> ·
  <a href="https://www.facebook.com/IEEE.UCSC/">Facebook</a>
</p>

<p align="center">
  <a href="https://github.com/IEEEUCSC/ucsc-official-web-2025/actions/workflows/deploy.yml">
    <img src="https://github.com/IEEEUCSC/ucsc-official-web-2025/actions/workflows/deploy.yml/badge.svg" alt="GitHub Pages deployment workflow">
  </a>
</p>

## About the website

Established in 2011, the IEEE Student Branch of UCSC brings students together
through technical learning, competitions, volunteering, and professional
development. This website presents the branch's activities and the people
behind them.

- **Branch overview** — an introduction to IEEE UCSC and its areas of activity.
- **Events and timeline** — workshops, competitions, and past initiatives.
- **Our team** — executive and standing committees, with member profiles.
- **Previous officers** — a dedicated page for past committees.
- **Blog** — event recaps and articles, with search, tag filters, and a page
  per post. See [Blog](#blog).
- **Contact** — branch contact details and social channels.

The site uses repository-managed content and local media. There is no CMS,
database, or API key required for local development.

## Built with

| Technology | Role |
| --- | --- |
| Next.js 16 · React 19 | Pages, components, metadata, and static export |
| Tailwind CSS 4 | Styling, responsive layouts, and theme colors |
| GSAP · ScrollTrigger · `@gsap/react` | Scroll animations and page transitions |
| Lenis | Smooth scrolling |
| React Icons | Social and interface icons |
| GitHub Actions · GitHub Pages | Build checks and static-site deployment |

The site uses the locally hosted **Raveo** font. Exact dependency versions are
recorded in the lockfiles.

## Local development

Use **Node.js 24** and npm, matching the deployment workflow. If you use nvm,
the repository includes an `.nvmrc` file.

```bash
git clone https://github.com/IEEEUCSC/ucsc-official-web-2025.git ucsc-web-2025
cd ucsc-web-2025
nvm use
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). Changes to pages and components
appear automatically while the development server is running.

### Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the versions recorded in `package-lock.json` |
| `npm run dev` | Start the local development server |
| `npm run lint` | Check JavaScript, JSX, and Next.js conventions |
| `npm test` | Run the blog tests, including the content checker |
| `npm run build` | Build the static site into `out/` |
| `npm audit` | Check installed dependencies for reported vulnerabilities |
| `npm run deploy` | Manually publish an existing `out/` build to `gh-pages` |

### Preview a production build

```bash
npm run lint
npm run build
python3 -m http.server 4173 --bind 127.0.0.1 --directory out
```

Open [localhost:4173](http://localhost:4173). Python is only needed for this
preview command; any static file server can serve `out/`.

`npm start` runs `next start`, which does **not** serve this project's static
export. Use a static file server to preview the production output.

## Updating website content

Most recurring content changes belong in [`utils/index.js`](utils/index.js).

| What to update | Where to edit |
| --- | --- |
| Navigation links | `navbarLinks` in `utils/index.js` |
| Areas of activity | `whatweDo` in `utils/index.js` |
| Timeline entries | `timelineData` in `utils/index.js` |
| Past events | `pastEvents` in `utils/index.js` |
| Current committees | `executiveCommittee` and `standingCommittee` in `utils/index.js` |
| Previous officers | `prevOfficers` in `utils/index.js` |
| Blog posts | `content/blog/posts/` and `content/blog/index.js` (see [Adding a post](#adding-a-post)) |
| Blog tags | `content/blog/tags.js` |
| Contact details and social links | `contactInfo` and `contactExCom` in `utils/index.js` |
| Page title, description, and sharing image | `metadata` in `app/layout.jsx` |
| Brand colors and shared styles | `styles/globals.css` |
| Logos, photographs, and video | `public/` |

### Adding or replacing a team portrait

1. Place the compressed image under `public/images/team/`, in the appropriate
   committee folder.
2. Set the member's `image` value relative to `public/images/team/`, for example
   `excom/hashen.jpg`. The component adds `/images/team/` automatically.
3. Check the desktop and mobile crops. Team cards use `object-cover`, appear
   in grayscale by default, and show color on hover.

Keep images appropriately sized and compressed before committing them. Images
are served as static assets; Next.js image optimization is disabled for export.
Use full `https://` URLs for external links and descriptive alternative text
where image fields support it.

## Blog

The blog lives at `/blog/`. Each post is a JavaScript data file, and every blog
page is generated at build time with the rest of the static export.

### Adding a post

1. Create `content/blog/posts/<slug>.js` with `export default { … }`. The file
   name must match `slug`. Copy an existing post as a starting point.
2. Import the post and add it to `posts` in `content/blog/index.js`.
3. Put its images in `public/images/blog/<slug>/` as WebP, at most 1600 px
   wide, and reference them as `/images/blog/<slug>/cover.webp`.
4. Run `npm test` and `npm run build`. Both fail with a list of problems if the
   content is invalid.

| Field | Notes |
| --- | --- |
| `slug`, `title`, `date`, `excerpt`, `image`, `imageAlt`, `tags` | Required. `date` is `YYYY-MM-DD`; tags come from `content/blog/tags.js` |
| `imageFocus` | CSS `object-position` for the cover crop. Default `"50% 50%"` |
| `author` | `{ name, role }`; `role` is optional |
| `featured` | `true` on at most one post. Without it, the newest post is featured |
| `body` | Blocks: `p`, `h2`, `h3`, `image`, `gallery` (2–4 images), `quote`, `list`, `code`, `callout`, `divider` |

Text in paragraphs, quotes, lists, callouts, and captions supports `**bold**`,
`*italic*`, `` `code` ``, and `[text](url)`. Links must start with `https://`,
`http://`, `mailto:`, or `/`.

The current posts are samples, marked `// SAMPLE POST — replace with real
content`.

### Features

- **Listing page**: a featured post hero, a grid of 9 cards with a
  **Load more** button, tag chips, and search over titles, excerpts, tags, and
  author names. Search ignores case and accents. The result count is announced
  to screen readers.
- **Shareable filters**: the tag and search text are kept in the URL
  (`/blog/?tag=workshops&q=madhack`), so a filtered view survives a reload and
  can be linked.
- **Post pages**: a cover hero with tags, date, reading time (200 words per
  minute), and author, followed by the body blocks. `h2` headings get anchor
  IDs.
- **Metadata**: each post sets its page title, description, and Open Graph
  article data with the cover image.
- **Navigation**: a Blog link in the navbar, marked with `aria-current` on blog
  pages. Hash links such as Contact us now work from any page: they go to the
  homepage, then scroll once the page transition ends.
- **404 page**: a styled page with links to the homepage and the blog. Unknown
  post slugs return it.
- **Checks**: 38 tests with `node:test`, run in CI before the build.

### Decisions

| Decision | Reason |
| --- | --- |
| Body text is structured blocks, read by a small inline parser that returns tokens | Nothing is rendered as raw HTML, so post content cannot inject markup. A link with an unsafe scheme renders as plain text and fails the checker. |
| Content is validated at build time (`lib/blog/validate.js`) | A missing image, unknown tag, invalid date, duplicate slug, or post left out of the index stops the build instead of shipping a broken page. |
| Tags come from a fixed list | Near-duplicates such as "Workshop" and "Workshops" cannot split the filter. |
| The URL is updated with `history.replaceState`, and search waits 250 ms after typing | The URL stays shareable without a router request or a history entry per keystroke. |
| `dynamicParams = false` on post pages | Only posts in the index get pages; any other slug is a 404 on the static host. |

### Design, performance, and next steps

**1. Design: How did you make the blog match the existing website?**

The blog reuses the site's existing styles and components instead of adding
new ones:

- Colors come from the `@theme` tokens in `styles/globals.css`
  (`primary-blue`, `secondary-blue`, `primary-white`, `secondary-white`). The
  Raveo font comes from the root layout.
- Labels and buttons copy the navbar: uppercase semibold text, `rounded-sm`
  borders, and the `hover:bg-primary-blue/10` hover.
- Every internal link uses `TransitionLink`, so blog navigation plays the same
  page wipe as the rest of the site. Scrolling goes through Lenis.
- Hero text sits on a dark blue gradient so it stays readable on any cover.
- Hover and press animations use `motion-safe:`, so they turn off when the
  visitor's system asks for reduced motion.

**2. Performance: How did you handle large images and long blog titles?**

Images:

- Next.js image optimization is disabled for the static export, so images are
  resized before they are committed: WebP, at most 1600 px wide. Each blog
  image is 6–31 KB, and `public/images/blog/` is 456 KB in total.
- `next/image` gets `width` and `height`, which reserves space so the page does
  not shift while images load. Card and body images load lazily; the two heroes
  use `priority` because they are the largest element above the fold.
- `object-cover` with a per-post `imageFocus` fits covers of any shape (from
  720×722 to 1600×2133) into fixed frames without distortion.
- The content checker fails the build if an image path does not exist in
  `public/`.

Long titles:

- Titles longer than 60 characters (`LONG_TITLE` in `lib/blog/posts.js`) drop
  one type size in the featured and post heroes.
- The hero's aspect ratio is a minimum height, not a fixed one
  (`overflow-clip` rather than `overflow-hidden`). A title that still does not
  fit makes the hero taller instead of being cut off.
- `overflow-wrap: anywhere` breaks long unbroken words, such as URLs, on cards
  and heroes.

**3. Improvements: If you had more time, what is one feature you would add to
improve the blog?**

Related posts at the end of each post. A post page now ends with only an
"All posts" link, so a reader who finishes a recap has no direct next step.
Three cards chosen by shared tags, newest first, would point them to similar
events. The list can be computed at build time from the existing summaries and
rendered with `BlogCard`, so it adds no client-side JavaScript.

## Media and repository size

Tracked files in `public/` total about 60 MB, and `.git` is about 116 MB
because history keeps every earlier version of each binary, including a 37 MB
`hero.mp4` and 2–3 MB team PNGs. Every clone and CI run downloads all of it,
and each replaced image adds to history permanently.

Suggested changes:

1. Delete media that no code references: `public/images-un-cmpressed/`
   (82 files, 23 MB) and `public/hero.old.mp4` (15 MB).
2. Move video and original photos to an object store or image CDN, such as
   Cloudflare R2 or Cloudinary, and reference them by full `https://` URL. The
   blog checker requires image paths to start with `/`, so it would need to
   accept the chosen host.
3. Convert team portraits from PNG to WebP; several are close to 1 MB.

## Project structure

```text
app/
  layout.jsx                 Shared layout, font, and site metadata
  page.jsx                   Homepage composition
  previous-officers/page.jsx Previous officers page
  blog/page.jsx              Blog listing
  blog/[slug]/page.jsx       Blog post pages
  not-found.jsx              404 page
components/                  Website sections and navigation
  blog/                      Blog listing, cards, heroes, and post body
  helpers/                   Team cards, animations, and transitions
content/blog/
  posts/                     One file per blog post
  index.js                   List of all posts
  tags.js                    Allowed tags
lib/blog/
  index.js                   Server-side loader; validates content at build
  posts.js                   Sorting, filtering, reading time, and summaries
  inline.js                  Inline formatting parser
  validate.js                Content checker
tests/blog/                  Tests for the blog helpers and content
utils/
  index.js                   Content, committee data, and contact details
  lenis.js                   Client-side smooth-scrolling export
styles/
  globals.css                Tailwind theme and shared styles
  fonts/                     Local font files
public/                      Logos, photographs, and video
.github/workflows/deploy.yml GitHub Pages deployment workflow
next.config.mjs              Static export and routing configuration
eslint.config.mjs            Lint configuration
```

## Deployment

The workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml)
runs when changes are pushed to **`main`**. It:

1. Installs dependencies with `npm ci` on Node.js 24.
2. Runs lint and tests, then creates the static production build.
3. Publishes `out/` to the **`gh-pages`** branch.

For branch-based GitHub Pages publishing, use `gh-pages` and the repository root
as the Pages source in the repository settings.

The build includes a `CNAME` for **`ucscieee.lk`** and a `.nojekyll` file. Routes
use trailing slashes and directory `index.html` files so page HTML and Next.js
route payloads resolve on static hosts. Transition links use the client router
with speculative prefetching disabled.

If the domain changes, update `CNAME`, the build script in `package.json`, the
deployment workflow, and `metadataBase` in `app/layout.jsx` together.

## Maintenance and contributions

Keep changes focused and explain their purpose in the pull request. For content
updates, check dates, names, roles, contact details, external links, and image
paths against the branch's approved information.

Before merging:

- Run `npm run lint`, `npm test`, and `npm run build`.
- Preview the exported homepage, `/previous-officers/`, `/blog/`, and a post
  page.
- Check desktop and mobile navigation, portrait crops, and scrolling behavior.
- After deployment, check the live routes, media, and social-sharing metadata.

### Dependency updates

npm is the package manager used by CI. After changing dependencies, update
`package-lock.json` with npm and regenerate the alternative pnpm lockfile with
`pnpm import`. Use one package manager per `node_modules` installation, and run
lint, build, and `npm audit` before accepting an update.

Next.js 16.4 supplies ESLint 10 compatibility adapters. Three bundled lint
plugins still declare older peer ranges, so scoped overrides in `package.json`
and `pnpm-workspace.yaml` align them with the root ESLint version. Keep these
overrides aligned and remove them when upstream peer ranges include ESLint 10.

The current frontend targets modern browsers. Tailwind 4 requires Safari 16.4+,
Chrome 111+, or Firefox 128+; consider browser support when changing the stack.

## Contact the branch

For branch inquiries, email [ucscieee@gmail.com](mailto:ucscieee@gmail.com) or
visit [ucscieee.lk](https://ucscieee.lk).
