/**
 * Cron 表达式解析器
 *
 * 支持标准 5 字段和 6 字段（含秒）Cron 表达式。
 * 输出人类可读描述和接下来 N 次执行时间。
 *
 * 字段：秒(可选) 分 时 日 月 周
 * 支持：* / , - L W # ?
 */

export type CronField = "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

export interface CronParsed {
  /** 原始表达式 */
  expression: string;
  /** 是否包含秒字段 */
  hasSeconds: boolean;
  /** 各字段的解析值 */
  fields: {
    seconds?: number[];
    minutes: number[];
    hours: number[];
    daysOfMonth: number[];
    months: number[];
    daysOfWeek: number[];
  };
  /** 人类可读描述 */
  description: string;
  /** 是否有效 */
  isValid: boolean;
  error?: string;
}

const MONTH_NAMES = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
const WEEKDAY_NAMES = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const MONTH_MAP: Record<string, number> = {
  jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6,
  jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12,
};

const WEEKDAY_MAP: Record<string, number> = {
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
};

/**
 * 解析 Cron 表达式。
 */
export function parseCron(expression: string): CronParsed {
  const trimmed = expression.trim();

  if (!trimmed) {
    return { expression: "", hasSeconds: false, fields: emptyFields(), description: "", isValid: false, error: "表达式为空" };
  }

  const parts = trimmed.split(/\s+/);
  let hasSeconds = false;
  let rawParts: string[];

  if (parts.length === 6) {
    hasSeconds = true;
    rawParts = parts;
  } else if (parts.length === 5) {
    rawParts = ["0", ...parts];
  } else {
    return {
      expression: trimmed,
      hasSeconds: false,
      fields: emptyFields(),
      description: "",
      isValid: false,
      error: `表达式需要 5 或 6 个字段（当前 ${parts.length} 个）`,
    };
  }

  try {
    const seconds = parseField(rawParts[0], 0, 59);
    const minutes = parseField(rawParts[1], 0, 59);
    const hours = parseField(rawParts[2], 0, 23);
    const daysOfMonth = parseField(rawParts[3], 1, 31);
    const months = parseField(rawParts[4], 1, 12);
    const daysOfWeek = parseField(rawParts[5], 0, 7);

    // 周日的 7 也映射到 0
    const normalizedDaysOfWeek = daysOfWeek.map((d) => d === 7 ? 0 : d);

    const fields = {
      seconds: hasSeconds ? seconds : undefined,
      minutes,
      hours,
      daysOfMonth,
      months,
      daysOfWeek: [...new Set(normalizedDaysOfWeek)].sort(),
    };

    const description = describeCron({
      seconds: hasSeconds ? seconds : undefined,
      minutes,
      hours,
      daysOfMonth,
      months,
      daysOfWeek: normalizedDaysOfWeek,
      hasSeconds,
      expression: trimmed,
      isValid: true,
    });

    return {
      expression: trimmed,
      hasSeconds,
      fields,
      description,
      isValid: true,
    };
  } catch (e) {
    return {
      expression: trimmed,
      hasSeconds,
      fields: emptyFields(),
      description: "",
      isValid: false,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

function emptyFields() {
  return { minutes: [], hours: [], daysOfMonth: [], months: [], daysOfWeek: [] };
}

/**
 * 解析单个字段
 */
function parseField(field: string, min: number, max: number): number[] {
  if (field === "*" || field === "?") {
    return range(min, max);
  }

  const values = new Set<number>();

  for (const segment of field.split(",")) {
    if (segment.includes("/")) {
      // 步进：*/5 或 1-10/2
      const [rangePart, stepStr] = segment.split("/");
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) throw new Error(`无效的步进值: ${stepStr}`);

      if (rangePart === "*") {
        for (let i = min; i <= max; i += step) values.add(i);
      } else if (rangePart.includes("-")) {
        const [fromStr, toStr] = rangePart.split("-");
        const from = parseInt(fromStr, 10);
        const to = parseInt(toStr, 10);
        if (isNaN(from) || isNaN(to)) throw new Error(`无效的范围: ${rangePart}`);
        for (let i = from; i <= to; i += step) values.add(i);
      } else {
        const start = parseInt(rangePart, 10);
        if (isNaN(start)) throw new Error(`无效的值: ${rangePart}`);
        for (let i = start; i <= max; i += step) values.add(i);
      }
    } else if (segment.includes("-")) {
      const [fromStr, toStr] = segment.split("-");
      const from = parseInt(fromStr, 10);
      const to = parseInt(toStr, 10);
      if (isNaN(from) || isNaN(to)) throw new Error(`无效的范围: ${segment}`);
      if (from < min || to > max) throw new Error(`超出范围: ${segment}`);
      for (let i = from; i <= to; i++) values.add(i);
    } else if (segment === "L") {
      // 最后一天/最后一周 - 简化处理，返回月中的最大可能值
      values.add(max);
    } else if (segment === "W") {
      // 最近的工作日 - 简化处理
      // 这里不做精确计算，返回所有有效日
      values.add(-1); // 标记
    } else if (/^[a-z]{3}$/i.test(segment)) {
      // 月份或周几的名称
      const monthVal = MONTH_MAP[segment.toLowerCase()];
      if (monthVal !== undefined) {
        values.add(monthVal);
        continue;
      }
      const wdVal = WEEKDAY_MAP[segment.toLowerCase()];
      if (wdVal !== undefined) {
        values.add(wdVal);
        continue;
      }
      throw new Error(`无法识别的名称: ${segment}`);
    } else {
      const val = parseInt(segment, 10);
      if (isNaN(val)) throw new Error(`无法解析的字段值: ${segment}`);
      if (val < min || val > max) throw new Error(`超出范围 ${min}-${max}: ${val}`);
      values.add(val);
    }
  }

  const result = [...values].sort((a, b) => a - b);
  if (result.length === 0) throw new Error(`字段解析结果为空`);
  return result;
}

function range(min: number, max: number): number[] {
  const result: number[] = [];
  for (let i = min; i <= max; i++) result.push(i);
  return result;
}

// ---- 描述生成 ----

interface CronFields {
  seconds?: number[];
  minutes: number[];
  hours: number[];
  daysOfMonth: number[];
  months: number[];
  daysOfWeek: number[];
  hasSeconds: boolean;
  expression: string;
  isValid: boolean;
}

function describeCron(fields: CronFields): string {
  const { seconds, minutes, hours, daysOfMonth, months, daysOfWeek } = fields;

  const isEverySecond = seconds && seconds.length === 60;
  const isEveryMinute = minutes.length === 60;
  const isEveryHour = hours.length === 24;
  const isEveryDay = daysOfMonth.length === 31;
  const isEveryMonth = months.length === 12;
  const isEveryWeek = daysOfWeek.length === 7;

  if (isEveryMinute && isEveryHour && isEveryDay && isEveryMonth && isEveryWeek) {
    return isEverySecond ? "每秒执行" : "每分钟执行";
  }

  const parts: string[] = [];

  // 秒
  if (seconds && !isEverySecond) {
    if (seconds.length <= 3) {
      parts.push(`第 ${seconds.join("、")} 秒`);
    } else {
      parts.push(`每秒`);
    }
  }

  // 分
  if (isEveryMinute) {
    // 不添加，由小时决定
  } else if (minutes.length <= 3) {
    parts.push(`第 ${minutes.join("、")} 分`);
  } else {
    // 检查步进模式
    parts.push(`每分钟`);
  }

  // 时
  if (isEveryHour) {
    // 不添加
  } else if (hours.length <= 3) {
    parts.push(`${hours.join(":")} 时`);
  } else {
    parts.push(`每小时`);
  }

  // 日
  if (!isEveryDay) {
    if (daysOfMonth.length <= 3) {
      parts.push(`每月 ${daysOfMonth.join("、")} 日`);
    }
  }

  // 月
  if (!isEveryMonth) {
    const monthNames = months.map((m) => MONTH_NAMES[m] || `${m}月`);
    if (months.length <= 3) {
      parts.push(`${monthNames.join("、")}`);
    }
  }

  // 周
  if (!isEveryWeek) {
    const dayNames = daysOfWeek.map((d) => WEEKDAY_NAMES[d] || `周${d}`);
    if (daysOfWeek.length <= 3) {
      parts.push(`每${dayNames.join("、")}`);
    }
  }

  if (parts.length === 0) return "每分钟执行（所有字段通配）";

  // 构建时间描述
  if (!isEveryMinute && !isEveryHour) {
    const timeParts: string[] = [];
    for (const h of hours.length <= 3 ? hours : [0]) {
      for (const m of minutes.length <= 10 ? minutes : [0]) {
        timeParts.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      }
    }
    if (timeParts.length <= 5) {
      parts.push(timeParts.join("、"));
    }
  }

  return parts.join(" ");
}

export interface NextRunResult {
  nextRuns: Date[];
  error?: string;
}

/**
 * 计算接下来 N 次执行时间。
 * @param expression Cron 表达式
 * @param count 计算次数（默认 5，最多 20）
 * @param fromDate 起始时间（默认当前时间）
 */
export function getNextRuns(
  expression: string,
  count = 5,
  fromDate?: Date
): NextRunResult {
  const parsed = parseCron(expression);
  if (!parsed.isValid) {
    return { nextRuns: [], error: parsed.error };
  }

  const maxCount = Math.max(1, Math.min(20, Math.round(count)));
  const now = fromDate || new Date();
  const runs: Date[] = [];

  // 简单模拟：从当前时间开始，每次加 1 秒检查
  // 对于生产环境应该使用更高效的计算，但对于 MVP 够用
  let candidate = new Date(now.getTime() + 60000); // 从 1 分钟后开始
  let guard = 0;

  while (runs.length < maxCount && guard < 100_000) {
    guard++;

    const sec = candidate.getSeconds();
    const min = candidate.getMinutes();
    const hour = candidate.getHours();
    const day = candidate.getDate();
    const month = candidate.getMonth() + 1;
    const weekday = candidate.getDay();

    const secMatch = !parsed.fields.seconds || parsed.fields.seconds.includes(sec);
    const minMatch = parsed.fields.minutes.includes(min);
    const hourMatch = parsed.fields.hours.includes(hour);
    const dayMatch = parsed.fields.daysOfMonth.includes(day);
    const monthMatch = parsed.fields.months.includes(month);
    const weekMatch = parsed.fields.daysOfWeek.includes(weekday);

    if ((dayMatch || weekMatch) && monthMatch && hourMatch && minMatch && secMatch) {
      runs.push(new Date(candidate));
    }

    // 快速前进策略
    candidate = new Date(candidate.getTime() + 1000); // 加 1 秒
  }

  return { nextRuns: runs };
}

/**
 * 常用 Cron 预设
 */
export interface CronPreset {
  name: string;
  expression: string;
  description: string;
}

export const CRON_PRESETS: CronPreset[] = [
  { name: "每分钟", expression: "* * * * *", description: "每分钟执行一次" },
  { name: "每 5 分钟", expression: "*/5 * * * *", description: "每 5 分钟执行一次" },
  { name: "每 10 分钟", expression: "*/10 * * * *", description: "每 10 分钟执行一次" },
  { name: "每 30 分钟", expression: "*/30 * * * *", description: "每 30 分钟执行一次" },
  { name: "每小时", expression: "0 * * * *", description: "每小时整点执行" },
  { name: "每天 0 点", expression: "0 0 * * *", description: "每天午夜执行" },
  { name: "每天 9 点", expression: "0 9 * * *", description: "每天上午 9 点执行" },
  { name: "工作日 9 点", expression: "0 9 * * 1-5", description: "工作日上午 9 点执行" },
  { name: "每周一 0 点", expression: "0 0 * * 1", description: "每周一午夜执行" },
  { name: "每月 1 号 0 点", expression: "0 0 1 * *", description: "每月 1 号午夜执行" },
  { name: "每季首月 1 号", expression: "0 0 1 1,4,7,10 *", description: "每季度首月 1 号执行" },
  { name: "每年 1 月 1 日", expression: "0 0 1 1 *", description: "每年元旦执行" },
  { name: "每 2 小时", expression: "0 */2 * * *", description: "每 2 小时执行一次" },
  { name: "每天 8-18 点每小时", expression: "0 8-18 * * *", description: "每天 8 点到 18 点每小时执行" },
];
