import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
function ScrollReveal({ children, className = "", delay = 0 }) {
  const ref = reactExports.useRef(null);
  reactExports.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.style.transitionDelay = `${delay}ms`;
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref, className: `reveal ${className}`, children });
}
export {
  ScrollReveal as S
};
