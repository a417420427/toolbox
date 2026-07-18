import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { UrlTool, UrlResult } from '@/utils/tools/urlTool';
import toolStyles from '../index.module.scss';

const modes = [
  { value: 'encodeComp', label: 'encodeURIComponent' },
  { value: 'decodeComp', label: 'decodeURIComponent' },
  { value: 'encodeFull', label: 'encodeURI' },
  { value: 'decodeFull', label: 'decodeURI' },
];

const UrlToolPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('encodeComp');
  const [error, setError] = useState<string | undefined>();

  const process = () => {
    let r: UrlResult;
    switch (mode) {
      case 'encodeComp':
        r = { result: UrlTool.encodeComponent(input) };
        break;
      case 'decodeComp':
        r = UrlTool.decodeComponent(input);
        break;
      case 'encodeFull':
        r = { result: UrlTool.encodeFull(input) };
        break;
      case 'decodeFull':
        r = UrlTool.decodeFull(input);
        break;
      default:
        r = { result: '' };
    }
    setOutput(r.result);
    setError(r.error);
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入文本</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="输入 URL 或文本..."
          style="height:200rpx"
        />
      </View>
      <View className={toolStyles.row} style="flex-wrap:wrap">
        {modes.map(m => (
          <Text
            key={m.value}
            className={`${toolStyles.badge} ${mode === m.value ? toolStyles.badgeActive : ''}`}
            onClick={() => setMode(m.value)}
            style="margin:4rpx;font-size:20rpx"
          >
            {m.label}
          </Text>
        ))}
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>执行</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>输出结果</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable className={toolStyles.monoText}>{output}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default UrlToolPage;
