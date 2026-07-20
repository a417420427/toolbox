import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import CalendarPicker from '@/components/CalendarPicker';
import type { CalendarValue } from '@/components/CalendarPicker';
import { AnniversaryTool } from '@/utils/tools/anniversaryTool';
import toolStyles from '@/styles/tool-common.module.scss';

const AnniversaryPage: React.FC = () => {
  const [date, setDate] = useState<CalendarValue>({ year: 2020, month: 1, day: 1 });
  const [label, setLabel] = useState('在一起');
  const [output, setOutput] = useState('');

  const process = () => {
    const d = new Date(date.year, date.month - 1, date.day);
    if (isNaN(d.getTime())) { setOutput('请输入有效日期'); return; }
    const r = AnniversaryTool.calculate(d);
    setOutput(
      `${label || '纪念日'}\n` +
      `目标日期: ${AnniversaryTool.formatDate(d)}\n` +
      `${r.description}`
    );
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>纪念日/倒数日</Text>
        <CalendarPicker
          value={date}
          onChange={setDate}
        />
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>名称</Text>
          <Input className={toolStyles.input} type="text" value={label} onInput={e => setLabel(e.detail.value)} placeholder="纪念日名称" />
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>计算</Button>
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

export default AnniversaryPage;
