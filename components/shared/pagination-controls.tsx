"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PaginationControls({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const canGoPrev = page > 1;
  const canGoNext = page < totalPages;

  return (
    <div className="flex items-center gap-[14px]">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={!canGoPrev}
        aria-label="Previous page"
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-[4px] bg-[#2f6cf6] text-white",
          !canGoPrev && "bg-[linear-gradient(180deg,#e6edff_0%,#bed0ff_100%)] text-white",
        )}
      >
        <ChevronLeft className="size-4" strokeWidth={2.2} />
      </button>
      <div className="flex size-6 items-center justify-center rounded-[3px] border border-[#8aa2f0] bg-white text-[12px] font-medium text-[#2f6cf6]">
        {page}
      </div>
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={!canGoNext}
        aria-label="Next page"
        className={cn(
          "inline-flex size-6 items-center justify-center rounded-[4px] bg-[#2f6cf6] text-white",
          !canGoNext && "bg-[linear-gradient(180deg,#e6edff_0%,#bed0ff_100%)] text-white",
        )}
      >
        <ChevronRight className="size-4" strokeWidth={2.2} />
      </button>
    </div>
  );
}
