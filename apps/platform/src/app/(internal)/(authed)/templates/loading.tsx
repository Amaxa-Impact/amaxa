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
      <div className="bg-background sticky top-0 z-10 flex items-center justify-between p-6">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="h-9 w-36" />
      </div>
      <main className="flex-1 p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Visibility</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4].map((row) => (
              <TableRow key={row}>
                <TableCell>
                  <Skeleton className="h-5 w-40" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-72" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-5 w-20" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </main>
    </div>
  );
}
