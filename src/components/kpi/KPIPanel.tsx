import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Status } from '@/lib/types';
import { 
  Activity, 
  Clock, 
  Database, 
  Users, 
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  Lock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  status?: 'success' | 'warning' | 'error' | 'info' | 'muted';
  subValue?: string;
  animate?: boolean;
}

function KPICard({ icon, label, value, status, subValue, animate }: KPICardProps) {
  const statusColors = {
    success: 'text-status-valid',
    warning: 'text-status-captcha',
    error: 'text-status-error',
    info: 'text-status-mfa',
    muted: 'text-muted-foreground',
  };

  return (
    <div className="kpi-card group hover:border-primary/30 transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className={cn(
          'p-2 rounded-lg bg-muted/50',
          status && statusColors[status]
        )}>
          {icon}
        </div>
        {animate && (
          <div className="h-2 w-2 rounded-full bg-status-valid live-pulse" />
        )}
      </div>
      <div className="mt-3">
        <div className={cn(
          'kpi-value',
          status && statusColors[status]
        )}>
          {value}
        </div>
        <div className="kpi-label">{label}</div>
        {subValue && (
          <div className="text-xs text-muted-foreground mt-1">{subValue}</div>
        )}
      </div>
    </div>
  );
}

interface StatusBadgeProps {
  status: Status;
  count: number;
}

function StatusBadge({ status, count }: StatusBadgeProps) {
  const configs: Record<Status, { icon: React.ReactNode; className: string }> = {
    valid: { icon: <CheckCircle className="h-3.5 w-3.5" />, className: 'status-valid' },
    invalid: { icon: <XCircle className="h-3.5 w-3.5" />, className: 'status-invalid' },
    error: { icon: <AlertTriangle className="h-3.5 w-3.5" />, className: 'status-error' },
    captcha: { icon: <ShieldAlert className="h-3.5 w-3.5" />, className: 'status-captcha' },
    mfa: { icon: <Lock className="h-3.5 w-3.5" />, className: 'status-mfa' },
  };

  const config = configs[status];

  return (
    <div className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-lg border',
      config.className
    )}>
      {config.icon}
      <span className="font-mono font-semibold">{count}</span>
      <span className="text-xs opacity-80 capitalize">{status}</span>
    </div>
  );
}

export function KPIPanel() {
  const { language, adminStatus, stats, isConnected } = useApp();

  const isRunning = adminStatus?.running && !adminStatus?.paused;
  const systemStatus = adminStatus?.running 
    ? (adminStatus.paused ? 'paused' : 'running')
    : 'idle';

  const statusConfig = {
    running: { status: 'success' as const, label: t('status.running', language) },
    paused: { status: 'warning' as const, label: t('status.paused', language) },
    idle: { status: 'muted' as const, label: t('status.idle', language) },
  };

  const current = statusConfig[systemStatus];

  return (
    <div className="space-y-4">
      {/* Main KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPICard
          icon={<Activity className="h-5 w-5" />}
          label={t('status.running', language).toUpperCase()}
          value={current.label}
          status={current.status}
          animate={isRunning}
        />
        <KPICard
          icon={<Zap className="h-5 w-5" />}
          label={t('kpi.rate', language)}
          value={stats?.rate_per_min?.toFixed(1) || '0'}
          status={isRunning ? 'success' : 'muted'}
          subValue="/min"
        />
        <KPICard
          icon={<Database className="h-5 w-5" />}
          label={t('kpi.queue', language)}
          value={adminStatus?.queue_size || 0}
          status={adminStatus?.queue_size && adminStatus.queue_size > 100 ? 'warning' : 'info'}
        />
        <KPICard
          icon={<Users className="h-5 w-5" />}
          label={t('kpi.workers', language)}
          value={`${adminStatus?.workers_alive || 0}/${adminStatus?.workers_total || 0}`}
          status={adminStatus?.workers_alive ? 'success' : 'muted'}
        />
        <KPICard
          icon={<Clock className="h-5 w-5" />}
          label={t('kpi.latency', language)}
          value={stats?.avg_latency_ms?.toFixed(0) || '—'}
          status="info"
          subValue="ms"
        />
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2">
        {(['valid', 'invalid', 'error', 'captcha', 'mfa'] as Status[]).map(status => (
          <StatusBadge 
            key={status} 
            status={status} 
            count={stats?.by_status?.[status] || 0} 
          />
        ))}
      </div>
    </div>
  );
}
