import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import { HolidayTool, HolidayEntry } from '@/utils/tools/holidayTool';
import toolStyles from '@/styles/tool-common.module.scss';

const HolidayPage: React.FC = () => {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [output, setOutput] = useState('');
  const [nearest, setNearest] = useState('');

  const listHolidays = () => {
    const y = parseInt(year, 10);
    if (isNaN(y)) { setOutput('请输入有效年份'); return; }
    const holidays = HolidayTool.getHolidays(y);
    if (holidays.length === 0) { setOutput('暂无数据'); return; }
    setOutput(
      `${y} 年节假日\n${'─'.repeat(20)}\n` +
      holidays.map(h =>
        `${h.name}: ${h.date.getFullYear()}-${(h.date.getMonth() + 1).toString().padStart(2, '0')}-${h.date.getDate().toString().padStart(2, '0')} 周${['日', '一', '二', '三', '四', '五', '六'][h.date.getDay()]}`
      ).join('\n')
    );
  };

  const checkNearest = () => {
    const y = parseInt(year, 10);
    if (isNaN(y)) { setNearest('请输入有效年份'); return; }
    const n = HolidayTool.nearestHoliday(y);
    if (!n) { setNearest('没有找到未来假日'); return; }
    setNearest(
      `最近节日: ${n.name}\n` +
      `日期: ${n.date.getFullYear()}-${(n.date.getMonth() + 1).toString().padStart(2, '0')}-${n.date.getDate().toString().padStart(2, '0')}\n` +
      `还有 ${n.daysUntil} 天`
    );
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>年份</Text>
        <View className={toolStyles.inputGroup}>
          <Input className={toolStyles.input} type="text" value={year} onInput={e => setYear(e.detail.value)} placeholder="YYYY" />
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={listHolidays}>查看全年节假日</Button>
        <Button className={toolStyles.btnSecondary} onClick={checkNearest}>最近假日</Button>
      </View>
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>节假日列表</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
      {nearest && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>最近假期</Text>
          <View className={toolStyles.resultBox}><Text selectable>{nearest}</Text></View>
        </View>
      )}
    </View>
  );
};

export default HolidayPage;
