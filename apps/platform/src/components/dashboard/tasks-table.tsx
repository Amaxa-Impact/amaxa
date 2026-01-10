"use client";
import type { User } from "@workos-inc/node";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserDisplayName } from "@/components/ui/user-dropdown";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

interface TasksTableProps {
  projectId: Id<"projects">;
  allUsers: User[];
}

type TaskStatus = "todo" | "in_progress" | "completed" | "blocked";

interface Filters {
  status: TaskStatus | undefined;
  assignedTo: string | undefined;
  searchLabel: string;
}

const PAGE_SIZE = 10;

const statusLabels: Record<TaskStatus, string> = {
  todo: "To Do",
  in_progress: "In Progress",
  completed: "Completed",
  blocked: "Blocked",
};

const statusVariants: Record<
  TaskStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  todo: "outline",
  in_progress: "secondary",
  completed: "default",
  blocked: "destructive",
};

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-4 w-[200px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[80px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-[120px]" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-[80px]" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

export function TasksTable({ projectId, allUsers }: TasksTableProps) {
  const [filters, setFilters] = useState<Filters>({
    status: undefined,
    assignedTo: undefined,
    searchLabel: "",
  });

  const debouncedSearch = useDebounce(filters.searchLabel, 300);

  const { results, status, loadMore } = usePaginatedQuery(
    api.dashboard.listTasksPaginated,
    {
      projectId,
      status: filters.status,
      assignedTo: filters.assignedTo,
      searchLabel: debouncedSearch || undefined,
    },
    { initialNumItems: PAGE_SIZE }
  );

  const projectUsers = useQuery(api.dashboard.getProjectUsers, { projectId });

  const userMap = useMemo(() => {
    const map = new Map<string, string>();
    for (const user of allUsers) {
      map.set(user.id, getUserDisplayName(user));
    }
    return map;
  }, [allUsers]);

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) {
      return "-";
    }
    return new Date(timestamp).toLocaleDateString();
  };

  const isLoading = status === "LoadingFirstPage";
  const canLoadMore = status === "CanLoadMore";
  const isLoadingMore = status === "LoadingMore";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Input
            className="w-[200px]"
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchLabel: e.target.value }))
            }
            placeholder="Search tasks..."
            value={filters.searchLabel}
          />

          <Select
            onValueChange={(value) =>
              setFilters((prev) => ({
                ...prev,
                status: value === "all" ? undefined : (value as TaskStatus),
              }))
            }
            value={filters.status ?? "all"}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              const newValue =
                value === "all" || value === null ? undefined : value;
              setFilters((prev) => ({
                ...prev,
                assignedTo: newValue,
              }));
            }}
            value={filters.assignedTo ?? "all"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {projectUsers?.map((user) => (
                <SelectItem key={user.userId} value={user.userId}>
                  {userMap.get(user.userId) ?? user.userId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(filters.status || filters.assignedTo || filters.searchLabel) && (
            <Button
              onClick={() =>
                setFilters({
                  status: undefined,
                  assignedTo: undefined,
                  searchLabel: "",
                })
              }
              variant="ghost"
            >
              Clear Filters
            </Button>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Name</TableHead>
              <TableHead>Due By</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton />
            ) : results.length === 0 ? (
              <TableRow>
                <TableCell
                  className="text-center text-muted-foreground"
                  colSpan={4}
                >
                  No tasks found
                </TableCell>
              </TableRow>
            ) : (
              <>
                {results.map((task) => (
                  <TableRow key={task._id}>
                    <TableCell className="font-medium">{task.label}</TableCell>
                    <TableCell>{formatDate(task.dueDate)}</TableCell>
                    <TableCell>
                      {task.assignedTo
                        ? (userMap.get(task.assignedTo) ?? "Unknown")
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {task.status ? (
                        <Badge variant={statusVariants[task.status]}>
                          {statusLabels[task.status]}
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not Set</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {isLoadingMore && <TableSkeleton />}
              </>
            )}
          </TableBody>
        </Table>

        {!isLoading && results.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm">
              Showing {results.length} task{results.length !== 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              {canLoadMore && (
                <Button
                  disabled={isLoadingMore}
                  onClick={() => loadMore(PAGE_SIZE)}
                  size="sm"
                  variant="outline"
                >
                  {isLoadingMore ? "Loading..." : "Load More"}
                </Button>
              )}
              {status === "Exhausted" && (
                <span className="text-muted-foreground text-sm">
                  All tasks loaded
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
