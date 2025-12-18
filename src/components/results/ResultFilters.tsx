import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { Status, ErrorType } from '@/lib/types';
import { exportResults } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Filter, 
  Download, 
  X, 
  Search,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const STATUSES: Status[] = ['valid', 'invalid', 'error', 'captcha', 'mfa'];
const ERROR_TYPES: ErrorType[] = ['dns', 'tls', 'timeout', 'waf', 'captcha', 'other'];

export function ResultFilters() {
  const { 
    language, 
    filters, 
    setFilters, 
    sort, 
    setSort,
    refreshResults,
    viewMode 
  } = useApp();
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const toggleStatus = useCallback((status: Status) => {
    const current = filters.statuses || [];
    const updated = current.includes(status)
      ? current.filter(s => s !== status)
      : [...current, status];
    setFilters({ ...filters, statuses: updated.length ? updated : undefined });
  }, [filters, setFilters]);

  const toggleErrorType = useCallback((errorType: ErrorType) => {
    const current = filters.errorTypes || [];
    const updated = current.includes(errorType)
      ? current.filter(e => e !== errorType)
      : [...current, errorType];
    setFilters({ ...filters, errorTypes: updated.length ? updated : undefined });
  }, [filters, setFilters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  const handleExport = useCallback(async (format: 'csv' | 'json', server = false) => {
    setIsExporting(true);
    try {
      if (server) {
        const data = await exportResults(format, filters, sort);
        const blob = new Blob(
          [typeof data === 'string' ? data : JSON.stringify(data, null, 2)],
          { type: format === 'csv' ? 'text/csv' : 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `noctivision-export.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
      toast({ description: `Export completed (${format.toUpperCase()})` });
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        description: `Export failed: ${error}` 
      });
    } finally {
      setIsExporting(false);
    }
  }, [filters, sort, toast]);

  const hasActiveFilters = Object.values(filters).some(v => 
    v !== undefined && (Array.isArray(v) ? v.length > 0 : true)
  );

  // Simplified view for basic mode
  if (viewMode === 'basic') {
    return (
      <div className="panel">
        <div className="flex items-center justify-between">
          <h3 className="panel-header mb-0 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            {t('filters.title', language)}
          </h3>
          <Select
            value={filters.status || 'all'}
            onValueChange={(v) => setFilters({ ...filters, status: v === 'all' ? undefined : v as Status })}
          >
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder={t('filters.status', language)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {STATUSES.map(status => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  return (
    <div className="panel space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="panel-header mb-0 flex items-center gap-2">
          <Filter className="h-4 w-4" />
          {t('filters.title', language)}
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            onClick={clearFilters}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            {t('filters.clear', language)}
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('filters.search', language)}
          value={filters.query || ''}
          onChange={(e) => setFilters({ ...filters, query: e.target.value || undefined })}
          className="pl-9 h-9"
        />
      </div>

      {/* Status chips */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
          {t('filters.status', language)}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {STATUSES.map(status => {
            const isActive = filters.statuses?.includes(status);
            return (
              <Badge
                key={status}
                variant="outline"
                className={cn(
                  'cursor-pointer transition-all',
                  isActive && `status-${status}`
                )}
                onClick={() => toggleStatus(status)}
              >
                {status}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Error type chips */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 block">
          {t('filters.errorType', language)}
        </label>
        <div className="flex flex-wrap gap-1.5">
          {ERROR_TYPES.map(errorType => {
            const isActive = filters.errorTypes?.includes(errorType);
            return (
              <Badge
                key={errorType}
                variant="outline"
                className={cn(
                  'cursor-pointer transition-all',
                  isActive && 'bg-destructive/20 text-destructive border-destructive/30'
                )}
                onClick={() => toggleErrorType(errorType)}
              >
                {errorType}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Domain & Latency */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {t('filters.domain', language)}
          </label>
          <Input
            placeholder="example.com"
            value={filters.domain || ''}
            onChange={(e) => setFilters({ ...filters, domain: e.target.value || undefined })}
            className="h-8 text-xs"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 block">
            {t('filters.latency', language)}
          </label>
          <div className="flex items-center gap-1.5">
            <Input
              type="number"
              placeholder="Min"
              value={filters.latencyMin || ''}
              onChange={(e) => setFilters({ ...filters, latencyMin: e.target.value ? Number(e.target.value) : undefined })}
              className="h-8 text-xs"
            />
            <span className="text-muted-foreground">–</span>
            <Input
              type="number"
              placeholder="Max"
              value={filters.latencyMax || ''}
              onChange={(e) => setFilters({ ...filters, latencyMax: e.target.value ? Number(e.target.value) : undefined })}
              className="h-8 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Date range */}
      <div>
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {t('filters.dateRange', language)}
        </label>
        <div className="flex items-center gap-1.5">
          <Input
            type="date"
            value={filters.dateFrom || ''}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
            className="h-8 text-xs flex-1"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="date"
            value={filters.dateTo || ''}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
            className="h-8 text-xs flex-1"
          />
        </div>
      </div>

      {/* Export buttons */}
      <div className="pt-2 border-t border-border">
        <label className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
          <Download className="h-3.5 w-3.5" />
          {t('export.title', language)}
        </label>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={isExporting}
            onClick={() => handleExport('csv', true)}
          >
            {t('export.csv', language)}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            disabled={isExporting}
            onClick={() => handleExport('json', true)}
          >
            {t('export.json', language)}
          </Button>
        </div>
      </div>
    </div>
  );
}
