import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Upload, GitBranch, Loader2, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VulnerabilityList, { Vulnerability } from "@/components/VulnerabilityList";
import SecurityScore from "@/components/SecurityScore";

const mockCodeVulns: Vulnerability[] = [
  { id: "c1", name: "Hardcoded API Key", severity: "critical", description: "API key exposed in source code at line 42.", location: "src/config.js:42", fix: "Move API keys to environment variables. Never commit secrets to version control." },
  { id: "c2", name: "SQL Injection", severity: "critical", description: "User input directly concatenated into SQL query.", location: "src/db/queries.py:78", fix: "Use parameterized queries: cursor.execute('SELECT * FROM users WHERE id = %s', (user_id,))" },
  { id: "c3", name: "Weak Password Hashing", severity: "high", description: "Using MD5 for password hashing. Easily brute-forced.", location: "src/auth/hash.js:15", fix: "Use bcrypt or argon2 for password hashing." },
  { id: "c4", name: "Insecure Random", severity: "medium", description: "Math.random() used for token generation. Not cryptographically secure.", location: "src/utils/token.js:8", fix: "Use crypto.randomBytes() or crypto.getRandomValues()." },
];

export default function CodeScanner() {
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<Vulnerability[] | null>(null);
  const [repoUrl, setRepoUrl] = useState("");
  const [codeInput, setCodeInput] = useState("");

  const handleScan = async () => {
    setScanning(true);
    setResults(null);
    await new Promise(r => setTimeout(r, 3000));
    setResults(mockCodeVulns);
    setScanning(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> CODE_SCANNER
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">
          AI-powered source code vulnerability analysis
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <Tabs defaultValue="paste" className="w-full">
          <TabsList className="bg-muted border border-border">
            <TabsTrigger value="paste" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Code className="w-4 h-4 mr-2" />Paste Code
            </TabsTrigger>
            <TabsTrigger value="github" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <GitBranch className="w-4 h-4 mr-2" />GitHub Repo
            </TabsTrigger>
            <TabsTrigger value="upload" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
              <Upload className="w-4 h-4 mr-2" />Upload Files
            </TabsTrigger>
          </TabsList>

          <TabsContent value="paste" className="mt-4">
            <Textarea
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              placeholder="// Paste your code here for analysis..."
              className="min-h-[200px] font-mono text-sm bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </TabsContent>

          <TabsContent value="github" className="mt-4">
            <Input
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="font-mono bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </TabsContent>

          <TabsContent value="upload" className="mt-4">
            <div className="border-2 border-dashed border-border rounded-lg p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-mono text-muted-foreground">Drop files here or click to browse</p>
              <p className="text-xs font-mono text-muted-foreground/50 mt-1">Supports .py, .js, .ts, .java, .php, .go</p>
            </div>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleScan}
          disabled={scanning}
          className="mt-4 font-mono bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {scanning ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Scan className="w-4 h-4 mr-2" />}
          {scanning ? "ANALYZING..." : "ANALYZE CODE"}
        </Button>
      </div>

      {results && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SecurityScore score={35} />
            <div className="md:col-span-2 rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-mono text-muted-foreground mb-4">DETECTED ISSUES ({results.length})</h3>
              <VulnerabilityList vulnerabilities={results} />
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
