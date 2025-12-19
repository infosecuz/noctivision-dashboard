import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { 
  ViewMode, 
  Language, 
  LiveMode, 
  ResultRow, 
  AdminStatus, 
  StatsResponse,
  FilterState,
  SortState,
  ActivityLogEntry,
  Status
} from '@/lib/types';
import { 
  getApiBaseUrl, 
  getNoctiAIBaseUrl, 
  getStoredToken, 
  setStoredToken,
  getAdminStatus,
  getResults,
  getStats,
  createWebSocket,
  createSSE
} from '@/lib/api';

interface AppContextType {
  // Mode & Language
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Configuration
  apiBaseUrl: string;
  setApiBaseUrl: (url: string) => void;
  noctiBaseUrl: string;
  setNoctiBaseUrl: (url: string) => void;
  adminToken: string;
  setAdminToken: (token: string) => void;
  
  // Live connection
  liveMode: LiveMode;
  setLiveMode: (mode: LiveMode) => void;
  isConnected: boolean;
  connectionError: string | null;
  
  // Data
  results: ResultRow[];
  adminStatus: AdminStatus | null;
  stats: StatsResponse | null;
  activityLog: ActivityLogEntry[];
  
  // Filters & Sort
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  sort: SortState;
  setSort: (sort: SortState) => void;
  
  // Actions
  refreshResults: () => Promise<void>;
  refreshAdminStatus: () => Promise<void>;
  refreshStats: (windowMinutes?: number) => Promise<void>;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  clearActivityLog: () => void;
  
  // Loading states
  isLoadingResults: boolean;
  isLoadingStatus: boolean;
  isLoadingStats: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const MAX_RESULTS_CACHE = 1000;
const MAX_ACTIVITY_LOG = 100;

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Mode & Language (persisted)
  const [viewMode, setViewModeState] = useState<ViewMode>(() => {
    const stored = localStorage.getItem('noctivision_view_mode');
    return (stored as ViewMode) || 'basic';
  });
  
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('noctivision_language');
    return (stored as Language) || 'en';
  });
  
  // Configuration
  const [apiBaseUrl, setApiBaseUrlState] = useState<string>(() => {
    return localStorage.getItem('noctivision_api_url') || getApiBaseUrl();
  });
  
  const [noctiBaseUrl, setNoctiBaseUrlState] = useState<string>(() => {
    return localStorage.getItem('noctivision_nocti_url') || getNoctiAIBaseUrl();
  });
  
  const [adminToken, setAdminTokenState] = useState<string>(() => {
    return getStoredToken() || '';
  });
  
  // Live connection
  const [liveMode, setLiveModeState] = useState<LiveMode>('auto');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  
  // Data
  const [results, setResults] = useState<ResultRow[]>([]);
  const [adminStatus, setAdminStatus] = useState<AdminStatus | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [activityLog, setActivityLog] = useState<ActivityLogEntry[]>([]);
  
  // Filters & Sort
  const [filters, setFilters] = useState<FilterState>({});
  const [sort, setSort] = useState<SortState>({ field: 'created_at', direction: 'desc' });
  
  // Loading states
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  // Refs for live connections
  const wsRef = useRef<WebSocket | null>(null);
  const sseRef = useRef<EventSource | null>(null);
  
  // Persist settings
  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    localStorage.setItem('noctivision_view_mode', mode);
  }, []);
  
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('noctivision_language', lang);
  }, []);
  
  const setApiBaseUrl = useCallback((url: string) => {
    setApiBaseUrlState(url);
    localStorage.setItem('noctivision_api_url', url);
    (window as any).NOCTIVISION_API_BASE_URL = url;
  }, []);
  
  const setNoctiBaseUrl = useCallback((url: string) => {
    setNoctiBaseUrlState(url);
    localStorage.setItem('noctivision_nocti_url', url);
    (window as any).NOCTI_AI_BASE_URL = url;
  }, []);
  
  const setAdminToken = useCallback((token: string) => {
    setAdminTokenState(token);
    setStoredToken(token);
  }, []);
  
  const setLiveMode = useCallback((mode: LiveMode) => {
    setLiveModeState(mode);
  }, []);
  
  // Activity log management
  const addActivityLog = useCallback((entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };
    setActivityLog(prev => [newEntry, ...prev].slice(0, MAX_ACTIVITY_LOG));
  }, []);
  
  const clearActivityLog = useCallback(() => {
    setActivityLog([]);
  }, []);
  
  // Data fetching
  const refreshResults = useCallback(async () => {
    setIsLoadingResults(true);
    try {
      const data = await getResults(filters, sort, MAX_RESULTS_CACHE);
      // Ensure data is always an array
      setResults(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch results:', error);
      addActivityLog({ type: 'error', message: `Failed to fetch results: ${error}` });
      setResults([]); // Reset to empty array on error
    } finally {
      setIsLoadingResults(false);
    }
  }, [filters, sort, addActivityLog]);
  
  const refreshAdminStatus = useCallback(async () => {
    if (!adminToken) return;
    setIsLoadingStatus(true);
    try {
      const data = await getAdminStatus();
      setAdminStatus(data);
    } catch (error) {
      console.error('Failed to fetch admin status:', error);
      if (String(error).includes('Unauthorized')) {
        addActivityLog({ type: 'error', message: 'Invalid admin token' });
      }
    } finally {
      setIsLoadingStatus(false);
    }
  }, [adminToken, addActivityLog]);
  
  const refreshStats = useCallback(async (windowMinutes = 15) => {
    if (!adminToken) return;
    setIsLoadingStats(true);
    try {
      const data = await getStats(windowMinutes);
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, [adminToken]);
  
  // Live result handler
  const handleLiveResult = useCallback((row: ResultRow) => {
    setResults(prev => {
      const newResults = [row, ...prev.filter(r => r.id !== row.id)];
      return newResults.slice(0, MAX_RESULTS_CACHE);
    });
  }, []);
  
  // Live connection management
  useEffect(() => {
    // Cleanup existing connections
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (sseRef.current) {
      sseRef.current.close();
      sseRef.current = null;
    }
    
    if (liveMode === 'off') {
      setIsConnected(false);
      setConnectionError(null);
      return;
    }
    
    const connectWS = () => {
      try {
        wsRef.current = createWebSocket(
          handleLiveResult,
          () => {
            setConnectionError('WebSocket error');
            setIsConnected(false);
            // Fallback to SSE if auto mode
            if (liveMode === 'auto') {
              setTimeout(connectSSE, 1000);
            }
          }
        );
        
        wsRef.current.onopen = () => {
          setIsConnected(true);
          setConnectionError(null);
          addActivityLog({ type: 'info', message: 'WebSocket connected' });
        };
        
        wsRef.current.onclose = () => {
          setIsConnected(false);
          if (liveMode === 'auto' || liveMode === 'ws') {
            setTimeout(connectWS, 3000);
          }
        };
      } catch (error) {
        setConnectionError('Failed to connect WebSocket');
        if (liveMode === 'auto') {
          connectSSE();
        }
      }
    };
    
    const connectSSE = () => {
      try {
        sseRef.current = createSSE(
          handleLiveResult,
          () => {
            setConnectionError('SSE error');
            setIsConnected(false);
            // Retry
            setTimeout(connectSSE, 3000);
          }
        );
        
        sseRef.current.onopen = () => {
          setIsConnected(true);
          setConnectionError(null);
          addActivityLog({ type: 'info', message: 'SSE connected' });
        };
      } catch (error) {
        setConnectionError('Failed to connect SSE');
      }
    };
    
    if (liveMode === 'ws' || liveMode === 'auto') {
      connectWS();
    } else if (liveMode === 'sse') {
      connectSSE();
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (sseRef.current) {
        sseRef.current.close();
        sseRef.current = null;
      }
    };
  }, [liveMode, handleLiveResult, addActivityLog]);
  
  // Initial data fetch
  useEffect(() => {
    refreshResults();
  }, [filters, sort]); // Don't include refreshResults to avoid infinite loop
  
  // Periodic status refresh
  useEffect(() => {
    if (!adminToken) return;
    
    refreshAdminStatus();
    refreshStats();
    
    const interval = setInterval(() => {
      refreshAdminStatus();
      refreshStats();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [adminToken]); // Don't include refresh functions
  
  const value: AppContextType = {
    viewMode,
    setViewMode,
    language,
    setLanguage,
    apiBaseUrl,
    setApiBaseUrl,
    noctiBaseUrl,
    setNoctiBaseUrl,
    adminToken,
    setAdminToken,
    liveMode,
    setLiveMode,
    isConnected,
    connectionError,
    results,
    adminStatus,
    stats,
    activityLog,
    filters,
    setFilters,
    sort,
    setSort,
    refreshResults,
    refreshAdminStatus,
    refreshStats,
    addActivityLog,
    clearActivityLog,
    isLoadingResults,
    isLoadingStatus,
    isLoadingStats,
  };
  
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
