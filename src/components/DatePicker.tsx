interface Props {
  value: string;   // "YYYY.MM" | "至今" | ""
  onChange: (v: string) => void;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: CURRENT_YEAR - 1989 + 3 }, (_, i) => String(1990 + i));
const MONTHS = ['01','02','03','04','05','06','07','08','09','10','11','12'];

export default function DatePicker({ value, onChange }: Props) {
  const isJinri = value === '至今';
  const parts = (!isJinri && value) ? value.split('.') : [];
  const year  = parts[0] ?? '';
  const month = parts[1] ?? '';

  function update(y: string, m: string) {
    if (y && m) onChange(`${y}.${m}`);
    else if (y) onChange(`${y}.`);
    else onChange('');
  }

  return (
    <div className="flex items-center gap-1.5">
      {isJinri ? (
        <span className="flex-1 text-sm text-slate-400 border border-slate-200 rounded px-2 py-1.5 bg-slate-50 select-none">
          至今
        </span>
      ) : (
        <>
          <select
            className="flex-1 text-sm border border-slate-200 rounded px-1.5 py-1.5 bg-white focus:outline-none focus:border-blue-400 text-slate-700"
            value={year}
            onChange={(e) => update(e.target.value, month)}
          >
            <option value="">年份</option>
            {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          <span className="text-slate-300 text-sm select-none">.</span>
          <select
            className="w-[68px] text-sm border border-slate-200 rounded px-1.5 py-1.5 bg-white focus:outline-none focus:border-blue-400 text-slate-700"
            value={month}
            onChange={(e) => update(year, e.target.value)}
          >
            <option value="">月</option>
            {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </>
      )}
      <label className="flex items-center gap-1 cursor-pointer select-none shrink-0">
        <input
          type="checkbox"
          className="accent-blue-500 cursor-pointer"
          checked={isJinri}
          onChange={() => onChange(isJinri ? '' : '至今')}
        />
        <span className="text-xs text-slate-500">至今</span>
      </label>
    </div>
  );
}
