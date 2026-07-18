/**
 * Cron 表达式解析器
 * 移植自 flutter_shared/tools/cron_tool.dart
 */

export interface CronResult {
  description: string;
  error?: string;
  preview?: string[];
}

const daysOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
const monthNames = ['', '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

function matchesField(value: number, field: string): boolean {
  if (field === '*') return true;
  if (field.startsWith('*/')) {
    const step = parseInt(field.substring(2));
    return step > 0 && value % step === 0;
  }
  if (field.includes('-')) {
    const [low, high] = field.split('-').map(Number);
    return value >= low && value <= high;
  }
  if (field.includes(',')) {
    return field.split(',').some(f => matchesField(value, f.trim()));
  }
  try {
    return value === parseInt(field);
  } catch {
    return false;
  }
}

function formatTime(dt: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${dt.getFullYear()}-${pad(dt.getMonth() + 1)}-${pad(dt.getDate())} ${pad(dt.getHours())}:${pad(dt.getMinutes())}:${pad(dt.getSeconds())}`;
}

function describe(fields: string[]): string {
  const [min, hour, dom, month, dow] = fields;

  if (min === '*' && hour === '*' && dom === '*' && month === '*' && dow === '*') {
    return '每分钟执行';
  }

  const parts: string[] = [];

  if (min !== '*') {
    if (min.startsWith('*/')) parts.push(`每 ${min.substring(2)} 分钟`);
    else if (min === '0') { /* handled later */ }
    else if (min.includes(',')) parts.push(`第 ${min} 分钟`);
    else parts.push(`第 ${min} 分钟`);
  }

  if (hour !== '*') {
    if (hour.startsWith('*/')) parts.push(`每 ${hour.substring(2)} 小时`);
    else if (hour.includes(',')) parts.push(`${hour} 点`);
    else parts.push(`${hour} 点`);
  } else if (min !== '*') {
    parts.push('每小时');
  }

  if (dom !== '*') {
    if (dom === 'L') parts.push('每月最后一天');
    else parts.push(`第 ${dom} 天`);
  }

  if (month !== '*') {
    if (month.includes(',')) {
      parts.push(month.split(',').map(m => monthNames[parseInt(m)]).join('、'));
    } else {
      parts.push(monthNames[parseInt(month)]);
    }
  }

  if (dow !== '*') {
    if (dow.includes(',')) {
      parts.push(dow.split(',').map(d => daysOfWeek[parseInt(d)]).join('、'));
    } else {
      parts.push(daysOfWeek[parseInt(dow)]);
    }
  }

  if (parts.length === 0) return '每分钟执行';

  // 自然语言
  if (min === '0' && hour !== '*' && dom === '*' && month === '*' && dow === '*') {
    return `每天 ${hour} 点整`;
  }
  if (min === '0' && hour !== '*' && dom === '*' && month === '*' && dow !== '*') {
    return `每${daysOfWeek[parseInt(dow)]} ${hour} 点整`;
  }
  if (min === '0' && hour !== '*' && dom !== '*' && month === '*' && dow === '*') {
    return `每月 ${dom} 号 ${hour} 点整`;
  }
  if (min === '0' && hour !== '*' && dom !== '*' && month !== '*' && dow === '*') {
    return `每年 ${month} 月 ${dom} 号 ${hour} 点整`;
  }

  return parts.join(' ');
}

export const CronTool = {
  parse(expression: string): CronResult {
    expression = expression.trim();
    if (!expression) return { description: '', error: '请输入 Cron 表达式' };

    const shortcuts: Record<string, string> = {
      '@yearly': '0 0 1 1 *',
      '@annually': '0 0 1 1 *',
      '@monthly': '0 0 1 * *',
      '@weekly': '0 0 * * 0',
      '@daily': '0 0 * * *',
      '@hourly': '0 * * * *',
    };

    if (shortcuts[expression]) {
      return this.parse(shortcuts[expression]);
    }

    const parts = expression.split(/\s+/);
    if (parts.length < 5 || parts.length > 6) {
      return {
        description: '',
        error: 'Cron 表达式必须为 5 字段（标准）或 6 字段（含秒）格式',
      };
    }

    try {
      const fields = parts.length === 6 ? parts.slice(1) : parts;
      const secondsField = parts.length === 6 ? parts[0] : '0';

      const desc = describe(fields);
      const preview = this._previewTimes(fields, secondsField);
      return { description: desc, preview };
    } catch (e: any) {
      return { description: '', error: `解析错误: ${e.message}` };
    }
  },

  _previewTimes(fields: string[], _secondsField: string): string[] {
    const times: string[] = [];
    const now = new Date();
    let count = 0;
    const maxIterations = 525600;

    for (let i = 1; i <= maxIterations && count < 5; i++) {
      const testTime = new Date(now.getTime() + i * 60000);
      if (this._matches(testTime, fields)) {
        times.push(formatTime(testTime));
        count++;
      }
    }

    return times;
  },

  _matches(dt: Date, fields: string[]): boolean {
    return (
      matchesField(dt.getMinutes(), fields[0]) &&
      matchesField(dt.getHours(), fields[1]) &&
      matchesField(dt.getDate(), fields[2]) &&
      matchesField(dt.getMonth() + 1, fields[3]) &&
      matchesField(dt.getDay(), fields[4])
    );
  },

  presets: [
    { label: '每分钟', expression: '* * * * *' },
    { label: '每5分钟', expression: '*/5 * * * *' },
    { label: '每15分钟', expression: '*/15 * * * *' },
    { label: '每30分钟', expression: '*/30 * * * *' },
    { label: '每小时', expression: '0 * * * *' },
    { label: '每天 0 点', expression: '0 0 * * *' },
    { label: '每天 9 点', expression: '0 9 * * *' },
    { label: '每周一早 9 点', expression: '0 9 * * 1' },
    { label: '每月 1 号 0 点', expression: '0 0 1 * *' },
    { label: '每年 1 月 1 号 0 点', expression: '0 0 1 1 *' },
    { label: '工作日 9 点', expression: '0 9 * * 1-5' },
  ],
};
