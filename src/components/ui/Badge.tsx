import { cn } from "@/lib/utils";

type BadgeVariant = "safe" | "warning" | "danger" | "info" | "neutral" | "party";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  partyColor?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  safe: "bg-green-100 text-green-700 border-green-200",
  warning: "bg-amber-100 text-amber-700 border-amber-200",
  danger: "bg-red-100 text-red-700 border-red-200",
  info: "bg-blue-100 text-blue-700 border-blue-200",
  neutral: "bg-gray-100 text-gray-600 border-gray-200",
  party: "border-transparent text-white",
};

export function Badge({
  variant = "neutral",
  partyColor,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
      style={
        variant === "party" && partyColor
          ? { backgroundColor: partyColor }
          : undefined
      }
      {...props}
    >
      {children}
    </span>
  );
}
