/**
 * 日期计算工具
 * 移植自 flutter_shared/tools/date_calc_tool.dart
 */

export interface DateDiffResult {
  days: number;
  hours: number;
  minutes: number;
  totalDays: number;
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
}

function daysInMonth(year: number, month: number): number {
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  if ([4, 6, 9, 11].includes(month)) return 30;
  return 31;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

export const DateCalcTool = {
  /** 日期差 */
  dateDiff(start: Date, end: Date): DateDiffResult {
    const diff = end.getTime() - start.getTime();
    const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    return {
      totalDays,
      hours: Math.floor(diff / (1000 * 60 * 60)),
      minutes: Math.floor(diff / (1000 * 60)),
      days: Math.abs(totalDays),
    };
  },

  /** 加减天数 */
  addDays(date: Date, days: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  },

  /** 加减周数 */
  addWeeks(date: Date, weeks: number): Date {
    return this.addDays(date, weeks * 7);
  },

  /** 加减月数 */
  addMonths(date: Date, months: number): Date {
    let newMonth = date.getMonth() + 1 + months;
    let yearDelta = Math.floor((newMonth - 1) / 12);
    let m = ((newMonth - 1) % 12) + 1;
    let y = date.getFullYear() + yearDelta;
    let maxDay = daysInMonth(y, m);
    let d = date.getDate() > maxDay ? maxDay : date.getDate();
    return new Date(y, m - 1, d, date.getHours(), date.getMinutes(), date.getSeconds());
  },

  /** 加减年数 */
  addYears(date: Date, years: number): Date {
    let y = date.getFullYear() + years;
    let maxDay = daysInMonth(y, date.getMonth() + 1);
    let d = date.getDate() > maxDay ? maxDay : date.getDate();
    return new Date(y, date.getMonth(), d, date.getHours(), date.getMinutes(), date.getSeconds());
  },

  /** 计算工作日天数（不含周六日） */
  weekdaysBetween(start: Date, end: Date): number {
    let count = 0;
    const day = new Date(Math.min(start.getTime(), end.getTime()));
    const target = new Date(Math.max(start.getTime(), end.getTime()));
    while (day < target) {
      const dow = day.getDay();
      if (dow !== 0 && dow !== 6) count++;
      day.setDate(day.getDate() + 1);
    }
    return count;
  },

  /** 年龄计算 */
  age(birthDate: Date): AgeResult {
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = now.getMonth() === 0 ? 12 : now.getMonth();
      const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
      days += daysInMonth(prevYear, prevMonth);
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, days };
  },

  isLeapYear,
  daysInMonth,
};
