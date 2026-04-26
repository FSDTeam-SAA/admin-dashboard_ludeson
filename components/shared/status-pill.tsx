import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  active: "border-[#22c55e] bg-[#ecfff2] text-[#18a14d]",
  pending: "border-[#7c3aed] bg-[#f7f2ff] text-[#6d3df0]",
  inactive: "border-[#ff6b6b] bg-[#fff5f5] text-[#ff5b5b]",
  blocked: "border-[#ff6b6b] bg-[#fff5f5] text-[#ff5b5b]",
  admin: "border-transparent bg-[#fff8f0] text-[#ff8b26]",
  open: "border-[#2f6cf6] bg-[#eef5ff] text-[#2f6cf6]",
  in_progress: "border-[#f59e0b] bg-[#fff8e8] text-[#d88a02]",
  resolved: "border-[#22c55e] bg-[#ecfff2] text-[#18a14d]",
};

export function StatusPill({
  value,
  className,
}: {
  value?: string | null;
  className?: string;
}) {
  const normalized = value?.toLowerCase() ?? "inactive";
  const label = normalized.replaceAll("_", " ");

  return (
    <span
      className={cn(
        "inline-flex min-w-24 items-center justify-center rounded-full border px-3 py-1 text-sm font-medium capitalize",
        toneMap[normalized] ?? toneMap.inactive,
        className,
      )}
    >
      {label}
    </span>
  );
}
