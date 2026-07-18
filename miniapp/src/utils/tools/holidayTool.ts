/**
 * 节假日查询
 * 移植自 flutter_shared/tools/holiday_tool.dart
 */

export interface HolidayEntry {
  name: string;
  date: Date;
}

const fixedHolidays: Record<string, [number, number]> = {
  '元旦': [1, 1],
  '劳动节': [5, 1],
  '国庆节': [10, 1],
  '儿童节': [6, 1],
  '圣诞节': [12, 25],
};

const knownSpringFestivals: Record<number, [number, number]> = {
  2024: [2, 10], 2025: [1, 29], 2026: [2, 17],
  2027: [2, 6], 2028: [1, 26], 2029: [2, 13], 2030: [2, 3],
};

const knownDragonBoat: Record<number, [number, number]> = {
  2024: [6, 10], 2025: [5, 31], 2026: [6, 19],
  2027: [6, 9], 2028: [5, 28], 2029: [6, 16], 2030: [6, 5],
};

const knownMidAutumn: Record<number, [number, number]> = {
  2024: [9, 17], 2025: [10, 6], 2026: [9, 25],
  2027: [9, 15], 2028: [10, 3], 2029: [9, 21], 2030: [9, 12],
};

function qingmingDate(year: number): Date {
  return new Date(year, 3, 4); // 4月4日
}

export const HolidayTool = {
  /** 获取某年所有节假日列表 */
  getHolidays(year: number): HolidayEntry[] {
    const list: HolidayEntry[] = [];

    // 固定公历节日
    for (const [name, [m, d]] of Object.entries(fixedHolidays)) {
      list.push({ name, date: new Date(year, m - 1, d) });
    }

    // 春节
    const sf = knownSpringFestivals[year];
    if (sf) {
      list.push({ name: '春节', date: new Date(year, sf[0] - 1, sf[1]) });
      list.push({ name: '除夕', date: new Date(year, sf[0] - 1, sf[1] - 1) });
    }

    // 清明节
    list.push({ name: '清明节', date: qingmingDate(year) });

    // 端午节
    const db = knownDragonBoat[year];
    if (db) list.push({ name: '端午节', date: new Date(year, db[0] - 1, db[1]) });

    // 中秋节
    const ma = knownMidAutumn[year];
    if (ma) list.push({ name: '中秋节', date: new Date(year, ma[0] - 1, ma[1]) });

    list.sort((a, b) => a.date.getTime() - b.date.getTime());
    return list;
  },

  /** 获取当月的节假日 */
  getHolidaysForMonth(year: number, month: number): HolidayEntry[] {
    return this.getHolidays(year).filter(h => h.date.getMonth() + 1 === month);
  },

  /** 距离最近节假日 */
  nearestHoliday(year: number): { name: string; date: Date; daysUntil: number } | null {
    const now = new Date();
    const holidays = this.getHolidays(year);
    holidays.push(...this.getHolidays(year + 1));

    const future = holidays.filter(h => h.date > now);
    if (future.length === 0) return null;

    future.sort((a, b) => a.date.getTime() - b.date.getTime());
    const next = future[0];
    return {
      name: next.name,
      date: next.date,
      daysUntil: Math.floor((next.date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
    };
  },
};
