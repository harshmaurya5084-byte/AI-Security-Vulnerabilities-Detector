import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, LayoutDashboard, Globe, Smartphone, Code, Server,
  FileText, History, BookOpen, Settings, ChevronLeft, ChevronRight,
  AlertTriangle, Activity
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Globe, label: "Website Scanner", path: "/scan/website" },
  { icon: Smartphone, label: "App Scanner", path: "/scan/app" },
  { icon: Code, label: "Code Scanner", path: "/scan/code" },
  { icon: Server, label: "API Scanner", path: "/scan/api" },
  { icon: FileText, label: "Reports", path: "/reports" },
  { icon: History, label: "Scan History", path: "/history" },
  { icon: Activity, label: "Threat Monitor", path: "/threats" },
  { icon: BookOpen, label: "Knowledge Base", path: "/knowledge" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center pulse-glow">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col"
          >
            <span className="text-sm font-bold font-mono text-primary neon-text">AI_SEC</span>
            <span className="text-[10px] text-muted-foreground font-mono">VULN DETECTOR</span>
          </motion.div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-all group relative ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-0.5 bg-primary rounded-full"
                  style={{ boxShadow: "var(--neon-glow)" }}
                />
              )}
              <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "drop-shadow-[0_0_6px_hsl(150,100%,45%)]" : ""}`} />
              {!collapsed && (
                <span className="text-sm font-mono truncate">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-12 border-t border-sidebar-border text-muted-foreground hover:text-primary transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
