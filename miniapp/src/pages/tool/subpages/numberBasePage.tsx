import React, { useState } from 'react';
import { View, Text, Textarea, Button, Picker } from '@tarojs/components';
import { NumberBaseTool } from '@/utils/tools/numberBaseTool';
import toolStyles from '@/styles/tool-common.module.scss';

const bases = [2, 8, 10, 16];
const baseLabels: Record<number, string> = { 2: '二进制', 8: '八进制', 10: '十进制', 16: '十六进制' };

const NumberBasePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [results, setResults] = useState<Array<{ base: number; value: string }>>([]);
  const [error, setError] = useState<string | undefined>();

  const convert = () => {
    const err = NumberBaseTool.validate(input, fromBase);
    if (err) { setError(err); setResults([]); return; }
    setError(undefined);
    const converted = bases
      .filter(b => b !== fromBase)
      .map(b => ({ base: b, value: NumberBaseTool.convert(input, fromBase, b) }));
    setResults(converted);
  };

  const fromSelector = bases.map(b => baseLabels[b]);

  return (
    <View>
      <View className={toolStyles.section}>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>源进制</Text>
          <View className={toolStyles.segmentedControl}>
            {bases.map(b => (
              <Text
                key={b}
                className={`${toolStyles.segment} ${fromBase === b ? toolStyles.segmentActive : ''}`}
                onClick={() => setFromBase(b)}
              >{baseLabels[b]}</Text>
            ))}
          </View>
        </View>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入数值</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder={`输入${baseLabels[fromBase]}数值...`}
          style="height:100rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={convert}>转换</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {results.length > 0 && (
        <View>
          {results.map(r => (
            <View key={r.base} className={toolStyles.section}>
              <Text className={toolStyles.sectionTitle}>{baseLabels[r.base]}</Text>
              <View className={toolStyles.resultBox}>
                <Text selectable className={toolStyles.monoText}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default NumberBasePage;
