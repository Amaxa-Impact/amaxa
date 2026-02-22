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
      <div className="bg-background sticky top-0 z-10 flex flex-row items-center justify-between p-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>

      <main className="flex-1 p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responses</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              "form-row-1",
              "form-row-2",
              "form-row-3",
              "form-row-4",
              "form-row-5",
            ].map((formRowSkeletonId) => (
              <TableRow key={formRowSkeletonId}>
                <TableCell>
                  <Skeleton className="h-5 w-48" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
