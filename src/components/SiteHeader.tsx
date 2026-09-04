import { Link } from "@tanstack/react-router";

const links = [
  { label: "Deals", to: "/", hash: "great-deals" as const },
  { label: "Products", to: "/", hash: "catalogue" as const },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline/80 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <Link
          to="/"
          className="font-display text-[1.15rem] tracking-tight text-ink transition-colors duration-200 hover:text-forest"
        >
          Corpus<span className="text-forest">.</span>
        </Link>
        <nav className="flex items-center gap-1 text-[13px]">
          {links.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              hash={item.hash}
              className="rounded-full px-3.5 py-1.5 text-muted-foreground transition-colors duration-200 hover:bg-surface hover:text-forest"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
