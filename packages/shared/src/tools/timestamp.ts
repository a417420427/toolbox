/**
 * 时间戳 ↔ 日期互转工具
 *
 * 支持秒级/毫秒级时间戳，多种日期格式输出，相对时间。
 * 全部纯函数，无外部依赖。
 */

/** 日期格式类型 */
export type DateFormat =
  | "iso"          // 2024-01-15T10:30:00+08:00
  | "cn"           // 2024-01-15 10:30:00
  | "us"           // 01/15/2024 10:30:00 AM
  | "cn-date"      // 2024-01-15
  | "cn-time"      // 10:30:00
  | "full-cn"      // 2024年1月15日 10:30:00
  | "relative";    // 3 小时前

/** 时区信息 */
export interface TimezoneInfo {
  label: string;
  offset: number; // UTC 偏移分钟数
}

/** 常用时区 */
export const COMMON_TIMEZONES: TimezoneInfo[] = [
  { label: "UTC-12", offset: -720 },
  { label: "UTC-11", offset: -660 },
  { label: "UTC-10", offset: -600 },
  { label: "UTC-9", offset: -540 },
  { label: "UTC-8", offset: -480 },
  { label: "UTC-7", offset: -420 },
  { label: "UTC-6", offset: -360 },
  { label: "UTC-5", offset: -300 },
  { label: "UTC-4", offset: -240 },
  { label: "UTC-3", offset: -180 },
  { label: "UTC-2", offset: -120 },
  { label: "UTC-1", offset: -60 },
  { label: "UTC", offset: 0 },
  { label: "UTC+1", offset: 60 },
  { label: "UTC+2", offset: 120 },
  { label: "UTC+3", offset: 180 },
  { label: "UTC+4", offset: 240 },
  { label: "UTC+5", offset: 300 },
  { label: "UTC+5:30 (印度)", offset: 330 },
  { label: "UTC+6", offset: 360 },
  { label: "UTC+7", offset: 420 },
  { label: "UTC+8 (北京时间)", offset: 480 },
  { label: "UTC+9", offset: 540 },
  { label: "UTC+10", offset: 600 },
  { label: "UTC+11", offset: 660 },
  { label: "UTC+12", offset: 720 },
];

/**
 * 自动判断时间戳是秒级还是毫秒级。
 * 规则：长度 ≤10 位（1970 年左右范围）为秒级，否则毫秒级。
 */
export function detectTimestampScale(ts: number): "seconds" | "milliseconds" {
  // 如果小于 1e12（约 2001 年毫秒值），可能是秒
  if (ts < 10000000000) return "seconds"; // < 2286-11-21, 秒级
  if (ts < 100000000000) return "seconds"; // < 5138, 但比 10 亿大可能是秒
  if (ts > 10000000000000) return "milliseconds"; // 远大于 2286 年毫秒
  // 模糊区间：比较近 50 年范围
  const now = Date.now();
  const sec = ts * 1000;
  // 如果秒级值更接近当前时间
  if (Math.abs(sec - now) < Math.abs(ts - now)) return "seconds";
  return "milliseconds";
}

export interface TimestampParseResult {
  /** 解析后的 Date 对象 */
  date: Date;
  /** 检测到的精度 */
  scale: "seconds" | "milliseconds";
  /** 原始输入 */
  raw: number;
}

/**
 * 解析时间戳为 Date 对象，自动检测秒/毫秒。
 */
export function parseTimestamp(ts: number): TimestampParseResult {
  const scale = detectTimestampScale(ts);
  const ms = scale === "seconds" ? ts * 1000 : ts;
  const date = new Date(ms);
  if (isNaN(date.getTime())) {
    throw new Error("无效的时间戳");
  }
  return { date, scale, raw: ts };
}

export interface FormatDateOptions {
  /** 输出格式（默认 cn） */
  format?: DateFormat;
  /** UTC 偏移分钟数（默认取本地时区） */
  timezoneOffset?: number;
  /** 相对时间参考点（默认当前时间，仅 relative 格式生效） */
  now?: Date;
}

/**
 * 将 Date 对象格式化为指定格式的字符串。
 */
export function formatDate(date: Date, options: FormatDateOptions = {}): string {
  const format = options.format ?? "cn";
  const tzOffset = options.timezoneOffset ?? -date.getTimezoneOffset();

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const ms = date.getUTCMilliseconds();

  // 应用时区偏移
  const tzMs = tzOffset * 60 * 1000;
  const localDate = new Date(date.getTime() + tzMs - date.getTimezoneOffset() * 60 * 1000);

  const lYear = localDate.getFullYear();
  const lMonth = localDate.getMonth() + 1;
  const lDay = localDate.getDate();
  const lHours = localDate.getHours();
  const lMinutes = localDate.getMinutes();
  const lSeconds = localDate.getSeconds();

  const pad = (n: number, len = 2): string => String(n).padStart(len, "0");
  const ampm = lHours >= 12 ? "PM" : "AM";
  const h12 = lHours % 12 || 12;

  // 构建时区字符串
  const tzSign = tzOffset >= 0 ? "+" : "-";
  const tzHours = Math.floor(Math.abs(tzOffset) / 60);
  const tzMins = Math.abs(tzOffset) % 60;
  const tzStr = `${tzSign}${pad(tzHours)}:${pad(tzMins)}`;

  switch (format) {
    case "iso":
      return `${lYear}-${pad(lMonth)}-${pad(lDay)}T${pad(lHours)}:${pad(lMinutes)}:${pad(lSeconds)}${tzStr}`;

    case "cn":
      return `${lYear}-${pad(lMonth)}-${pad(lDay)} ${pad(lHours)}:${pad(lMinutes)}:${pad(lSeconds)}`;

    case "us":
      return `${pad(lMonth)}/${pad(lDay)}/${lYear} ${pad(h12)}:${pad(lMinutes)}:${pad(lSeconds)} ${ampm}`;

    case "cn-date":
      return `${lYear}-${pad(lMonth)}-${pad(lDay)}`;

    case "cn-time":
      return `${pad(lHours)}:${pad(lMinutes)}:${pad(lSeconds)}`;

    case "full-cn":
      return `${lYear}年${lMonth}月${lDay}日 ${pad(lHours)}:${pad(lMinutes)}:${pad(lSeconds)}`;

    case "relative":
      return formatRelative(date, options.now ?? new Date());

    default:
      return localDate.toISOString();
  }
}

/**
 * 格式化相对时间（"3 小时前"）。
 */
export function formatRelative(date: Date, now: Date = new Date()): string {
  const diffMs = now.getTime() - date.getTime();
  const absMs = Math.abs(diffMs);
  const future = diffMs < 0;

  const units: [number, string][] = [
    [365 * 24 * 60 * 60 * 1000, "年"],
    [30 * 24 * 60 * 60 * 1000, "个月"],
    [7 * 24 * 60 * 60 * 1000, "周"],
    [24 * 60 * 60 * 1000, "天"],
    [60 * 60 * 1000, "小时"],
    [60 * 1000, "分钟"],
    [1000, "秒"],
  ];

  for (const [threshold, label] of units) {
    const count = Math.floor(absMs / threshold);
    if (count >= 1) {
      const prefix = future ? "后" : "前";
      return `${count} ${label}${prefix}`;
    }
  }

  return "刚刚";
}

/** 时间戳转换结果 */
export interface TimestampConvertResult {
  timestamp: {
    seconds: number;
    milliseconds: number;
  };
  date: Date;
  formatted: Record<string, string>;
}

/**
 * 一键转换时间戳/日期。
 * 输入可以是时间戳数字，也可以是日期字符串。
 */
export function convertTimestamp(
  input: number | string | Date,
  options?: { timezoneOffset?: number }
): TimestampConvertResult {
  let date: Date;

  if (input instanceof Date) {
    date = input;
  } else if (typeof input === "number" && !isNaN(input)) {
    date = parseTimestamp(input).date;
  } else if (typeof input === "string") {
    date = new Date(input);
    if (isNaN(date.getTime())) {
      throw new Error("无法解析输入的日期字符串");
    }
  } else {
    throw new Error("无效的输入");
  }

  const tzOffset = options?.timezoneOffset;
  const formats: DateFormat[] = ["iso", "cn", "us", "cn-date", "cn-time", "full-cn", "relative"];
  const formatted: Record<string, string> = {};

  for (const fmt of formats) {
    formatted[fmt] = formatDate(date, { format: fmt, timezoneOffset: tzOffset });
  }

  return {
    timestamp: {
      seconds: Math.floor(date.getTime() / 1000),
      milliseconds: date.getTime(),
    },
    date,
    formatted,
  };
}

/**
 * 获取当前时间的完整转换结果。
 */
export function getCurrentTimestamp(options?: { timezoneOffset?: number }): TimestampConvertResult {
  return convertTimestamp(new Date(), options);
}
