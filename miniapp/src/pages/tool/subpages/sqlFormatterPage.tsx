import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { SqlFormatter } from '@/utils/tools/sqlFormatter';
import toolStyles from '@/styles/tool-common.module.scss';

const modes = [
  { value: 'format', label: '格式化' },
  { value: 'minify', label: '压缩' },
];

const sample = 'SELECT id,name,age FROM users WHERE age>18 ORDER BY name LIMIT 10';

const SqlFormatterPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('format');
  const [error, setError] = useState<string | undefined>();

  const process = () => {
    const r = SqlFormatter.process(input, mode === 'minify');
    setOutput(r.result);
    setError(r.error);
  };

  const fillSample = () => setInput(sample);

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>SQL 输入</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="粘贴 SQL..."
          style="height:200rpx;font-family:monospace;font-size:24rpx"
        />
      </View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          {modes.map(m => (
            <Text key={m.value} className={`${toolStyles.segment} ${mode === m.value ? toolStyles.segmentActive : ''}`} onClick={() => setMode(m.value)}>{m.label}</Text>
          ))}
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>执行</Button>
        <Button className={toolStyles.btnSecondary} onClick={fillSample}>填入示例</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}><Text className={toolStyles.errorText}>{error}</Text></View>
      )}
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>输出</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
    </View>
  );
};

export default SqlFormatterPage;
