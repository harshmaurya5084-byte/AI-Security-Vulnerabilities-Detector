import { motion } from "framer-motion";
import { Activity, AlertTriangle, Shield, Clock } from "lucide-react";

const threats = [
  { id: 1, type: "Brute Force Attempt", source: "192.168.1.45", target: "/api/login", severity: "high", time: "2 min ago", status: "active" },
  { id: 2, type: "DDoS Pattern Detected", source: "Multiple IPs", target: "Main Server", severity: "critical", time: "5 min ago", status: "mitigated" },
  { id: 3, type: "Suspicious File Upload", source: "user@example.com", target: "/upload", severity: "medium", time: "12 min ago", status: "investigating" },
  { id: 4, type: "SQL Injection Attempt", source: "10.0.0.23", target: "/api/search", severity: "high", time: "18 min ago", status: "blocked" },
  { id: 5, type: "Port Scan Detected", source: "203.0.113.50", target: "Ports 1-1024", severity: "medium", time: "25 min ago", status: "blocked" },
];

const severityColors: Record<string, string> = {
  critical: "text-destructive bg-destructive/10 border-destructive/30",
  high: "text-[hsl(30,100%,50%)] bg-[hsl(30,100%,50%)]/10 border-[hsl(30,100%,50%)]/30",
  medium: "text-warning bg-warning/10 border-warning/30",
  low: "text-primary bg-primary/10 border-primary/30",
};

const statusColors: Record<string, string> = {
  active: "text-destructive",
  mitigated: "text-primary",
  investigating: "text-warning",
  blocked: "text-secondary",
};

export default function ThreatMonitor() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
            <span className="text-primary">$</span> THREAT_MONITOR
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">Real-time threat detection and monitoring</p>
        </div>
        <motion.div
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-destructive/30 bg-destructive/5"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-2 h-2 rounded-full bg-destructive" />
          <span className="text-xs font-mono text-destructive">5 ACTIVE THREATS</span>
        </motion.div>
      </div>

      <div className="space-y-3">
        {threats.map((threat, i) => (
          <motion.div
            key={threat.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1">
                <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${threat.severity === "critical" ? "text-destructive" : "text-warning"}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-mono font-semibold text-foreground">{threat.type}</h4>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${severityColors[threat.severity]}`}>
                      {threat.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs font-mono text-muted-foreground">
                    <span>Source: <span className="text-secondary">{threat.source}</span></span>
                    <span>Target: <span className="text-secondary">{threat.target}</span></span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className={`text-xs font-mono font-bold ${statusColors[threat.status]}`}>
                  {threat.status.toUpperCase()}
                </span>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span className="font-mono">{threat.time}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
