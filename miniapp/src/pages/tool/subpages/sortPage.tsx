import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { SortTool, SortMode, DedupMode, SortStats } from '@/utils/tools/sortTool';
import toolStyles from '@/styles/tool-common.module.scss';

const sortModes = [
  { value: SortMode.asc, label: '升序' },
  { value: SortMode.desc, label: '降序' },
  { value: SortMode.lengthAsc, label: '短→长' },
  { value: SortMode.lengthDesc, label: '长→短' },
  { value: SortMode.reverse, label: '反转' },
];

const dedupModes = [
  { value: DedupMode.all, label: '严格去重' },
  { value: DedupMode.caseInsensitive, label: '忽略大小写' },
  { value: DedupMode.trimThenDedup, label: '去空格去重' },
];

const SortPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [stats, setStats] = useState<SortStats | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<'sort' | 'dedup' | 'clean'>('sort');
  const [sortMode, setSortMode] = useState(SortMode.asc);
  const [dedupMode, setDedupMode] = useState(DedupMode.all);

  const processSort = () => {
    if (!input.trim()) { setOutput(''); setError('请输入文本'); return; }
    setError(undefined);
    setOutput(SortTool.sort(input, sortMode));
    setStats(SortTool.stats(input));
  };

  const processDedup = () => {
    if (!input.trim()) { setOutput(''); setError('请输入文本'); return; }
    setError(undefined);
    setOutput(SortTool.dedup(input, dedupMode));
    setStats(SortTool.stats(input));
  };

  const processClean = () => {
    if (!input.trim()) { setOutput(''); setError('请输入文本'); return; }
    setError(undefined);
    setOutput(SortTool.removeEmptyLines(input));
    setStats(SortTool.stats(input));
  };

  return (
    <View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          <Text className={`${toolStyles.segment} ${activeTab === 'sort' ? toolStyles.segmentActive : ''}`} onClick={() => setActiveTab('sort')}>排序</Text>
          <Text className={`${toolStyles.segment} ${activeTab === 'dedup' ? toolStyles.segmentActive : ''}`} onClick={() => setActiveTab('dedup')}>去重</Text>
          <Text className={`${toolStyles.segment} ${activeTab === 'clean' ? toolStyles.segmentActive : ''}`} onClick={() => setActiveTab('clean')}>清理空行</Text>
        </View>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入文本（每行一条）</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="粘贴文本..."
          style="height:200rpx;font-family:monospace;font-size:24rpx"
        />
      </View>
      {activeTab === 'sort' && (
        <View className={toolStyles.row} style="flex-wrap:wrap">
          {sortModes.map(m => (
            <Text key={m.value} className={`${toolStyles.chip} ${sortMode === m.value ? toolStyles.chipActive : ''}`} onClick={() => setSortMode(m.value)}>{m.label}</Text>
          ))}
        </View>
      )}
      {activeTab === 'dedup' && (
        <View className={toolStyles.row} style="flex-wrap:wrap">
          {dedupModes.map(m => (
            <Text key={m.value} className={`${toolStyles.chip} ${dedupMode === m.value ? toolStyles.chipActive : ''}`} onClick={() => setDedupMode(m.value)}>{m.label}</Text>
          ))}
        </View>
      )}
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={activeTab === 'sort' ? processSort : activeTab === 'dedup' ? processDedup : processClean}>执行</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}><Text className={toolStyles.errorText}>{error}</Text></View>
      )}
      {stats && (
        <View className={toolStyles.statGrid}>
          <View className={toolStyles.statItem}><Text className={toolStyles.statLabel}>总行数</Text><Text className={toolStyles.statValue}>{stats.totalLines}</Text></View>
          <View className={toolStyles.statItem}><Text className={toolStyles.statLabel}>非空行</Text><Text className={toolStyles.statValue}>{stats.nonEmptyLines}</Text></View>
          <View className={toolStyles.statItem}><Text className={toolStyles.statLabel}>唯一行</Text><Text className={toolStyles.statValue}>{stats.uniqueLines}</Text></View>
          <View className={toolStyles.statItem}><Text className={toolStyles.statLabel}>输出行</Text><Text className={toolStyles.statValue}>{output.split('\n').length}</Text></View>
        </View>
      )}
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>输出结果</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
    </View>
  );
};

export default SortPage;
