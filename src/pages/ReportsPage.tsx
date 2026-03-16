import { Globe, Smartphone, FileText, Download, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ReportsPage() {
  const { scanResults } = useAuth();
  const websiteScans = scanResults.filter((s) => s.type === "website");
  const appScans = scanResults.filter((s) => s.type === "app");

  const handleExport = (scan: any, format: "json" | "txt") => {
    const content = format === "json"
      ? JSON.stringify(scan, null, 2)
      : `Security Report\n================\nTarget: ${scan.target}\nType: ${scan.type}\nScore: ${scan.score}%\nDate: ${scan.date}\nVulnerabilities: ${scan.vulnerabilities.length}\n\n${scan.vulnerabilities.map((v: any) => `- [${v.severity.toUpperCase()}] ${v.name}: ${v.description}\n  Fix: ${v.fix}`).join("\n\n")}`;
    const blob = new Blob([content], { type: format === "json" ? "application/json" : "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `report-${scan.target.replace(/[^a-z0-9]/gi, "_")}.${format}`;
    a.click();
  };

  const ScanReportCard = ({ scan }: { scan: any }) => (
    <div className="rounded-lg border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {scan.type === "website" ? <Globe className="w-4 h-4 text-primary" /> : <Smartphone className="w-4 h-4 text-secondary" />}
          <span className="text-sm font-mono text-foreground truncate max-w-[250px]">{scan.target}</span>
        </div>
        <span className="text-xs font-mono text-muted-foreground">{scan.date}</span>
      </div>

      {/* Score bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-mono text-muted-foreground">Security Score</span>
          <span className={`text-sm font-mono font-bold ${scan.score >= 70 ? "text-primary" : scan.score >= 40 ? "text-warning" : "text-destructive"}`}>{scan.score}%</span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${scan.score >= 70 ? "bg-primary" : scan.score >= 40 ? "bg-warning" : "bg-destructive"}`}
            style={{ width: `${scan.score}%` }}
          />
        </div>
      </div>

      {/* Vuln stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        {["critical", "high", "medium", "low"].map((sev) => {
          const count = scan.vulnerabilities.filter((v: any) => v.severity === sev).length;
          return (
            <div key={sev} className="text-center p-2 rounded bg-muted/50">
              <span className={`text-lg font-bold font-mono ${sev === "critical" ? "text-destructive" : sev === "high" ? "text-warning" : sev === "medium" ? "text-yellow-400" : "text-primary"}`}>{count}</span>
              <p className="text-[10px] font-mono text-muted-foreground capitalize">{sev}</p>
            </div>
          );
        })}
      </div>

      {/* Export */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => handleExport(scan, "json")} className="flex-1 font-mono text-xs border-border text-muted-foreground hover:text-primary hover:border-primary">
          <Download className="w-3 h-3 mr-1" /> JSON
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleExport(scan, "txt")} className="flex-1 font-mono text-xs border-border text-muted-foreground hover:text-primary hover:border-primary">
          <FileText className="w-3 h-3 mr-1" /> TXT
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> REPORTS
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Security scan reports and exports</p>
      </div>

      <Tabs defaultValue="website" className="w-full">
        <TabsList className="bg-muted border border-border">
          <TabsTrigger value="website" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Globe className="w-4 h-4 mr-2" /> Website Reports ({websiteScans.length})
          </TabsTrigger>
          <TabsTrigger value="app" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Smartphone className="w-4 h-4 mr-2" /> App Reports ({appScans.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="website" className="mt-4">
          {websiteScans.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <Shield className="w-8 h-8 text-primary/30 mx-auto mb-3" />
              <p className="text-sm font-mono text-muted-foreground">No website scan reports yet. Run a website scan first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {websiteScans.map((scan) => <ScanReportCard key={scan.id} scan={scan} />)}
            </div>
          )}
        </TabsContent>

        <TabsContent value="app" className="mt-4">
          {appScans.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <Shield className="w-8 h-8 text-primary/30 mx-auto mb-3" />
              <p className="text-sm font-mono text-muted-foreground">No app scan reports yet. Run an app scan first.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appScans.map((scan) => <ScanReportCard key={scan.id} scan={scan} />)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
