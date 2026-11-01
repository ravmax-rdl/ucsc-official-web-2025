// Shared by blog motion: entrance animations wait until the page wipe or
// the Preloader (both set body.no-scroll) has finished.
export function onPageReady(callback) {
  const { body } = document;
  if (!body.classList.contains("no-scroll")) {
    callback();
    return () => {};
  }

  const observer = new MutationObserver(() => {
    if (!body.classList.contains("no-scroll")) {
      observer.disconnect();
      callback();
    }
  });
  observer.observe(body, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
