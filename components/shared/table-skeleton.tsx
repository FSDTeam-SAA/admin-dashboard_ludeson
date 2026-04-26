import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton({
  rows = 6,
  columns = 6,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div className="space-y-3 p-6">
      <div className="grid gap-3 md:grid-cols-6">
        {Array.from({ length: columns }).map((_, index) => (
          <Skeleton key={`head-${index}`} className="h-5 w-full" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={`row-${rowIndex}`} className="grid gap-3 md:grid-cols-6">
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <Skeleton
              key={`cell-${rowIndex}-${columnIndex}`}
              className="h-12 w-full rounded-2xl"
            />
          ))}
        </div>
      ))}
    </div>
  );
}
