import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { useResumeStore } from '../store';
import ModuleEditor from './ModuleEditor';
import { MODULE_LABELS, type ModuleType } from '../types';

export default function ModuleList() {
  const { modules, addModule, reorderModules } = useResumeStore();
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIdx = modules.findIndex((m) => m.id === active.id);
    const newIdx = modules.findIndex((m) => m.id === over.id);
    const next = [...modules];
    const [item] = next.splice(oldIdx, 1);
    next.splice(newIdx, 0, item);
    reorderModules(next.map((m) => m.id));
  }

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={modules.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {modules.map((mod) => (
            <ModuleEditor key={mod.id} module={mod} />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add module button */}
      <div className="relative">
        <button
          className="w-full mt-1 py-2 flex items-center justify-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 border border-dashed border-slate-300 hover:border-blue-400 rounded-lg transition-colors"
          onClick={() => setShowAddMenu((v) => !v)}
        >
          <Plus size={15} />
          添加模块
        </button>

        {showAddMenu && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 py-1">
            {(Object.entries(MODULE_LABELS) as [ModuleType, string][]).map(([type, label]) => (
              <button
                key={type}
                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                onClick={() => {
                  addModule(type);
                  setShowAddMenu(false);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
