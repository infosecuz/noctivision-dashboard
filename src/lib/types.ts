// NoctiVision API Types

export type Status = 'valid' | 'invalid' | 'captcha' | 'mfa' | 'error';
export type ErrorType = 'dns' | 'tls' | 'timeout' | 'waf' | 'captcha' | 'other';
export type Language = 'uz' | 'en' | 'ru';
export type ViewMode = 'basic' | 'expert';
export type LiveMode = 'auto' | 'ws' | 'sse' | 'off';

export interface ResultRow {
  id: string;
  url: string;
  login: string;
  password?: string;
  password_masked?: string;
  status: Status;
  message?: string;
  error_type?: ErrorType;
  raw_response_snippet?: string;
  screenshot_path?: string;
  latency_ms?: number;
  created_at: string;
  domain: string;
}

export interface UploadResponse {
  accepted: number;
  deduped: number;
}

export interface AdminStatus {
  ok: boolean;
  workers_total: number;
  workers_alive: number;
  paused: boolean;
  running: boolean;
  target: number;
  accept_uploads: boolean;
  queue_size: number;
}

export interface DomainOverrides {
  ok: boolean;
  overrides: Record<string, number>;
}

export interface StatsResponse {
  ok: boolean;
  window_minutes: number;
  total: number;
  by_status: Record<Status, number>;
  avg_latency_ms: number;
  p50_latency_ms: number;
  p75_latency_ms: number;
  p90_latency_ms: number;
  p99_latency_ms: number;
  span: {
    from: string;
    to: string;
  };
  rate_per_min: number;
  top_error_domains: Array<{ domain: string; count: number }>;
  queue: number;
  series: {
    points: number[];
    errors: number[];
    valid: number[];
    invalid: number[];
    captcha: number[];
    mfa: number[];
  };
  now: string;
}

export interface NoctiAIResponse {
  ok: boolean;
  answer: string;
  lang: Language;
  contexts: Array<{
    id: string;
    text: string;
    score: number;
  }>;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  type: 'upload' | 'worker' | 'result' | 'admin' | 'error' | 'info';
  message: string;
  details?: Record<string, unknown>;
}

export interface FilterState {
  status?: Status;
  statuses?: Status[];
  errorTypes?: ErrorType[];
  domain?: string;
  query?: string;
  latencyMin?: number;
  latencyMax?: number;
  dateFrom?: string;
  dateTo?: string;
}

export interface SortState {
  field: 'created_at' | 'latency_ms' | 'status' | 'login' | 'url';
  direction: 'asc' | 'desc';
}

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

// WebSocket/SSE message types
export interface LiveMessage {
  type?: 'ping' | 'result';
  data?: ResultRow;
}
