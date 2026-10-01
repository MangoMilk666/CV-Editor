import type { ResumeLocale } from '../types';
import { PRESENT_LABEL, isPresentValue, UI_TEXT } from '../config/i18n';

interface Props {
  value: string;   // "YYYY.MM" | "至今" | ""
  locale: ResumeLocale;
  onChange: (v: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 + 3 }, (_, i) => String(1990 + i));
const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];
const ENGLISH_MONTHS: Record<string, string> = {
  '01': 'Jan.',
  '02': 'Feb.',
  '03': 'Mar.',
  '04': 'Apr.',
  '05': 'May',
  '06': 'Jun.',
  '07': 'Jul.',
  '08': 'Aug.',
  '09': 'Sep.',
  '10': 'Oct.',
  '11': 'Nov.',
  '12': 'Dec.',
};

export default function DatePicker({ value, locale, onChange }: Props) {
  const isJinri = isPresentValue(value);
  const parts = (!isJinri && value) ? value.split('.') : [];
  const year  = parts[0] ?? '';
  const month = parts[1] ?? '';
  const text = UI_TEXT[locale];
  const presentLabel = PRESENT_LABEL[locale];

  function update(y: string, m: string) {
    if (y && m) onChange(`${y}.${m}`);
    else if (y) onChange(`${y}.`);
    else onChange('');
  }

  return (
    <div className="flex items-center gap-1.5">
      {isJinri ? (
        <span className="flex-1 text-sm text-slate-400 border border-slate-200 rounded px-2 py-1.5 bg-slate-50 select-none">
          {presentLabel}
        </span>
      ) : (
        <>
          <select
            className="flex-1 text-sm border border-slate-200 rounded px-1.5 py-1.5 bg-white focus:outline-none focus:border-blue-400 text-slate-700"
            value={year}
            onChange={(e) => update(e.target.value, month)}
          >
            <option value="">{text.year}</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-slate-300 text-sm select-none">.</span>
          <select
            className="w-[68px] text-sm border border-slate-200 rounded px-1.5 py-1.5 bg-white focus:outline-none focus:border-blue-400 text-slate-700"
            value={month}
            onChange={(e) => update(year, e.target.value)}
          >
            <option value="">{text.month}</option>
            {MONTHS.map((m) => <option key={m} value={m}>{locale === 'en' ? ENGLISH_MONTHS[m] : m}</option>)}
          </select>
        </>
      )}
      <label className="flex items-center gap-1 cursor-pointer select-none shrink-0">
        <input
          type="checkbox"
          className="accent-blue-500 cursor-pointer"
          checked={isJinri}
          onChange={() => onChange(isJinri ? '' : presentLabel)}
        />
        <span className="text-xs text-slate-500">{presentLabel}</span>
      </label>
    </div>
  );
}
