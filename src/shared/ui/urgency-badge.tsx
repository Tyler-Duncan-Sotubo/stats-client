import { NeedUrgency } from "@/features/needs/types/need.types";
import { cn } from "@/lib/utils";

type UrgencyBadgeProps = {
  urgency: NeedUrgency;
  className?: string;
};

function getUrgencyClasses(urgency: NeedUrgency) {
  switch (urgency) {
    case "high":
      return "bg-red-500 text-white";
    case "normal":
      return "bg-primary text-white";
    case "low":
    default:
      return "bg-slate-500 text-white";
  }
}

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-[20px] px-3 py-1 text-xs font-bold uppercase tracking-[0.5px]",
        getUrgencyClasses(urgency),
        className,
      )}
    >
      {urgency.charAt(0).toUpperCase() + urgency.slice(1)}
    </span>
  );
}
