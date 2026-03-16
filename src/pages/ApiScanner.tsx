import { useState } from "react";
import { motion } from "framer-motion";
import { Server, Loader2, Scan, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import VulnerabilityList, { Vulnerability } from "@/components/VulnerabilityList";
import SecurityScore from "@/components/SecurityScore";

const mockApiVulns: Vulnerability[] = [
  { id: "a1", name: "Broken Authentication", severity: "critical", description: "API endpoint accessible without valid auth token.", location: "GET /api/users", fix: "Implement JWT validation middleware on all protected routes." },
  { id: "a2", name: "Missing Rate Limiting", severity: "high", description: "No rate limiting detected on API endpoints.", location: "POST /api/login", fix: "Implement rate limiting (e.g., 100 requests/minute per IP)." },
  { id: "a3", name: "Data Exposure", severity: "high", description: "API returns sensitive fields (password_hash, ssn) in responses.", location: "GET /api/users/:id", fix: "Create response DTOs excluding sensitive fields." },
  { id: "a4", name: "Missing CORS Restrictions", severity: "medium", description: "Access-Control-Allow-Origin set to wildcard *.", fix: "Restrict CORS to specific trusted origins." },
];

export default function ApiScanner() {
  const [endpoints, setEndpoints] = useState([""]);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Vulnerability[] | null>(null);

  const handleScan = async () => {
    setScanning(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 2500));
    setResults(mockApiVulns);
    setScanning(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> API_SCANNER
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          Test API endpoints for security vulnerabilities
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Server className="w-5 h-5 text-primary" />
          <span className="text-sm font-mono text-muted-foreground">API ENDPOINTS</span>
        </div>
        <div className="space-y-3">
          {endpoints.map((ep, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={ep}
                onChange={(e) => {
                  const next = [...endpoints];
                  next[i] = e.target.value;
                  setEndpoints(next);
                }}
                placeholder="https://api.example.com/v1/users"
                className="font-mono bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
              />
              {endpoints.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setEndpoints(endpoints.filter((_, j) => j !== i))}
                  className="border-border text-muted-foreground hover:text-destructive hover:border-destructive shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEndpoints([...endpoints, ""])}
            className="font-mono text-xs border-border text-muted-foreground hover:text-primary hover:border-primary"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Endpoint
          </Button>
        </div>
        <Button
          onClick={handleScan}
          disabled={scanning}
          className="mt-4 font-mono bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scan className="w-4 h-4 mr-2" />}
          {scanning ? "TESTING..." : "TEST ENDPOINTS"}
        </Button>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SecurityScore score={48} />
            <div className="md:col-span-2 rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-mono text-muted-foreground mb-4">API VULNERABILITIES ({results.length})</h3>
              <VulnerabilityList vulnerabilities={results} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
