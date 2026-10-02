import { useEffect, useRef, useState } from 'react';
import { useResumeStore } from './store';
import { applyLayoutVars } from './utils/applyLayout';
import Toolbar from './components/Toolbar';
import HeaderEditor from './components/HeaderEditor';
import ModuleList from './components/ModuleList';
import ResumePreview from './components/ResumePreview';
import LayoutPanel from './components/LayoutPanel';
import TemplateGallery from './components/TemplateGallery';

const EDITOR_WIDTH_KEY = 'cv-editor-sidebar-width';
const DEFAULT_EDITOR_WIDTH = 384;
const MIN_EDITOR_WIDTH = 320;
const MAX_EDITOR_WIDTH = 720;

function clampEditorWidth(width: number): number {
  return Math.min(MAX_EDITOR_WIDTH, Math.max(MIN_EDITOR_WIDTH, width));
}

export default function App() {
  const store = useResumeStore();
  const { layout, locale } = store;
  const [layoutOpen, setLayoutOpen] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [editorWidth, setEditorWidth] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_EDITOR_WIDTH;
    const stored = Number(window.localStorage.getItem(EDITOR_WIDTH_KEY) ?? DEFAULT_EDITOR_WIDTH);
    return Number.isFinite(stored) ? clampEditorWidth(stored) : DEFAULT_EDITOR_WIDTH;
  });
  const [draggingSidebar, setDraggingSidebar] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    applyLayoutVars(layout);
  }, [layout]);

  useEffect(() => {
    window.localStorage.setItem(EDITOR_WIDTH_KEY, String(editorWidth));
  }, [editorWidth]);

  useEffect(() => {
    if (!draggingSidebar) return undefined;

    function handleMouseMove(event: MouseEvent) {
      const shellRect = shellRef.current?.getBoundingClientRect();
      if (!shellRect) return;

      const layoutPanelWidth = layoutOpen ? 288 : 0;
      const maxWidth = Math.max(
        MIN_EDITOR_WIDTH,
        Math.min(MAX_EDITOR_WIDTH, window.innerWidth - layoutPanelWidth - 360)
      );
      const nextWidth = Math.min(Math.max(event.clientX - shellRect.left, MIN_EDITOR_WIDTH), maxWidth);
      setEditorWidth(nextWidth);
    }

    function handleMouseUp() {
      setDraggingSidebar(false);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingSidebar, layoutOpen]);

  if (templateGalleryOpen) {
    return (
      <TemplateGallery
        locale={locale}
        templates={store.templates[locale]}
        activeTemplateId={store.activeTemplateIds[locale]}
        onBack={() => setTemplateGalleryOpen(false)}
        onSelect={(templateId) => {
          store.selectTemplate(templateId);
          setTemplateGalleryOpen(false);
        }}
        onRename={store.renameTemplate}
      />
    );
  }

  return (
    <div className={`flex flex-col h-screen bg-slate-100 overflow-hidden ${draggingSidebar ? 'select-none cursor-col-resize' : ''}`}>
      <Toolbar
        onToggleLayout={() => setLayoutOpen((v) => !v)}
        onToggleFullscreen={() => setFullscreen((v) => !v)}
        layoutOpen={layoutOpen}
        fullscreen={fullscreen}
        onOpenTemplateGallery={() => setTemplateGalleryOpen(true)}
      />

      <div ref={shellRef} className="flex flex-1 overflow-hidden">
        {/* Left: Editor pane (hidden in fullscreen) */}
        {!fullscreen && (
          <>
            <div
              className="flex-shrink-0 flex flex-col overflow-y-auto bg-slate-100 p-3 no-print"
              style={{ width: `${editorWidth}px` }}
            >
              <HeaderEditor />
              <ModuleList />
            </div>
            <div
              className="no-print group relative w-2 flex-shrink-0 cursor-col-resize bg-transparent hover:bg-blue-100/70"
              onMouseDown={() => setDraggingSidebar(true)}
              role="separator"
              aria-orientation="vertical"
              aria-label="调整左侧菜单栏宽度"
            >
              <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-slate-300 transition-colors group-hover:bg-blue-400" />
            </div>
          </>
        )}

        {/* Center: Preview pane — must NOT be a flex container on the scrollable root */}
        <div className="flex-1 overflow-auto bg-slate-200">
          <div className="min-h-full flex justify-center py-6 px-4">
            <ResumePreview />
          </div>
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
