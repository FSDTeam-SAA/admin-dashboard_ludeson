import Image from "next/image";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

export function AuthShell({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div className="auth-road -left-28 bottom-[-120px] h-72 w-72 md:-left-16 md:bottom-[-90px]" />
      <div className="auth-road -right-14 top-[-84px] h-72 w-72 md:-right-10 md:top-[-120px]" />

      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden items-center justify-center overflow-hidden bg-[#f2f7ff] px-10 py-12 lg:flex">
          <div className="relative flex w-full max-w-4xl items-center justify-center">
            <Image
              src="/branding/auth-illustration.png"
              alt="Muvbay transport illustration"
              width={960}
              height={960}
              priority
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-[440px] space-y-8">
            <div className="flex flex-col items-center gap-5 text-center">
              <Logo priority className="w-20 md:w-24" />
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-[var(--primary)]">
                  {title}
                </h1>
                <p className="text-base text-[var(--muted-foreground)]">{description}</p>
              </div>
            </div>

            <div className={cn("space-y-6", className)}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
