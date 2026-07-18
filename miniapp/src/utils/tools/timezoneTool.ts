/**
 * 时区查询工具
 * 移植自 flutter_shared/tools/timezone_tool.dart
 */

export interface TimeZoneEntry {
  name: string;
  city: string;
  code: string;
  offsetMinutes: number;
}

function currentTimeForOffset(offsetMinutes: number): string {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const local = new Date(utc + offsetMinutes * 60000);
  const h = local.getHours().toString().padStart(2, '0');
  const m = local.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export const TimeZoneTool = {
  zones: [
    { name: 'PST (美西)', city: '洛杉矶/温哥华', code: 'UTC-8', offsetMinutes: -480 },
    { name: 'MST (美山)', city: '丹佛', code: 'UTC-7', offsetMinutes: -420 },
    { name: 'CST (美中)', city: '芝加哥/墨西哥城', code: 'UTC-6', offsetMinutes: -360 },
    { name: 'EST (美东)', city: '纽约/多伦多', code: 'UTC-5', offsetMinutes: -300 },
    { name: 'BRT', city: '圣保罗', code: 'UTC-3', offsetMinutes: -180 },
    { name: 'GMT/BST', city: '伦敦/都柏林', code: 'UTC+0/+1', offsetMinutes: 60 },
    { name: 'CET', city: '巴黎/柏林', code: 'UTC+1/+2', offsetMinutes: 120 },
    { name: 'EET', city: '雅典/赫尔辛基', code: 'UTC+2/+3', offsetMinutes: 180 },
    { name: 'MSK (莫斯科)', city: '莫斯科', code: 'UTC+3', offsetMinutes: 180 },
    { name: 'GST (海湾)', city: '迪拜/阿布扎比', code: 'UTC+4', offsetMinutes: 240 },
    { name: 'IST (印度)', city: '新德里', code: 'UTC+5:30', offsetMinutes: 330 },
    { name: 'CST (中国)', city: '北京/上海', code: 'UTC+8', offsetMinutes: 480 },
    { name: 'JST (日本)', city: '东京', code: 'UTC+9', offsetMinutes: 540 },
    { name: 'KST (韩国)', city: '首尔', code: 'UTC+9', offsetMinutes: 540 },
    { name: 'AWST (澳洲西)', city: '珀斯', code: 'UTC+8', offsetMinutes: 480 },
    { name: 'AEST (澳洲东)', city: '悉尼/墨尔本', code: 'UTC+10', offsetMinutes: 600 },
    { name: 'NZST (新西兰)', city: '奥克兰', code: 'UTC+12', offsetMinutes: 720 },
  ] as TimeZoneEntry[],

  getCurrentTime(zone: TimeZoneEntry): string {
    return currentTimeForOffset(zone.offsetMinutes);
  },

  diffFromCST(zone: TimeZoneEntry): string {
    const diff = zone.offsetMinutes - 480;
    if (diff === 0) return '相同';
    const h = Math.floor(diff / 60);
    const m = Math.abs(diff) % 60;
    const sign = diff > 0 ? '+' : '';
    if (m === 0) return `${sign}${h}h`;
    return `${sign}${h}h${m}min`;
  },

  search(query: string): TimeZoneEntry[] {
    if (!query) return this.zones;
    const q = query.toLowerCase();
    return this.zones.filter(z =>
      z.name.toLowerCase().includes(q) ||
      z.city.toLowerCase().includes(q) ||
      z.code.toLowerCase().includes(q)
    );
  },
};
