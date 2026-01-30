import { Navigation } from "~/components/layout/navigation";
import { ModelsVoting } from "~/components/betting/models-voting";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ML Model Validation - ModelMerge",
  description: "Vote on submitted ML models and earn rewards for accurate predictions",
};

// Static page with client components
export const dynamic = 'force-static';

export default function ModelsPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-1 opacity-40" />
        <div className="orb orb-2 opacity-40" />
        <div className="orb orb-3 opacity-30" />
      </div>
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      <div className="absolute inset-0 dot-pattern opacity-30" />
      
      <ModelsVoting />
    </div>
  );
}
