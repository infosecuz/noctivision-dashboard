import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Status } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Download, 
  Clock,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { getStatsCsv } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const WINDOW_OPTIONS = [
  { value: 5, label: '5m' },
  { value: 10, label: '10m' },
  { value: 15, label: '15m' },
  { value: 30, label: '30m' },
  { value: 60, label: '1h' },
];

interface SparklineProps {
  data?: number[];
  color?: string;
  height?: number;
}

function Sparkline({ data = [], color = 'hsl(var(--primary))', height = 40 }: SparklineProps) {
  // Guard against non-array data
  const safeData = Array.isArray(data) ? data : [];
  
  if (safeData.length === 0) {
    return (
      <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
        <line x1="0" y1={height / 2} x2="100" y2={height / 2} stroke="hsl(var(--muted))" strokeWidth="1" strokeDasharray="4" />
      </svg>
    );
  }

  const max = Math.max(...safeData, 1);
  const points = safeData.map((value, i) => {
    const x = (i / (safeData.length - 1 || 1)) * 100;
    const y = height - (value / max) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 100 ${height}`} className="w-full" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
      <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0" />
      </linearGradient>
      <polygon
        fill="url(#sparklineGradient)"
        points={`0,${height} ${points} 100,${height}`}
      />
    </svg>
  );
}

interface LatencyMetricProps {
  label: string;
  value: number;
}

function LatencyMetric({ label, value }: LatencyMetricProps) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm">{value.toFixed(0)}ms</span>
    </div>
  );
}

export function StatsPanel() {
  const { language, stats, refreshStats, adminToken, viewMode } = useApp();
  const { toast } = useToast();

  const handleWindowChange = (minutes: string) => {
    refreshStats(Number(minutes));
  };

  const handleDownloadCsv = async () => {
    try {
      const csv = await getStatsCsv(stats?.window_minutes || 15);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `noctivision-stats.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ description: 'Stats CSV downloaded' });
    } catch (error) {
      toast({ variant: 'destructive', description: `Failed to download: ${error}` });
    }
  };

  // Simplified stats for basic mode
  if (viewMode === 'basic' || !adminToken) {
    return null;
  }

  if (!stats) {
    return (
      <div className="panel">
        <h3 className="panel-header flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {t('stats.title', language)}
        </h3>
        <p className="text-sm text-muted-foreground">
          {adminToken ? 'Loading stats...' : t('admin.tokenMissing', language)}
        </p>
      </div>
    );
  }

  return (
    <div className="panel space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="panel-header mb-0 flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          {t('stats.title', language)}
        </h3>
        <div className="flex items-center gap-2">
          <Select
            value={String(stats.window_minutes)}
            onValueChange={handleWindowChange}
          >
            <SelectTrigger className="w-[80px] h-7 text-xs">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WINDOW_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={String(opt.value)}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleDownloadCsv}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Rate */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
        <TrendingUp className="h-5 w-5 text-primary" />
        <div>
          <div className="text-2xl font-mono font-semibold">{stats.rate_per_min.toFixed(1)}</div>
          <div className="text-xs text-muted-foreground">{t('kpi.rate', language)}</div>
        </div>
      </div>

      {/* Latency metrics */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
          Latency Percentiles
        </label>
        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
          <LatencyMetric label={t('stats.avgLatency', language)} value={stats.avg_latency_ms} />
          <LatencyMetric label={t('stats.p50', language)} value={stats.p50_latency_ms} />
          <LatencyMetric label={t('stats.p90', language)} value={stats.p90_latency_ms} />
          <LatencyMetric label={t('stats.p99', language)} value={stats.p99_latency_ms} />
        </div>
      </div>

      {/* Sparklines */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
          {t('stats.series', language)}
        </label>
        <div className="space-y-3">
          <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">All</span>
              <span className="font-mono text-xs">{stats.total}</span>
            </div>
            <Sparkline data={stats.series?.points} />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-muted/30 rounded-lg p-2 border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="status-valid text-xs">Valid</Badge>
                <span className="font-mono text-xs">{stats.by_status.valid || 0}</span>
              </div>
              <Sparkline data={stats.series?.valid} color="hsl(var(--status-valid))" height={30} />
            </div>
            <div className="bg-muted/30 rounded-lg p-2 border border-border/50">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className="status-error text-xs">Error</Badge>
                <span className="font-mono text-xs">{stats.by_status.error || 0}</span>
              </div>
              <Sparkline data={stats.series?.errors} color="hsl(var(--status-error))" height={30} />
            </div>
          </div>
        </div>
      </div>

      {/* Top error domains */}
      {Array.isArray(stats.top_error_domains) && stats.top_error_domains.length > 0 && (
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
            <AlertTriangle className="h-3.5 w-3.5" />
            {t('stats.topErrors', language)}
          </label>
          <div className="space-y-1">
            {stats.top_error_domains.slice(0, 5).map((item, idx) => (
              <div 
                key={item.domain || idx}
                className="flex items-center justify-between py-1.5 px-2 rounded bg-muted/30 border border-border/50"
              >
                <span className="text-xs font-mono truncate max-w-[150px]">{item.domain}</span>
                <Badge variant="outline" className="status-error text-xs ml-2">
                  {item.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
