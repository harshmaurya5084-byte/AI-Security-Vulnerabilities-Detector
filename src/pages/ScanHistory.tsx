import { motion } from "framer-motion";
import { Globe, Smartphone, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const getIconForType = (type: string) => {
  switch (type) {
    case "website":
      return Globe;
    case "app":
      return Smartphone;
    default:
      return Globe;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-warning";
  if (score >= 40) return "text-[hsl(30,100%,50%)]";
  return "text-destructive";
};

export default function ScanHistory() {
  const { scanResults } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> SCAN_HISTORY
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Previous scan results and reports</p>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 border-b border-border text-xs font-mono text-muted-foreground">
          <span>TYPE</span><span>TARGET</span><span>DATE</span><span>SCORE</span><span>VULNS</span>
        </div>
        {scanResults.length === 0 ? (
          <div className="p-6 text-center text-sm font-mono text-muted-foreground">No scans yet — run a website or app scan to see history here.</div>
        ) : (
          scanResults.map((scan, i) => {
            const Icon = getIconForType(scan.type);
            const targetLink = scan.target.startsWith("http") ? scan.target : scan.type === "website" ? `https://${scan.target}` : scan.target;
            return (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 p-4 border-b border-border/50 items-center hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => window.open(targetLink, "_blank")}
              >
                <Icon className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-sm font-mono text-foreground truncate group-hover:text-primary transition-colors flex items-center gap-1">
                    {scan.target} <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </span>
                  {scan.meta && (
                    <p className="text-[10px] text-muted-foreground font-mono mt-1">
                      Theme: <span className="text-foreground">{scan.meta.theme}</span> • Font: <span className="text-foreground">{scan.meta.font}</span> • Lang: <span className="text-foreground">{scan.meta.language}</span>
                    </p>
                  )}
                </div>
                <span className="text-xs font-mono text-muted-foreground">{scan.date}</span>
                <span className={`text-sm font-mono font-bold ${getScoreColor(scan.score)}`}>{scan.score}</span>
                <span className="text-sm font-mono text-muted-foreground">{scan.vulnerabilities.length}</span>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
