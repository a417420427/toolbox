import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import { TimeZoneTool, TimeZoneEntry } from '@/utils/tools/timezoneTool';
import toolStyles from '@/styles/tool-common.module.scss';

const TimezonePage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [zones, setZones] = useState<TimeZoneEntry[]>(TimeZoneTool.zones);
  const [timeStrs, setTimeStrs] = useState<Record<string, string>>({});
  const [showDiff, setShowDiff] = useState(false);

  const doSearch = () => {
    setZones(TimeZoneTool.search(query));
  };

  const refreshTimes = () => {
    const times: Record<string, string> = {};
    zones.forEach(z => { times[z.name] = TimeZoneTool.getCurrentTime(z); });
    setTimeStrs({ ...times });
  };

  return (
    <View>
      <View className={toolStyles.inputGroup}>
        <Input className={toolStyles.input} type="text" value={query} onInput={e => setQuery(e.detail.value)} placeholder="搜索时区/城市..." />
        <Button className={toolStyles.btnPrimary} onClick={doSearch} style="flex-shrink:0">搜索</Button>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={refreshTimes}>刷新时间</Button>
        <Button className={toolStyles.btnSecondary} onClick={() => setShowDiff(!showDiff)}>{showDiff ? '隐藏时差' : '显示时差'}</Button>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>时区列表</Text>
        {zones.map(z => (
          <View key={z.name} className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>{z.name}</Text>
            <Text style="font-size:24rpx;color:#999">{z.city} | {z.code}</Text>
            {timeStrs[z.name] && <Text style="font-size:40rpx;font-weight:bold;color:#333;margin-top:8rpx">{timeStrs[z.name]}</Text>}
            {showDiff && <Text style="font-size:22rpx;color:#666">距北京: {TimeZoneTool.diffFromCST(z)}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
};

export default TimezonePage;
