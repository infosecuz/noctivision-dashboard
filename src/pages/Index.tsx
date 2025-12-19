import { useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { KPIPanel } from '@/components/kpi/KPIPanel';
import { UploadPanel } from '@/components/upload/UploadPanel';
import { ResultsTable } from '@/components/results/ResultsTable';
import { ResultFilters } from '@/components/results/ResultFilters';
import { StatsPanel } from '@/components/stats/StatsPanel';
import { AdminControls } from '@/components/admin/AdminControls';
import { ActivityLog } from '@/components/activity/ActivityLog';
import { NoctiAIModal } from '@/components/nocti/NoctiAIModal';
import { Button } from '@/components/ui/button';
import { Bot } from 'lucide-react';

function DashboardContent() {
  const { viewMode } = useApp();
  const [noctiOpen, setNoctiOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<'dashboard' | 'settings' | 'admin' | 'about'>('dashboard');

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar activePanel={activePanel} onPanelChange={setActivePanel} />
      
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

      {/* Floating Nocti AI Button */}
      {viewMode === 'expert' && (
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
          onClick={() => setNoctiOpen(true)}
        >
          <Bot className="h-6 w-6" />
        </Button>
      )}

      {/* Nocti AI Modal */}
      <NoctiAIModal open={noctiOpen} onOpenChange={setNoctiOpen} />
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
