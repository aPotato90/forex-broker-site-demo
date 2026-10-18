"use client";

import { inView } from "motion";
import { animate } from "motion/mini";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Fades content up as it scrolls into view using Motion's lightweight WAAPI animate.
 * Content is fully visible without JavaScript, and nothing animates when the user prefers
 * reduced motion or when the element is already on screen at load.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight) return;

    element.style.opacity = "0";
    const stop = inView(
      element,
      () => {
        animate(
          element,
          { opacity: [0, 1], transform: ["translateY(16px)", "translateY(0)"] },
          { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
        );
      },
      { amount: 0.15 },
    );
    return () => {
      stop();
      element.style.opacity = "";
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
