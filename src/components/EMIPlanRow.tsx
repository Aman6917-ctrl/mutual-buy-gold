import { inr, type EMIPlan } from "@/lib/api";

export function EMIPlanRow({
  plan,
  selected,
  bestValue = false,
  onSelect,
}: {
  plan: EMIPlan;
  selected: boolean;
  bestValue?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={[
        "w-full rounded-[4px] px-4 py-4 text-left transition-all duration-[170ms] ease-out",
        selected
          ? "border border-forest bg-surface-deep shadow-plan"
          : "border border-hairline bg-transparent hover:border-forest/40",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <div className="font-display text-xl">
              {inr(plan.monthlyAmount)}
              <span className="ml-1 font-sans text-xs font-normal text-muted-foreground">
                / month
              </span>
            </div>
            {bestValue ? (
              <span className="rounded-full border border-forest/40 bg-forest/10 px-2 py-0.5 text-[11px] font-medium text-forest">
                Best Value
              </span>
            ) : null}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {plan.tenureMonths} months ·{" "}
            {plan.interestRate === 0 ? "No interest" : `${plan.interestRate}% p.a.`}
          </div>

          {plan.cashback ? (
            <div className="mt-2 text-xs font-medium text-forest">
              {inr(plan.cashback)} cashback on completion
            </div>
          ) : null}
        </div>
        <span
          aria-hidden
          className={[
            "mt-1 flex size-5 shrink-0 items-center justify-center rounded-full transition-all duration-[170ms]",
            selected ? "bg-forest text-primary-foreground" : "border border-hairline",
          ].join(" ")}
        >
          {selected ? (
            <svg viewBox="0 0 12 12" className="size-3" fill="none">
              <path
                d="M2.5 6.3 L4.8 8.6 L9.5 3.6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
      </div>
    </button>
  );
}
