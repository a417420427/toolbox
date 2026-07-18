import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { TextCaseTool } from '@/utils/tools/textCaseTool';
import toolStyles from '@/styles/tool-common.module.scss';

const TextCasePage: React.FC = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Array<{ label: string; value: string }>>([]);

  const process = () => {
    const r = TextCaseTool.convert(input);
    const items = [
      { label: '大写', value: r.upper },
      { label: '小写', value: r.lower },
      { label: '标题', value: r.title },
      { label: '句子', value: r.sentence },
      { label: '驼峰', value: r.camel },
      { label: '帕斯卡', value: r.pascal },
      { label: '蛇形', value: r.snake },
      { label: '中划线', value: r.kebab },
      { label: '反转', value: r.reverse },
    ];
    setResults(items);
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入文本</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="输入要转换的文本..."
          style="height:120rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>转换</Button>
      </View>
      {results.length > 0 && (
        <View>
          {results.map(r => (
            <View key={r.label} className={toolStyles.card}>
              <Text className={toolStyles.cardTitle}>{r.label}</Text>
              <Text selectable className={toolStyles.monoText}>{r.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default TextCasePage;
