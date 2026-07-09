import { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "gold" | "valid" | "pending" | "invalid" | "outline";
  children: ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: "bg-trd-primary/10 text-trd-primary",
  gold: "bg-trd-secondary/15 text-trd-secondary-dark",
  valid: "bg-status-valid/10 text-status-valid",
  pending: "bg-status-pending/10 text-status-pending",
  invalid: "bg-status-invalid/10 text-status-invalid",
  outline: "bg-transparent border border-trd-border text-gray-600",
};

export default function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full
        text-xs font-semibold
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
