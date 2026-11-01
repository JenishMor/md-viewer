import { useEffect, useState, type RefObject } from "react";

// Diagrams and charts load large libraries (Mermaid, Chart.js), so each block
// renders only once it scrolls near the viewport. Export asks every block to
// render immediately, wherever it is.

const RENDER_ALL_EVENT = "mdviewer:render-all-blocks";
let renderAll = false;

export function renderAllBlocks() {
  if (renderAll) return;
  renderAll = true;
  window.dispatchEvent(new Event(RENDER_ALL_EVENT));
}

/** True once the element has come within a screen of the viewport (and from then on). */
export function useNearViewport(ref: RefObject<Element | null>) {
  const [near, setNear] = useState(() => renderAll || typeof IntersectionObserver === "undefined");

  useEffect(() => {
    const el = ref.current;
    if (near || !el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setNear(true);
      },
      // Inside the preview, watch its scroll area; elsewhere, the page.
      { root: el.closest("[data-scroll-root]"), rootMargin: "50% 0px" },
    );
    observer.observe(el);
    const onRenderAll = () => setNear(true);
    window.addEventListener(RENDER_ALL_EVENT, onRenderAll);
    return () => {
      observer.disconnect();
      window.removeEventListener(RENDER_ALL_EVENT, onRenderAll);
    };
  }, [ref, near]);

  return near;
}
