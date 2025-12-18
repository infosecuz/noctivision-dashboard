import { useApp } from '@/context/AppContext';
import { t, getNextLanguage, languageNames } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Wrench, 
  Globe, 
  Wifi, 
  WifiOff, 
  Settings,
  Moon
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Header() {
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
    connectionError,
  } = useApp();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Moon className="h-8 w-8 text-primary" />
            <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary live-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {t('app.title', language)}
            </h1>
            <p className="text-xs text-muted-foreground">
              {t('app.subtitle', language)}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Live Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
            {isConnected ? (
              <>
                <Wifi className="h-4 w-4 text-status-valid" />
                <span className="text-xs text-status-valid font-medium">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {connectionError || t('status.disconnected', language)}
                </span>
              </>
            )}
          </div>

          {/* Live Mode Selector */}
          <Select value={liveMode} onValueChange={(v) => setLiveMode(v as any)}>
            <SelectTrigger className="w-[100px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">{t('live.auto', language)}</SelectItem>
              <SelectItem value="ws">{t('live.websocket', language)}</SelectItem>
              <SelectItem value="sse">{t('live.sse', language)}</SelectItem>
              <SelectItem value="off">{t('live.off', language)}</SelectItem>
            </SelectContent>
          </Select>

          {/* Mode Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
            <Button
              variant={viewMode === 'basic' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setViewMode('basic')}
            >
              <Eye className="h-3.5 w-3.5 mr-1.5" />
              {t('mode.basic', language)}
            </Button>
            <Button
              variant={viewMode === 'expert' ? 'default' : 'ghost'}
              size="sm"
              className="h-7 px-3 text-xs"
              onClick={() => setViewMode('expert')}
            >
              <Wrench className="h-3.5 w-3.5 mr-1.5" />
              {t('mode.expert', language)}
            </Button>
          </div>

          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5"
            onClick={() => setLanguage(getNextLanguage(language))}
          >
            <Globe className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">{language.toUpperCase()}</span>
          </Button>

          {/* Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">{t('settings.baseUrl', language)}</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure API endpoints
                  </p>
                </div>
                <div className="grid gap-3">
                  <div className="grid gap-1.5">
                    <Label htmlFor="apiUrl" className="text-xs">
                      {t('settings.apiUrl', language)}
                    </Label>
                    <Input
                      id="apiUrl"
                      value={apiBaseUrl}
                      onChange={(e) => setApiBaseUrl(e.target.value)}
                      className="h-8 text-xs font-mono"
                      placeholder="http://localhost:8000"
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="noctiUrl" className="text-xs">
                      {t('settings.noctiUrl', language)}
                    </Label>
                    <Input
                      id="noctiUrl"
                      value={noctiBaseUrl}
                      onChange={(e) => setNoctiBaseUrl(e.target.value)}
                      className="h-8 text-xs font-mono"
                      placeholder="http://localhost:8000"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}
