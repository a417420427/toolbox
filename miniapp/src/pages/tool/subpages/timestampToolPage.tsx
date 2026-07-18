import React, { useState } from 'react';
import { View, Text, Textarea, Button, Picker } from '@tarojs/components';
import { TimestampTool } from '@/utils/tools/timestampTool';
import toolStyles from '@/styles/tool-common.module.scss';

const modes = [
  { value: 'ts2date', label: '时间戳→日期' },
  { value: 'date2ts', label: '日期→时间戳' },
  { value: 'now', label: '当前时间戳' },
];

const TimestampToolPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('ts2date');

  const process = () => {
    if (mode === 'now') {
      const sec = TimestampTool.nowSeconds();
      const ms = TimestampTool.nowMilliseconds();
      const now = new Date();
      setOutput(
        `当前时间: ${TimestampTool.toChinese(now)}\n` +
        `ISO: ${TimestampTool.toIso(now)}\n` +
        `美国格式: ${TimestampTool.toAmerican(now)}\n` +
        `相对: ${TimestampTool.relative(now)}\n\n` +
        `秒级时间戳: ${sec}\n` +
        `毫秒级时间戳: ${ms}`
      );
      return;
    }

    if (mode === 'ts2date') {
      const ts = parseInt(input);
      if (isNaN(ts)) { setOutput(''); return; }
      const { dateTime, isMs } = TimestampTool.toDateTime(ts);
      setOutput(
        `日期时间: ${TimestampTool.toChinese(dateTime)}\n` +
        `ISO 8601: ${TimestampTool.toIso(dateTime)}\n` +
        `美国格式: ${TimestampTool.toAmerican(dateTime)}\n` +
        `相对时间: ${TimestampTool.relative(dateTime)}\n\n` +
        `检测为: ${isMs ? '毫秒级' : '秒级'}`
      );
    } else {
      const dt = new Date(input);
      if (isNaN(dt.getTime())) { setOutput('请输入有效日期 (如 2024-01-15T10:30:00)'); return; }
      setOutput(
        `秒级时间戳: ${TimestampTool.toSeconds(dt)}\n` +
        `毫秒级时间戳: ${TimestampTool.toMilliseconds(dt)}\n` +
        `ISO 8601: ${TimestampTool.toIso(dt)}\n` +
        `中国格式: ${TimestampTool.toChinese(dt)}\n` +
        `美国格式: ${TimestampTool.toAmerican(dt)}\n` +
        `相对时间: ${TimestampTool.relative(dt)}`
      );
    }
  };

  return (
    <View>
      <View className={toolStyles.row} style={{ justifyContent: 'center' }}>
        <View className={toolStyles.segmentedControl}>
          {modes.map(m => (
            <Text
              key={m.value}
              className={`${toolStyles.segment} ${mode === m.value ? toolStyles.segmentActive : ''}`}
              onClick={() => setMode(m.value)}
            >{m.label}</Text>
          ))}
        </View>
      </View>
      {mode !== 'now' && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>
            {mode === 'ts2date' ? '输入时间戳 (秒或毫秒)' : '输入日期时间 (ISO 8601)'}
          </Text>
          <Textarea
            className={toolStyles.textarea}
            value={input}
            onInput={e => setInput(e.detail.value)}
            placeholder={mode === 'ts2date' ? '例如: 1705300000 或 1705300000000' : '例如: 2024-01-15T10:30:00'}
            style="height:100rpx"
          />
        </View>
      )}
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>
          {mode === 'now' ? '获取当前时间' : '转换'}
        </Button>
      </View>
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>结果</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable style={{ whiteSpace: 'pre-wrap', fontSize: '24rpx', lineHeight: 1.6 }}>{output}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TimestampToolPage;
