import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Scan,
  Shield,
  Bell,
  Settings,
  Key,
  Database,
  Crown,
  Save,
  Eye,
  EyeOff,
  Globe,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Mail,
  MessageSquare,
  Webhook,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    scanComplete: true,
    threatAlerts: true,
    weeklyReports: false
  });

  const [scanSettings, setScanSettings] = useState({
    autoScan: false,
    scanFrequency: "daily",
    maxConcurrentScans: 5,
    timeout: 30,
    deepScan: true,
    vulnerabilityThreshold: "medium"
  });

  const [securityPrefs, setSecurityPrefs] = useState({
    twoFactor: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    auditLogging: true,
    ipWhitelist: false,
    encryptionLevel: "AES256"
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-mono text-foreground neon-text">
          <span className="text-primary">$</span> SETTINGS
        </h1>
        <p className="text-sm text-muted-foreground font-mono mt-1">Configure your security platform preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 bg-muted border border-border">
          <TabsTrigger value="profile" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <User className="w-4 h-4 mr-1" />Profile
          </TabsTrigger>
          <TabsTrigger value="scan" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Scan className="w-4 h-4 mr-1" />Scan
          </TabsTrigger>
          <TabsTrigger value="threats" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Shield className="w-4 h-4 mr-1" />Threats
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Bell className="w-4 h-4 mr-1" />Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Settings className="w-4 h-4 mr-1" />Security
          </TabsTrigger>
          <TabsTrigger value="api" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Key className="w-4 h-4 mr-1" />API
          </TabsTrigger>
          <TabsTrigger value="data" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Database className="w-4 h-4 mr-1" />Data
          </TabsTrigger>
          <TabsTrigger value="admin" className="font-mono text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
            <Crown className="w-4 h-4 mr-1" />Admin
          </TabsTrigger>
        </TabsList>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <User className="w-5 h-5 text-primary" />
                Profile Settings
              </CardTitle>
              <CardDescription>Manage your account information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-mono text-sm">Full Name</Label>
                  <Input id="name" defaultValue={user?.name || ""} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-mono text-sm">Email Address</Label>
                  <Input id="email" type="email" defaultValue={user?.email || ""} className="font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="font-mono text-sm">Role</Label>
                  <Input id="role" defaultValue={user?.role || ""} className="font-mono" disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="font-mono text-sm">Timezone</Label>
                  <Select defaultValue="utc">
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="utc">UTC</SelectItem>
                      <SelectItem value="est">Eastern Time</SelectItem>
                      <SelectItem value="pst">Pacific Time</SelectItem>
                      <SelectItem value="cet">Central European Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="font-mono text-sm">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself..." className="font-mono" />
              </div>
              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scan Settings */}
        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Scan className="w-5 h-5 text-primary" />
                Scan Settings
              </CardTitle>
              <CardDescription>Configure scanning behavior and parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">Auto Scan</Label>
                  <p className="text-xs text-muted-foreground font-mono">Automatically scan targets on schedule</p>
                </div>
                <Switch
                  checked={scanSettings.autoScan}
                  onCheckedChange={(checked) => setScanSettings({...scanSettings, autoScan: checked})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Scan Frequency</Label>
                  <Select value={scanSettings.scanFrequency} onValueChange={(value) => setScanSettings({...scanSettings, scanFrequency: value})}>
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Max Concurrent Scans</Label>
                  <Input
                    type="number"
                    value={scanSettings.maxConcurrentScans}
                    onChange={(e) => setScanSettings({...scanSettings, maxConcurrentScans: parseInt(e.target.value)})}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={scanSettings.timeout}
                    onChange={(e) => setScanSettings({...scanSettings, timeout: parseInt(e.target.value)})}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Vulnerability Threshold</Label>
                  <Select value={scanSettings.vulnerabilityThreshold} onValueChange={(value) => setScanSettings({...scanSettings, vulnerabilityThreshold: value})}>
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">Deep Scan</Label>
                  <p className="text-xs text-muted-foreground font-mono">Perform comprehensive vulnerability analysis</p>
                </div>
                <Switch
                  checked={scanSettings.deepScan}
                  onCheckedChange={(checked) => setScanSettings({...scanSettings, deepScan: checked})}
                />
              </div>

              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Scan Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threat Monitoring */}
        <TabsContent value="threats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Shield className="w-5 h-5 text-primary" />
                Threat Monitoring
              </CardTitle>
              <CardDescription>Configure threat detection and monitoring parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Monitoring Level</Label>
                  <Select defaultValue="standard">
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                      <SelectItem value="paranoid">Paranoid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Alert Threshold</Label>
                  <Select defaultValue="high">
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="font-mono text-sm">Monitored Threat Types</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {["SQL Injection", "XSS", "CSRF", "DDoS", "Malware", "Phishing", "Brute Force", "Data Breach"].map((threat) => (
                    <div key={threat} className="flex items-center space-x-2">
                      <input type="checkbox" id={threat} defaultChecked className="rounded" />
                      <Label htmlFor={threat} className="text-xs font-mono">{threat}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">Real-time Monitoring</Label>
                  <p className="text-xs text-muted-foreground font-mono">Monitor threats in real-time</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Threat Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Bell className="w-5 h-5 text-primary" />
                Notifications
              </CardTitle>
              <CardDescription>Manage notification preferences and alert settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground font-mono">Receive alerts via email</p>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Push Notifications
                    </Label>
                    <p className="text-xs text-muted-foreground font-mono">Browser push notifications</p>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm">SMS Alerts</Label>
                    <p className="text-xs text-muted-foreground font-mono">Critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-mono text-sm">Alert Types</Label>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm">Scan Completion</Label>
                    <p className="text-xs text-muted-foreground font-mono">Notify when scans finish</p>
                  </div>
                  <Switch
                    checked={notifications.scanComplete}
                    onCheckedChange={(checked) => setNotifications({...notifications, scanComplete: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm">Threat Alerts</Label>
                    <p className="text-xs text-muted-foreground font-mono">Immediate threat notifications</p>
                  </div>
                  <Switch
                    checked={notifications.threatAlerts}
                    onCheckedChange={(checked) => setNotifications({...notifications, threatAlerts: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm">Weekly Reports</Label>
                    <p className="text-xs text-muted-foreground font-mono">Weekly security summaries</p>
                  </div>
                  <Switch
                    checked={notifications.weeklyReports}
                    onCheckedChange={(checked) => setNotifications({...notifications, weeklyReports: checked})}
                  />
                </div>
              </div>

              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Preferences */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Settings className="w-5 h-5 text-primary" />
                Security Preferences
              </CardTitle>
              <CardDescription>Configure security policies and authentication settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground font-mono">Enable 2FA for enhanced security</p>
                </div>
                <Switch
                  checked={securityPrefs.twoFactor}
                  onCheckedChange={(checked) => setSecurityPrefs({...securityPrefs, twoFactor: checked})}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={securityPrefs.sessionTimeout}
                    onChange={(e) => setSecurityPrefs({...securityPrefs, sessionTimeout: parseInt(e.target.value)})}
                    className="font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Password Expiry (days)</Label>
                  <Input
                    type="number"
                    value={securityPrefs.passwordExpiry}
                    onChange={(e) => setSecurityPrefs({...securityPrefs, passwordExpiry: parseInt(e.target.value)})}
                    className="font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">Audit Logging</Label>
                  <p className="text-xs text-muted-foreground font-mono">Log all security events</p>
                </div>
                <Switch
                  checked={securityPrefs.auditLogging}
                  onCheckedChange={(checked) => setSecurityPrefs({...securityPrefs, auditLogging: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="font-mono text-sm">IP Whitelist</Label>
                  <p className="text-xs text-muted-foreground font-mono">Restrict access to specific IPs</p>
                </div>
                <Switch
                  checked={securityPrefs.ipWhitelist}
                  onCheckedChange={(checked) => setSecurityPrefs({...securityPrefs, ipWhitelist: checked})}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-mono text-sm">Encryption Level</Label>
                <Select value={securityPrefs.encryptionLevel} onValueChange={(value) => setSecurityPrefs({...securityPrefs, encryptionLevel: value})}>
                  <SelectTrigger className="font-mono">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AES128">AES-128</SelectItem>
                    <SelectItem value="AES256">AES-256</SelectItem>
                    <SelectItem value="RSA2048">RSA-2048</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Integration */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Key className="w-5 h-5 text-primary" />
                API Integration
              </CardTitle>
              <CardDescription>Manage API keys, webhooks, and third-party integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm">API Access</Label>
                    <p className="text-xs text-muted-foreground font-mono">Enable API access for integrations</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-sm">API Key</Label>
                  <div className="flex gap-2">
                    <Input value="sk-******************************abcd" className="font-mono" readOnly />
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-sm">Webhook URL</Label>
                  <Input placeholder="https://your-app.com/webhook" className="font-mono" />
                </div>

                <div className="space-y-2">
                  <Label className="font-mono text-sm">Rate Limit</Label>
                  <Select defaultValue="1000">
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100">100 requests/hour</SelectItem>
                      <SelectItem value="500">500 requests/hour</SelectItem>
                      <SelectItem value="1000">1000 requests/hour</SelectItem>
                      <SelectItem value="5000">5000 requests/hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-mono text-sm">Connected Services</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "Slack", connected: true, icon: "💬" },
                    { name: "Discord", connected: false, icon: "🎮" },
                    { name: "Teams", connected: true, icon: "👥" },
                    { name: "Jira", connected: false, icon: "🎫" },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between p-3 border border-border rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{service.icon}</span>
                        <span className="font-mono text-sm">{service.name}</span>
                      </div>
                      <Badge variant={service.connected ? "default" : "secondary"} className="font-mono text-xs">
                        {service.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save API Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data & Privacy */}
        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Database className="w-5 h-5 text-primary" />
                Data & Privacy
              </CardTitle>
              <CardDescription>Manage data retention, privacy settings, and compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Data Retention Period</Label>
                  <Select defaultValue="365">
                    <SelectTrigger className="font-mono">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="365">1 year</SelectItem>
                      <SelectItem value="730">2 years</SelectItem>
                      <SelectItem value="forever">Forever</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm">Data Anonymization</Label>
                    <p className="text-xs text-muted-foreground font-mono">Anonymize sensitive data</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="font-mono text-sm">Analytics Tracking</Label>
                    <p className="text-xs text-muted-foreground font-mono">Allow usage analytics</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-mono text-sm">Data Export & Import</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="font-mono">
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                  <Button variant="outline" className="font-mono">
                    <Upload className="w-4 h-4 mr-2" />
                    Import Data
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-mono text-sm text-destructive">Danger Zone</Label>
                <div className="p-4 border border-destructive/20 rounded bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-mono text-sm font-bold text-destructive">Delete All Data</h4>
                      <p className="text-xs text-muted-foreground font-mono">Permanently delete all your data. This action cannot be undone.</p>
                    </div>
                    <Button variant="destructive" size="sm" className="font-mono">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Privacy Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Admin Controls */}
        <TabsContent value="admin" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-mono">
                <Crown className="w-5 h-5 text-primary" />
                Admin Controls
              </CardTitle>
              <CardDescription>Administrative settings and system management</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-mono text-sm">System Status</Label>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm text-primary">All Systems Operational</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-mono text-sm">Last Backup</Label>
                  <span className="font-mono text-sm">2026-03-15 12:00 UTC</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-mono text-sm">User Management</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <span className="font-mono text-sm font-bold">Total Users</span>
                      <p className="text-xs text-muted-foreground font-mono">Active user accounts</p>
                    </div>
                    <Badge className="font-mono">1</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border rounded">
                    <div>
                      <span className="font-mono text-sm font-bold">Active Sessions</span>
                      <p className="text-xs text-muted-foreground font-mono">Current active sessions</p>
                    </div>
                    <Badge className="font-mono">1</Badge>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-mono text-sm">System Maintenance</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="font-mono">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Cache
                  </Button>
                  <Button variant="outline" className="font-mono">
                    <Download className="w-4 h-4 mr-2" />
                    Backup Data
                  </Button>
                  <Button variant="outline" className="font-mono">
                    <Upload className="w-4 h-4 mr-2" />
                    Restore Data
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="font-mono text-sm text-destructive">Critical Actions</Label>
                <div className="p-4 border border-destructive/20 rounded bg-destructive/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-mono text-sm font-bold text-destructive">System Reset</h4>
                      <p className="text-xs text-muted-foreground font-mono">Reset all settings to defaults. This will affect all users.</p>
                    </div>
                    <Button variant="destructive" size="sm" className="font-mono">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              <Button className="font-mono bg-primary text-primary-foreground hover:bg-primary/90">
                <Save className="w-4 h-4 mr-2" />
                Save Admin Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
