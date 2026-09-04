import type { Variant } from "@/lib/api";

export function VariantSelector({
  variants,
  activeId,
  onSelect,
}: {
  variants: Variant[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((v) => {
        const active = v.variantId === activeId;
        return (
          <button
            key={v.variantId}
            type="button"
            onClick={() => onSelect(v.variantId)}
            aria-pressed={active}
            className={
              active
                ? "rounded-full bg-forest px-4 py-2 text-sm text-primary-foreground"
                : "rounded-full border border-hairline bg-transparent px-4 py-2 text-sm text-ink/80 transition-colors duration-200 hover:border-forest/50"
            }
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
}
