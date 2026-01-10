import { Skeleton } from "@amaxa/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col">
      <div className="flex items-center justify-between border-b bg-background px-6 py-4">
        <Skeleton className="h-8 w-48" />
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <Skeleton className="h-8 w-8 rounded-full" key={i} />
              ))}
            </div>
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="relative flex-1 bg-muted/20">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
}
