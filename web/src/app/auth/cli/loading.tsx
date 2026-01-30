import { LoadingSpinner } from "~/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="card-modern p-8 text-center">
          <LoadingSpinner size="lg" text="Authenticating..." />
        </div>
      </div>
    </div>
  );
}
