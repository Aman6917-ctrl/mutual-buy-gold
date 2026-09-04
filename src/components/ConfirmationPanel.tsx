import { inr, type EMIPlan } from "@/lib/api";

export function ConfirmationPanel({
  productName,
  variantLabel,
  plan,
  onDismiss,
}: {
  productName: string;
  variantLabel: string;
  plan: EMIPlan;
  onDismiss: () => void;
}) {
  const total = plan.monthlyAmount * plan.tenureMonths;
  const rows: Array<[string, string]> = [
    ["Product", productName],
    ["Variant", variantLabel],
    ["Monthly amount", inr(plan.monthlyAmount)],
    ["Tenure", `${plan.tenureMonths} months`],
    ["Total payable", inr(total)],
  ];

  return (
    <div className="mt-6 rounded-lg border border-forest/30 bg-card p-6">
      <h3 className="font-display text-xl">Your plan is set aside</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Nothing is charged yet. Here's what you've chosen.
      </p>
      <dl className="mt-5 divide-y divide-hairline">
        {rows.map(([k, v], i) => (
          <div key={k} className="flex items-baseline justify-between gap-6 py-2.5">
            <dt className="text-sm text-muted-foreground">{k}</dt>
            <dd
              className={
                i === rows.length - 1 ? "font-display text-lg" : "text-sm font-medium text-ink"
              }
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-5 text-sm text-forest underline decoration-hairline underline-offset-4"
      >
        Choose a different plan
      </button>
    </div>
  );
}
