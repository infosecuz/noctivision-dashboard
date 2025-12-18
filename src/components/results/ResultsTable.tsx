import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { ResultRow, Status } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Eye, 
  ExternalLink, 
  Copy, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const PAGE_SIZES = [25, 50, 100, 250];

function StatusBadge({ status }: { status: Status }) {
  const variants: Record<Status, string> = {
    valid: 'status-valid',
    invalid: 'status-invalid',
    error: 'status-error',
    captcha: 'status-captcha',
    mfa: 'status-mfa',
  };

  return (
    <Badge variant="outline" className={cn('text-xs', variants[status])}>
      {status.toUpperCase()}
    </Badge>
  );
}

export function ResultsTable() {
  const { language, results, isLoadingResults, viewMode } = useApp();
  const { toast } = useToast();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [selectedRow, setSelectedRow] = useState<ResultRow | null>(null);

  const paginatedResults = useMemo(() => {
    const start = page * pageSize;
    return results.slice(start, start + pageSize);
  }, [results, page, pageSize]);

  const totalPages = Math.ceil(results.length / pageSize);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ description: 'Copied to clipboard' });
  };

  const formatTime = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true });
    } catch {
      return dateStr;
    }
  };

  if (isLoadingResults && results.length === 0) {
    return (
      <div className="panel">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="panel">
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Eye className="h-12 w-12 mb-3 opacity-50" />
          <p>{t('results.empty', language)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel p-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="panel-header mb-0">
          {t('results.title', language)}
          <span className="ml-2 text-primary font-mono">{results.length}</span>
        </h3>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{t('common.perPage', language)}</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              setPageSize(Number(v));
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[70px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZES.map(size => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[50px] text-xs">#</TableHead>
              <TableHead className="text-xs">{t('results.time', language)}</TableHead>
              <TableHead className="text-xs">{t('results.domain', language)}</TableHead>
              <TableHead className="text-xs">{t('results.login', language)}</TableHead>
              <TableHead className="text-xs">{t('results.password', language)}</TableHead>
              <TableHead className="text-xs">{t('results.status', language)}</TableHead>
              <TableHead className="text-xs">{t('results.latency', language)}</TableHead>
              {viewMode === 'expert' && (
                <TableHead className="text-xs w-[100px]">{t('results.actions', language)}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResults.map((row, idx) => (
              <TableRow 
                key={row.id} 
                className="data-row cursor-pointer"
                onClick={() => setSelectedRow(row)}
              >
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {page * pageSize + idx + 1}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {formatTime(row.created_at)}
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[120px] truncate">
                  {row.domain}
                </TableCell>
                <TableCell className="font-mono text-xs max-w-[150px] truncate">
                  {row.login}
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {row.password_masked || row.password || '••••••'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={row.status} />
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {row.latency_ms ? `${row.latency_ms}ms` : '—'}
                </TableCell>
                {viewMode === 'expert' && (
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRow(row);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(row.url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          {page * pageSize + 1}–{Math.min((page + 1) * pageSize, results.length)} of {results.length}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page === 0}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-3 text-sm font-mono">
            {page + 1} / {totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            disabled={page >= totalPages - 1}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedRow} onOpenChange={() => setSelectedRow(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {t('results.viewDetails', language)}
              {selectedRow && <StatusBadge status={selectedRow.status} />}
            </DialogTitle>
          </DialogHeader>
          
          {selectedRow && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t('results.url', language)}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm font-mono bg-muted p-2 rounded truncate">
                      {selectedRow.url}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => copyToClipboard(selectedRow.url)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t('results.domain', language)}
                  </label>
                  <div className="text-sm font-mono bg-muted p-2 rounded mt-1">
                    {selectedRow.domain}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t('results.login', language)}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm font-mono bg-muted p-2 rounded">
                      {selectedRow.login}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => copyToClipboard(selectedRow.login)}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t('results.password', language)}
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 text-sm font-mono bg-muted p-2 rounded">
                      {selectedRow.password || selectedRow.password_masked || '••••••'}
                    </code>
                    {selectedRow.password && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => copyToClipboard(selectedRow.password!)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {selectedRow.message && (
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    {t('results.message', language)}
                  </label>
                  <div className="text-sm bg-muted p-2 rounded mt-1">
                    {selectedRow.message}
                  </div>
                </div>
              )}

              {selectedRow.raw_response_snippet && (
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider">
                    Response Snippet
                  </label>
                  <pre className="text-xs font-mono bg-muted p-3 rounded mt-1 overflow-x-auto max-h-[200px]">
                    {selectedRow.raw_response_snippet}
                  </pre>
                </div>
              )}

              {selectedRow.screenshot_path && (
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <ImageIcon className="h-3.5 w-3.5" /> Screenshot
                  </label>
                  <a 
                    href={selectedRow.screenshot_path} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 block"
                  >
                    View Screenshot
                  </a>
                </div>
              )}

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
                <span>ID: {selectedRow.id}</span>
                <span>Latency: {selectedRow.latency_ms || '—'}ms</span>
                <span>Created: {selectedRow.created_at}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
