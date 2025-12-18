import { useState, useEffect } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { Header } from '@/components/layout/Header';
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container px-4 py-6 space-y-6">
        {/* KPIs */}
        <section>
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

          {/* Right sidebar - Stats & Admin */}
          <aside className="lg:col-span-3 space-y-4">
            <AdminControls />
            <StatsPanel />
            {viewMode === 'expert' && <ActivityLog />}
          </aside>
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
