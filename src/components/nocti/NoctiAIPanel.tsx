import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { NoctiAIResponse } from '@/lib/types';
import { queryNoctiAI } from '@/lib/api';
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

interface NoctiAIPanelProps {
  onClose: () => void;
}

export function NoctiAIPanel({ onClose }: NoctiAIPanelProps) {
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

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Bot className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold">{t('nocti.title', language)}</h2>
            <p className="text-xs text-muted-foreground">AI Assistant</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-0 p-4 space-y-4">
        {/* Input */}
        <div className="relative">
          <Textarea
            placeholder={t('nocti.placeholder', language)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[100px] pr-12 resize-none"
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
            <X className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 border border-border">
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
              <div className="p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
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
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                      {t('nocti.contexts', language)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {response.contexts.map((ctx, idx) => (
                      <div
                        key={ctx.id || idx}
                        className="p-3 rounded-lg bg-muted/30 border border-border/50"
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

        {/* Empty state */}
        {!response && !isLoading && !error && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="p-4 rounded-full bg-primary/10 mb-4">
              <Bot className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-medium mb-1">Ask Nocti AI</h3>
            <p className="text-sm text-muted-foreground max-w-[200px]">
              Get insights about your validation results and system status
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
