import { Badge } from "@/components/ui/badge";
import { cn } from "@/core/lib/utils";

interface StatusBadgeProps {
  status: string;
  role?: "business_user" | "admin";
  className?: string;
}

const getStatusConfig = (
  status: string,
  role: "business_user" | "admin" = "business_user",
) => {
  switch (status) {
    case "pending":
      return {
        label: role === "admin" ? "Requested" : "Pending",
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      };
    case "awaiting_payment":
      return {
        label: role === "admin" ? "Awaiting Payment" : "Payment Pending",
        color: "bg-blue-100 text-blue-800 border-blue-200",
      };
    case "paid":
      return {
        label: "Payment Completed",
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
      };
    case "in_possession":
      return {
        label: role === "admin" ? "Out of Possession" : "In Possession",
        color: "bg-purple-100 text-purple-800 border-purple-200",
      };
    case "returned":
      return {
        label: "Returned",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
    case "overdue":
      return {
        label: "Due for Return",
        color: "bg-red-100 text-red-800 border-red-200",
      };
    case "cancelled":
      return {
        label: "Cancelled",
        color: "bg-slate-100 text-slate-800 border-slate-200",
      };
    default:
      return {
        label: status,
        color: "bg-gray-100 text-gray-800 border-gray-200",
      };
  }
};

export function StatusBadge({
  status,
  role = "business_user",
  className,
}: StatusBadgeProps) {
  const { label, color } = getStatusConfig(status, role);

  return (
    <Badge
      className={cn("font-normal border", color, className)}
      variant="outline"
    >
      {label}
    </Badge>
  );
}
