import { Navigation } from "~/components/layout/navigation";
import { MergeRequestForm } from "~/components/repository/merge-request-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Merge Request - ModelMerge",
  description: "Submit a new model merge request for community validation",
};

// Static page with client components
export const dynamic = 'force-static';

export default function MergePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb w-[600px] h-[600px] bg-primary/20 -top-40 -left-40"></div>
        <div className="orb w-[500px] h-[500px] bg-accent/15 top-1/3 -right-32 animation-delay-2000"></div>
        <div className="orb w-[400px] h-[400px] bg-primary/10 bottom-20 left-1/4 animation-delay-4000"></div>
      </div>
      <div className="fixed inset-0 gradient-mesh opacity-30 pointer-events-none"></div>
      <div className="fixed inset-0 dot-pattern pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10">
        <MergeRequestForm />
      </div>
    </div>
  );
}
