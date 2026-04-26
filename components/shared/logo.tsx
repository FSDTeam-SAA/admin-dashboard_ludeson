import { cn } from "@/lib/utils";

export function Logo({
  className,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className={cn("inline-flex shrink-0", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/logo.png"
        alt="Muvbay Transport LLC"
        width={96}
        height={96}
        className="block h-auto w-full min-w-0 object-contain"
      />
    </span>
  );
}
