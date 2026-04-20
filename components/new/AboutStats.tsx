"use client";

import { useEffect, useRef, useState } from "react";

/* ── Shared CountUp ──────────────────────────────────────── */
function CountUp({
  target,
  suffix,
  prefix = "",
  decimals = 0,
  duration = 1600,
  run,
}: {
  target: number;
  suffix: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
  run: boolean;
}) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!run) return;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((target * eased).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [run, target, duration, decimals]);

  return (
    <>
      {prefix}
      {decimals && decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
      {suffix}
    </>
  );
}

/* ── useInViewOnce ── triggers once when element enters viewport ── */
function useInViewOnce(threshold = 0.3) {
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, started };
}

/* ── Hero Stats Bar (120K+, 8000+, etc) ─────────────────── */
const heroStats = [
  { label: "Happy Customers", numeric: 120, suffix: "K+" },
  { label: "Products Listed", numeric: 8000, suffix: "+" },
  { label: "Countries Served", numeric: 50, suffix: "+" },
  { label: "Years of Trust", numeric: 5, suffix: "+" },
];

export function AboutHeroStats() {
  const { ref, started } = useInViewOnce(0.3);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {heroStats.map((stat) => (
        <div key={stat.label} className="text-center">
          <p className="text-4xl font-black text-primary mb-1 tabular-nums">
            <CountUp target={stat.numeric} suffix={stat.suffix} run={started} />
          </p>
          <p className="text-sm text-muted-foreground font-medium">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ── Mission Stats Grid (Founded, Team Size, etc) ────────── */
const missionStats = [
  { label: "Founded", numeric: 2020, suffix: "" },
  { label: "Team Size", numeric: 45, suffix: "+" },
  { label: "Avg. Rating", numeric: 4.9, suffix: " ★", decimals: 1 },
  { label: "Return Rate", numeric: 2, suffix: "%", prefix: "< " },
];

export default function AboutStats() {
  const { ref, started } = useInViewOnce(0.3);

  return (
    <div ref={ref} className="grid grid-cols-2 gap-4">
      {missionStats.map((stat) => (
        <div
          key={stat.label}
          className="bg-background border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
        >
          <p className="text-3xl font-black text-foreground mb-1 tabular-nums">
            <CountUp
              target={stat.numeric}
              suffix={stat.suffix}
              prefix={stat.prefix}
              decimals={stat.decimals}
              run={started}
            />
          </p>
          <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
