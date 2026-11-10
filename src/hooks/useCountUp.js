import { useState, useEffect, useRef } from 'react';

/**
 * Animates one or more numeric targets smoothly from 0 to their final values
 * once per page load when the observed element first enters the viewport.
 *
 * @param {number|number[]} targets - Single target number or array of target numbers.
 * @param {number} duration - Animation duration in milliseconds.
 */
export function useCountUp(targets, duration = 1800) {
  const isArray = Array.isArray(targets);
  const targetList = isArray ? targets : [targets];
  const [values, setValues] = useState(() => targetList.map(() => 0));
  const containerRef = useRef(null);
  const hasStartedRef = useRef(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node || hasStartedRef.current) return;

    let rafId = null;
    let delayTimer = null;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          observer.disconnect();

          delayTimer = setTimeout(() => {
            const startTime = performance.now();

            const tick = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Smooth cubic ease-out
              const eased = 1 - Math.pow(1 - progress, 3);

              setValues(targetList.map((t) => Math.round(eased * t)));

              if (progress < 1) {
                rafId = requestAnimationFrame(tick);
              } else {
                setValues(targetList);
              }
            };

            rafId = requestAnimationFrame(tick);
          }, 120);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (delayTimer) clearTimeout(delayTimer);
      if (rafId) cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return {
    ref: containerRef,
    value: isArray ? values : values[0],
  };
}

