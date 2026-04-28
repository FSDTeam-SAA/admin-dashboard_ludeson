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
      {/* Decorative Roads */}
      <img
        src="/branding/road-bl.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -left-4 -bottom-4 z-50 w-[300px]  opacity-70 select-none md:w-[360px]"
      />

      <img
        src="/branding/road-tr.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -top-4 z-10 w-[300px] opacity-70 select-none md:w-[360px]"
      />

      <div className="relative z-20 grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left Side Illustration */}
        <div className="relative hidden items-center justify-center overflow-hidden bg-[#f4f8ff] px-10 py-12 lg:flex">
          <div className="w-full max-w-[720px]">
            <img
              src="/branding/auth-img.png"
              alt="Transport Illustration"
              className="h-auto w-full object-contain"
            />
          </div>
        </div>

        {/* Right Side Form */}
        <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-[460px]">
            <div className="flex flex-col items-center text-center">
              <Logo priority className="mb-6 w-24 md:w-28" />

              <div className="mb-14 space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-[#2876f9] md:text-[26px]">
                  {title}
                </h1>
                <p className="text-[15px] text-[#8b8b8b]">{description}</p>
              </div>
            </div>

            <div className={cn("w-full", className)}>{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}