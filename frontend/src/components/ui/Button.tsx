import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  isLoading?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    "bg-trd-primary text-white hover:bg-trd-primary-dark active:bg-trd-primary-dark shadow-sm hover:shadow-md",
  secondary:
    "bg-trd-secondary text-trd-primary-dark font-semibold hover:bg-trd-secondary-light active:bg-trd-secondary-dark shadow-gold hover:shadow-lg",
  outline:
    "bg-transparent text-white border-2 border-white/40 hover:bg-white/10 hover:border-white/70",
  ghost:
    "bg-transparent text-trd-primary hover:bg-trd-primary/5 active:bg-trd-primary/10",
  danger:
    "bg-status-invalid text-white hover:bg-red-700 active:bg-red-800 shadow-sm",
};

const sizeStyles: Record<string, string> = {
  sm: "px-4 py-2 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-lg",
  lg: "px-8 py-3.5 text-base rounded-xl",
};

export default function Button({
  variant = "primary",
  size = "md",
  children,
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium
        transition-all duration-200 ease-out transform hover:scale-[1.02] active:scale-[0.98]
        focus:outline-none focus:ring-2 focus:ring-trd-primary/30 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:transform-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
