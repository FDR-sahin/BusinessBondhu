import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  /** Error message from React Hook Form (already in Bangla from the Zod schema). */
  error?: string;
  hint?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
}

/** Label + control + error/hint, wired for screen readers via role="alert". */
export function FormField({ label, htmlFor, error, hint, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
      </Label>
      {children}
      {error ? (
        <p role="alert" className="text-sm text-danger">{error}</p>
      ) : hint ? (
        <p className="text-sm text-ink-secondary">{hint}</p>
      ) : null}
    </div>
  );
}
