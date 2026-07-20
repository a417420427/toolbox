/**
 * 农历/黄历查询工具
 * 移植自 flutter_shared/tools/lunar_calendar_tool.dart
 * 实现公历 ↔ 农历互转、节气、宜忌
 */

// 农历 1900-2100 年的数据（每个月的大小月 + 闰月）
// 16进制格式: 前12位表示1-12月大小月(1=30天,0=29天), 后4位表示闰月(0=无闰月), 闰月天数在下一年的数据中
const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
  0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
  0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
  0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
  0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
  0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
  0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
  0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
  0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x05ac0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
  0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
  0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
  0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
  0x05aa0, 0x076a3, 0x096d0, 0x04afb, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
  0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
  0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06aa0, 0x1a6c4, 0x0aae0, //2050-2059
  0x092e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
  0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
  0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
  0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d150, 0x0f252, //2090-2099
  0x0d520, //2100
];

const heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const zodiacAnimals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// 二十四节气（1900-2100）
const solarTerms = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
  '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
];

// 黄历宜忌数据（简化版）
const luckyAffairs: Record<string, string[]> = {
  '祭祀': ['祈福', '求嗣', '斋醮'],
  '嫁娶': ['订婚', '领证', '婚礼'],
  '出行': ['旅游', '出差', '搬家'],
  '开市': ['开业', '开张', '开工'],
  '入宅': ['搬家', '乔迁'],
  '动土': ['开工', '装修', '建房'],
  '安葬': ['下葬', '迁坟'],
  '安床': ['入宅', '移床'],
};

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  yearName: string;       // 如 庚子年
  monthName: string;      // 如 正月
  dayName: string;        // 如 初一
  zodiac: string;         // 生肖
  solarTerm: string;      // 当天节气（如有）
  ganZhiYear: string;
  ganZhiMonth: string;
  ganZhiDay: string;
}

export interface DayYiJi {
  yi: string[];   // 宜
  ji: string[];   // 忌
}

export const LunarCalendarTool = {
  /** 公历日期 → 农历日期 */
  solarToLunar(year: number, month: number, day: number): LunarDate {
    // 基础日期：1900-01-31 = 农历庚子年正月初一
    const baseDate = new Date(1900, 0, 31);
    const targetDate = new Date(year, month - 1, day);
    let offset = Math.floor((targetDate.getTime() - baseDate.getTime()) / 86400000);

    let lunarYear = 1900;
    let leapMonth = 0;
    let isLeap = false;

    for (let i = 0; i < lunarInfo.length; i++) {
      const yearDays = this._yearDays(lunarYear);
      if (offset < yearDays) {
        leapMonth = this._leapMonth(lunarYear);
        break;
      }
      offset -= yearDays;
      lunarYear++;
    }

    if (lunarYear > 2100) {
      return this._fallbackSolar(year, month, day);
    }

    let lunarMonth = 1;
    let monthDays = 0;

    for (let i = 1; i <= 12; i++) {
      monthDays = this._monthDays(lunarYear, i);
      if (offset < monthDays) {
        lunarMonth = i;
        break;
      }
      offset -= monthDays;
    }

    // 检查闰月
    if (leapMonth > 0 && lunarMonth >= leapMonth) {
      const leapDays = this._leapDays(lunarYear);
      if (lunarMonth === leapMonth) {
        if (offset < leapDays) {
          isLeap = true;
        } else {
          offset -= leapDays;
          lunarMonth++;
        }
      } else {
        lunarMonth++;
      }
    }

    const lunarDay = offset + 1;
    const ganZhiYear = this._ganZhiYear(lunarYear);
    const ganZhiMonth = this._ganZhiMonth(lunarYear, lunarMonth, isLeap);
    const ganZhiDay = this._ganZhiDay(year, month, day);

    return {
      year: lunarYear,
      month: lunarMonth > 12 ? lunarMonth - 12 : lunarMonth,
      day: Math.min(lunarDay, 30),
      isLeap,
      yearName: `${ganZhiYear}${this._zodiacYear(lunarYear)}年`,
      monthName: `${isLeap ? '闰' : ''}${lunarMonths[(lunarMonth > 12 ? lunarMonth - 13 : lunarMonth - 1)]}月`,
      dayName: lunarDays[Math.min(lunarDay - 1, 29)],
      zodiac: zodiacAnimals[(lunarYear - 4) % 12],
      solarTerm: this._getSolarTerm(year, month, day),
      ganZhiYear,
      ganZhiMonth,
      ganZhiDay,
    };
  },

  /** 获取农历年总天数 */
  _yearDays(year: number): number {
    let sum = 0;
    for (let i = 1; i <= 13; i++) sum += this._monthDays(year, i);
    return sum;
  },

  /** 获取农历月天数（支持 1-13） */
  _monthDays(year: number, month: number): number {
    if (month > 12) return this._leapDays(year);
    const info = lunarInfo[year - 1900];
    return (info & (0x10000 >> month)) ? 30 : 29;
  },

  /** 获取闰月天数 */
  _leapDays(year: number): number {
    return this._leapMonth(year) ? 30 : 0;
  },

  /** 获取闰月（0=无闰月） */
  _leapMonth(year: number): number {
    return lunarInfo[year - 1900] & 0xf;
  },

  /** 获取干支纪年 */
  _ganZhiYear(year: number): string {
    const celestial = heavenlyStems[(year - 4) % 10];
    const terrestrial = earthlyBranches[(year - 4) % 12];
    return `${celestial}${terrestrial}`;
  },

  _zodiacYear(year: number): string {
    return zodiacAnimals[(year - 4) % 12];
  },

  _ganZhiMonth(year: number, month: number, isLeap: boolean): string {
    if (isLeap) return '闰月';
    // 根据年干支推算月干支（近似）
    const yearCelestial = (year - 4) % 10;
    const monthOffset = (month + 1) % 12;
    const celestial = heavenlyStems[(yearCelestial % 5 * 2 + monthOffset) % 10];
    const terrestrial = earthlyBranches[monthOffset];
    return `${celestial}${terrestrial}`;
  },

  _ganZhiDay(year: number, month: number, day: number): string {
    // 近似公式
    const base = new Date(1900, 0, 1); // 甲子日
    const target = new Date(year, month - 1, day);
    const offset = Math.floor((target.getTime() - base.getTime()) / 86400000) % 60;
    const c = offset % 10;
    const t = offset % 12;
    return `${heavenlyStems[c]}${earthlyBranches[t]}`;
  },

  /** 获取节气 */
  _getSolarTerm(year: number, month: number, day: number): string {
    // 简化的节气表（仅常用年份）
    const termDates: Record<string, { m: number; d: number }[]> = {
      2026: [
        { m: 1, d: 5 }, { m: 1, d: 20 }, { m: 2, d: 4 }, { m: 2, d: 19 },
        { m: 3, d: 5 }, { m: 3, d: 20 }, { m: 4, d: 5 }, { m: 4, d: 20 },
        { m: 5, d: 5 }, { m: 5, d: 21 }, { m: 6, d: 5 }, { m: 6, d: 21 },
        { m: 7, d: 7 }, { m: 7, d: 22 }, { m: 8, d: 7 }, { m: 8, d: 23 },
        { m: 9, d: 7 }, { m: 9, d: 23 }, { m: 10, d: 8 }, { m: 10, d: 23 },
        { m: 11, d: 7 }, { m: 11, d: 22 }, { m: 12, d: 7 }, { m: 12, d: 22 },
      ],
    };

    const terms = termDates[year];
    if (!terms) return '';
    for (let i = 0; i < terms.length; i++) {
      if (terms[i].m === month && terms[i].d === day) {
        return solarTerms[i] || '';
      }
    }
    return '';
  },

  /** 获取宜忌（基于农历月日查表） */
  getDayYiJi(lunarDate: LunarDate): DayYiJi {
    // 简化版：基于月日和月相返回大致宜忌
    const day = lunarDate.day;
    const month = lunarDate.month;
    const yi: string[] = [];
    const ji: string[] = [];

    // 初一、十五适祭祀
    if (day === 1 || day === 15) {
      yi.push('祭祀', '祈福');
      ji.push('动土', '开市');
    }

    // 双数日
    if (day % 2 === 0) {
      yi.push('出行', '嫁娶');
    } else {
      yi.push('入宅', '安床');
    }

    // 每月月初
    if (day <= 5) {
      yi.push('开市', '交易');
    }

    // 每月中旬
    if (day >= 10 && day <= 20) {
      yi.push('出行', '签订');
    }

    if (day >= 20) {
      yi.push('安葬', '祭祀');
    }

    // 通用宜
    yi.push('理发', '沐浴');
    ji.push('破土', '伐木');

    // 去重
    return {
      yi: [...new Set(yi)].slice(0, 6),
      ji: [...new Set(ji)].slice(0, 4),
    };
  },

  /** 回退：当农历数据不足时返回简单的干支 */
  _fallbackSolar(year: number, month: number, day: number): LunarDate {
    const d = new Date(year, month - 1, day);
    const base = new Date(1900, 0, 1);
    const offset = Math.floor((d.getTime() - base.getTime()) / 86400000) % 60;
    const c = offset % 10;
    const t = offset % 12;
    const ganZhi = `${heavenlyStems[c]}${earthlyBranches[t]}`;
    const zodiac = zodiacAnimals[(year - 4) % 12];

    return {
      year, month, day, isLeap: false,
      yearName: `${this._ganZhiYear(year)}${zodiac}年`,
      monthName: `${month}月`,
      dayName: `${day}日`,
      zodiac,
      solarTerm: this._getSolarTerm(year, month, day),
      ganZhiYear: this._ganZhiYear(year),
      ganZhiMonth: this._ganZhiMonth(year, month, false),
      ganZhiDay: ganZhi,
    };
  },
};
