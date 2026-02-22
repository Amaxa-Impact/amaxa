interface AdminContainerProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function AdminContainer({
  children,
  title,
  description,
  actions,
}: AdminContainerProps) {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
