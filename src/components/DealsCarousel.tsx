import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { inr, type Deal } from "@/lib/api";

const SPEED_PX_PER_SEC = 38;

export function DealsCarousel({ deals }: { deals: Deal[] }) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const skipClick = useRef(false);
  const paused = useRef(false);
  const resumeAt = useRef(0);
  const [dragging, setDragging] = useState(false);

  const slides = deals;
  const loopSlides = [...slides, ...slides];

  useEffect(() => {
    const el = trackRef.current;
    if (!el || slides.length < 1) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const wrap = () => {
      const loopWidth = el.scrollWidth / 2;
      if (loopWidth <= 1) return;
      if (el.scrollLeft >= loopWidth) el.scrollLeft -= loopWidth;
      else if (el.scrollLeft < 0) el.scrollLeft += loopWidth;
    };

    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      if (!paused.current && now >= resumeAt.current) {
        el.scrollLeft += (SPEED_PX_PER_SEC * dt) / 1000;
        wrap();
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    el.addEventListener("scroll", wrap, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", wrap);
    };
  }, [slides.length]);

  if (!slides.length) return null;

  const pauseAuto = (ms = 0) => {
    if (ms) {
      paused.current = false;
      resumeAt.current = performance.now() + ms;
      return;
    }
    paused.current = true;
  };

  const resumeAuto = () => {
    paused.current = false;
  };

  const scrollByDir = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    pauseAuto(1800);
    el.scrollBy({ left: dir * Math.max(280, el.clientWidth * 0.72), behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || e.pointerType === "touch" || e.button !== 0) return;
    skipClick.current = false;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
    pauseAuto();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !drag.current) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved) {
      if (Math.abs(dx) < 12) return;
      drag.current.moved = true;
      el.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    el.scrollLeft = drag.current.left - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (drag.current?.moved) skipClick.current = true;
    const moved = drag.current?.moved;
    drag.current = null;
    setDragging(false);
    resumeAt.current = performance.now() + 1200;
    paused.current = false;
    if (moved && e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  };

  return (
    <section id="great-deals" className="mx-auto max-w-6xl scroll-mt-20 px-5 pt-10 sm:px-8">
      <div className="flex items-baseline justify-between gap-6">
        <h2 className="font-display text-2xl">Great Deals</h2>
        <div className="flex items-center gap-1">
          <CarouselArrow label="Previous deals" onClick={() => scrollByDir(-1)} flip />
          <CarouselArrow label="Next deals" onClick={() => scrollByDir(1)} />
        </div>
      </div>

      <div
        className="relative mt-5"
        onMouseEnter={() => pauseAuto()}
        onMouseLeave={() => resumeAuto()}
      >
        <button
          type="button"
          aria-label="Previous deals"
          onClick={() => scrollByDir(-1)}
          className="absolute left-0 top-1/2 z-10 hidden size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-card text-ink shadow-plan transition-colors duration-200 hover:border-forest/50 sm:flex"
        >
          <Chevron flip />
        </button>
        <button
          type="button"
          aria-label="Next deals"
          onClick={() => scrollByDir(1)}
          className="absolute right-0 top-1/2 z-10 hidden size-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-hairline bg-card text-ink shadow-plan transition-colors duration-200 hover:border-forest/50 sm:flex"
        >
          <Chevron />
        </button>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className={[
            "flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            dragging ? "cursor-grabbing select-none" : "cursor-grab",
          ].join(" ")}
        >
          {loopSlides.map((d, i) => (
            <Link
              key={`${d.slug}-${i}`}
              to="/products/$slug"
              params={{ slug: d.slug }}
              preload="intent"
              draggable={false}
              onClick={(e) => {
                if (skipClick.current) {
                  e.preventDefault();
                  skipClick.current = false;
                  return;
                }
                e.preventDefault();
                void navigate({ to: "/products/$slug", params: { slug: d.slug } });
              }}
              className="hairline group w-[260px] shrink-0 !cursor-pointer bg-card p-3 transition-colors duration-200 hover:border-forest/40 sm:w-[300px]"
            >
              <div className="relative overflow-hidden rounded-lg bg-surface">
                <img
                  src={d.thumbnail}
                  alt={`${d.name} product shot`}
                  draggable={false}
                  loading="lazy"
                  width={1024}
                  height={1024}
                  className="aspect-[4/3] w-full object-contain"
                />
                <span className="absolute left-2 top-2 rounded-full bg-forest px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
                  {d.dealTag}
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between gap-3 px-1 pb-1">
                <div>
                  <h3 className="font-display text-base leading-snug">{d.name}</h3>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-[11px] text-muted-foreground">from</span>
                    <span className="font-display text-sm">{inr(d.startingPrice)}</span>
                  </div>
                </div>
                <span className="whitespace-nowrap rounded-full border border-gold/50 bg-gold/15 px-2.5 py-1 text-[11px] font-medium text-ink">
                  {d.discountPercent}% off
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className={flip ? "size-3.5 rotate-180" : "size-3.5"} fill="none">
      <path
        d="M5.5 2.5 L11 8 L5.5 13.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CarouselArrow({
  label,
  onClick,
  flip,
}: {
  label: string;
  onClick: () => void;
  flip?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-8 items-center justify-center rounded-full border border-hairline text-ink/70 transition-colors duration-200 hover:border-forest/50 hover:text-forest"
    >
      <Chevron flip={flip} />
    </button>
  );
}
