import { cn, getFullName, getInitials } from "@/lib/utils";
import type { UserReference } from "@/types";

export function ProfileAvatar({
  user,
  className,
  size = "md",
}: {
  user?: Partial<UserReference> | null;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const label = getFullName(user);
  const image = user?.profile_image_url;

  const sizes = {
    sm: "size-10 text-sm",
    md: "size-14 text-md",
    lg: "size-20 text-xl",
  };

  if (image) {
    return (
      <div
        className={cn(
          "overflow-hidden rounded-full border border-[var(--border)] bg-white shadow-sm",
          sizes[size],
          className,
        )}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image} alt={label} className="h-full w-full object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#dfeafe_0%,#c9dbff_100%)] font-semibold text-[var(--secondary)] shadow-sm",
        sizes[size],
        className,
      )}
      aria-label={label}
      title={label}
    >
      {getInitials(label)}
    </div>
  );
}
