export type ModuleType =
  | 'education'
  | 'skills'
  | 'projects'
  | 'internship'
  | 'work'
  | 'others'
  | 'custom';

export const MODULE_LABELS: Record<ModuleType, string> = {
  education: '教育背景',
  skills: '专业技能',
  projects: '项目经历',
  internship: '实习经历',
  work: '工作经历',
  others: '其他',
  custom: '自定义模块',
};

export type PhotoSize = '1inch' | '2inch';

export const PHOTO_DIMENSIONS: Record<PhotoSize, { w: number; h: number; label: string }> = {
  '1inch': { w: 25, h: 35, label: '1寸 (25×35mm)' },
  '2inch': { w: 35, h: 49, label: '2寸 (35×49mm)' },
};

export type HeaderAlign = 'left' | 'center';

export interface ResumeHeader {
  name: string;
  jobTarget: string;
  email: string;
  phone: string;
  city: string;
  github: string;
  website: string;
  linkedin: string;
  photo: string;
  photoSize: PhotoSize;
  headerAlign: HeaderAlign;
}

// ── Field schema ──────────────────────────────────────────
export type FieldType = 'text' | 'select' | 'textarea-md' | 'date-ym';

export interface FieldSchema {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: string[];   // for select
  span?: 'half' | 'full';
}

// Entry is a free-form key-value bag; keys are defined by MODULE_FIELDS
export type EntryRecord = Record<string, string>;

export interface ResumeModule {
  id: string;
  type: ModuleType;
  title: string;
  entries: EntryRecord[];
  visible: boolean;
}

export interface LayoutConfig {
  modulePaddingTop: number;
  modulePaddingBottom: number;
  lineHeight: number;
  bodyFontSize: number;
  headingFontSize: number;
  fontFamily: string;
  pageMarginMm: number;
  accentColor: string;
}

export interface ResumeData {
  header: ResumeHeader;
  modules: ResumeModule[];
  layout: LayoutConfig;
}
