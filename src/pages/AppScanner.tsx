import { useState } from "react";
import { motion } from "framer-motion";
import { Smartphone, Upload, Loader2, Scan, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VulnerabilityList, { Vulnerability } from "@/components/VulnerabilityList";
import SecurityScore from "@/components/SecurityScore";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import AIAssistant from "@/components/AIAssistant";

function generateAppResults(input: string) {
  const hash = input.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const vulns: Vulnerability[] = [];
  const themes = ["Dark", "Light", "Cyber", "Minimal", "Neon"];
  const fonts = ["Inter", "Roboto", "Montserrat", "JetBrains Mono", "IBM Plex Sans"];
  const languages = ["en", "es", "fr", "de", "pt"];
  const theme = themes[hash % themes.length];
  const font = fonts[hash % fonts.length];
  const language = languages[hash % languages.length];

  if (hash % 3 === 0) vulns.push({ id: "m1", name: "Insecure Data Storage", severity: "critical", description: "Sensitive data stored without encryption.", fix: "Use EncryptedSharedPreferences." });
  if (hash % 4 === 0) vulns.push({ id: "m2", name: "Excessive Permissions", severity: "high", description: "App requests unnecessary permissions.", fix: "Remove unused permissions." });
  if (hash % 5 === 0) vulns.push({ id: "m3", name: "Hardcoded API Key", severity: "high", description: "API key found in source.", fix: "Use server-side key management." });
  if (hash % 2 === 0) vulns.push({ id: "m4", name: "Cleartext Traffic", severity: "medium", description: "App allows HTTP traffic.", fix: "Enforce HTTPS only." });
  if (hash % 7 === 0) vulns.push({ id: "m5", name: "Weak Encryption", severity: "high", description: "Using deprecated encryption algorithm.", fix: "Use AES-256-GCM." });

  if (vulns.length === 0) vulns.push({ id: "m6", name: "Minor Info Leak", severity: "low", description: "Debug logs enabled in production.", fix: "Disable debug logging." });

  const score = Math.max(10, Math.min(95, 90 - vulns.length * 12));
  return {
    vulns,
    score,
    meta: {
      theme,
      font,
      language,
    },
  };
}

export default function AppScanner() {
  const { addScanResult } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<{ vulns: Vulnerability[]; score: number; meta: { theme: string; font: string; language: string } } | null>(null);
  const [storeUrl, setStoreUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const scanTarget = storeUrl || fileName;

  const handleScan = async (target: string) => {
    if (!target) return;
    setScanning(true);
    setResults(null);
    await new Promise((r) => setTimeout(r, 3000));
    const res = generateAppResults(target);
    setResults(res);

    const hasSerious = res.vulns.some((v) => v.severity === "critical" || v.severity === "high");
    const allGood = res.vulns.length === 0 || !hasSerious;

    const issueNames = res.vulns
      .filter((v) => v.severity === "critical" || v.severity === "high")
      .map((v) => v.name)
      .slice(0, 3)
      .join(", ");

    toast({
      title: allGood ? "Scan complete — all good" : "Detection alert — suspicious findings",
      description: allGood
        ? "No critical or high-severity issues were detected during the scan."
        : `Found ${res.vulns.length} issue(s): ${issueNames || "See report for details"}.`,
      variant: allGood ? "default" : "destructive",
    });

    addScanResult({
      id: Date.now().toString(),
      type: "app",
      target,
      score: res.score,
      date: new Date().toLocaleDateString(),
      vulnerabilities: res.vulns,
      meta: res.meta,
    });
    setScanning(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> APP_SCANNER
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Analyze mobile applications for security vulnerabilities</p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="upload" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Upload className="w-4 h-4 mr-2" />Upload APK
            </TabsTrigger>
            <TabsTrigger value="store" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Smartphone className="w-4 h-4 mr-2" />Store Link
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-4">
            <label className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer block">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-mono text-muted-foreground">{fileName || "Drop APK file here or click to browse"}</p>
              <input type="file" accept=".apk" className="hidden" onChange={(e) => { if (e.target.files?.[0]) setFileName(e.target.files[0].name); }} />
            </label>
            <Button onClick={() => handleScan(fileName)} disabled={scanning || !fileName} className="mt-4 font-mono bg-primary text-primary-foreground hover:bg-primary/90">
              {scanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scan className="w-4 h-4 mr-2" />}
              {scanning ? "ANALYZING..." : "SCAN APK"}
            </Button>
          </TabsContent>

          <TabsContent value="store" className="mt-4">
            <Input value={storeUrl} onChange={(e) => setStoreUrl(e.target.value)} placeholder="https://play.google.com/store/apps/details?id=..." className="font-mono bg-muted border-border text-foreground placeholder:text-muted-foreground/50" />
            <Button onClick={() => handleScan(storeUrl)} disabled={scanning || !storeUrl} className="mt-4 font-mono bg-primary text-primary-foreground hover:bg-primary/90">
              {scanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scan className="w-4 h-4 mr-2" />}
              {scanning ? "ANALYZING..." : "SCAN APP"}
            </Button>
          </TabsContent>
        </Tabs>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SecurityScore score={results.score} />
            <div className="md:col-span-2 rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-mono text-muted-foreground mb-3">SCAN SUMMARY</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground font-mono">Target</span>
                  <p className="text-sm font-mono text-foreground truncate">{scanTarget}</p>
                </div>
                <div className="p-3 rounded bg-muted/50">
                  <span className="text-xs text-muted-foreground font-mono">Security Score</span>
                  <p className={`text-lg font-mono font-bold ${results.score >= 70 ? "text-primary" : results.score >= 40 ? "text-warning" : "text-destructive"}`}>{results.score}%</p>
                </div>
                <div className="p-3 rounded bg-destructive/10">
                  <span className="text-xs text-muted-foreground font-mono">Critical</span>
                  <p className="text-lg font-mono font-bold text-destructive">{results.vulns.filter((v) => v.severity === "critical").length}</p>
                </div>
                <div className="p-3 rounded bg-warning/10">
                  <span className="text-xs text-muted-foreground font-mono">High</span>
                  <p className="text-lg font-mono font-bold text-warning">{results.vulns.filter((v) => v.severity === "high").length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* App Analysis */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-mono text-muted-foreground mb-4">APP ANALYSIS</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-xs font-mono text-muted-foreground">THEME DETECTED</span>
                </div>
                <p className="text-lg font-mono font-bold text-primary">{results.meta.theme}</p>
              </div>
              <div className="p-4 rounded bg-secondary/5 border border-secondary/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                  <span className="text-xs font-mono text-muted-foreground">FONT FAMILY</span>
                </div>
                <p className="text-lg font-mono font-bold text-foreground">{results.meta.font}</p>
              </div>
              <div className="p-4 rounded bg-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-accent"></div>
                  <span className="text-xs font-mono text-muted-foreground">LANGUAGE</span>
                </div>
                <p className="text-lg font-mono font-bold text-foreground">{results.meta.language.toUpperCase()}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-mono text-muted-foreground mb-4">APP VULNERABILITIES ({results.vulns.length})</h3>
            <VulnerabilityList vulnerabilities={results.vulns} />
          </div>

          {/* AI Assistant */}
          <AIAssistant
            vulnerabilities={results.vulns}
            scanType="app"
            target={scanTarget}
            score={results.score}
          />
        </motion.div>
      )}
    </div>
  );
}
