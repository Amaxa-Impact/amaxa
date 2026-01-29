import { Card, CardContent } from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen flex-col">
      <main className="bg-background flex-1 overflow-auto">
        <div className="mx-auto max-w-3xl space-y-4 px-4 py-6">
          <Card className="border-t-primary/50 border-t-4">
            <CardContent className="space-y-4 pt-6">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-8 w-8" />
                    </div>
                    <Skeleton className="h-9 w-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center">
            <Skeleton className="h-10 w-40" />
          </div>
        </div>
      </main>
    </div>
  );
}
