"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth/auth-shell";
import { forgotPassword, toApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      toast.success("OTP sent. Check your email.");
      router.push(`/enter-code?email=${encodeURIComponent(email)}`);
    },
    onError: (error) => {
      toast.error(toApiError(error).message);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    forgotPasswordMutation.mutate({ email });
  }

  return (
    <AuthShell
      title="Forgot Password"
      description="Enter your details to recover your account safely"
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[var(--foreground)]">Email</label>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <Button
          type="submit"
          className="w-full"
          loading={forgotPasswordMutation.isPending}
        >
          Send OTP
        </Button>
      </form>
    </AuthShell>
  );
}
