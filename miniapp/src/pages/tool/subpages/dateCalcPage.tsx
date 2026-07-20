import React, { useState } from 'react';
import { View, Text, Input, Button, Picker } from '@tarojs/components';
import CalendarPicker from '@/components/CalendarPicker';
import type { CalendarValue } from '@/components/CalendarPicker';
import { DateCalcTool, isLeapYear } from '@/utils/tools/dateCalcTool';
import toolStyles from '@/styles/tool-common.module.scss';

const tabs = ['日期差', '加减天数', '周数计算', '年龄计算', '闰年判断'];

const DateCalcPage: React.FC = () => {
  const [tab, setTab] = useState(0);
  // 日期差
  const [startDate, setStartDate] = useState<CalendarValue>({ year: 2020, month: 1, day: 1 });
  const [endDate, setEndDate] = useState<CalendarValue>({ year: 2026, month: 7, day: 18 });
  // 加减天数
  const [baseDate, setBaseDate] = useState<CalendarValue>({ year: 2026, month: 7, day: 18 });
  const [days, setDays] = useState('100');
  // 周数
  const [weekDate, setWeekDate] = useState<CalendarValue>({ year: 2026, month: 7, day: 18 });
  const [weeks, setWeeks] = useState('10');
  // 年龄
  const [birthDate, setBirthDate] = useState<CalendarValue>({ year: 1990, month: 1, day: 1 });
  // 闰年
  const [leapYearStr, setLeapYearStr] = useState('2026');
  // 输出
  const [output, setOutput] = useState('');

  const toDate = (v: CalendarValue) => new Date(v.year, v.month - 1, v.day);
  const fmt = (v: CalendarValue) =>
    `${v.year}-${String(v.month).padStart(2, '0')}-${String(v.day).padStart(2, '0')}`;

  const processDiff = () => {
    const s = toDate(startDate);
    const e = toDate(endDate);
    const r = DateCalcTool.dateDiff(s, e);
    const wd = DateCalcTool.weekdaysBetween(s, e);
    setOutput(
      `开始: ${fmt(startDate)}\n结束: ${fmt(endDate)}\n\n相差天数: ${r.totalDays}\n相差小时: ${r.hours}\n相差分钟: ${r.minutes}\n工作日: ${wd}`
    );
  };

  const processAdd = () => {
    const d = toDate(baseDate);
    const n = parseInt(days, 10);
    if (isNaN(n)) { setOutput('请输入有效天数'); return; }
    const r = DateCalcTool.addDays(d, n);
    setOutput(`${fmt(baseDate)} 之后 ${n} 天:\n${formatDate(r)}`);
  };

  const processWeeks = () => {
    const d = toDate(weekDate);
    const n = parseInt(weeks, 10);
    if (isNaN(n)) { setOutput('请输入有效周数'); return; }
    const r = DateCalcTool.addWeeks(d, n);
    setOutput(`${fmt(weekDate)} 之后 ${n} 周:\n${formatDate(r)}`);
  };

  const processAge = () => {
    const b = toDate(birthDate);
    if (isNaN(b.getTime())) { setOutput('请输入有效日期'); return; }
    const r = DateCalcTool.age(b);
    setOutput(`出生: ${fmt(birthDate)}\n年龄: ${r.years} 岁 ${r.months} 月 ${r.days} 天`);
  };

  const processLeap = () => {
    const y = parseInt(leapYearStr, 10);
    if (isNaN(y)) { setOutput('请输入有效年份'); return; }
    setOutput(`${y} 年${isLeapYear(y) ? '是' : '不是'}闰年\n2月有 ${DateCalcTool.daysInMonth(y, 2)} 天`);
  };

  const formatDate = (d: Date) =>
    `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')}`;

  const actions = [processDiff, processAdd, processWeeks, processAge, processLeap];

  return (
    <View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          {tabs.map((t, i) => (
            <Text key={i} className={`${toolStyles.segment} ${tab === i ? toolStyles.segmentActive : ''}`} onClick={() => setTab(i)}>{t}</Text>
          ))}
        </View>
      </View>
      {tab === 0 && (
        <View>
          <CalendarPicker title='开始日期' value={startDate} onChange={setStartDate} />
          <CalendarPicker title='结束日期' value={endDate} onChange={setEndDate} />
        </View>
      )}
      {tab === 1 && (
        <View>
          <CalendarPicker title='基准日期' value={baseDate} onChange={setBaseDate} />
          <View className={toolStyles.inputGroup}><Text className={toolStyles.label}>天数</Text><Input className={toolStyles.input} type="text" value={days} onInput={e => setDays(e.detail.value)} placeholder="天数" /></View>
        </View>
      )}
      {tab === 2 && (
        <View>
          <CalendarPicker title='基准日期' value={weekDate} onChange={setWeekDate} />
          <View className={toolStyles.inputGroup}><Text className={toolStyles.label}>周数</Text><Input className={toolStyles.input} type="text" value={weeks} onInput={e => setWeeks(e.detail.value)} placeholder="周数" /></View>
        </View>
      )}
      {tab === 3 && (
        <CalendarPicker title='出生日期' value={birthDate} onChange={setBirthDate} />
      )}
      {tab === 4 && (
        <View className={toolStyles.inputGroup}><Text className={toolStyles.label}>年份</Text><Input className={toolStyles.input} type="text" value={leapYearStr} onInput={e => setLeapYearStr(e.detail.value)} placeholder="YYYY" /></View>
      )}
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={actions[tab]}>计算</Button>
      </View>
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>结果</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
    </View>
  );
};

export default DateCalcPage;
