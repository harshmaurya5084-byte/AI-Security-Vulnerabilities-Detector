import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import Dashboard from "@/pages/Dashboard";
import WebsiteScanner from "@/pages/WebsiteScanner";
import AppScanner from "@/pages/AppScanner";
import CodeScanner from "@/pages/CodeScanner";
import ApiScanner from "@/pages/ApiScanner";
import ReportsPage from "@/pages/ReportsPage";
import ScanHistory from "@/pages/ScanHistory";
import ThreatMonitor from "@/pages/ThreatMonitor";
import KnowledgeBase from "@/pages/KnowledgeBase";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function AppRoutes() {
  const { user } = useAuth();

  if (!user) return <LoginPage />;

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/scan/website" element={<WebsiteScanner />} />
        <Route path="/scan/app" element={<AppScanner />} />
        <Route path="/scan/code" element={<CodeScanner />} />
        <Route path="/scan/api" element={<ApiScanner />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/history" element={<ScanHistory />} />
        <Route path="/threats" element={<ThreatMonitor />} />
        <Route path="/knowledge" element={<KnowledgeBase />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AppLayout>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
