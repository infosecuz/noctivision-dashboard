import { useState, useCallback, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { t } from '@/lib/i18n';
import { uploadFile } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, CheckCircle, AlertCircle, Ban } from 'lucide-react';
import { cn } from '@/lib/utils';

export function UploadPanel() {
  const { language, adminStatus, addActivityLog, viewMode } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{ accepted: number; deduped: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDisabled = adminStatus?.accept_uploads === false;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!isDisabled) {
      setIsDragging(true);
    }
  }, [isDisabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isDisabled) return;
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.txt')) {
      setFile(droppedFile);
      setResult(null);
      setError(null);
    } else {
      setError('Only .txt files are accepted');
    }
  }, [isDisabled]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!file || isDisabled) return;
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 10, 90));
    }, 100);
    
    try {
      const response = await uploadFile(file);
      setResult(response);
      setProgress(100);
      addActivityLog({
        type: 'upload',
        message: `Uploaded ${file.name}: ${response.accepted} accepted, ${response.deduped} deduped`,
        details: { filename: file.name, ...response },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      addActivityLog({
        type: 'error',
        message: `Upload failed: ${err}`,
      });
    } finally {
      clearInterval(progressInterval);
      setUploading(false);
    }
  }, [file, isDisabled, addActivityLog]);

  // Simplified view for basic mode
  if (viewMode === 'basic') {
    return null;
  }

  return (
    <div className="panel">
      <h3 className="panel-header flex items-center gap-2">
        <Upload className="h-4 w-4" />
        {t('upload.title', language)}
      </h3>

      {isDisabled ? (
        <div className="flex items-center gap-3 p-4 rounded-lg bg-status-captcha/10 border border-status-captcha/30 text-status-captcha">
          <Ban className="h-5 w-5" />
          <span className="text-sm">{t('upload.disabled', language)}</span>
        </div>
      ) : (
        <>
          {/* Dropzone */}
          <div
            className={cn(
              'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
              isDragging 
                ? 'border-primary bg-primary/10' 
                : 'border-border hover:border-primary/50 hover:bg-muted/30',
              uploading && 'pointer-events-none opacity-50'
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".txt"
              className="hidden"
              onChange={handleFileSelect}
            />
            
            <div className="flex flex-col items-center gap-2 text-center">
              {file ? (
                <>
                  <FileText className="h-10 w-10 text-primary" />
                  <span className="font-mono text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {t('upload.dropzone', language)}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Progress */}
          {uploading && (
            <div className="mt-3">
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-status-valid/10 border border-status-valid/30">
              <CheckCircle className="h-5 w-5 text-status-valid" />
              <div className="flex-1">
                <div className="text-sm font-medium text-status-valid">
                  {t('upload.accepted', language)}: {result.accepted}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('upload.deduped', language)}: {result.deduped}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-status-error/10 border border-status-error/30">
              <AlertCircle className="h-5 w-5 text-status-error" />
              <span className="text-sm text-status-error">{error}</span>
            </div>
          )}

          {/* Upload Button */}
          {file && !result && (
            <Button
              className="w-full mt-3"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : t('upload.button', language)}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
