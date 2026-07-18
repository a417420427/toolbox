import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { CronTool, CronResult } from '@/utils/tools/cronTool';
import toolStyles from '@/styles/tool-common.module.scss';

const CronPage: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<CronResult | null>(null);

  const parse = () => {
    const r = CronTool.parse(expression);
    setResult(r);
  };

  const applyPreset = (expr: string) => {
    setExpression(expr);
    const r = CronTool.parse(expr);
    setResult(r);
  };

  const clear = () => {
    setExpression('');
    setResult(null);
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>Cron 表达式</Text>
        <Textarea
          className={toolStyles.textarea}
          value={expression}
          onInput={e => setExpression(e.detail.value)}
          placeholder="* * * * *"
          style="height:100rpx;font-family:monospace;font-size:28rpx"
        />
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>常用预设</Text>
        <View className={toolStyles.row} style="flex-wrap:wrap">
          {CronTool.presets.map(p => (
            <Text
              key={p.expression}
              className={`${toolStyles.chip} ${expression === p.expression ? toolStyles.chipActive : ''}`}
              onClick={() => applyPreset(p.expression)}
            >
              {p.label}
            </Text>
          ))}
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={parse}>解析</Button>
        <Button className={toolStyles.btnSecondary} onClick={clear}>清空</Button>
      </View>
      {result && result.error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{result.error}</Text>
        </View>
      )}
      {result && result.description && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>描述</Text>
          <View className={toolStyles.resultBox}>
            <Text className={toolStyles.monoText}>{result.description}</Text>
          </View>
        </View>
      )}
      {result && result.preview && result.preview.length > 0 && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>最近 5 次执行时间</Text>
          {result.preview.map((t, i) => (
            <View key={i} className={toolStyles.card}>
              <Text className={toolStyles.monoText}>{t}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default CronPage;
