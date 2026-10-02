import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { EntrySortOrder, LayoutConfig, ModuleType, ResumeData, ResumeHeader, ResumeLocale, ResumeModule, ResumeTemplate } from './types';
import { emptyEntry } from './config/fields';
import { createDefaultResume, DEFAULT_HEADERS, DEFAULT_LAYOUTS, DEFAULT_TEMPLATES, SECOND_CHINESE_TEMPLATE } from './config/resumeDefaults';
import { MODULE_LABELS } from './config/i18n';
import { v4 as uuid } from './utils/uuid';

interface ResumeStore extends ResumeData {
  locale: ResumeLocale;
  setLocale: (locale: ResumeLocale) => void;
  selectTemplate: (templateId: string) => void;
  renameTemplate: (templateId: string, name: string) => void;
  updateHeader: (patch: Partial<ResumeHeader>) => void;
  updateLayout: (patch: Partial<LayoutConfig>) => void;
  addModule: (type: ModuleType) => void;
  updateModule: (id: string, patch: Partial<ResumeModule>) => void;
  deleteModule: (id: string) => void;
  reorderModules: (orderedIds: string[]) => void;
  addEntry: (moduleId: string) => void;
  updateEntry: (moduleId: string, idx: number, key: string, value: string) => void;
  deleteEntry: (moduleId: string, idx: number) => void;
  resetAll: () => void;
  importData: (data: ResumeData) => void;
  resumes: Record<ResumeLocale, ResumeData>;
  templates: Record<ResumeLocale, ResumeTemplate[]>;
  activeTemplateIds: Record<ResumeLocale, string>;
}

const DEFAULT_LOCALE: ResumeLocale = 'zh';

function supportsModuleSort(type: ModuleType): boolean {
  return type === 'education' || type === 'projects' || type === 'internship';
}

function getDefaultSortOrder(type: ModuleType): EntrySortOrder | undefined {
  return supportsModuleSort(type) ? 'desc' : undefined;
}

function normalizeModules(modules: ResumeModule[]): ResumeModule[] {
  return modules.map((module) => ({
    ...module,
    entrySortOrder: module.entrySortOrder ?? getDefaultSortOrder(module.type),
    entries: module.entries.map((entry) => ({ ...entry })),
  }));
}

function cloneResume(data: ResumeData): ResumeData {
  return {
    header: { ...data.header },
    modules: normalizeModules(data.modules),
    layout: { ...data.layout },
  };
}

function createDefaultResumes(): Record<ResumeLocale, ResumeData> {
  return {
    zh: createDefaultResume('zh'),
    en: createDefaultResume('en'),
  };
}

function createDefaultTemplates(): Record<ResumeLocale, ResumeTemplate[]> {
  return {
    zh: [
      { ...DEFAULT_TEMPLATES.zh, layout: { ...DEFAULT_TEMPLATES.zh.layout } },
      { ...SECOND_CHINESE_TEMPLATE, layout: { ...SECOND_CHINESE_TEMPLATE.layout } },
    ],
    en: [{ ...DEFAULT_TEMPLATES.en, layout: { ...DEFAULT_TEMPLATES.en.layout } }],
  };
}

function mergeLayoutDefaults(layout: Partial<LayoutConfig> | undefined, locale: ResumeLocale): LayoutConfig {
  return { ...DEFAULT_LAYOUTS[locale], ...(layout ?? {}) };
}

function mergeTemplateList(saved: ResumeTemplate[] | undefined, locale: ResumeLocale): ResumeTemplate[] {
  const defaults = createDefaultTemplates()[locale];
  const normalizedSaved = (saved ?? []).map((template) => ({
    ...(defaults.find((item) => item.id === template.id) ?? DEFAULT_TEMPLATES[locale]),
    ...template,
    locale,
    layout: mergeLayoutDefaults(template.layout, locale),
  }));
  const defaultIds = new Set(defaults.map((template) => template.id));
  return [
    ...defaults.map((template) => normalizedSaved.find((item) => item.id === template.id) ?? template),
    ...normalizedSaved.filter((template) => !defaultIds.has(template.id)),
  ];
}

function mergeHeaderDefaults(header: Partial<ResumeHeader> | undefined, locale: ResumeLocale): ResumeHeader {
  return { ...DEFAULT_HEADERS[locale], ...(header ?? {}) };
}

function hasLegacyEnglishEducation(data: Partial<ResumeData> | undefined): boolean {
  return Boolean(
    data?.modules?.some((module) =>
      module.type === 'education' &&
      module.entries.some((entry) => Boolean(entry.major?.trim()))
    )
  );
}

function normalizeResumeData(data: Partial<ResumeData> | undefined, locale: ResumeLocale): ResumeData {
  const fallback = createDefaultResume(locale);
  if (locale === 'en' && hasLegacyEnglishEducation(data)) {
    return fallback;
  }
  return {
    header: mergeHeaderDefaults(data?.header, locale),
    modules: data?.modules?.length ? cloneResume({ ...fallback, ...data, header: mergeHeaderDefaults(data.header, locale), layout: mergeLayoutDefaults(data.layout, locale) }).modules : fallback.modules,
    layout: mergeLayoutDefaults(data?.layout, locale),
  };
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      locale: DEFAULT_LOCALE,
      resumes: createDefaultResumes(),
      templates: createDefaultTemplates(),
      activeTemplateIds: { zh: DEFAULT_TEMPLATES.zh.id, en: DEFAULT_TEMPLATES.en.id },
      ...cloneResume(createDefaultResume(DEFAULT_LOCALE)),

      updateHeader: (patch) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const next = { ...current, header: { ...current.header, ...patch } };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      updateLayout: (patch) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const next = { ...current, layout: { ...current.layout, ...patch } };
          const activeId = s.activeTemplateIds[s.locale];
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
            templates: {
              ...s.templates,
              [s.locale]: s.templates[s.locale].map((template) =>
                template.id === activeId ? { ...template, layout: next.layout } : template
              ),
            },
          };
        }),

      setLocale: (locale) =>
        set((s) => {
          const next = s.resumes[locale];
          const template = s.templates[locale].find((item) => item.id === s.activeTemplateIds[locale]);
          return {
            locale,
            header: next.header,
            modules: next.modules,
            layout: template?.layout ?? next.layout,
          };
        }),

      selectTemplate: (templateId) =>
        set((s) => {
          const template = s.templates[s.locale].find((item) => item.id === templateId);
          if (!template) return s;
          const next = { ...s.resumes[s.locale], layout: { ...template.layout } };
          return {
            activeTemplateIds: { ...s.activeTemplateIds, [s.locale]: templateId },
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      renameTemplate: (templateId, name) =>
        set((s) => ({
          templates: {
            ...s.templates,
            [s.locale]: s.templates[s.locale].map((template) =>
              template.id === templateId ? { ...template, name } : template
            ),
          },
        })),

      addModule: (type) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const nextModules = [
            ...current.modules,
            {
              id: uuid(),
              type,
              title: MODULE_LABELS[s.locale][type],
              entries: [emptyEntry(type)],
              visible: true,
              entrySortOrder: getDefaultSortOrder(type),
            },
          ];
          const next = { ...current, modules: nextModules };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      updateModule: (id, patch) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const next = {
            ...current,
            modules: current.modules.map((m) => (m.id === id ? { ...m, ...patch } : m)),
          };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      deleteModule: (id) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const next = { ...current, modules: current.modules.filter((m) => m.id !== id) };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      reorderModules: (orderedIds) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const next = {
            ...current,
            modules: orderedIds
              .map((id) => current.modules.find((m) => m.id === id))
              .filter(Boolean) as ResumeModule[],
          };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      addEntry: (moduleId) => {
        const { locale, resumes } = get();
        const mod = resumes[locale].modules.find((m) => m.id === moduleId);
        if (!mod) return;
        set((s) => ({
          ...(() => {
            const current = s.resumes[s.locale];
            const next = {
              ...current,
              modules: current.modules.map((m) =>
                m.id === moduleId ? { ...m, entries: [...m.entries, emptyEntry(m.type)] } : m
              ),
            };
            return {
              header: next.header,
              modules: next.modules,
              layout: next.layout,
              resumes: { ...s.resumes, [s.locale]: next },
            };
          })(),
        }));
      },

      updateEntry: (moduleId, idx, key, value) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const next = {
            ...current,
            modules: current.modules.map((m) => {
              if (m.id !== moduleId) return m;
              const entries = m.entries.map((e, i) =>
                i === idx ? { ...e, [key]: value } : e
              );
              return { ...m, entries };
            }),
          };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      deleteEntry: (moduleId, idx) =>
        set((s) => {
          const current = s.resumes[s.locale];
          const next = {
            ...current,
            modules: current.modules.map((m) => {
              if (m.id !== moduleId) return m;
              const entries = m.entries.filter((_, i) => i !== idx);
              return { ...m, entries: entries.length ? entries : [emptyEntry(m.type)] };
            }),
          };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),

      resetAll: () =>
        set((s) => {
          const next = createDefaultResume(s.locale);
          const activeId = s.activeTemplateIds[s.locale];
          const defaultTemplate = createDefaultTemplates()[s.locale].find((template) => template.id === activeId);
          if (defaultTemplate) next.layout = { ...defaultTemplate.layout };
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
            templates: {
              ...s.templates,
              [s.locale]: s.templates[s.locale].map((template) =>
                template.id === activeId ? { ...template, layout: { ...next.layout } } : template
              ),
            },
          };
        }),

      importData: (data) =>
        set((s) => {
          const activeId = s.activeTemplateIds[s.locale];
          const activeLayout = s.templates[s.locale].find((template) => template.id === activeId)?.layout ?? s.layout;
          const next = normalizeResumeData({ ...data, layout: activeLayout }, s.locale);
          return {
            header: next.header,
            modules: next.modules,
            layout: next.layout,
            resumes: { ...s.resumes, [s.locale]: next },
          };
        }),
    }),
    {
      name: 'cv-editor-v3',
      // Deep-merge defaults so newly added persisted fields are never undefined.
      merge: (persisted: unknown, current) => {
        const p = persisted as Partial<typeof current> & Partial<ResumeData>;
        const locale = p.locale === 'en' ? 'en' : DEFAULT_LOCALE;
        const resumes = p.resumes
          ? {
              zh: normalizeResumeData(p.resumes.zh, 'zh'),
              en: normalizeResumeData(p.resumes.en, 'en'),
            }
          : {
              ...createDefaultResumes(),
              zh: normalizeResumeData({
                header: p.header,
                modules: p.modules,
                layout: p.layout,
              }, 'zh'),
            };
        const templates = {
          zh: mergeTemplateList(p.templates?.zh, 'zh'),
          en: mergeTemplateList(p.templates?.en, 'en'),
        };
        const activeTemplateIds = {
          zh: templates.zh.some((template) => template.id === p.activeTemplateIds?.zh)
            ? p.activeTemplateIds!.zh
            : templates.zh[0].id,
          en: templates.en.some((template) => template.id === p.activeTemplateIds?.en)
            ? p.activeTemplateIds!.en
            : templates.en[0].id,
        };
        if (!p.templates) {
          for (const lang of ['zh', 'en'] as const) {
            const savedLayout = p.resumes?.[lang]?.layout ?? (lang === locale ? p.layout : undefined);
            if (savedLayout) {
              const defaultId = DEFAULT_TEMPLATES[lang].id;
              templates[lang] = templates[lang].map((template) => template.id === defaultId
                ? { ...template, layout: mergeLayoutDefaults(savedLayout, lang) }
                : template);
            }
          }
        }
        const activeResume = resumes[locale];
        const activeTemplate = templates[locale].find((template) => template.id === activeTemplateIds[locale])!;
        return {
          ...current,
          locale,
          resumes,
          templates,
          activeTemplateIds,
          header: activeResume.header,
          modules: activeResume.modules,
          layout: activeTemplate.layout,
        };
      },
    }
  )
);
