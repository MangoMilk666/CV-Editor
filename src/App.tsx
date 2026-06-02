import { useEffect, useState } from 'react';
import { useResumeStore } from './store';
import { applyLayoutVars } from './utils/applyLayout';
import Toolbar from './components/Toolbar';
import HeaderEditor from './components/HeaderEditor';
import ModuleList from './components/ModuleList';
import ResumePreview from './components/ResumePreview';
import LayoutPanel from './components/LayoutPanel';

export default function App() {
  const layout = useResumeStore((s) => s.layout);
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    applyLayoutVars(layout);
  }, [layout]);

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden">
      <Toolbar
        onToggleLayout={() => setLayoutOpen((v) => !v)}
        onToggleFullscreen={() => setFullscreen((v) => !v)}
        layoutOpen={layoutOpen}
        fullscreen={fullscreen}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor pane (hidden in fullscreen) */}
        {!fullscreen && (
          <div className="w-96 flex-shrink-0 flex flex-col overflow-y-auto bg-slate-100 p-3 no-print">
            <HeaderEditor />
            <ModuleList />
          </div>
        )}

        {/* Center: Preview pane */}
        <div className="flex-1 overflow-auto bg-slate-200 flex justify-center py-6 px-4">
          <ResumePreview />
        </div>

        {/* Right: Layout settings panel */}
        {layoutOpen && (
          <div className="no-print">
            <LayoutPanel onClose={() => setLayoutOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
