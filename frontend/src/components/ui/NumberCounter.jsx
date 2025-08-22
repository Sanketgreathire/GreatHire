
"use client";
import { useEffect, useRef, useState } from "react";

const NumberCounter = ({
  end,
  start = 0,
  duration = 1200,
  prefix = "",
  suffix = "",
  decimals = 0,
}) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    let rafId;

    const animate = () => {
      const e = Number(end) || 0;
      const s = Number(start) || 0;
      const d = Number(duration) || 1000;
      const t0 = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - t0) / d, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = s + (e - s) * eased;
        setVal(current);

        if (progress < 1) {
          rafId = requestAnimationFrame(tick);
        } else {
          setVal(e);
        }
      };

      rafId = requestAnimationFrame(tick);
    };

    animate();

    return () => rafId && cancelAnimationFrame(rafId);
  }, [end, start, duration]);

  // ✅ Number formatting with commas
  const formattedVal = Number(val).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref}>
      {prefix}
      {formattedVal}
      {suffix}
    </span>
  );
};

export default NumberCounter;
