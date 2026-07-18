import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { TextStatsTool } from '@/utils/tools/textStatsTool';
import toolStyles from '@/styles/tool-common.module.scss';

const TextStatsPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState<ReturnType<typeof TextStatsTool.analyze> | null>(null);

  const analyze = () => {
    setStats(TextStatsTool.analyze(input));
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入文本</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="粘贴要统计的文本..."
          style="height:250rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={analyze}>统计</Button>
      </View>
      {stats && (
        <View className={toolStyles.statGrid}>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>字符数 (含空格)</Text>
            <Text className={toolStyles.statValue}>{stats.charCount}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>字符数 (不含空格)</Text>
            <Text className={toolStyles.statValue}>{stats.charNoSpace}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>单词数</Text>
            <Text className={toolStyles.statValue}>{stats.wordCount}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>行数</Text>
            <Text className={toolStyles.statValue}>{stats.lineCount}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>中文字数</Text>
            <Text className={toolStyles.statValue}>{stats.chineseCharCount}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>数字</Text>
            <Text className={toolStyles.statValue}>{stats.digitCount}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>字母</Text>
            <Text className={toolStyles.statValue}>{stats.letterCount}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>标点</Text>
            <Text className={toolStyles.statValue}>{stats.punctuationCount}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>UTF-8 字节</Text>
            <Text className={toolStyles.statValue}>{stats.byteCountUtf8}</Text>
          </View>
          <View className={toolStyles.statItem}>
            <Text className={toolStyles.statLabel}>UTF-16 字节</Text>
            <Text className={toolStyles.statValue}>{stats.byteCountUtf16}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default TextStatsPage;
