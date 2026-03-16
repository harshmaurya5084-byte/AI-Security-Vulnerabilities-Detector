import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";
import AppSidebar from "./AppSidebar";
import AIChat from "./AIChat";

export default function AppLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background cyber-grid scanline">
      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-card border-b border-border flex items-center px-4">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-primary">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <span className="ml-3 text-sm font-mono font-bold text-primary neon-text">AI_SEC</span>
      </div>

      {/* Sidebar - overlay on mobile */}
      {mobileOpen && <div className="md:hidden fixed inset-0 bg-background/80 z-40" onClick={() => setMobileOpen(false)} />}
      <div className={`fixed z-50 md:block ${mobileOpen ? "block" : "hidden"}`}>
        <AppSidebar onNavigate={() => setMobileOpen(false)} />
      </div>

      <main className="md:ml-[260px] min-h-screen transition-all duration-300 pt-14 md:pt-0">
        <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>

      {/* AI Chat */}
      <AIChat />
    </div>
  );
}
