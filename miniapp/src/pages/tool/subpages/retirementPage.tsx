import React, { useState, useMemo } from 'react';
import { View, Text, Picker, Input } from '@tarojs/components';
import CalendarPicker, { type CalendarValue } from '@/components/CalendarPicker';
import toolStyles from '@/styles/tool-common.module.scss';

interface CalcResult {
  totalDays: number;
  yearsLeft: number;
  monthsLeft: number;
  daysLeft: number;
  isRetired: boolean;
  retireDate: Date;
  retiredYears: number;
  totalWorkDays: number;
  workedDays: number;
  remainingWorkDays: number;
  workProgress: number;
}

function calcDayDiff(a: Date, b: Date): number {
  return Math.ceil((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function compute(birth: CalendarValue, retireAge: number, workAge: number): CalcResult | null {
  const birthDate = new Date(birth.year, birth.month - 1, birth.day);
  if (isNaN(birthDate.getTime()) || retireAge < 33 || retireAge > 80) return null;
  if (workAge < 16 || workAge > 65) return null;

  const retireDate = new Date(birthDate);
  retireDate.setFullYear(retireDate.getFullYear() + retireAge, 0, 1);
  retireDate.setHours(0, 0, 0, 0);

  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = retireDate.getTime() - now.getTime();
  const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
  const isRetired = totalDays <= 0;

  let yearsLeft = 0, monthsLeft = 0, daysLeft = 0, retiredYears = 0;

  if (isRetired) {
    retiredYears = Math.floor(Math.abs(totalDays) / 365);
  } else {
    yearsLeft = Math.floor(totalDays / 365);
    monthsLeft = Math.floor((totalDays % 365) / 30);
    daysLeft = totalDays % 30;
  }

  const workStart = new Date(birthDate);
  workStart.setFullYear(workStart.getFullYear() + workAge);
  const totalWorkDays = calcDayDiff(workStart, retireDate);
  const workedDays = now > workStart ? calcDayDiff(workStart, now > retireDate ? retireDate : now) : 0;
  const remainingWorkDays = Math.max(0, totalWorkDays - workedDays);
  const workProgress = totalWorkDays > 0 ? workedDays / totalWorkDays : 0;

  return {
    totalDays: isRetired ? Math.abs(totalDays) : totalDays,
    yearsLeft, monthsLeft, daysLeft, isRetired, retireDate, retiredYears,
    totalWorkDays, workedDays, remainingWorkDays, workProgress,
  };
}

const ages = Array.from({ length: 48 }, (_, i) => i + 33);
const workAges = Array.from({ length: 40 }, (_, i) => i + 18);

const RetirementPage: React.FC = () => {
  const [birth, setBirth] = useState<CalendarValue>({ year: 1990, month: 1, day: 1 });
  const [ageIdx, setAgeIdx] = useState(ages.indexOf(60));
  const [workAgeIdx, setWorkAgeIdx] = useState(workAges.indexOf(22));
  const retireAge = ages[ageIdx];
  const workAge = workAges[workAgeIdx];
  const result = useMemo(() => compute(birth, retireAge, workAge), [birth, retireAge, workAge]);

  return (
    <View>
      {/* 出生日期：弹出式日历选择 */}
      <CalendarPicker
        title='出生日期'
        value={birth}
        onChange={setBirth}
      />

      {/* 行：退休年龄 + 工作年龄 */}
      <View className={toolStyles.row}>
        <View className={toolStyles.inputGroup} style={{ flex: 1, marginRight: '16rpx' }}>
          <Text className={toolStyles.label}>退休</Text>
          <Picker
            mode='selector'
            range={ages.map(a => `${a}岁`)}
            value={ageIdx}
            onChange={e => setAgeIdx(Number(e.detail.value))}
          >
            <View className={toolStyles.input}>{retireAge}岁</View>
          </Picker>
        </View>
        <View className={toolStyles.inputGroup} style={{ flex: 1 }}>
          <Text className={toolStyles.label}>工作</Text>
          <Picker
            mode='selector'
            range={workAges.map(a => `${a}岁`)}
            value={workAgeIdx}
            onChange={e => setWorkAgeIdx(Number(e.detail.value))}
          >
            <View className={toolStyles.input}>{workAge}岁</View>
          </Picker>
        </View>
      </View>

      {/* 计算结果 */}
      {result && (
        <View className={toolStyles.section}>
          {result.isRetired ? (
            <>
              <Text className={toolStyles.sectionTitle}>🎉 已退休</Text>
              <View className={toolStyles.statGrid}>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>退休年份</Text>
                  <Text className={toolStyles.statValue} style={{ fontSize: '28rpx' }}>{result.retireDate.getFullYear()}</Text>
                </View>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>已退休</Text>
                  <Text className={toolStyles.statValue}>{result.retiredYears} 年</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text className={toolStyles.sectionTitle}>⏳ 退休倒计时</Text>
              <View className={toolStyles.calcDisplay} style={{ justifyContent: 'center', flexDirection: 'column', gap: '4rpx' }}>
                <Text className={toolStyles.calcDisplayText} style={{ fontSize: '72rpx', color: '#3b82f6', textAlign: 'center' }}>
                  {result.totalDays}
                </Text>
                <Text style={{ fontSize: '24rpx', color: '#64748b', textAlign: 'center', display: 'block' }}>天</Text>
              </View>
              <View className={toolStyles.statGrid}>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>约</Text>
                  <Text className={toolStyles.statValue}>{result.yearsLeft}</Text>
                  <Text className={toolStyles.statLabel}>年</Text>
                </View>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>余</Text>
                  <Text className={toolStyles.statValue}>{result.monthsLeft}</Text>
                  <Text className={toolStyles.statLabel}>月</Text>
                </View>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>零</Text>
                  <Text className={toolStyles.statValue}>{result.daysLeft}</Text>
                  <Text className={toolStyles.statLabel}>天</Text>
                </View>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>退休年份</Text>
                  <Text className={toolStyles.statValue} style={{ fontSize: '28rpx' }}>{result.retireDate.getFullYear()}</Text>
                </View>
              </View>

              {/* 工作时间统计 */}
              <View className={toolStyles.section}>
                <Text className={toolStyles.sectionTitle}>💼 工作时间统计</Text>
                <View className={toolStyles.statGrid}>
                  <View className={toolStyles.statItem}>
                    <Text className={toolStyles.statLabel}>已工作</Text>
                    <Text className={toolStyles.statValue}>{result.workedDays}</Text>
                    <Text className={toolStyles.statLabel}>天</Text>
                  </View>
                  <View className={toolStyles.statItem}>
                    <Text className={toolStyles.statLabel}>剩余</Text>
                    <Text className={toolStyles.statValue}>{result.remainingWorkDays}</Text>
                    <Text className={toolStyles.statLabel}>天</Text>
                  </View>
                </View>
                <View className={toolStyles.resultBox} style={{ marginTop: '8rpx', background: '#f8fafc' }}>
                  <Text style={{ fontSize: '22rpx', color: '#64748b', textAlign: 'center', display: 'block', marginBottom: '12rpx' }}>
                    已完成 {Math.round(result.workProgress * 100)}% 的工作生涯
                  </Text>
                  <View style={{ height: '12rpx', background: '#e2e8f0', borderRadius: '6rpx', overflow: 'hidden' }}>
                    <View style={{ width: `${Math.min(100, result.workProgress * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)', borderRadius: '6rpx' }} />
                  </View>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default RetirementPage;
