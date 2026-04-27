import { Inbox } from "lucide-react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--border)] bg-[#fbfdff] px-6 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-[var(--soft)] text-[var(--secondary)]">
        <Inbox className="size-6" />
      </div>
      <div className="space-y-1">
        <p className="text-md font-semibold text-[var(--foreground)]">
          {title}
        </p>
        <p className="max-w-md text-sm text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
    </div>
  );
}
