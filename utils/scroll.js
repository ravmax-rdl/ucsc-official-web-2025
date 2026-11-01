// Current height of the fixed navbar, from the --nav-height variable the Navbar keeps up to date.
export const navHeight = () =>
  parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 0;

// Distance from the top of the page, from layout offsets. Unlike
// getBoundingClientRect it ignores transforms, such as a block still
// offset by its scroll-in animation.
const pageTop = (element) => {
  let top = 0;
  for (let node = element; node; node = node.offsetParent) top += node.offsetTop;
  return top;
};

// Scroll so `element` sits `gap` pixels below the navbar. Lenis measures element
// targets from its own scroll record, which goes stale when the page moves
// without it (scroll anchoring, native scrollTo), so sync it to the real
// position and pass a number instead.
export const scrollBelowNav = (lenis, element, { gap = 24, immediate = false } = {}) => {
  const target = pageTop(element) - navHeight() - gap;
  if (!lenis) {
    window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" });
    return;
  }
  lenis.scrollTo(window.scrollY, { immediate: true });
  lenis.scrollTo(target, { immediate });
};
