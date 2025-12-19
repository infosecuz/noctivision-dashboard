import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { KPIPanel } from '@/components/kpi/KPIPanel';
import { UploadPanel } from '@/components/upload/UploadPanel';
import { ResultsTable } from '@/components/results/ResultsTable';
import { ResultFilters } from '@/components/results/ResultFilters';
import { StatsPanel } from '@/components/stats/StatsPanel';
import { AdminControls } from '@/components/admin/AdminControls';
import { ActivityLog } from '@/components/activity/ActivityLog';
import { NoctiAIPanel } from '@/components/nocti/NoctiAIPanel';
import { NoctiAIButton } from '@/components/nocti/NoctiAIButton';

function DashboardContent() {
  const { viewMode } = useApp();
  const [activePanel, setActivePanel] = useState<'dashboard' | 'settings' | 'admin' | 'about'>('dashboard');
  const [isNoctiOpen, setIsNoctiOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const toggleNocti = () => setIsNoctiOpen(!isNoctiOpen);

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar 
        activePanel={activePanel} 
        onPanelChange={setActivePanel}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
          {activePanel === 'dashboard' && (
            <>
              {/* KPIs */}
              <section className="fade-in">
                <KPIPanel />
              </section>

              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left sidebar - Filters & Upload (Expert mode) */}
                {viewMode === 'expert' && (
                  <aside className="lg:col-span-3 space-y-4">
                    <ResultFilters />
                    <UploadPanel />
                  </aside>
                )}

                {/* Main content - Results table */}
                <section className={viewMode === 'expert' ? 'lg:col-span-6' : 'lg:col-span-9'}>
                  {viewMode === 'basic' && (
                    <div className="mb-4">
                      <ResultFilters />
                    </div>
                  )}
                  <ResultsTable />
                </section>

                {/* Right sidebar - Stats */}
                <aside className="lg:col-span-3 space-y-4">
                  <StatsPanel />
                  {viewMode === 'expert' && <ActivityLog />}
                </aside>
              </div>
            </>
          )}

          {activePanel === 'admin' && (
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Admin Controls</h2>
              <AdminControls />
            </div>
          )}
        </div>
      </main>

      {/* Nocti AI Floating Button */}
      <NoctiAIButton isOpen={isNoctiOpen} onClick={toggleNocti} />

      {/* Right Panel - Nocti AI (sliding) */}
      {isNoctiOpen && (
        <aside className="fixed top-0 right-0 h-screen w-[400px] z-40 animate-slide-in-right">
          <NoctiAIPanel onClose={toggleNocti} />
        </aside>
      )}
    </div>
  );
}

export default function Index() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
