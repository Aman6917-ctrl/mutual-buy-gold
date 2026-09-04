import { Link } from "@tanstack/react-router";
import { inr, type ProductSummary } from "@/lib/api";

export function ProductCard({
  product,
  subtitle,
}: {
  product: ProductSummary;
  subtitle?: string;
}) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      preload="intent"
      className="group block hairline bg-card p-3 transition-colors duration-200 hover:border-forest/40"
    >
      <div className="overflow-hidden rounded-lg bg-surface">
        <img
          src={product.thumbnail}
          alt={`${product.name} product shot`}
          loading="lazy"
          width={1024}
          height={1024}
          className="aspect-square w-full object-cover"
        />
      </div>
      <div className="mt-4 flex items-end justify-between gap-4 px-1 pb-1">
        <div>
          <h3 className="font-display text-lg leading-snug">{product.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{subtitle ?? product.brand}</p>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-muted-foreground">from</div>
          <div className="font-display text-base">{inr(product.startingPrice)}</div>
        </div>
      </div>
    </Link>
  );
}
