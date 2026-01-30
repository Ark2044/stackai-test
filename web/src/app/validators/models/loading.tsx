import { LoadingSpinner } from "~/components/ui/loading-spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="card-modern p-12 text-center animate-fade-in-up">
        <LoadingSpinner size="xl" text="Loading models..." />
      </div>
    </div>
  );
}
