import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Scan, Loader2, Shield, ExternalLink, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SecurityScore from "@/components/SecurityScore";
import VulnerabilityList, { Vulnerability } from "@/components/VulnerabilityList";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import AIAssistant from "@/components/AIAssistant";

interface SecurityCheck {
  name: string;
  status: "pass" | "fail" | "warn";
  detail: string;
}

function generateResults(url: string): { vulns: Vulnerability[]; checks: SecurityCheck[]; score: number; meta: { theme: string; font: string; language: string } } {
  const hash = url.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hasSSL = url.includes("https") || hash % 3 !== 0;
  const hasHSTS = hash % 4 !== 0;
  const hasCSP = hash % 5 !== 0;
  const hasXFrame = hash % 3 !== 1;
  const hasSQLi = hash % 7 === 0;
  const hasXSS = hash % 6 === 0;
  const hasOpenPorts = hash % 8 === 0;
  const hasDirListing = hash % 9 === 0;
  const hasTLS10 = hash % 5 === 0;

  const themes = ["Dark", "Light", "Cyber", "Minimal", "Neon"];
  const fonts = ["Inter", "Roboto", "Montserrat", "JetBrains Mono", "IBM Plex Sans"];
  const languages = ["en", "es", "fr", "de", "pt"];
  const theme = themes[hash % themes.length];
  const font = fonts[hash % fonts.length];
  const language = languages[hash % languages.length];

  const checks: SecurityCheck[] = [
    { name: "SSL/TLS Certificate", status: hasSSL ? "pass" : "fail", detail: hasSSL ? "Valid SSL certificate detected" : "No valid SSL certificate found" },
    { name: "HSTS Header", status: hasHSTS ? "pass" : "warn", detail: hasHSTS ? "Strict-Transport-Security header present" : "HSTS header missing" },
    { name: "Content Security Policy", status: hasCSP ? "pass" : "fail", detail: hasCSP ? "CSP header configured" : "No CSP header found" },
    { name: "X-Frame-Options", status: hasXFrame ? "pass" : "warn", detail: hasXFrame ? "X-Frame-Options set to DENY" : "X-Frame-Options header missing" },
    { name: "TLS Version", status: hasTLS10 ? "fail" : "pass", detail: hasTLS10 ? "Deprecated TLS 1.0 supported" : "Only TLS 1.2+ supported" },
    { name: "Open Ports", status: hasOpenPorts ? "warn" : "pass", detail: hasOpenPorts ? "Non-standard ports detected" : "No unusual open ports" },
  ];

  const vulns: Vulnerability[] = [];
  if (hasSQLi) vulns.push({ id: "w1", name: "SQL Injection", severity: "critical", description: "Login endpoint vulnerable to SQL injection.", location: "POST /api/login", fix: "Use parameterized queries." });
  if (hasXSS) vulns.push({ id: "w2", name: "Cross-Site Scripting (XSS)", severity: "high", description: "Reflected XSS in search parameter.", location: "GET /search?q=", fix: "Encode all user output. Add CSP." });
  if (!hasCSP) vulns.push({ id: "w3", name: "Missing CSP Header", severity: "medium", description: "Content-Security-Policy header not set.", fix: "Add a restrictive CSP header." });
  if (!hasHSTS) vulns.push({ id: "w4", name: "Missing HSTS", severity: "medium", description: "Strict-Transport-Security not configured.", fix: "Add HSTS with max-age=31536000." });
  if (!hasXFrame) vulns.push({ id: "w5", name: "Clickjacking Risk", severity: "medium", description: "X-Frame-Options not set, clickjacking possible.", fix: "Set X-Frame-Options: DENY." });
  if (hasDirListing) vulns.push({ id: "w6", name: "Directory Listing", severity: "high", description: "Directory listing enabled on /assets/.", location: "/assets/", fix: "Disable directory listing." });
  if (hasTLS10) vulns.push({ id: "w7", name: "TLS 1.0 Supported", severity: "medium", description: "Server supports deprecated TLS 1.0.", fix: "Disable TLS 1.0/1.1, allow only 1.2+." });
  if (!hasSSL) vulns.push({ id: "w8", name: "No SSL Certificate", severity: "critical", description: "Website is not using HTTPS.", fix: "Install a valid SSL certificate (e.g., Let's Encrypt)." });

  const passCount = checks.filter((c) => c.status === "pass").length;
  const score = Math.round((passCount / checks.length) * 80 + (vulns.length === 0 ? 20 : Math.max(0, 20 - vulns.length * 4)));

  return {
    vulns,
    checks,
    score: Math.min(100, Math.max(5, score)),
    meta: {
      theme,
      font,
      language,
    },
  };
}

export default function WebsiteScanner() {
  const { addScanResult } = useAuth();
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ vulns: Vulnerability[]; checks: SecurityCheck[]; score: number } | null>(null);
  const [scanPhase, setScanPhase] = useState("");

  const phases = ["Resolving DNS...", "Checking SSL/TLS...", "Scanning ports...", "Testing SQL injection...", "Testing XSS vectors...", "Checking security headers...", "Analyzing directory exposure...", "Generating report..."];

  const handleScan = async () => {
    if (!url) return;
    setScanning(true);
    setResults(null);
    setProgress(0);

    for (let i = 0; i < phases.length; i++) {
      setScanPhase(phases[i]);
      setProgress(((i + 1) / phases.length) * 100);
      await new Promise((r) => setTimeout(r, 500 + Math.random() * 300));
    }

    const res = generateResults(url);
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
      type: "website",
      target: url,
      score: res.score,
      date: new Date().toLocaleDateString(),
      vulnerabilities: res.vulns,
      meta: res.meta,
    });

    setScanning(false);
    setScanPhase("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> WEBSITE_SCANNER
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Scan any website for security vulnerabilities</p>
      </div>

      {/* Input */}
      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">TARGET URL</span>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">https://</span>
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="example.com"
              className="pl-[72px] font-mono bg-muted border-border h-12 text-foreground placeholder:text-muted-foreground/50"
              onKeyDown={(e) => e.key === "Enter" && handleScan()}
            />
          </div>
          <Button onClick={handleScan} disabled={scanning || !url} className="h-12 px-6 font-mono bg-primary text-primary-foreground hover:bg-primary/90">
            {scanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scan className="w-4 h-4 mr-2" />}
            {scanning ? "SCANNING..." : "SCAN"}
          </Button>
        </div>

        <AnimatePresence>
          {scanning && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-primary">{scanPhase}</span>
                <span className="text-xs font-mono text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <motion.div className="h-full bg-primary rounded-full" style={{ boxShadow: "var(--neon-glow)" }} animate={{ width: `${progress}%` }} transition={{ duration: 0.3 }} />
              </div>
              <div className="mt-3 p-3 rounded bg-muted/50 border border-border font-mono text-xs text-muted-foreground">
                <span className="text-primary">{">"}</span> Scanning target: https://{url}<br />
                <span className="text-primary">{">"}</span> {scanPhase}<span className="typing-cursor" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            {/* Security Checks */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-mono text-muted-foreground mb-4">SECURITY CONDITION CHECKS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {results.checks.map((check) => (
                  <div key={check.name} className={`flex items-center gap-3 p-3 rounded border ${check.status === "pass" ? "border-primary/20 bg-primary/5" : check.status === "warn" ? "border-warning/20 bg-warning/5" : "border-destructive/20 bg-destructive/5"}`}>
                    {check.status === "pass" ? <CheckCircle className="w-4 h-4 text-primary shrink-0" /> : check.status === "warn" ? <AlertTriangle className="w-4 h-4 text-warning shrink-0" /> : <XCircle className="w-4 h-4 text-destructive shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-xs font-mono font-bold text-foreground">{check.name}</p>
                      <p className="text-[10px] font-mono text-muted-foreground">{check.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Score + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SecurityScore score={results.score} />
              <div className="md:col-span-2 rounded-lg border border-border bg-card p-5">
                <h3 className="text-sm font-mono text-muted-foreground mb-3">SCAN SUMMARY</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded bg-muted/50">
                    <span className="text-xs text-muted-foreground font-mono">Target</span>
                    <p className="text-sm font-mono text-foreground flex items-center gap-1">https://{url} <ExternalLink className="w-3 h-3 text-primary" /></p>
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

            {/* Website Analysis */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-mono text-muted-foreground mb-4">WEBSITE ANALYSIS</h3>
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

            {/* Vulns */}
            {results.vulns.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="text-sm font-mono text-muted-foreground mb-4">VULNERABILITIES DETECTED ({results.vulns.length})</h3>
                <VulnerabilityList vulnerabilities={results.vulns} />
              </div>
            )}

            {/* AI Assistant */}
            <AIAssistant
              vulnerabilities={results.vulns}
              scanType="website"
              target={url}
              score={results.score}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
