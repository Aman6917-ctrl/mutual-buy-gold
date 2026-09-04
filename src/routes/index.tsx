import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { dealsQuery, productsQuery, type Deal } from "@/lib/api";
import { Hero } from "@/components/Hero";
import { DealsCarousel } from "@/components/DealsCarousel";
import { ProductCard } from "@/components/ProductCard";
import { SiteHeader } from "@/components/SiteHeader";
import { ErrorState, LoadingNote, Skeleton } from "@/components/States";

export const Route = createFileRoute("/")({
  loader: async () => {
    try {
      const deals = await dealsQuery.queryFn();
      return { deals };
    } catch {
      return { deals: [] as Deal[] };
    }
  },
  head: () => ({
    meta: [
      { title: "Corpus — Shop on EMI backed by your mutual funds" },
      {
        name: "description",
        content:
          "Buy premium devices in monthly instalments backed by your mutual funds. Stay invested while you spend.",
      },
      { property: "og:title", content: "Corpus — Shop on EMI backed by your mutual funds" },
      {
        property: "og:description",
        content: "Turn your invested corpus into purchasing power without redeeming a single unit.",
      },
    ],
  }),
  component: HomePage,
});

function DealsBlock({
  deals,
  isPending,
}: {
  deals: Deal[] | undefined;
  isPending: boolean;
}) {
  if (isPending && !deals?.length) {
    return (
      <section className="mx-auto max-w-6xl px-5 pt-10 sm:px-8">
        <h2 className="font-display text-2xl">Great Deals</h2>
        <div className="mt-5 flex gap-4 overflow-hidden">
          {[0, 1].map((i) => (
            <Skeleton key={i} className="h-56 w-[260px] shrink-0 rounded-2xl sm:w-[300px]" />
          ))}
        </div>
      </section>
    );
  }

  return <DealsCarousel deals={deals ?? []} />;
}

function HomePage() {
  const { deals: loadedDeals } = Route.useLoaderData();
  const deals = useQuery({
    ...dealsQuery,
    initialData: loadedDeals.length ? loadedDeals : undefined,
  });
  const products = useQuery(productsQuery);

  const catalog = products.data ?? [];
  const heroTiles = catalog
    .filter((p) => p.placement === "hero")
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      startingPrice: p.startingPrice,
      startingEmi: p.startingEmi,
      imageSrc: p.thumbnail,
    }));
  const catalogueCards = catalog.filter((p) => p.placement === "catalogue");

  return (
    <main>
      <SiteHeader />
      <DealsBlock
        deals={deals.data}
        isPending={deals.isPending || deals.isLoading}
      />
      {products.isError ? (
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <ErrorState onRetry={() => products.refetch()} />
        </div>
      ) : products.isPending ? (
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <Skeleton className="h-12 w-3/4 max-w-lg" />
          <Skeleton className="mt-4 h-5 w-1/2 max-w-sm" />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[0, 1].map((i) => (
              <Skeleton key={i} className="aspect-[4/5] w-full rounded-2xl" />
            ))}
          </div>
          <div className="mt-8">
            <LoadingNote>Loading products from the database.</LoadingNote>
          </div>
        </div>
      ) : (
        <>
          <Hero featured={heroTiles} />
          <section
            id="catalogue"
            className="mx-auto max-w-6xl scroll-mt-20 border-t border-hairline px-5 pt-14 pb-24 sm:px-8"
          >
            <h2 className="font-display text-2xl">Everything you can buy on a fund-backed EMI</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {catalogueCards.length ? (
                catalogueCards.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))
              ) : (
                <p className="text-sm text-muted-foreground sm:col-span-2">
                  No catalogue products are available yet.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
