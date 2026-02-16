import { cn } from "@/lib/utils";

interface PanelHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export function PanelHeader({ title, children, className }: PanelHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-8 items-center justify-between border-b border-marex-border-subtle bg-marex-bg-elevated px-3",
        className
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </span>
      {children && <div className="flex items-center space-x-1">{children}</div>}
    </div>
  );
}
