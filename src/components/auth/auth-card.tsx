import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";
import { Card } from "@/components/ui/card";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  /** e.g. "অ্যাকাউন্ট নেই? সাইন আপ করুন" */
  footer?: ReactNode;
}

export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <Card className="w-full max-w-md p-6 shadow-md sm:p-8">
      <div className="flex justify-center"><Logo /></div>
      <div className="mt-6 text-center">
        <h1 className="text-2xl font-semibold leading-snug">{title}</h1>
        {description && <p className="mt-1.5 text-ink-secondary">{description}</p>}
      </div>
      <div className="mt-6">{children}</div>
      {footer && <p className="mt-6 text-center text-sm text-ink-secondary">{footer}</p>}
    </Card>
  );
}
