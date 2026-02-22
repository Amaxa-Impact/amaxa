import { Card, CardContent, CardHeader } from "@amaxa/ui/card";
import { Skeleton } from "@amaxa/ui/skeleton";

export default function Loading() {
  return (
    <div className="from-background to-muted/20 min-h-screen bg-gradient-to-b py-8 md:py-12">
      <div className="container mx-auto px-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader className="border-b">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-muted/30 space-y-4 rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            </div>

            <div className="space-y-6">
              <Skeleton className="h-4 w-32" />
              {["field-1", "field-2", "field-3"].map((fieldSkeletonId) => (
                <div className="space-y-2" key={fieldSkeletonId}>
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>

            <div className="flex justify-end border-t pt-6">
              <Skeleton className="h-10 w-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
