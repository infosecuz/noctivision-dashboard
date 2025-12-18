import { 
  ResultRow, 
  UploadResponse, 
  AdminStatus, 
  DomainOverrides, 
  StatsResponse, 
  NoctiAIResponse,
  FilterState,
  SortState,
  Status
} from './types';

// Config getters
export function getApiBaseUrl(): string {
  return (
    (window as any).NOCTIVISION_API_BASE_URL ||
    import.meta.env.VITE_NOCTIVISION_API_BASE_URL ||
    window.location.origin
  );
}

export function getNoctiAIBaseUrl(): string {
  return (
    (window as any).NOCTI_AI_BASE_URL ||
    import.meta.env.VITE_NOCTI_AI_BASE_URL ||
    window.location.origin
  );
}

export function getStoredToken(): string | null {
  return localStorage.getItem('noctivision_admin_token');
}

export function setStoredToken(token: string): void {
  localStorage.setItem('noctivision_admin_token', token);
}

// Helper to build query params
function buildQueryParams(params: Record<string, string | number | undefined | string[]>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach(v => searchParams.append(key, v));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });
  const str = searchParams.toString();
  return str ? `?${str}` : '';
}

// Fetch wrapper with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  requiresAuth = false
): Promise<T> {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  };
  
  if (requiresAuth) {
    const token = getStoredToken();
    if (!token) {
      throw new Error('Admin token required');
    }
    headers['X-Admin-Token'] = token;
  }
  
  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new Error('Unauthorized: Invalid or missing admin token');
    }
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  
  // Handle empty responses
  const text = await response.text();
  if (!text) return {} as T;
  
  try {
    return JSON.parse(text);
  } catch {
    return text as unknown as T;
  }
}

// Upload endpoint
export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('file', file);
  
  return apiFetch<UploadResponse>('/upload', {
    method: 'POST',
    body: formData,
  });
}

// Results endpoints
export async function getResults(
  filters: FilterState = {},
  sort: SortState = { field: 'created_at', direction: 'desc' },
  limit = 100
): Promise<ResultRow[]> {
  const params = buildQueryParams({
    limit,
    status: filters.status,
    statuses: filters.statuses?.join(','),
    domain: filters.domain,
    q: filters.query,
    latency_min: filters.latencyMin,
    latency_max: filters.latencyMax,
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
  });
  
  return apiFetch<ResultRow[]>(`/results${params}`);
}

export async function exportResults(
  format: 'csv' | 'json',
  filters: FilterState = {},
  sort: SortState = { field: 'created_at', direction: 'desc' },
  limit = 100000
): Promise<string | ResultRow[]> {
  const params = buildQueryParams({
    format,
    limit,
    status: filters.status,
    statuses: filters.statuses?.join(','),
    domain: filters.domain,
    q: filters.query,
    sort: sort.field,
    dir: sort.direction,
    latency_min: filters.latencyMin,
    latency_max: filters.latencyMax,
    date_from: filters.dateFrom,
    date_to: filters.dateTo,
  });
  
  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/results/export${params}`);
  
  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }
  
  if (format === 'csv') {
    return response.text();
  }
  return response.json();
}

// Admin endpoints
export async function getAdminStatus(): Promise<AdminStatus> {
  return apiFetch<AdminStatus>('/admin/status', {}, true);
}

export async function adminControl(
  action: 'start' | 'stop' | 'pause' | 'continue',
  workers?: number
): Promise<AdminStatus> {
  const params = buildQueryParams({ action, workers });
  return apiFetch<AdminStatus>(`/admin/control${params}`, { method: 'POST' }, true);
}

export async function adminCleanup(status?: Status | ''): Promise<void> {
  const params = buildQueryParams({ status });
  return apiFetch<void>(`/admin/cleanup${params}`, { method: 'POST' }, true);
}

export async function adminReset(): Promise<void> {
  return apiFetch<void>('/admin/reset', { method: 'POST' }, true);
}

export async function adminQueueClear(): Promise<void> {
  return apiFetch<void>('/admin/queue/clear', { method: 'POST' }, true);
}

export async function adminQueueDrain(enable: boolean): Promise<void> {
  const params = buildQueryParams({ enable: enable ? 'true' : 'false' });
  return apiFetch<void>(`/admin/queue/drain${params}`, { method: 'POST' }, true);
}

export async function getAdminDomains(): Promise<DomainOverrides> {
  return apiFetch<DomainOverrides>('/admin/domains', {}, true);
}

export async function setAdminDomain(domain: string, limit: number): Promise<void> {
  const params = buildQueryParams({ domain, limit });
  return apiFetch<void>(`/admin/domain_set${params}`, { method: 'POST' }, true);
}

export async function deleteAdminDomain(domain: string): Promise<void> {
  const params = buildQueryParams({ domain });
  return apiFetch<void>(`/admin/domain_delete${params}`, { method: 'POST' }, true);
}

export async function setPlaywrightConcurrency(concurrency: number): Promise<void> {
  const params = buildQueryParams({ concurrency });
  return apiFetch<void>(`/admin/pw_set${params}`, { method: 'POST' }, true);
}

export async function getAdminPasswords(ids: string[]): Promise<{ ok: boolean; passwords: Record<string, string> }> {
  const params = buildQueryParams({ id: ids });
  return apiFetch<{ ok: boolean; passwords: Record<string, string> }>(`/admin/passwords${params}`, {}, true);
}

// Stats endpoint
export async function getStats(windowMinutes = 15, top = 10): Promise<StatsResponse> {
  const params = buildQueryParams({ window_minutes: windowMinutes, top });
  return apiFetch<StatsResponse>(`/admin/stats${params}`, {}, true);
}

export async function getStatsCsv(windowMinutes = 15, top = 10): Promise<string> {
  const params = buildQueryParams({ window_minutes: windowMinutes, top, format: 'csv' });
  const baseUrl = getApiBaseUrl();
  const token = getStoredToken();
  
  const response = await fetch(`${baseUrl}/admin/stats${params}`, {
    headers: token ? { 'X-Admin-Token': token } : {},
  });
  
  if (!response.ok) {
    throw new Error(`Stats CSV failed: ${response.statusText}`);
  }
  
  return response.text();
}

// Nocti AI endpoint
export async function queryNoctiAI(
  query: string,
  lang: 'uz' | 'en' | 'ru'
): Promise<NoctiAIResponse> {
  const baseUrl = getNoctiAIBaseUrl();
  
  const response = await fetch(`${baseUrl}/api/nocti-ai/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, lang }),
  });
  
  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// WebSocket connection
export function createWebSocket(onMessage: (data: ResultRow) => void, onError: (error: Event) => void): WebSocket {
  const baseUrl = getApiBaseUrl();
  const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws';
  const ws = new WebSocket(wsUrl);
  
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'ping') return;
      onMessage(data);
    } catch (e) {
      console.error('WebSocket parse error:', e);
    }
  };
  
  ws.onerror = onError;
  
  return ws;
}

// SSE connection
export function createSSE(onMessage: (data: ResultRow) => void, onError: () => void): EventSource {
  const baseUrl = getApiBaseUrl();
  const sse = new EventSource(`${baseUrl}/stream`);
  
  sse.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === 'ping') return;
      onMessage(data);
    } catch (e) {
      console.error('SSE parse error:', e);
    }
  };
  
  sse.onerror = () => {
    onError();
  };
  
  return sse;
}
