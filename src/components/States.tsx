export function LoadingNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground">
      <span className="mr-2 inline-block size-1.5 translate-y-[-1px] rounded-full bg-gold" />
      {children}
    </p>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-surface-deep/70 ${className}`} />;
}

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="hairline bg-card p-8">
      <h2 className="font-display text-2xl">We couldn't load this right now</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        The connection to our catalogue dropped. Nothing is wrong with your account — please try
        again in a moment.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 rounded-full bg-forest px-5 py-2.5 text-sm text-primary-foreground"
      >
        Try again
      </button>
    </div>
  );
}
