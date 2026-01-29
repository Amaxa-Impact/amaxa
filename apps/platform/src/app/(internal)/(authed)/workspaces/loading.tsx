import { Card, CardContent } from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

export default function WorkspacesLoading() {
  return (
    <div className="flex h-full flex-col">
      <div className="bg-background/95 border-border/50 sticky top-0 z-10 flex flex-row items-center justify-between border-b p-6 backdrop-blur-sm">
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-9 w-36" />
      </div>

      <main className="flex-1 p-6">
        <Card className="overflow-hidden shadow-sm">
          <CardContent className="p-0">
            <div className="space-y-4 p-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-8 w-20" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
