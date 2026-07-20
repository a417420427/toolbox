import React, { useMemo } from 'react';
import { View, Text } from '@tarojs/components';
import Calendar, { type CalendarValue } from '@/components/Calendar';
import { HolidayTool } from '@/utils/tools/holidayTool';
import styles from './index.module.scss';

interface HolidayCalendarProps {
  value?: CalendarValue;
  onChange?: (value: CalendarValue) => void;
  title?: string;
}

const ZHOU = ['日', '一', '二', '三', '四', '五', '六'];

/** 日期格上的节日标签 */
const HolidayBadge: React.FC<{ name: string }> = ({ name }) => {
  const shortName = name.length <= 2 ? name : name.slice(0, 2);
  return <Text className={styles.badge}>{shortName}</Text>;
};

const HolidayCalendar: React.FC<HolidayCalendarProps> = ({
  value: initialValue,
  onChange,
  title,
}) => {
  const today = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }, []);

  const value = initialValue ?? today;
  const effectiveOnChange = onChange ?? (() => {});

  // 当前视图的月份节假日索引（跟 Calendar 内部视图同步）
  const [viewYear, setViewYear] = React.useState(value.year);
  const [viewMonth, setViewMonth] = React.useState(value.month);

  React.useEffect(() => {
    setViewYear(value.year);
    setViewMonth(value.month);
  }, [value.year, value.month]);

  // 通过 onViewChange 同步 Calendar 内部翻页
  const handleViewChange = (y: number, m: number) => {
    setViewYear(y);
    setViewMonth(m);
  };

  const handleChange = (v: CalendarValue) => {
    effectiveOnChange(v);
  };

  // 当前月份节假日 map: day -> name[]
  const holidayMap = useMemo(() => {
    const map = new Map<number, string[]>();
    const holidays = HolidayTool.getHolidays(viewYear);
    for (const h of holidays) {
      if (h.date.getMonth() + 1 === viewMonth) {
        const arr = map.get(h.date.getDate()) ?? [];
        arr.push(h.name);
        map.set(h.date.getDate(), arr);
      }
    }
    return map;
  }, [viewYear, viewMonth]);

  const renderDayExtra = (day: number) => {
    const names = holidayMap.get(day);
    if (!names || names.length === 0) return null;
    return <HolidayBadge name={names[0]} />;
  };

  // 本月节假日列表（用于下方展示）
  const monthHolidays = useMemo(
    () => HolidayTool.getHolidays(viewYear).filter(h => h.date.getMonth() + 1 === viewMonth),
    [viewYear, viewMonth]
  );

  return (
    <View>
      <Calendar
        title={title ?? '节假日日历'}
        value={value}
        onChange={handleChange}
        renderDayExtra={renderDayExtra}
        onViewChange={handleViewChange}
      />

      {/* 当月节假日列表 */}
      {monthHolidays.length > 0 && (
        <View className={styles.holidayList}>
          {monthHolidays.map((h, i) => {
            const dow = ZHOU[h.date.getDay()];
            return (
              <View key={i} className={styles.holidayItem}>
                <View className={styles.holidayDot} />
                <Text className={styles.holidayName}>{h.name}</Text>
                <Text className={styles.holidayDate}>
                  {h.date.getMonth() + 1}月{h.date.getDate()}日 周{dow}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

export default HolidayCalendar;
