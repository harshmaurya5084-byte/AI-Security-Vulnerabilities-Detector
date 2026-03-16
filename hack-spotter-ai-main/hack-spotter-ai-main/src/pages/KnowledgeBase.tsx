import { motion } from "framer-motion";
import { BookOpen, ShieldAlert, ExternalLink } from "lucide-react";

const owaspTop10 = [
  { id: "A01", name: "Broken Access Control", desc: "Restrictions on what authenticated users can do are not properly enforced.", prevention: "Implement proper access controls, deny by default, enforce record ownership." },
  { id: "A02", name: "Cryptographic Failures", desc: "Failures related to cryptography leading to sensitive data exposure.", prevention: "Classify data, encrypt sensitive data at rest and in transit, use strong algorithms." },
  { id: "A03", name: "Injection", desc: "User-supplied data is not validated, filtered, or sanitized by the application.", prevention: "Use parameterized queries, input validation, and escape special characters." },
  { id: "A04", name: "Insecure Design", desc: "Missing or ineffective security controls in application design.", prevention: "Use secure design patterns, threat modeling, and security requirements." },
  { id: "A05", name: "Security Misconfiguration", desc: "Missing security hardening or improperly configured permissions.", prevention: "Harden configurations, remove unused features, automate verification." },
  { id: "A06", name: "Vulnerable Components", desc: "Using components with known vulnerabilities.", prevention: "Monitor CVEs, keep dependencies updated, remove unused dependencies." },
  { id: "A07", name: "Auth Failures", desc: "Broken authentication and session management.", prevention: "Implement MFA, strong password policies, and secure session management." },
  { id: "A08", name: "Software & Data Integrity", desc: "Code and infrastructure that does not protect against integrity violations.", prevention: "Verify software integrity, use signed updates, secure CI/CD pipelines." },
  { id: "A09", name: "Logging & Monitoring Failures", desc: "Insufficient logging, detection, monitoring, and active response.", prevention: "Log security events, implement alerting, and conduct regular audits." },
  { id: "A10", name: "SSRF", desc: "Server-Side Request Forgery - fetching remote resources without validating URLs.", prevention: "Sanitize and validate all client-supplied URLs, use allowlists." },
];

export default function KnowledgeBase() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> KNOWLEDGE_BASE
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">OWASP Top 10 & security reference</p>
      </div>

      <div className="space-y-3">
        {owaspTop10.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-lg border border-border bg-card p-5 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-mono font-bold text-primary">{item.id}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-mono font-semibold text-foreground">{item.name}</h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">{item.desc}</p>
                <div className="mt-2 p-2 rounded bg-primary/5 border border-primary/20">
                  <p className="text-xs font-mono text-primary">
                    <span className="font-bold">Prevention → </span>{item.prevention}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
