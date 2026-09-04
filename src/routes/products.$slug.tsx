import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ApiError, bestValueTenure as pickBestValueTenure, inr, mediaUrl, productQuery } from "@/lib/api";

import { SiteHeader } from "@/components/SiteHeader";
import { VariantSelector } from "@/components/VariantSelector";
import { EMIPlanRow } from "@/components/EMIPlanRow";
import { ConfirmationPanel } from "@/components/ConfirmationPanel";
import { ErrorState, LoadingNote, Skeleton } from "@/components/States";

export const Route = createFileRoute("/products/$slug")({
  head: ({ params }) => {
    const name = params.slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${name} on fund-backed EMI — Corpus` },
        {
          name: "description",
          content: `Choose a monthly plan for the ${name}, backed by your mutual funds. Compare tenures, interest and cashback.`,
        },
        { property: "og:title", content: `${name} on fund-backed EMI — Corpus` },
        {
          property: "og:description",
          content: `Pick a tenure for the ${name} and keep your investments untouched.`,
        },
      ],
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const { data, isPending, isError, error, refetch } = useQuery(productQuery(slug));

  const [variantId, setVariantId] = useState<string | null>(null);
  const [selectedTenure, setSelectedTenure] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const variant = useMemo(() => {
    if (!data?.variants?.length) return null;
    return data.variants.find((v) => v.variantId === variantId) ?? data.variants[0];
  }, [data, variantId]);

  const selectedPlan = variant?.emiPlans.find((p) => p.tenureMonths === selectedTenure) ?? null;

  const bestValueTenure = useMemo(
    () => pickBestValueTenure(variant?.emiPlans ?? []),
    [variant],
  );

  if (isError) {
    const missing = error instanceof ApiError && error.status === 404;
    return (
      <main>
        <SiteHeader />
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          {missing ? (
            <div className="hairline bg-card p-8">
              <h2 className="font-display text-2xl">We couldn't find that product</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                The link may be out of date. Browse the catalogue to pick another device.
              </p>
              <Link
                to="/"
                className="mt-5 inline-flex rounded-full bg-forest px-5 py-2.5 text-sm text-primary-foreground"
              >
                Back to catalogue
              </Link>
            </div>
          ) : (
            <ErrorState onRetry={() => refetch()} />
          )}
        </div>
      </main>
    );
  }

  if (isPending || !variant || !data) {
    return (
      <main>
        <SiteHeader />
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:px-8 lg:grid-cols-2">
          <div>
            <Skeleton className="aspect-square w-full rounded-2xl" />
            <div className="mt-6 flex gap-2">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-28 rounded-full" />
            </div>
          </div>
          <div>
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="mt-3 h-4 w-24" />
            <Skeleton className="mt-8 h-10 w-40" />
            <div className="mt-8 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-[92px] w-full rounded-[4px]" />
              ))}
            </div>
            <div className="mt-6">
              <LoadingNote>Fetching today's plans. Thanks for your patience.</LoadingNote>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const discount = variant.mrp - variant.price;

  const onVariantChange = (id: string) => {
    setVariantId(id);
    setSelectedTenure(null);
    setConfirmed(false);
  };

  return (
    <main>
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-5 pt-6 sm:px-8">
        <Link to="/" className="text-xs text-muted-foreground hover:text-forest">
          Back to catalogue
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 pt-8 pb-24 sm:px-8 lg:grid-cols-2 lg:gap-16">
        {/* LEFT */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-surface">
            <img
              src={mediaUrl(variant.images[0])}
              alt={`${data.name} in ${variant.label}`}
              width={1024}
              height={1024}
              className="aspect-square w-full object-cover"
            />
          </div>
          {data.variants.length > 1 ? (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {data.variants.map((v) => (
                <button
                  key={v.variantId}
                  type="button"
                  onClick={() => onVariantChange(v.variantId)}
                  aria-label={`View ${v.label}`}
                  className={[
                    "overflow-hidden rounded-lg bg-surface transition-colors duration-200",
                    v.variantId === variant.variantId
                      ? "ring-1 ring-forest"
                      : "ring-1 ring-hairline",
                  ].join(" ")}
                >
                  <img
                    src={mediaUrl(v.images[0])}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-8">
            <h1 className="font-display text-3xl leading-tight break-words">{data.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{data.brand}</p>
          </div>


          <div className="mt-6">
            <p className="mb-3 text-sm text-muted-foreground">Choose a variant</p>
            <VariantSelector
              variants={data.variants}
              activeId={variant.variantId}
              onSelect={onVariantChange}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
            <span className="font-display text-3xl sm:text-4xl">{inr(variant.price)}</span>
            {discount > 0 ? (
              <>
                <span className="text-sm text-muted-foreground line-through">
                  {inr(variant.mrp)}
                </span>
                <span className="rounded-full border border-gold/50 bg-gold/15 px-2.5 py-1 text-xs font-medium text-ink">
                  Save {inr(discount)}
                </span>
              </>
            ) : null}
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl">EMI plans backed by mutual funds</h2>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              Your units stay invested and act as collateral. Pick the tenure that suits you.
            </p>

            <div className="mt-6 space-y-3">
              {variant.emiPlans.length ? (
                variant.emiPlans.map((plan) => (
                  <EMIPlanRow
                    key={plan.tenureMonths}
                    plan={plan}
                    selected={plan.tenureMonths === selectedTenure}
                    bestValue={plan.tenureMonths === bestValueTenure}
                    onSelect={() => {
                      setSelectedTenure(plan.tenureMonths);
                      setConfirmed(false);
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No EMI plans are available for this variant yet.
                </p>
              )}
            </div>

            <button
              type="button"
              disabled={!selectedPlan}
              onClick={() => setConfirmed(true)}
              className={[
                "mt-7 w-full rounded-md px-6 py-3.5 text-sm font-medium transition-colors duration-200",
                selectedPlan
                  ? "bg-forest text-primary-foreground hover:bg-forest-deep"
                  : "cursor-not-allowed border border-hairline bg-surface text-muted-foreground",
              ].join(" ")}
            >
              Proceed with this plan
            </button>
            {!selectedPlan ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Select a plan above to continue.
              </p>
            ) : null}

            {confirmed && selectedPlan ? (
              <ConfirmationPanel
                productName={data.name}
                variantLabel={variant.label}
                plan={selectedPlan}
                onDismiss={() => setConfirmed(false)}
              />
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
