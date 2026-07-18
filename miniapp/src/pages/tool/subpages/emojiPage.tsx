import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import { EmojiSearch, EmojiEntry } from '@/utils/tools/emojiTool';
import toolStyles from '@/styles/tool-common.module.scss';

const EmojiPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [results, setResults] = useState<EmojiEntry[]>(EmojiSearch.byCategory('笑脸'));
  const categories = EmojiSearch.categories;

  const doSearch = () => {
    setCategory('');
    setResults(EmojiSearch.search(query));
  };

  const byCategory = (cat: string) => {
    setCategory(cat);
    setQuery('');
    setResults(EmojiSearch.byCategory(cat));
  };

  return (
    <View>
      <View className={toolStyles.inputGroup}>
        <Input className={toolStyles.input} type="text" value={query} onInput={e => setQuery(e.detail.value)} placeholder="搜索 emoji..." />
        <Button className={toolStyles.btnPrimary} onClick={doSearch} style="flex-shrink:0">搜索</Button>
      </View>
      <View className={toolStyles.row} style="flex-wrap:wrap">
        {categories.map(c => (
          <Text key={c} className={`${toolStyles.chip} ${category === c ? toolStyles.chipActive : ''}`} onClick={() => byCategory(c)}>{c}</Text>
        ))}
      </View>
      <View className={toolStyles.grid}>
        {results.map(([emoji, name], i) => (
          <View key={i} className={toolStyles.gridItem}>
            <Text style="font-size:48rpx;text-align:center;display:block">{emoji}</Text>
            <Text style="font-size:20rpx;color:#666;text-align:center;display:block;margin-top:4rpx">{name}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default EmojiPage;
