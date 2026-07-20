import React, { useState, useMemo } from 'react';
import { View, Text, Picker, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { LunarCalendarTool, LunarDate, DayYiJi } from '@/utils/tools/lunarCalendarTool';
import toolStyles from '@/styles/tool-common.module.scss';

const LunarCalendarPage: React.FC = () => {
  const today = useMemo(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1, day: d.getDate() };
  }, []);

  const [year, setYear] = useState(today.year);
  const [month, setMonth] = useState(today.month);
  const [day, setDay] = useState(today.day);

  const lunarDate = useMemo(() =>
    LunarCalendarTool.solarToLunar(year, month, day),
    [year, month, day]
  );

  const yiJi = useMemo(() =>
    LunarCalendarTool.getDayYiJi(lunarDate),
    [lunarDate]
  );

  // 日期变更
  const setToday = () => {
    setYear(today.year);
    setMonth(today.month);
    setDay(today.day);
  };

  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);

  // 生成日期选项
  const yearRange = Array.from({ length: 121 }, (_, i) => ({ value: 1980 + i, label: `${1980 + i}年` }));
  const monthRange = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: `${i + 1}月` }));
  const dayRange = Array.from({ length: daysInMonth }, (_, i) => ({ value: i + 1, label: `${i + 1}日` }));

  const yearIdx = yearRange.findIndex(y => y.value === year);
  const monthIdx = monthRange.findIndex(m => m.value === month);
  const dayIdx = dayRange.findIndex(d => d.value === day);

  const birthdayTip = useMemo(() => {
    if (lunarDate.day === 1 && !lunarDate.isLeap) {
      return '🌙 今日是农历初一 · 新月';
    }
    if (lunarDate.day === 15 && !lunarDate.isLeap) {
      return '🌕 今日是农历十五 · 满月';
    }
    return '';
  }, [lunarDate]);

  return (
    <View>
      {/* 日期选择 */}
      <View className={toolStyles.section}>
        <View style={{ display: 'flex', gap: '16rpx', alignItems: 'center' }}>
          <Picker
            mode="selector"
            range={yearRange.map(y => y.label)}
            value={Math.max(0, yearIdx)}
            onChange={e => {
              const idx = parseInt(e.detail.value, 10);
              setYear(yearRange[Math.min(idx, yearRange.length - 1)]?.value || today.year);
            }}
          >
            <View className={toolStyles.select} style={{ flex: 1 }}>
              <Text>{year}年</Text>
            </View>
          </Picker>
          <Picker
            mode="selector"
            range={monthRange.map(m => m.label)}
            value={Math.max(0, monthIdx)}
            onChange={e => setMonth(monthRange[parseInt(e.detail.value, 10)]?.value || today.month)}
          >
            <View className={toolStyles.select} style={{ flex: 1 }}>
              <Text>{month}月</Text>
            </View>
          </Picker>
          <Picker
            mode="selector"
            range={dayRange.map(d => d.label)}
            value={Math.max(0, dayIdx)}
            onChange={e => setDay(dayRange[parseInt(e.detail.value, 10)]?.value || today.day)}
          >
            <View className={toolStyles.select} style={{ flex: 1 }}>
              <Text>{day}日</Text>
            </View>
          </Picker>
        </View>
        <View className={toolStyles.actionRow} style={{ marginTop: '12rpx' }}>
          <Button className={toolStyles.btnPrimary} onClick={setToday}>今天</Button>
        </View>
      </View>

      {/* 农历信息主卡片 */}
      <View className={toolStyles.section} style={{
        background: '#fff',
        borderRadius: '20rpx',
        padding: '28rpx',
        border: '1rpx solid #e5e7eb',
      }}>
        <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: '48rpx', fontWeight: 700, color: '#1a1a1a' }}>
            {year}年{month}月{day}日
          </Text>
          {lunarDate.solarTerm && (
            <View style={{
              background: 'rgba(245,158,11,0.15)',
              borderRadius: '12rpx',
              padding: '6rpx 16rpx',
            }}>
              <Text style={{ fontSize: '24rpx', color: '#d97706', fontWeight: 500 }}>
                {lunarDate.solarTerm}
              </Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: '36rpx', color: '#3b82f6', fontWeight: 600, marginTop: '12rpx' }}>
          {lunarDate.dayName} {lunarDate.monthName}
        </Text>
        <Text style={{ fontSize: '24rpx', color: '#6b7280', marginTop: '8rpx' }}>
          {lunarDate.yearName}
        </Text>
        <Text style={{ fontSize: '22rpx', color: '#9ca3af', marginTop: '4rpx' }}>
          {lunarDate.ganZhiYear}年 · {lunarDate.ganZhiMonth}月 · {lunarDate.ganZhiDay}日
        </Text>
        {birthdayTip && (
          <Text style={{ fontSize: '22rpx', color: '#8b5cf6', marginTop: '8rpx', display: 'block' }}>
            {birthdayTip}
          </Text>
        )}
      </View>

      {/* 宜忌 */}
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>今日黄历</Text>
        <View style={{ display: 'flex', gap: '16rpx' }}>
          <View style={{
            flex: 1,
            background: 'rgba(34,197,94,0.08)',
            borderRadius: '16rpx',
            padding: '20rpx',
          }}>
            <Text style={{ fontSize: '24rpx', color: '#16a34a', fontWeight: 600, marginBottom: '8rpx', display: 'block' }}>
              ✅ 宜
            </Text>
            <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8rpx' }}>
              {yiJi.yi.map((item) => (
                <Text key={item} style={{
                  fontSize: '22rpx',
                  color: '#166534',
                  background: 'rgba(34,197,94,0.12)',
                  borderRadius: '6rpx',
                  padding: '4rpx 12rpx',
                }}>{item}</Text>
              ))}
            </View>
          </View>
          <View style={{
            flex: 1,
            background: 'rgba(239,68,68,0.06)',
            borderRadius: '16rpx',
            padding: '20rpx',
          }}>
            <Text style={{ fontSize: '24rpx', color: '#dc2626', fontWeight: 600, marginBottom: '8rpx', display: 'block' }}>
              ❌ 忌
            </Text>
            <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8rpx' }}>
              {yiJi.ji.map((item) => (
                <Text key={item} style={{
                  fontSize: '22rpx',
                  color: '#991b1b',
                  background: 'rgba(239,68,68,0.1)',
                  borderRadius: '6rpx',
                  padding: '4rpx 12rpx',
                }}>{item}</Text>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default LunarCalendarPage;
