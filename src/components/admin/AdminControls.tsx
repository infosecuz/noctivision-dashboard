import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Status } from '@/lib/types';
import {
  adminControl,
  adminCleanup,
  adminReset,
  adminQueueClear,
  adminQueueDrain,
  getAdminDomains,
  setAdminDomain,
  deleteAdminDomain,
  setPlaywrightConcurrency,
} from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Shield, 
  Play, 
  Pause, 
  Square, 
  SkipForward,
  Trash2,
  RefreshCw,
  Users,
  Database,
  Globe,
  Cpu,
  ChevronDown,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const WORKER_PRESETS = [
  { label: '×4', multiplier: 4 },
  { label: '×8', multiplier: 8 },
  { label: '×16', multiplier: 16 },
  { label: 'Max', multiplier: 32 },
];

const STATUSES: (Status | '')[] = ['', 'valid', 'invalid', 'error', 'captcha', 'mfa'];

export function AdminControls() {
  const { 
    language, 
    adminToken, 
    setAdminToken, 
    adminStatus, 
    refreshAdminStatus,
    addActivityLog,
    viewMode 
  } = useApp();
  const { toast } = useToast();
  
  const [workers, setWorkers] = useState(8);
  const [isControlling, setIsControlling] = useState(false);
  const [cleanupStatus, setCleanupStatus] = useState<Status | ''>('');
  const [domainsOpen, setDomainsOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newLimit, setNewLimit] = useState(5);
  const [pwConcurrency, setPwConcurrency] = useState(4);

  const handleControl = useCallback(async (action: 'start' | 'stop' | 'pause' | 'continue') => {
    if (!adminToken) {
      toast({ variant: 'destructive', description: t('admin.tokenMissing', language) });
      return;
    }
    
    setIsControlling(true);
    try {
      await adminControl(action, action === 'start' ? workers : undefined);
      await refreshAdminStatus();
      addActivityLog({ type: 'worker', message: `Worker action: ${action}` });
      toast({ description: `Action "${action}" completed` });
    } catch (error) {
      toast({ variant: 'destructive', description: `Failed: ${error}` });
      addActivityLog({ type: 'error', message: `Worker action failed: ${error}` });
    } finally {
      setIsControlling(false);
    }
  }, [adminToken, workers, refreshAdminStatus, addActivityLog, toast, language]);

  const handleCleanup = useCallback(async () => {
    try {
      await adminCleanup(cleanupStatus);
      await refreshAdminStatus();
      addActivityLog({ type: 'admin', message: `Cleanup: ${cleanupStatus || 'all'}` });
      toast({ description: 'Cleanup completed' });
    } catch (error) {
      toast({ variant: 'destructive', description: `Cleanup failed: ${error}` });
    }
  }, [cleanupStatus, refreshAdminStatus, addActivityLog, toast]);

  const handleReset = useCallback(async () => {
    try {
      await adminReset();
      await refreshAdminStatus();
      addActivityLog({ type: 'admin', message: 'Database reset' });
      toast({ description: 'Database reset completed' });
    } catch (error) {
      toast({ variant: 'destructive', description: `Reset failed: ${error}` });
    }
  }, [refreshAdminStatus, addActivityLog, toast]);

  const handleQueueClear = useCallback(async () => {
    try {
      await adminQueueClear();
      await refreshAdminStatus();
      addActivityLog({ type: 'admin', message: 'Queue cleared' });
      toast({ description: 'Queue cleared' });
    } catch (error) {
      toast({ variant: 'destructive', description: `Clear failed: ${error}` });
    }
  }, [refreshAdminStatus, addActivityLog, toast]);

  const handleDrain = useCallback(async (enable: boolean) => {
    try {
      await adminQueueDrain(enable);
      await refreshAdminStatus();
      addActivityLog({ type: 'admin', message: enable ? 'Drain enabled' : 'Drain disabled' });
      toast({ description: enable ? 'Uploads paused (drain)' : 'Uploads resumed' });
    } catch (error) {
      toast({ variant: 'destructive', description: `Drain toggle failed: ${error}` });
    }
  }, [refreshAdminStatus, addActivityLog, toast]);

  const handleSetDomain = useCallback(async () => {
    if (!newDomain) return;
    try {
      await setAdminDomain(newDomain, newLimit);
      addActivityLog({ type: 'admin', message: `Domain limit set: ${newDomain} = ${newLimit}` });
      toast({ description: `Domain limit set: ${newDomain}` });
      setNewDomain('');
    } catch (error) {
      toast({ variant: 'destructive', description: `Failed: ${error}` });
    }
  }, [newDomain, newLimit, addActivityLog, toast]);

  const handleSetPlaywright = useCallback(async () => {
    try {
      await setPlaywrightConcurrency(pwConcurrency);
      addActivityLog({ type: 'admin', message: `Playwright concurrency: ${pwConcurrency}` });
      toast({ description: `Playwright concurrency set to ${pwConcurrency}` });
    } catch (error) {
      toast({ variant: 'destructive', description: `Failed: ${error}` });
    }
  }, [pwConcurrency, addActivityLog, toast]);

  // Simplified controls for basic mode
  if (viewMode === 'basic') {
    return (
      <div className="panel space-y-4">
        <h3 className="panel-header flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Controls
        </h3>
        
        {/* Token input */}
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="password"
            placeholder={t('admin.tokenPlaceholder', language)}
            value={adminToken}
            onChange={(e) => setAdminToken(e.target.value)}
            className="pl-9 h-9"
          />
        </div>

        {!adminToken && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-status-captcha/10 border border-status-captcha/30 text-status-captcha text-sm">
            <AlertTriangle className="h-4 w-4" />
            {t('admin.tokenMissing', language)}
          </div>
        )}

        {adminToken && (
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant={adminStatus?.running && !adminStatus?.paused ? 'default' : 'outline'}
              disabled={isControlling || (adminStatus?.running && !adminStatus?.paused)}
              onClick={() => handleControl('start')}
            >
              <Play className="h-4 w-4 mr-2" />
              {t('admin.start', language)}
            </Button>
            <Button
              variant="outline"
              disabled={isControlling || !adminStatus?.running || adminStatus?.paused}
              onClick={() => handleControl('pause')}
            >
              <Pause className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="border-destructive/50 text-destructive hover:bg-destructive/10"
              disabled={isControlling || !adminStatus?.running}
              onClick={() => handleControl('stop')}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Full admin controls for expert mode
  return (
    <div className="panel space-y-4">
      <h3 className="panel-header flex items-center gap-2">
        <Shield className="h-4 w-4" />
        {t('admin.title', language)}
      </h3>

      {/* Token input */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="password"
          placeholder={t('admin.tokenPlaceholder', language)}
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
          className="pl-9 h-9"
        />
      </div>

      {!adminToken ? (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-status-captcha/10 border border-status-captcha/30 text-status-captcha text-sm">
          <AlertTriangle className="h-4 w-4" />
          {t('admin.tokenMissing', language)}
        </div>
      ) : (
        <>
          {/* Workers control */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {t('admin.workers', language)}
              <Badge variant="outline" className="ml-auto">
                {adminStatus?.workers_alive || 0}/{adminStatus?.workers_total || 0}
              </Badge>
            </label>
            
            <div className="flex items-center gap-2 mb-3">
              <Slider
                value={[workers]}
                min={1}
                max={64}
                step={1}
                onValueChange={([v]) => setWorkers(v)}
                className="flex-1"
              />
              <span className="font-mono text-sm w-8 text-right">{workers}</span>
            </div>
            
            <div className="flex gap-1 mb-3">
              {WORKER_PRESETS.map(preset => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  className="flex-1 h-7 text-xs"
                  onClick={() => setWorkers(preset.multiplier)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                className="flex-1"
                disabled={isControlling}
                onClick={() => handleControl('start')}
              >
                <Play className="h-4 w-4 mr-1" />
                {t('admin.start', language)}
              </Button>
              <Button
                variant="outline"
                disabled={isControlling || !adminStatus?.running}
                onClick={() => handleControl(adminStatus?.paused ? 'continue' : 'pause')}
              >
                {adminStatus?.paused ? (
                  <SkipForward className="h-4 w-4" />
                ) : (
                  <Pause className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="outline"
                className="border-destructive/50 text-destructive hover:bg-destructive/10"
                disabled={isControlling || !adminStatus?.running}
                onClick={() => handleControl('stop')}
              >
                <Square className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Queue control */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Database className="h-3.5 w-3.5" />
              {t('admin.queue', language)}
              <Badge variant="outline" className="ml-auto">
                {adminStatus?.queue_size || 0}
              </Badge>
            </label>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => handleDrain(!adminStatus?.accept_uploads)}
              >
                {adminStatus?.accept_uploads ? t('admin.drain', language) : t('admin.resume', language)}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleQueueClear}
              >
                {t('admin.clear', language)}
              </Button>
            </div>
          </div>

          {/* Cleanup */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Trash2 className="h-3.5 w-3.5" />
              {t('admin.cleanup', language)}
            </label>
            
            <div className="flex gap-2">
              <Select
                value={cleanupStatus}
                onValueChange={(v) => setCleanupStatus(v as Status | '')}
              >
                <SelectTrigger className="flex-1 h-8 text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(status => (
                    <SelectItem key={status || 'all'} value={status}>
                      {status || 'All'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCleanup}
              >
                {t('admin.cleanup', language)}
              </Button>
            </div>
          </div>

          {/* Domain limits */}
          <Collapsible open={domainsOpen} onOpenChange={setDomainsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between h-8 px-0">
                <span className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Globe className="h-3.5 w-3.5" />
                  {t('admin.domains', language)}
                </span>
                <ChevronDown className={cn('h-4 w-4 transition-transform', domainsOpen && 'rotate-180')} />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <div className="flex gap-2">
                <Input
                  placeholder="domain.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-1 h-8 text-xs"
                />
                <Input
                  type="number"
                  placeholder="Limit"
                  value={newLimit}
                  onChange={(e) => setNewLimit(Number(e.target.value))}
                  className="w-16 h-8 text-xs"
                />
                <Button size="sm" className="h-8" onClick={handleSetDomain}>
                  {t('admin.set', language)}
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Playwright concurrency */}
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" />
              {t('admin.playwright', language)} {t('admin.concurrency', language)}
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={pwConcurrency}
                onChange={(e) => setPwConcurrency(Number(e.target.value))}
                className="flex-1 h-8 text-xs"
                min={1}
                max={32}
              />
              <Button size="sm" className="h-8" onClick={handleSetPlaywright}>
                {t('admin.apply', language)}
              </Button>
            </div>
          </div>

          {/* Reset DB */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('admin.reset', language)}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('admin.reset', language)}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('admin.resetConfirm', language)}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{t('common.cancel', language)}</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-destructive hover:bg-destructive/90">
                  {t('common.confirm', language)}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
}
