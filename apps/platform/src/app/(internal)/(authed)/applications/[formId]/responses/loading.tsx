import { Skeleton } from "@amaxa/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";

export default function Loading() {
  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex gap-2">
            {[
              "status-filter-1",
              "status-filter-2",
              "status-filter-3",
              "status-filter-4",
              "status-filter-5",
            ].map((statusFilterSkeletonId) => (
              <Skeleton className="h-9 w-24" key={statusFilterSkeletonId} />
            ))}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                "response-row-1",
                "response-row-2",
                "response-row-3",
                "response-row-4",
                "response-row-5",
              ].map((responseRowSkeletonId) => (
                <TableRow key={responseRowSkeletonId}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-48" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-36" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-24" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
