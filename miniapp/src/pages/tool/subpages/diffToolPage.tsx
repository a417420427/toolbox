import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { DiffTool, DiffType } from '@/utils/tools/diffTool';
import toolStyles from '@/styles/tool-common.module.scss';

const DiffToolPage: React.FC = () => {
  const [oldText, setOldText] = useState('');
  const [newText, setNewText] = useState('');

  const diff = () => {
    return DiffTool.diff(oldText, newText);
  };

  const diffLines = diff();
  const stats = DiffTool.stats(oldText, newText);

  return (
    <View>
      <View className={toolStyles.grid}>
        <View className={`${toolStyles.gridItem}`}>
          <Text className={toolStyles.sectionTitle}>原文本</Text>
          <Textarea
            className={toolStyles.textarea}
            value={oldText}
            onInput={e => setOldText(e.detail.value)}
            placeholder="原文本..."
            style="height:250rpx"
          />
        </View>
        <View className={`${toolStyles.gridItem}`}>
          <Text className={toolStyles.sectionTitle}>新文本</Text>
          <Textarea
            className={toolStyles.textarea}
            value={newText}
            onInput={e => setNewText(e.detail.value)}
            placeholder="新文本..."
            style="height:250rpx"
          />
        </View>
      </View>
      {diffLines.length > 0 && (
        <View>
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>
              差异结果 (新增: {stats.added} | 删除: {stats.removed} | 相同: {diffLines.filter(l => l.type === DiffType.same).length})
            </Text>
          </View>
          <View className={toolStyles.resultBox}>
            {diffLines.map((line, i) => {
              let color = '#333';
              let prefix = '  ';
              if (line.type === DiffType.added) { color = '#10b981'; prefix = '+ '; }
              else if (line.type === DiffType.removed) { color = '#ef4444'; prefix = '- '; }
              return (
                <Text key={i} style={{ display: 'block', color, fontSize: '22rpx', lineHeight: 1.5, fontFamily: 'monospace', whiteSpace: 'pre' }}>
                  {prefix}{line.text}
                </Text>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

export default DiffToolPage;
