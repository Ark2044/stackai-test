import { LoadingSpinner } from "~/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-size-[75px_75px] dark:bg-grid-slate-100/[0.03]" />
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="relative card-modern p-12 text-center animate-fade-in-up">
        <LoadingSpinner size="xl" text="Loading..." />
      </div>
    </div>
  );
}
