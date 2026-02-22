import { Skeleton } from "@amaxa/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-4 p-6">
      <Skeleton className="h-8 w-80" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-[70vh] w-full" />
    </div>
  );
}
