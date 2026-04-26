import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

type NameLike = {
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  email?: string | null;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    process.env.NEXTPUBLICBASEURL ??
    "http://localhost:5000/api/v1"
  );
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function formatPercent(value: number | string) {
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "0%";
  return `${numeric > 0 ? "+" : ""}${numeric}%`;
}

export function formatDate(value?: string | null, withTime = false) {
  if (!value) return "--";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  }).format(date);
}

export function formatDaysSince(value?: string | null) {
  if (!value) return "0 days";

  const createdAt = new Date(value).getTime();
  if (Number.isNaN(createdAt)) return "0 days";

  const diff = Math.max(1, Math.ceil((Date.now() - createdAt) / (1000 * 60 * 60 * 24)));
  return `${diff} day${diff === 1 ? "" : "s"}`;
}

export function getFullName(user?: NameLike | null) {
  if (!user) return "Unknown user";

  const fullName = [user.first_name, user.last_name].filter(Boolean).join(" ").trim();
  if (fullName) return fullName;
  if (user.username) return user.username;
  if (user.email) return user.email;
  return "Unknown user";
}

export function getInitials(label?: string | null) {
  if (!label) return "AD";
  const words = label.trim().split(/\s+/).slice(0, 2);
  return words.map((word) => word[0]?.toUpperCase() ?? "").join("") || "AD";
}

export function isObjectId(value?: string) {
  return Boolean(value && /^[a-f\d]{24}$/i.test(value));
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
