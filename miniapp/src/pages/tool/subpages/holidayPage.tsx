import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import HolidayCalendar from '@/components/HolidayCalendar';
import { HolidayTool } from '@/utils/tools/holidayTool';
import type { CalendarValue } from '@/components/Calendar';
import styles from './holiday.module.scss';

const MONTH_NAMES = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

const HolidayPage: React.FC = () => {
  const now = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }, []);

  const [viewDate, setViewDate] = useState<CalendarValue>(now);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // 最近的假日
  const nearest = useMemo(() => {
    const n = HolidayTool.nearestHoliday(viewDate.year);
    if (!n) return null;
    const diff = Math.floor((n.date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return { ...n, daysUntil: diff };
  }, [viewDate.year]);

  // 全年节假日按月分组
  const grouped = useMemo(() => {
    const holidays = HolidayTool.getHolidays(viewDate.year);
    const map = new Map<number, { name: string; day: number; dow: string }[]>();
    const ZHOU = ['日', '一', '二', '三', '四', '五', '六'];
    for (const h of holidays) {
      const m = h.date.getMonth() + 1;
      if (!map.has(m)) map.set(m, []);
      map.get(m)!.push({ name: h.name, day: h.date.getDate(), dow: ZHOU[h.date.getDay()] });
    }
    return Array.from(map.entries()).sort(([a], [b]) => a - b);
  }, [viewDate.year]);

  const jumpToMonth = (month: number) => {
    setSelectedMonth(month);
    setViewDate({ ...viewDate, month });
  };

  return (
    <ScrollView scrollY>
      <HolidayCalendar
        title='节假日日历'
        value={viewDate}
        onChange={setViewDate}
      />

      {/* 最近假日卡片 */}
      {nearest && (
        <View className={styles.nearestCard}>
          <View className={styles.nearestIcon}>🔜</View>
          <View style={{ flex: 1 }}>
            <Text className={styles.nearestName}>{nearest.name}</Text>
            <Text className={styles.nearestDate}>
              {nearest.date.getFullYear()}年{nearest.date.getMonth() + 1}月{nearest.date.getDate()}日
            </Text>
          </View>
          <View className={styles.nearestCountdown}>
            <Text className={styles.nearestDays}>{nearest.daysUntil}</Text>
            <Text className={styles.nearestLabel}>天</Text>
          </View>
        </View>
      )}

      {/* 全年节假日列表 */}
      <View className={styles.yearSection}>
        <Text className={styles.yearTitle}>{viewDate.year}年全部节假日</Text>
        {grouped.length === 0 && (
          <Text style={{ fontSize: '22rpx', color: '#94a3b8', padding: '16rpx 0' }}>暂无数据</Text>
        )}
        {grouped.map(([month, items]) => (
          <View
            key={month}
            className={`${styles.monthCard} ${selectedMonth === month ? styles.monthCardActive : ''}`}
            onClick={() => jumpToMonth(month)}
          >
            <View className={styles.monthHeader}>
              <Text className={styles.monthName}>{MONTH_NAMES[month - 1]}</Text>
              <Text className={styles.monthCount}>{items.length} 个节日</Text>
            </View>
            <View className={styles.monthItems}>
              {items.map((item, i) => (
                <View key={i} className={styles.holidayRow}>
                  <View className={styles.holidayTag}>{item.name}</View>
                  <Text className={styles.holidayDay}>{month}月{item.day}日 周{item.dow}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HolidayPage;
