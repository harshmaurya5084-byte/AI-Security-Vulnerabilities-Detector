import { motion } from "framer-motion";
import { Shield, Globe, Smartphone, Scan, Bug, AlertTriangle, TrendingUp, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import SecurityScore from "@/components/SecurityScore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const { user, logout, scanResults } = useAuth();
  const navigate = useNavigate();

  const websiteScans = scanResults.filter((s) => s.type === "website");
  const appScans = scanResults.filter((s) => s.type === "app");

  const totalScans = scanResults.length;
  const totalVulns = scanResults.reduce((sum, s) => sum + s.vulnerabilities.length, 0);
  const avgScore = totalScans > 0 ? Math.round(scanResults.reduce((sum, s) => sum + s.score, 0) / totalScans) : 0;
  const criticalCount = scanResults.reduce(
    (sum, s) => sum + s.vulnerabilities.filter((v: any) => v.severity === "critical").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
            <span className="text-primary">$</span> DASHBOARD
          </h1>
          <p className="text-sm text-muted-foreground font-mono mt-1">
            Welcome, {user?.name} • Role: {user?.role}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-xs font-mono text-primary">ONLINE</span>
          </motion.div>
          <Button variant="ghost" size="sm" onClick={logout} className="font-mono text-xs text-muted-foreground hover:text-destructive">
            <LogOut className="w-4 h-4 mr-1" /> LOGOUT
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Scan, label: "Total Scans", value: totalScans, color: "text-primary" },
          { icon: Bug, label: "Vulnerabilities", value: totalVulns, color: "text-destructive" },
          { icon: AlertTriangle, label: "Critical", value: criticalCount, color: "text-warning" },
          { icon: TrendingUp, label: "Avg Score", value: avgScore ? `${avgScore}%` : "—", color: "text-primary" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-xs font-mono text-muted-foreground">{stat.label}</span>
            </div>
            <span className="text-2xl font-bold font-mono text-foreground">{stat.value}</span>
          </div>
        ))}
      </div>

      {/* No scans prompt */}
      {totalScans === 0 && (
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <Shield className="w-10 h-10 text-primary/30 mx-auto mb-3" />
          <p className="text-sm font-mono text-muted-foreground mb-4">No scans yet. Start scanning to see results here.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/scan/website")} className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
              <Globe className="w-4 h-4 mr-2" /> Scan Website
            </Button>
            <Button onClick={() => navigate("/scan/app")} variant="outline" className="font-mono border-border text-muted-foreground hover:text-primary hover:border-primary">
              <Smartphone className="w-4 h-4 mr-2" /> Scan App
            </Button>
          </div>
        </div>
      )}

      {/* Two Sections: Website & App */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Website Scans Section */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-mono text-primary">WEBSITE SCANS</h2>
            <span className="ml-auto text-xs font-mono text-muted-foreground">{websiteScans.length} scan(s)</span>
          </div>
          {websiteScans.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground py-6 text-center">No website scans yet</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {websiteScans.map((scan) => (
                <div key={scan.id} className="p-3 rounded bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-foreground truncate max-w-[200px]">{scan.target}</span>
                    <span className={`text-xs font-mono font-bold ${scan.score >= 70 ? "text-primary" : scan.score >= 40 ? "text-warning" : "text-destructive"}`}>
                      {scan.score}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scan.score >= 70 ? "bg-primary" : scan.score >= 40 ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${scan.score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{scan.vulnerabilities.length} vulns</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{scan.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* App Scans Section */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-5 h-5 text-secondary" />
            <h2 className="text-sm font-mono text-secondary">APP SCANS</h2>
            <span className="ml-auto text-xs font-mono text-muted-foreground">{appScans.length} scan(s)</span>
          </div>
          {appScans.length === 0 ? (
            <p className="text-xs font-mono text-muted-foreground py-6 text-center">No app scans yet</p>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {appScans.map((scan) => (
                <div key={scan.id} className="p-3 rounded bg-muted/50 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-foreground truncate max-w-[200px]">{scan.target}</span>
                    <span className={`text-xs font-mono font-bold ${scan.score >= 70 ? "text-primary" : scan.score >= 40 ? "text-warning" : "text-destructive"}`}>
                      {scan.score}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${scan.score >= 70 ? "bg-primary" : scan.score >= 40 ? "bg-warning" : "bg-destructive"}`}
                      style={{ width: `${scan.score}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-mono text-muted-foreground">{scan.vulnerabilities.length} vulns</span>
                    <span className="text-[10px] font-mono text-muted-foreground">{scan.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overall Security Score */}
      {totalScans > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SecurityScore score={avgScore} />
          <div className="lg:col-span-2 rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-mono text-muted-foreground mb-4">TOP SCANNED TARGETS</h3>
            <div className="space-y-2">
              {scanResults.slice(0, 5).map((scan, i) => (
                <div key={scan.id} className="flex items-center gap-3 p-2 rounded bg-muted/30">
                  <span className="text-xs font-mono text-muted-foreground w-5">#{i + 1}</span>
                  {scan.type === "website" ? <Globe className="w-4 h-4 text-primary" /> : <Smartphone className="w-4 h-4 text-secondary" />}
                  <span className="text-xs font-mono text-foreground flex-1 truncate">{scan.target}</span>
                  <span className={`text-xs font-mono font-bold ${scan.score >= 70 ? "text-primary" : scan.score >= 40 ? "text-warning" : "text-destructive"}`}>
                    {scan.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
