import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending", className: "status-pending" },
  cutting: { label: "Cutting", className: "status-cutting" },
  stitching: { label: "Stitching", className: "status-stitching" },
  finishing: { label: "Finishing", className: "status-finishing" },
  ready: { label: "Ready", className: "status-ready" },
  delivered: { label: "Delivered", className: "status-delivered" },
};

export default function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] ?? { label: status, className: "" };
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
