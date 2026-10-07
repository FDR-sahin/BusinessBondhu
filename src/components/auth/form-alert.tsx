import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Form-level message (server errors, success notices). Announced to screen readers. */
export function FormAlert({ message, tone = "error", className }: { message?: string | null; tone?: "error" | "success"; className?: string }) {
  if (!message) return null;
  const Icon = tone === "error" ? AlertCircle : CheckCircle2;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex gap-2 rounded-lg border px-3 py-2.5 text-sm",
        tone === "error" ? "border-danger/30 bg-danger-soft text-danger-soft-foreground" : "border-success/30 bg-success-soft text-success-soft-foreground",
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  );
}
