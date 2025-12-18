import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { NoctiAIResponse } from '@/lib/types';
import { queryNoctiAI } from '@/lib/api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  Send, 
  Loader2, 
  Sparkles,
  FileText,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NoctiAIModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NoctiAIModal({ open, onOpenChange }: NoctiAIModalProps) {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<NoctiAIResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!query.trim() || isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await queryNoctiAI(query, language);
      setResponse(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to query Nocti AI');
    } finally {
      setIsLoading(false);
    }
  }, [query, language, isLoading]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    setQuery('');
    setResponse(null);
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            {t('nocti.title', language)}
            <Badge variant="outline" className="ml-auto">
              {language.toUpperCase()}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col min-h-0 space-y-4">
          {/* Input */}
          <div className="relative">
            <Textarea
              placeholder={t('nocti.placeholder', language)}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[80px] pr-12 resize-none"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="absolute bottom-2 right-2 h-8 w-8"
              disabled={!query.trim() || isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
              <X className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 border border-border/50">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">
                {t('nocti.thinking', language)}
              </span>
            </div>
          )}

          {/* Response */}
          {response && !isLoading && (
            <ScrollArea className="flex-1">
              <div className="space-y-4">
                {/* Answer */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">
                      Answer
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {response.answer}
                  </p>
                </div>

                {/* Contexts */}
                {response.contexts && response.contexts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider">
                        {t('nocti.contexts', language)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {response.contexts.map((ctx, idx) => (
                        <div
                          key={ctx.id || idx}
                          className="p-3 rounded-lg bg-muted/20 border border-border/30"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-mono text-muted-foreground">
                              #{idx + 1}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {(ctx.score * 100).toFixed(0)}%
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-3">
                            {ctx.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button variant="outline" onClick={handleClose}>
            {t('nocti.close', language)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
