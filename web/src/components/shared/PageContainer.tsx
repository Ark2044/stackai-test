interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-primary/5 ${className || ''}`}>
      {/* Decorative Background Grid */}
      <div className="fixed inset-0 bg-grid-slate-900/[0.04] bg-[size:75px_75px] dark:bg-grid-slate-100/[0.03] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      {/* Content */}
      <div className="relative">
        {children}
      </div>
    </div>
  );
}
