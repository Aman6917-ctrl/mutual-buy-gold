import { Link } from "@tanstack/react-router";
import { inr, mediaUrl } from "@/lib/api";

export type HeroTile = {
  slug: string;
  name: string;
  startingPrice: number;
  startingEmi?: number;
  imageSrc: string;
};

export function Hero({ featured }: { featured: HeroTile[] }) {
  const items = featured.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-5 pt-14 pb-14 sm:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-14">
        <div className="hero-rise">
          <h1 className="font-display text-[2.6rem] leading-[1.05] sm:text-5xl">
            Your investments are
            <br />
            already <span className="text-forest">purchasing power</span>.
          </h1>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Keep your mutual funds compounding and pay in monthly instalments backed by them. No
            redemption, no lost growth.
          </p>
        </div>

        <div
          className={
            items.length <= 2 ? "grid grid-cols-2 gap-4" : "grid grid-cols-2 gap-4 sm:grid-cols-3"
          }
        >
          {items.map((p, i) => (
            <Link
              key={p.slug}
              to="/products/$slug"
              params={{ slug: p.slug }}
              preload="intent"
              className="hero-rise group relative block overflow-hidden rounded-2xl bg-surface"
              style={{ animationDelay: `${120 + i * 110}ms` }}
            >
              <img
                src={mediaUrl(p.imageSrc)}
                alt={`${p.name} product shot`}
                width={1024}
                height={1024}
                className="aspect-[3/4] w-full object-cover"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/95 via-ink/80 to-transparent p-4 pt-20">
                <div className="font-display text-xl text-paper">{p.name}</div>
                <div className="mt-0.5 flex items-baseline gap-2 text-paper/85">
                  <span className="text-xs">EMI from</span>
                  <span className="font-display text-sm text-gold">
                    {inr(p.startingEmi ?? Math.round(p.startingPrice / 24))}/mo
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
