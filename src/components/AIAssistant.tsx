import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Lightbulb, Code, Shield, CheckCircle, AlertTriangle, XCircle, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vulnerability } from "@/components/VulnerabilityList";

interface AIAssistantProps {
  vulnerabilities: Vulnerability[];
  scanType: "website" | "app";
  target: string;
  score: number;
}

interface AIFix {
  title: string;
  description: string;
  steps: string[];
  code?: string;
  priority: "high" | "medium" | "low";
  impact: string;
}

function generateAIAnalysis(vulns: Vulnerability[], scanType: string, target: string, score: number): {
  summary: string;
  riskLevel: "critical" | "high" | "medium" | "low";
  fixes: AIFix[];
  recommendations: string[];
} {
  const criticalCount = vulns.filter(v => v.severity === "critical").length;
  const highCount = vulns.filter(v => v.severity === "high").length;
  const mediumCount = vulns.filter(v => v.severity === "medium").length;
  const lowCount = vulns.filter(v => v.severity === "low").length;

  let riskLevel: "critical" | "high" | "medium" | "low" = "low";
  if (criticalCount > 0) riskLevel = "critical";
  else if (highCount > 0) riskLevel = "high";
  else if (mediumCount > 0) riskLevel = "medium";

  const fixes: AIFix[] = [];

  // Generate specific fixes based on vulnerabilities
  vulns.forEach(vuln => {
    switch (vuln.name.toLowerCase()) {
      case "sql injection":
        fixes.push({
          title: "Implement Parameterized Queries",
          description: "Replace direct SQL string concatenation with parameterized queries to prevent SQL injection attacks.",
          steps: [
            "Use prepared statements or parameterized queries",
            "Validate and sanitize all user inputs",
            "Implement input length limits",
            "Use stored procedures when possible"
          ],
          code: `// Instead of:
// $query = "SELECT * FROM users WHERE id = " . $_GET['id'];

// Use:
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);`,
          priority: "high",
          impact: "Prevents data breaches and unauthorized access"
        });
        break;

      case "cross-site scripting (xss)":
        fixes.push({
          title: "Implement Content Security Policy & Input Sanitization",
          description: "Add CSP headers and properly sanitize all user inputs to prevent XSS attacks.",
          steps: [
            "Implement Content Security Policy (CSP) headers",
            "Use output encoding for all user-generated content",
            "Validate and sanitize input on both client and server side",
            "Use secure coding frameworks with built-in XSS protection"
          ],
          code: `// Add CSP header
header("Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");

// Sanitize output
echo htmlspecialchars($userInput, ENT_QUOTES, 'UTF-8');`,
          priority: "high",
          impact: "Prevents malicious script execution in user browsers"
        });
        break;

      case "missing ssl/tls certificate":
        fixes.push({
          title: "Install SSL/TLS Certificate",
          description: "Implement HTTPS encryption to secure data transmission.",
          steps: [
            "Obtain SSL certificate from trusted CA (Let's Encrypt is free)",
            "Configure web server for HTTPS",
            "Redirect all HTTP traffic to HTTPS",
            "Update all internal links to use HTTPS"
          ],
          code: `# Apache .htaccess redirect
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`,
          priority: "high",
          impact: "Encrypts all data transmission and builds user trust"
        });
        break;

      case "weak encryption":
        fixes.push({
          title: "Upgrade to Strong Encryption Standards",
          description: "Replace weak encryption algorithms with modern, secure standards.",
          steps: [
            "Use AES-256-GCM for symmetric encryption",
            "Implement proper key management",
            "Use secure random number generation",
            "Regularly rotate encryption keys"
          ],
          code: `// Use AES-256-GCM
const crypto = require('crypto');

const algorithm = 'aes-256-gcm';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

const cipher = crypto.createCipher(algorithm, key);
let encrypted = cipher.update(text, 'utf8', 'hex');
encrypted += cipher.final('hex');`,
          priority: "high",
          impact: "Ensures data confidentiality and integrity"
        });
        break;

      case "insecure data storage":
        fixes.push({
          title: "Implement Secure Data Storage",
          description: "Use encrypted storage solutions and proper access controls.",
          steps: [
            "Use EncryptedSharedPreferences for sensitive data",
            "Implement proper database encryption",
            "Use secure key storage solutions",
            "Implement access control and audit logging"
          ],
          code: `// Android EncryptedSharedPreferences
val masterKey = MasterKey.Builder(context)
    .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
    .build()

val sharedPreferences = EncryptedSharedPreferences.create(
    context,
    "secret_shared_prefs",
    masterKey,
    EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
    EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
)`,
          priority: "high",
          impact: "Protects sensitive user data from unauthorized access"
        });
        break;

      default:
        fixes.push({
          title: `Address ${vuln.name}`,
          description: `Resolve the ${vuln.severity} severity ${vuln.name} vulnerability.`,
          steps: [
            "Review the vulnerability details",
            "Implement appropriate security controls",
            "Test the fix thoroughly",
            "Monitor for similar issues"
          ],
          priority: vuln.severity === "critical" ? "high" : vuln.severity === "high" ? "medium" : "low",
          impact: "Improves overall security posture"
        });
    }
  });

  const recommendations = [
    "Implement regular security audits and penetration testing",
    "Keep all software and dependencies updated",
    "Use security headers (CSP, HSTS, X-Frame-Options)",
    "Implement proper logging and monitoring",
    "Conduct security awareness training for developers",
    "Use automated security testing in CI/CD pipelines"
  ];

  let summary = "";
  if (vulns.length === 0) {
    summary = `🎉 Excellent! No vulnerabilities detected in your ${scanType}. Your security score of ${score}% indicates strong security practices. Continue monitoring and maintaining these standards.`;
  } else {
    summary = `⚠️ Analysis complete. Found ${vulns.length} vulnerabilities (${criticalCount} critical, ${highCount} high, ${mediumCount} medium, ${lowCount} low severity). Overall security score: ${score}%. I've provided detailed remediation steps below.`;
  }

  return { summary, riskLevel, fixes, recommendations };
}

export default function AIAssistant({ vulnerabilities, scanType, target, score }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const analysis = generateAIAnalysis(vulnerabilities, scanType, target, score);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical": return "text-destructive bg-destructive/10";
      case "high": return "text-warning bg-warning/10";
      case "medium": return "text-orange-500 bg-orange-100";
      case "low": return "text-primary bg-primary/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "critical": return <XCircle className="w-4 h-4" />;
      case "high": return <AlertTriangle className="w-4 h-4" />;
      case "medium": return <AlertTriangle className="w-4 h-4" />;
      case "low": return <CheckCircle className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  if (vulnerabilities.length === 0 && !isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-primary/20 bg-primary/5 p-4 cursor-pointer hover:bg-primary/10 transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <div className="flex items-center gap-3">
          <Bot className="w-6 h-6 text-primary" />
          <div className="flex-1">
            <h3 className="font-mono text-sm font-bold text-primary">AI Security Analysis</h3>
            <p className="text-xs text-muted-foreground font-mono">Click to view detailed security insights</p>
          </div>
          <Badge className="font-mono text-xs bg-primary/20 text-primary">All Clear</Badge>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bot className="w-6 h-6 text-primary" />
              <div>
                <CardTitle className="font-mono text-lg">AI Security Assistant</CardTitle>
                <CardDescription className="font-mono">Intelligent analysis and remediation guidance</CardDescription>
              </div>
            </div>
            <Badge className={`font-mono text-xs flex items-center gap-1 ${getRiskColor(analysis.riskLevel)}`}>
              {getRiskIcon(analysis.riskLevel)}
              {analysis.riskLevel.toUpperCase()} RISK
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-card border border-border">
              <h4 className="font-mono text-sm font-bold mb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" />
                Analysis Summary
              </h4>
              <p className="text-sm font-mono text-muted-foreground leading-relaxed">{analysis.summary}</p>
            </div>

            {analysis.fixes.length > 0 && (
              <Tabs defaultValue="fixes" className="w-full">
                <TabsList className="bg-muted border border-border">
                  <TabsTrigger value="fixes" className="font-mono text-xs">
                    <Shield className="w-4 h-4 mr-1" />
                    Fix Solutions ({analysis.fixes.length})
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="font-mono text-xs">
                    <Lightbulb className="w-4 h-4 mr-1" />
                    Recommendations
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="fixes" className="space-y-4">
                  {analysis.fixes.map((fix, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 rounded-lg border border-border bg-card"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-mono text-sm font-bold flex items-center gap-2">
                            <Code className="w-4 h-4 text-primary" />
                            {fix.title}
                          </h5>
                          <p className="text-xs text-muted-foreground font-mono mt-1">{fix.description}</p>
                        </div>
                        <Badge variant={fix.priority === "high" ? "destructive" : "secondary"} className="font-mono text-xs">
                          {fix.priority} priority
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h6 className="font-mono text-xs font-bold text-muted-foreground mb-2">IMPLEMENTATION STEPS:</h6>
                          <ol className="list-decimal list-inside space-y-1">
                            {fix.steps.map((step, stepIndex) => (
                              <li key={stepIndex} className="text-xs font-mono text-foreground">{step}</li>
                            ))}
                          </ol>
                        </div>

                        {fix.code && (
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <h6 className="font-mono text-xs font-bold text-muted-foreground">CODE EXAMPLE:</h6>
                              <Button variant="ghost" size="sm" className="h-6 px-2 font-mono text-xs">
                                <Copy className="w-3 h-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto border">
                              <code>{fix.code}</code>
                            </pre>
                          </div>
                        )}

                        <div className="pt-2 border-t border-border">
                          <p className="text-xs font-mono text-primary">
                            <strong>Impact:</strong> {fix.impact}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.recommendations.map((rec, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="p-3 rounded-lg border border-border bg-card"
                      >
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <p className="text-xs font-mono text-foreground">{rec}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted-foreground">AI Analysis powered by advanced security intelligence</span>
              </div>
              <Button variant="outline" size="sm" className="font-mono text-xs">
                <ExternalLink className="w-3 h-3 mr-1" />
                Learn More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}