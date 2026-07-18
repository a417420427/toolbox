import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { UrlParserTool, UrlParseResult } from '@/utils/tools/urlParserTool';
import toolStyles from '@/styles/tool-common.module.scss';

const UrlParserPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<UrlParseResult | null>(null);

  const parse = () => {
    const r = UrlParserTool.parse(input);
    setResult(r);
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>URL 输入</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="https://example.com:8080/path?name=test#section"
          style="height:120rpx;font-family:monospace;font-size:24rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={parse}>解析</Button>
      </View>
      {result && result.error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{result.error}</Text>
        </View>
      )}
      {result && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>解析结果</Text>
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>协议 (Protocol)</Text>
            <Text className={toolStyles.monoText}>{result.protocol || '-'}</Text>
          </View>
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>主机 (Host)</Text>
            <Text className={toolStyles.monoText}>{result.host || '-'}</Text>
          </View>
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>端口 (Port)</Text>
            <Text className={toolStyles.monoText}>{result.port != null ? String(result.port) : '-'}</Text>
          </View>
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>路径 (Pathname)</Text>
            <Text className={toolStyles.monoText}>{result.pathname || '-'}</Text>
          </View>
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>查询字符串 (Search)</Text>
            <Text className={toolStyles.monoText}>{result.search || '-'}</Text>
          </View>
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>哈希 (Hash)</Text>
            <Text className={toolStyles.monoText}>{result.hash ? '#' + result.hash : '-'}</Text>
          </View>
          {Object.keys(result.params).length > 0 && (
            <View className={toolStyles.card}>
              <Text className={toolStyles.cardTitle}>查询参数</Text>
              {Object.entries(result.params).map(([k, v], i) => (
                <Text key={i} className={toolStyles.monoText} style="display:block">
                  {k}: {v || '(空)'}
                </Text>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default UrlParserPage;
