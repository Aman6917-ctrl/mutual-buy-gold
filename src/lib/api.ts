const PRODUCTION_API_ORIGIN = "https://onefi-assignment-nzq0.onrender.com";

function normalizeApiBase(raw: string) {
  const trimmed = raw.replace(/\/$/, "");
  if (trimmed.endsWith("/api")) return trimmed;
  return `${trimmed}/api`;
}

function originFromApiBase(apiBase: string) {
  return apiBase.replace(/\/api$/, "");
}

const resolved = (() => {
  const fromEnv =
    import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_BASE || "";
  if (fromEnv) return normalizeApiBase(String(fromEnv));
  if (import.meta.env.PROD) return `${PRODUCTION_API_ORIGIN}/api`;
  return "http://localhost:5001/api";
})();

export const API_BASE = resolved;
export const API_ORIGIN = originFromApiBase(resolved);

/** Rewrite leftover localhost image URLs so production still loads studio shots. */
export function mediaUrl(url?: string | null) {
  if (!url) return "";
  return url.replace(/https?:\/\/(localhost|127\.0\.0\.1):\d+/g, API_ORIGIN);
}

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

export type EMIPlan = {
  tenureMonths: number;
  monthlyAmount: number;
  interestRate: number;
  cashback?: number | null;
};

export type Variant = {
  variantId: string;
  label: string;
  mrp: number;
  price: number;
  images: string[];
  emiPlans: EMIPlan[];
};

export type ProductSummary = {
  slug: string;
  name: string;
  brand: string;
  thumbnail: string;
  startingPrice: number;
  startingEmi?: number;
  placement?: "deals" | "hero" | "catalogue";
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  variants: Variant[];
};

function asList<T>(json: unknown): T[] {
  if (Array.isArray(json)) return json as T[];
  if (json && typeof json === "object") {
    const record = json as Record<string, unknown>;
    for (const key of ["data", "deals", "products"]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }
  return [];
}

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new ApiError(res.status, `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

async function getList<T>(path: string): Promise<T[]> {
  return asList<T>(await get<unknown>(path));
}

export type Deal = ProductSummary & {
  mrp: number;
  discountPercent: number;
  dealTag: string;
};

export const productsQuery = {
  queryKey: ["products"] as const,
  queryFn: () => getList<ProductSummary>("/products"),
  staleTime: 5 * 60_000,
  retry: 2,
};

export const dealsQuery = {
  queryKey: ["deals"] as const,
  queryFn: () => getList<Deal>("/products/deals"),
  staleTime: 5 * 60_000,
  retry: 4,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 8000),
  refetchOnMount: "always" as const,
};

export const productQuery = (slug: string) => ({
  queryKey: ["product", slug] as const,
  queryFn: () => get<Product>(`/products/${slug}`),
  staleTime: 5 * 60_000,
  retry: (failureCount: number, error: Error) => {
    if (error instanceof ApiError && error.status === 404) return false;
    return failureCount < 2;
  },
});

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const totalPayable = (plan: EMIPlan) => plan.monthlyAmount * plan.tenureMonths;

/** Lowest total payable; ties go to 0% interest, then the longest tenure. */
export function bestValueTenure(plans: EMIPlan[]): number | null {
  if (plans.length < 2) return null;

  return plans.reduce((best, plan) => {
    const planTotal = totalPayable(plan);
    const bestTotal = totalPayable(best);
    if (planTotal < bestTotal) return plan;
    if (planTotal > bestTotal) return best;
    if (plan.interestRate === 0 && best.interestRate !== 0) return plan;
    if (best.interestRate === 0 && plan.interestRate !== 0) return best;
    return plan.tenureMonths > best.tenureMonths ? plan : best;
  }).tenureMonths;
}
