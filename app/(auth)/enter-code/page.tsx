"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { forgotPassword, toApiError, verifyOtp } from "@/lib/api";
import { Button } from "@/components/ui/button";

const OTP_LENGTH = 6;

export default function EnterCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [digits, setDigits] = useState(() => Array.from({ length: OTP_LENGTH }, () => ""));
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (!email) {
      router.replace("/forgot-password");
    }
  }, [email, router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = window.setTimeout(() => setCountdown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const otp = useMemo(() => digits.join(""), [digits]);

  const verifyMutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: ({ reset_token }) => {
      toast.success("Code verified.");
      router.push(
        `/change-password?token=${encodeURIComponent(reset_token)}&email=${encodeURIComponent(email)}`,
      );
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  const resendMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("A new code was sent.");
      setCountdown(60);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  function updateDigit(index: number, value: string) {
    const sanitized = value.replace(/\D/g, "").slice(-1);
    setDigits((current) => {
      const next = [...current];
      next[index] = sanitized;
      return next;
    });

    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("");

    if (!pasted.length) return;

    setDigits((current) =>
      current.map((_, index) => pasted[index] ?? current[index] ?? ""),
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (otp.length !== OTP_LENGTH) {
      toast.error("Enter the full 6-digit code.");
      return;
    }

    verifyMutation.mutate({ email, otp });
  }

  return (
    <AuthShell
      title="Enter Code"
      description="Enter the code to confirm it is really you"
    >
      <form className="space-y-7" onSubmit={handleSubmit}>
        <div className="flex items-center justify-between gap-2">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              inputMode="numeric"
              value={digit}
              onChange={(event) => updateDigit(index, event.target.value)}
              onKeyDown={(event) => handleKeyDown(index, event)}
              onPaste={handlePaste}
              maxLength={1}
              className="h-14 w-12 rounded-xl border border-[var(--primary)] bg-white text-center text-2xl font-semibold text-[var(--primary)] outline-none focus:ring-4 focus:ring-[rgba(47,108,246,0.12)] sm:w-14"
            />
          ))}
        </div>

        <div className="text-center text-sm text-[var(--muted-foreground)]">
          {countdown > 0 ? (
            <span>Send the code again in {countdown} sec</span>
          ) : (
            <button
              type="button"
              onClick={() => resendMutation.mutate({ email })}
              className="font-medium text-[var(--primary)]"
            >
              Resend code
            </button>
          )}
        </div>

        <Button type="submit" className="w-full" loading={verifyMutation.isPending}>
          Verify
        </Button>
      </form>
    </AuthShell>
  );
}
