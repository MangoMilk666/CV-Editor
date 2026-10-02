import { isPresentValue } from '../config/i18n';
import type { EntryRecord, EntrySortOrder, ModuleType } from '../types';

export function supportsModuleSort(type: ModuleType): boolean {
  return type === 'education' || type === 'projects' || type === 'internship';
}

function parseDateVal(value: string): number {
  if (!value || isPresentValue(value)) return 999999;
  const [year, month] = value.split('.');
  return Number.parseInt(year || '0', 10) * 100 + Number.parseInt(month || '0', 10);
}

export function sortEntriesByDate(entries: EntryRecord[], order: EntrySortOrder): EntryRecord[] {
  return [...entries].sort((a, b) => {
    const endDiff = parseDateVal(b.endDate ?? '') - parseDateVal(a.endDate ?? '');
    const startDiff = parseDateVal(b.startDate ?? '') - parseDateVal(a.startDate ?? '');
    const result = endDiff !== 0 ? endDiff : startDiff;
    return order === 'asc' ? -result : result;
  });
}
