"use client";

import { Eye, EyeOff } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { resetPassword, toApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChangePasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (!resetToken) {
      router.replace("/forgot-password");
    }
  }, [resetToken, router]);

  const resetMutation = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Password updated successfully.");
      router.push("/sign-in");
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    resetMutation.mutate({
      reset_token: resetToken,
      new_password: newPassword,
      confirm_password: confirmPassword,
    });
  }

  return (
    <AuthShell
      title="Change Password"
      description="Enter a strong password to protect your account"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((value) => !value)}
              className="absolute inset-y-0 right-3 my-auto flex size-8 items-center justify-center rounded-full text-[#9aa3b6] hover:bg-[var(--soft)] hover:text-[var(--foreground)]"
              aria-label={showNewPassword ? "Hide password" : "Show password"}
            >
              {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((value) => !value)}
              className="absolute inset-y-0 right-3 my-auto flex size-8 items-center justify-center rounded-full text-[#9aa3b6] hover:bg-[var(--soft)] hover:text-[var(--foreground)]"
              aria-label={showConfirmPassword ? "Hide password" : "Show password"}
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        <Button type="submit" className="w-full" loading={resetMutation.isPending}>
          Save
        </Button>
      </form>
    </AuthShell>
  );
}
