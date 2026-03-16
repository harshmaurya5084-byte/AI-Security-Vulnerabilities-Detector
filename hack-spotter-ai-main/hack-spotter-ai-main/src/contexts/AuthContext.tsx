import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  name: string;
  role: string;
}

interface ScanResult {
  id: string;
  type: "website" | "app";
  target: string;
  score: number;
  date: string;
  vulnerabilities: any[];
  meta?: {
    theme: string;
    font: string;
    language: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  scanResults: ScanResult[];
  addScanResult: (result: ScanResult) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);

  const login = (email: string, password: string) => {
    if (email && password) {
      const name = email.split("@")[0].replace(/[^a-zA-Z]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      setUser({ email, name: name || "User", role: "Security Analyst" });
      return true;
    }
    return false;
  };

  const logout = () => setUser(null);

  const addScanResult = (result: ScanResult) => {
    setScanResults((prev) => [result, ...prev]);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, scanResults, addScanResult }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
