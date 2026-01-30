import { FolderGit2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-700" />
      </div>
      
      <div className="relative z-10 card-glass p-12 rounded-3xl text-center animate-fade-in-up">
        <div className="relative mx-auto w-20 h-20 mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full animate-ping opacity-25" />
          <div className="absolute inset-2 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" />
          <FolderGit2 className="absolute inset-0 m-auto h-10 w-10 text-white" />
        </div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Loading Repository...
        </h3>
        <p className="text-sm text-muted-foreground mt-2">Fetching your files</p>
      </div>
    </div>
  );
}
