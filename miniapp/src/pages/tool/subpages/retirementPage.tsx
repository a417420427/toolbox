import React, { useState, useMemo } from 'react';
import { View, Text, Input, Picker, Button } from '@tarojs/components';
import toolStyles from '@/styles/tool-common.module.scss';

interface RetirementInfo {
  /** 退休日期 */
  retirementDate: Date;
  /** 出生日期 */
  birthDate: Date;
  /** 退休年龄（岁） */
  retirementAge: number;
  /** 退休年份 */
  retirementYear: number;
}

function calcRetirement(birthStr: string, age: number): RetirementInfo | null {
  const birth = new Date(birthStr);
  if (isNaN(birth.getTime()) || age < 18 || age > 80) return null;

  const retireDate = new Date(birth);
  retireDate.setFullYear(retireDate.getFullYear() + age);
  // 退休当月1号 00:00
  retireDate.setDate(1);
  retireDate.setHours(0, 0, 0, 0);

  return {
    retirementDate: retireDate,
    birthDate: birth,
    retirementAge: age,
    retirementYear: retireDate.getFullYear(),
  };
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 生成出生年份 Picker 选项
function yearRange(): number[] {
  const y = new Date().getFullYear();
  const years: number[] = [];
  for (let i = y - 80; i <= y - 18; i++) years.push(i);
  return years;
}

const months = Array.from({ length: 12 }, (_, i) => i + 1);
const days = Array.from({ length: 31 }, (_, i) => i + 1);
const ages = Array.from({ length: 48 }, (_, i) => i + 33); // 33 ~ 80

const RetirementPage: React.FC = () => {
  const years = useMemo(() => yearRange(), []);

  const [birthYearIdx, setBirthYearIdx] = useState(years.length - 50); // default ~1990
  const [birthMonthIdx, setBirthMonthIdx] = useState(0);
  const [birthDayIdx, setBirthDayIdx] = useState(0);
  const [ageIdx, setAgeIdx] = useState(ages.indexOf(60)); // default 60岁

  const birthYear = years[birthYearIdx];
  const birthMonth = months[birthMonthIdx];
  const birthDay = days[birthDayIdx];
  const retireAge = ages[ageIdx];

  const birthStr = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

  const result = useMemo(() => {
    const r = calcRetirement(birthStr, retireAge);
    if (!r) return null;

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const diff = r.retirementDate.getTime() - now.getTime();
    const totalDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    const yearsLeft = Math.floor(totalDays / 365);
    const monthsLeft = Math.floor((totalDays % 365) / 30);
    const daysLeft = totalDays % 30;

    // 工作总天数（从法定工作年龄 22 到退休）
    let workDays = 0;
    const workStart = new Date(r.birthDate);
    workStart.setFullYear(workStart.getFullYear() + 22);
    const totalWorkMs = r.retirementDate.getTime() - workStart.getTime();
    if (totalWorkMs > 0) {
      workDays = Math.ceil(totalWorkMs / (1000 * 60 * 60 * 24));
    }

    return {
      totalDays,
      yearsLeft,
      monthsLeft,
      daysLeft,
      isAlreadyRetired: totalDays <= 0,
      retirementDate: r.retirementDate,
      retiredYears: totalDays <= 0 ? Math.floor(Math.abs(totalDays) / 365) : 0,
      workDays,
    };
  }, [birthStr, retireAge]);

  return (
    <View>
      {/* 出生年月日选择 */}
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>出生日期</Text>
        <View className={toolStyles.row}>
          <Picker
            mode='selector'
            range={years.map(String)}
            value={birthYearIdx}
            onChange={e => setBirthYearIdx(Number(e.detail.value))}
          >
            <View className={toolStyles.select}>{birthYear}年</View>
          </Picker>
          <Picker
            mode='selector'
            range={months.map(String)}
            value={birthMonthIdx}
            onChange={e => setBirthMonthIdx(Number(e.detail.value))}
          >
            <View className={toolStyles.select}>{birthMonth}月</View>
          </Picker>
          <Picker
            mode='selector'
            range={days.map(String)}
            value={birthDayIdx}
            onChange={e => setBirthDayIdx(Number(e.detail.value))}
          >
            <View className={toolStyles.select}>{birthDay}日</View>
          </Picker>
        </View>
      </View>

      {/* 退休年龄选择 */}
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>退休年龄</Text>
        <View className={toolStyles.row}>
          <Picker
            mode='selector'
            range={ages.map(a => `${a}岁`)}
            value={ageIdx}
            onChange={e => setAgeIdx(Number(e.detail.value))}
          >
            <View className={toolStyles.select}>{retireAge}岁</View>
          </Picker>
        </View>
      </View>

      {/* 计算结果 */}
      {result && (
        <View className={toolStyles.section}>
          {result.isAlreadyRetired ? (
            <>
              <Text className={toolStyles.sectionTitle}>🎉 已退休</Text>
              <View className={toolStyles.statGrid}>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>退休日期</Text>
                  <Text className={toolStyles.statValue} style={{ fontSize: '24rpx', color: '#6b7280' }}>
                    {formatDate(result.retirementDate)}
                  </Text>
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
              <View style={{ textAlign: 'center', padding: '24rpx 0' }}>
                <Text style={{ fontSize: '72rpx', fontWeight: 700, color: '#3b82f6' }}>
                  {result.totalDays}
                </Text>
                <Text style={{ fontSize: '28rpx', color: '#6b7280', display: 'block' }}>天</Text>
              </View>
              <View className={toolStyles.statGrid}>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>约</Text>
                  <Text className={toolStyles.statValue}>{result.yearsLeft} 年</Text>
                </View>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>余</Text>
                  <Text className={toolStyles.statValue}>{result.monthsLeft} 月</Text>
                </View>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>零</Text>
                  <Text className={toolStyles.statValue}>{result.daysLeft} 天</Text>
                </View>
                <View className={toolStyles.statItem}>
                  <Text className={toolStyles.statLabel}>退休年份</Text>
                  <Text className={toolStyles.statValue}>{result.retirementDate.getFullYear()}</Text>
                </View>
              </View>
              <View style={{ background: '#f0fdf4', borderRadius: '12rpx', padding: '16rpx', marginTop: '8rpx' }}>
                <Text style={{ fontSize: '22rpx', color: '#16a34a', textAlign: 'center', display: 'block' }}>
                  离退休还有 {result.totalDays} 天（约 {result.yearsLeft} 年）
                </Text>
                {result.workDays > 0 && (
                  <Text style={{ fontSize: '22rpx', color: '#6b7280', textAlign: 'center', display: 'block', marginTop: '8rpx' }}>
                    从 22 岁到退休，共计工作约 {result.workDays} 天
                  </Text>
                )}
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
};

export default RetirementPage;
