import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { UnicodeTool } from '@/utils/tools/unicodeTool';
import toolStyles from '@/styles/tool-common.module.scss';

const modes = [
  { value: 'char2codepoint', label: '字符→码点' },
  { value: 'codepoint2char', label: '码点→字符' },
];

const UnicodePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('char2codepoint');
  const [error, setError] = useState<string | undefined>();

  const process = () => {
    if (mode === 'char2codepoint') {
      if (!input) { setOutput(''); return; }
      const batch = UnicodeTool.batchInfo(input);
      const lines = batch.map(item =>
        `${item.char} → ${item.codePoint}  ${item.name}${item.block ? ` [${item.block}]` : ''}`
      );
      setOutput(lines.join('\n'));
      setError(undefined);
    } else {
      const r = UnicodeTool.fromCodePoint(input);
      if (r.error) { setError(r.error); setOutput(''); }
      else {
        const info = UnicodeTool.charInfo(r.char);
        setOutput(`字符: ${r.char}\n码点: ${info.codePoint}\n名称: ${info.name}\n区块: ${info.block || '未知'}`);
        setError(undefined);
      }
    }
  };

  return (
    <View>
      <View className={toolStyles.row}>
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
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>
          {mode === 'char2codepoint' ? '输入字符或文本' : '输入码点 (如 U+4E00 或 4E00)'}
        </Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder={mode === 'char2codepoint' ? '输入任意文本...' : 'U+4E00'}
          style="height:150rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>查询</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>查询结果</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable style={{ whiteSpace: 'pre-wrap', fontSize: '24rpx', lineHeight: 1.6 }}>{output}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default UnicodePage;
