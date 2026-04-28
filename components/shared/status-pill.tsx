import { cn } from "@/lib/utils";

const toneMap: Record<string, string> = {
  active: "border-[#22c55e] bg-white text-[#22c55e]",
  pending: "border-[#6d28d9] bg-white text-[#6d28d9]",
  inactive: "border-[#ff6b6b] bg-white text-[#ff6b6b]",
  blocked: "border-[#ff6b6b] bg-white text-[#ff6b6b]",
  admin: "border-[#ff9f43] bg-white text-[#ff9f43]",
  open: "border-[#4b78f2] bg-white text-[#4b78f2]",
  in_progress: "border-[#f59e0b] bg-white text-[#f59e0b]",
  resolved: "border-[#22c55e] bg-white text-[#22c55e]",
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
        "inline-flex min-w-[80px] items-center justify-center rounded-full border px-4 py-[6px] text-[14px] leading-none font-normal capitalize",
        toneMap[normalized] ?? toneMap.inactive,
        className,
      )}
    >
      {label}
    </span>
  );
}
