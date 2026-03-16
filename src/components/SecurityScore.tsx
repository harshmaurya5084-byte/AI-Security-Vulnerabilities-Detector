import { motion } from "framer-motion";

interface SecurityScoreProps {
  score: number;
}

export default function SecurityScore({ score }: SecurityScoreProps) {
  const getColor = () => {
    if (score >= 80) return "hsl(150, 100%, 45%)";
    if (score >= 60) return "hsl(45, 100%, 50%)";
    if (score >= 40) return "hsl(30, 100%, 50%)";
    return "hsl(0, 85%, 55%)";
  };

  const getLabel = () => {
    if (score >= 80) return "SECURE";
    if (score >= 60) return "MODERATE";
    if (score >= 40) return "AT RISK";
    return "CRITICAL";
  };

  const circumference = 2 * Math.PI * 58;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 rounded-lg border border-border bg-card">
      <h3 className="text-sm font-mono text-muted-foreground mb-4">SECURITY SCORE</h3>
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle cx="64" cy="64" r="58" stroke="hsl(220, 15%, 12%)" strokeWidth="8" fill="none" />
          <motion.circle
            cx="64" cy="64" r="58"
            stroke={getColor()}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${getColor()})` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-3xl font-bold font-mono"
            style={{ color: getColor() }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] font-mono text-muted-foreground">/100</span>
        </div>
      </div>
      <motion.span
        className="mt-3 text-xs font-mono font-bold tracking-widest"
        style={{ color: getColor() }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {getLabel()}
      </motion.span>
    </div>
  );
}
