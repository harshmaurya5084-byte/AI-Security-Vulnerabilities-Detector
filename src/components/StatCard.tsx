import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: string;
  variant?: "default" | "warning" | "danger" | "success";
}

const variantStyles = {
  default: "border-border bg-card",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-destructive/30 bg-destructive/5",
  success: "border-primary/30 bg-primary/5",
};

const iconVariants = {
  default: "text-primary bg-primary/10",
  warning: "text-warning bg-warning/10",
  danger: "text-destructive bg-destructive/10",
  success: "text-primary bg-primary/10",
};

export default function StatCard({ icon: Icon, label, value, trend, variant = "default" }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-5 ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconVariants[variant]}`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="text-xs font-mono text-primary">{trend}</span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold font-mono">{value}</p>
        <p className="text-xs text-muted-foreground font-mono mt-1">{label}</p>
      </div>
    </motion.div>
  );
}
