import React, { useState } from 'react';
import { View, Text, Textarea, Button, Picker } from '@tarojs/components';
import { RegexTool } from '@/utils/tools/regexTool';
import toolStyles from '@/styles/tool-common.module.scss';

const RegexPage: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [testText, setTestText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [multiLine, setMultiLine] = useState(false);
  const [dotAll, setDotAll] = useState(false);
  const [matches, setMatches] = useState<Array<{ match: string; start: number; end: number }>>([]);
  const [error, setError] = useState<string | undefined>();

  const test = () => {
    const r = RegexTool.test(pattern, testText, { global: true, caseSensitive, multiLine, dotAll });
    setError(r.error);
    setMatches(r.matches);
  };

  const fillPattern = (p: string) => {
    setPattern(p);
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>正则表达式</Text>
        <Textarea
          className={toolStyles.textarea}
          value={pattern}
          onInput={e => setPattern(e.detail.value)}
          placeholder="输入正则表达式..."
          style="height:80rpx;font-family:monospace"
        />
      </View>
      <View className={toolStyles.row}>
        <Text
          className={`${toolStyles.chip} ${caseSensitive ? toolStyles.chipActive : ''}`}
          onClick={() => setCaseSensitive(!caseSensitive)}
        >区分大小写</Text>
        <Text
          className={`${toolStyles.chip} ${multiLine ? toolStyles.chipActive : ''}`}
          onClick={() => setMultiLine(!multiLine)}
        >多行模式</Text>
        <Text
          className={`${toolStyles.chip} ${dotAll ? toolStyles.chipActive : ''}`}
          onClick={() => setDotAll(!dotAll)}
        >.匹配换行</Text>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>测试文本</Text>
        <Textarea
          className={toolStyles.textarea}
          value={testText}
          onInput={e => setTestText(e.detail.value)}
          placeholder="输入测试文本..."
          style="height:200rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={test}>测试</Button>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>常用正则</Text>
        <View className={toolStyles.row} style={{ flexWrap: 'wrap' }}>
          {RegexTool.quickPatterns.map(qp => (
            <Text
              key={qp.label}
              className={toolStyles.badge}
              onClick={() => fillPattern(qp.pattern)}
              style={{ margin: '4rpx' }}
            >{qp.label}</Text>
          ))}
        </View>
      </View>
      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {matches.length > 0 && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>匹配结果 ({matches.length})</Text>
          <View className={toolStyles.resultBox}>
            {matches.map((m, i) => (
              <View key={i} style={{ padding: '4rpx 0', borderBottom: '1rpx solid #eee' }}>
                <Text selectable className={toolStyles.monoText}>
                  #{i + 1}: "{m.match}" (位置 {m.start}-{m.end})
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {!error && matches.length === 0 && pattern && testText && (
        <View className={toolStyles.resultBox}>
          <Text>无匹配结果</Text>
        </View>
      )}
    </View>
  );
};

export default RegexPage;
