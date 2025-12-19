import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { t, getNextLanguage, languageNames } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Eye, 
  Wrench, 
  Settings, 
  Shield, 
  Info,
  Moon,
  Wifi,
  WifiOff,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface AppSidebarProps {
  activePanel: 'dashboard' | 'settings' | 'admin' | 'about';
  onPanelChange: (panel: 'dashboard' | 'settings' | 'admin' | 'about') => void;
}

export function AppSidebar({ activePanel, onPanelChange }: AppSidebarProps) {
  const {
    viewMode,
    setViewMode,
    language,
    setLanguage,
    apiBaseUrl,
    setApiBaseUrl,
    noctiBaseUrl,
    setNoctiBaseUrl,
    liveMode,
    setLiveMode,
    isConnected,
    adminToken,
    setAdminToken,
  } = useApp();

  const [collapsed, setCollapsed] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const navItems = [
    { 
      id: 'basic' as const, 
      label: t('mode.basic', language), 
      icon: Eye,
      onClick: () => { setViewMode('basic'); onPanelChange('dashboard'); }
    },
    { 
      id: 'expert' as const, 
      label: t('mode.expert', language), 
      icon: Wrench,
      onClick: () => { setViewMode('expert'); onPanelChange('dashboard'); }
    },
  ];

  return (
    <>
      <aside className={cn(
        "flex flex-col h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Moon className="h-5 w-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold gradient-text">NoctiVision</h1>
              <p className="text-xs text-muted-foreground truncate">
                {t('app.subtitle', language)}
              </p>
            </div>
          )}
        </div>

        {/* Connection Status */}
        <div className={cn(
          "flex items-center gap-2 mx-3 mt-4 px-3 py-2 rounded-lg",
          isConnected ? "bg-emerald-50 dark:bg-emerald-900/20" : "bg-muted"
        )}>
          {isConnected ? (
            <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <WifiOff className="h-4 w-4 text-muted-foreground" />
          )}
          {!collapsed && (
            <span className={cn(
              "text-xs font-medium",
              isConnected ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"
            )}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          <div className="mb-2">
            {!collapsed && (
              <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                View Mode
              </span>
            )}
          </div>
          
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={cn(
                "nav-item w-full",
                viewMode === item.id && activePanel === 'dashboard' && "active"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}

          <Separator className="my-4" />

          {!collapsed && (
            <span className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              System
            </span>
          )}

          <button
            onClick={() => setSettingsOpen(true)}
            className={cn("nav-item w-full mt-2")}
          >
            <Settings className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{t('admin.title', language).split(' ')[0]} Settings</span>}
          </button>

          <button
            onClick={() => onPanelChange('admin')}
            className={cn(
              "nav-item w-full",
              activePanel === 'admin' && "active"
            )}
          >
            <Shield className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Admin Controls</span>}
            {!collapsed && adminToken && (
              <Badge variant="secondary" className="ml-auto text-xs">Active</Badge>
            )}
          </button>

          <button
            onClick={() => setAboutOpen(true)}
            className={cn("nav-item w-full")}
          >
            <Info className="h-5 w-5 shrink-0" />
            {!collapsed && <span>About</span>}
          </button>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-sidebar-border space-y-2">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(getNextLanguage(language))}
            className="nav-item w-full"
          >
            <Globe className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{languageNames[language]}</span>}
            {!collapsed && (
              <Badge variant="outline" className="ml-auto text-xs">
                {language.toUpperCase()}
              </Badge>
            )}
          </button>

          {/* Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="nav-item w-full justify-center"
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Settings</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">{t('settings.apiUrl', language)}</Label>
              <Input
                id="apiUrl"
                value={apiBaseUrl}
                onChange={(e) => setApiBaseUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noctiUrl">{t('settings.noctiUrl', language)}</Label>
              <Input
                id="noctiUrl"
                value={noctiBaseUrl}
                onChange={(e) => setNoctiBaseUrl(e.target.value)}
                placeholder="http://localhost:8000"
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adminToken">{t('admin.token', language)}</Label>
              <Input
                id="adminToken"
                type="password"
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder={t('admin.tokenPlaceholder', language)}
              />
            </div>
            <div className="space-y-2">
              <Label>Live Mode</Label>
              <Select value={liveMode} onValueChange={(v) => setLiveMode(v as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">{t('live.auto', language)}</SelectItem>
                  <SelectItem value="ws">{t('live.websocket', language)}</SelectItem>
                  <SelectItem value="sse">{t('live.sse', language)}</SelectItem>
                  <SelectItem value="off">{t('live.off', language)}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* About Dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              NoctiVision
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Real-time credential validation monitoring dashboard with live updates, 
              statistics, and AI assistance.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Version</span>
                <span className="font-mono">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API Endpoint</span>
                <span className="font-mono text-xs truncate max-w-[200px]">{apiBaseUrl}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Connection</span>
                <Badge variant={isConnected ? "default" : "secondary"}>
                  {isConnected ? 'Live' : 'Offline'}
                </Badge>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
