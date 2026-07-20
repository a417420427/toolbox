import React, { useMemo } from 'react';
import { View, Text, Picker } from '@tarojs/components';
import styles from './index.module.scss';

export interface CalendarValue {
  year: number;
  month: number;
  day: number;
}

interface CalendarProps {
  value: CalendarValue;
  onChange: (value: CalendarValue) => void;
  /** 标题，可选 */
  title?: string;
  /** 最小可选年份（默认 1920） */
  minYear?: number;
  /** 最大可选年份（默认当前年 + 50） */
  maxYear?: number;
  /** 日期格子上额外的渲染内容，例如节假日标记 */
  renderDayExtra?: (day: number) => React.ReactNode;
  /** 视图年月变化时的回调（翻页时触发） */
  onViewChange?: (year: number, month: number) => void;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  title,
  minYear = 1920,
  maxYear,
  renderDayExtra,
  onViewChange,
}) => {
  const effectiveMaxYear = useMemo(() => maxYear ?? new Date().getFullYear() + 50, [maxYear]);
  const [viewYear, setViewYear] = React.useState(value.year);
  const [viewMonth, setViewMonth] = React.useState(value.month);

  React.useEffect(() => {
    setViewYear(value.year);
    setViewMonth(value.month);
  }, [value.year, value.month]);

  const days = useMemo(() => daysInMonth(viewYear, viewMonth), [viewYear, viewMonth]);
  const firstDay = useMemo(() => firstDayOfMonth(viewYear, viewMonth), [viewYear, viewMonth]);

  const grid = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= days; d++) cells.push(d);
    while (cells.length < 42) cells.push(null);
    return cells;
  }, [firstDay, days]);

  const isToday = (d: number) => {
    const now = new Date();
    return now.getFullYear() === viewYear && now.getMonth() + 1 === viewMonth && now.getDate() === d;
  };

  const isSelected = (d: number) =>
    value.day === d && value.month === viewMonth && value.year === viewYear;

  const notifyView = (y: number, m: number) => {
    onViewChange?.(y, m);
  };

  const goPrevMonth = () => {
    if (viewMonth === 1) {
      if (viewYear <= minYear) return;
      const y = viewYear - 1;
      setViewYear(y);
      setViewMonth(12);
      notifyView(y, 12);
    } else {
      const m = viewMonth - 1;
      setViewMonth(m);
      notifyView(viewYear, m);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 12) {
      if (viewYear >= effectiveMaxYear) return;
      const y = viewYear + 1;
      setViewYear(y);
      setViewMonth(1);
      notifyView(y, 1);
    } else {
      const m = viewMonth + 1;
      setViewMonth(m);
      notifyView(viewYear, m);
    }
  };

  const goPrevYear = () => {
    if (viewYear <= minYear) return;
    const y = viewYear - 1;
    setViewYear(y);
    notifyView(y, viewMonth);
  };

  const goNextYear = () => {
    if (viewYear >= effectiveMaxYear) return;
    const y = viewYear + 1;
    setViewYear(y);
    notifyView(y, viewMonth);
  };

  const goToday = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth() + 1;
    setViewYear(y);
    setViewMonth(m);
    onChange({ year: y, month: m, day: now.getDate() });
    notifyView(y, m);
  };

  return (
    <View className={styles.wrap}>
      {title && <Text className={styles.title}>{title}</Text>}

      {/* 导航：年- ‹ 年 Picker 月 Picker › 年+ */}
      <View className={styles.nav}>
        <View className={styles.navLeft}>
          <Text className={styles.navIcon} onClick={goPrevYear}>«</Text>
          <Text className={styles.navIcon} onClick={goPrevMonth}>‹</Text>
        </View>
        <Picker
          mode='selector'
          range={Array.from({ length: effectiveMaxYear - minYear + 1 }, (_, i) => `${minYear + i}年`)}
          value={viewYear - minYear}
          onChange={e => {
            const y = minYear + Number(e.detail.value);
            setViewYear(y);
            notifyView(y, viewMonth);
          }}
        >
          <Text className={styles.navTitle}>{viewYear}年</Text>
        </Picker>
        <Picker
          mode='selector'
          range={Array.from({ length: 12 }, (_, i) => `${i + 1}月`)}
          value={viewMonth - 1}
          onChange={e => {
            const m = Number(e.detail.value) + 1;
            setViewMonth(m);
            notifyView(viewYear, m);
          }}
        >
          <Text className={styles.navTitle}>{viewMonth}月</Text>
        </Picker>
        <View className={styles.navRight}>
          <Text className={styles.navIcon} onClick={goNextMonth}>›</Text>
          <Text className={styles.navIcon} onClick={goNextYear}>»</Text>
        </View>
      </View>

      {/* 星期标题 */}
      <View className={styles.weekRow}>
        {WEEKDAYS.map((w, i) => (
          <Text key={i} className={`${styles.weekCell} ${i === 0 || i === 6 ? styles.weekend : ''}`}>{w}</Text>
        ))}
      </View>

      {/* 日期网格 */}
      <View className={styles.grid}>
        {grid.map((d, i) => {
          if (d === null) return <View key={i} className={styles.cell} />;
          const col = i % 7;
          return (
            <View
              key={i}
              className={`${styles.cell} ${styles.dayCell} ${col === 0 || col === 6 ? styles.weekend : ''} ${isToday(d) ? styles.today : ''} ${isSelected(d) ? styles.selected : ''}`}
              onClick={() => onChange({ year: viewYear, month: viewMonth, day: d })}
            >
              <Text className={`${styles.dayText} ${isSelected(d) ? styles.selectedText : ''} ${isToday(d) && !isSelected(d) ? styles.todayText : ''}`}>{d}</Text>
              {renderDayExtra?.(d)}
            </View>
          );
        })}
      </View>

      {/* "今天" 快捷按钮 */}
      <View className={styles.todayRow}>
        <Text className={styles.todayBtn} onClick={goToday}>回到今天</Text>
      </View>
    </View>
  );
};

export default Calendar;
