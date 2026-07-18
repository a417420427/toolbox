import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { HashTool } from '@/utils/tools/hashTool';
import toolStyles from '@/styles/tool-common.module.scss';

const HashToolPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const process = async () => {
    setLoading(true);
    try {
      const r = await HashTool.hashText(input);
      setResults(r);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入文本</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="输入要计算哈希的文本..."
          style="height:150rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process} loading={loading}>计算哈希</Button>
      </View>
      {Object.keys(results).length > 0 && (
        <View>
          {HashTool.algorithms.map(algo => (
            <View key={algo} className={toolStyles.section}>
              <Text className={toolStyles.sectionTitle}>{algo}</Text>
              <View className={toolStyles.resultBox}>
                <Text selectable className={toolStyles.monoText} style={{ fontSize: '20rpx' }}>{results[algo]}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default HashToolPage;
