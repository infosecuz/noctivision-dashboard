import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { ActivityLogEntry } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Activity, 
  Upload, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Info,
  Shield,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const typeIcons: Record<ActivityLogEntry['type'], React.ReactNode> = {
  upload: <Upload className="h-3.5 w-3.5" />,
  worker: <Users className="h-3.5 w-3.5" />,
  result: <CheckCircle className="h-3.5 w-3.5" />,
  admin: <Shield className="h-3.5 w-3.5" />,
  error: <AlertCircle className="h-3.5 w-3.5" />,
  info: <Info className="h-3.5 w-3.5" />,
};

const typeColors: Record<ActivityLogEntry['type'], string> = {
  upload: 'text-status-mfa',
  worker: 'text-status-valid',
  result: 'text-primary',
  admin: 'text-status-captcha',
  error: 'text-status-error',
  info: 'text-muted-foreground',
};

export function ActivityLog() {
  const { language, activityLog, clearActivityLog, viewMode } = useApp();

  if (viewMode === 'basic') {
    return null;
  }

  return (
    <div className="panel flex flex-col h-[300px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="panel-header mb-0 flex items-center gap-2">
          <Activity className="h-4 w-4" />
          {t('activity.title', language)}
        </h3>
        {activityLog.length > 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={clearActivityLog}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {activityLog.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
          {t('activity.empty', language)}
        </div>
      ) : (
        <ScrollArea className="flex-1 -mx-4 px-4">
          <div className="space-y-2">
            {activityLog.map(entry => (
              <div
                key={entry.id}
                className="flex items-start gap-2 p-2 rounded-lg bg-muted/30 border border-border/50 fade-in"
              >
                <div className={cn('mt-0.5', typeColors[entry.type])}>
                  {typeIcons[entry.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs leading-relaxed">{entry.message}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDistanceToNow(entry.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
