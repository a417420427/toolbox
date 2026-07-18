import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { JwtTool } from '@/utils/tools/jwtTool';
import toolStyles from '@/styles/tool-common.module.scss';

const JwtToolPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  const decode = () => {
    const r = JwtTool.decode(input);
    if (r.error) {
      setError(r.error);
      setResult('');
    } else if (r.result) {
      setError(undefined);
      setResult(
        '=== Header ===\n' +
        JSON.stringify(r.result.header, null, 2) +
        '\n\n=== Payload ===\n' +
        JSON.stringify(r.result.payload, null, 2) +
        '\n\n=== Signature ===\n' +
        r.result.signature +
        '\n\n=== 过期检查 ===\n' +
        (r.result.payload.exp
          ? new Date(r.result.payload.exp * 1000).toLocaleString() +
            (r.result.payload.exp * 1000 > Date.now() ? ' (未过期)' : ' (已过期)')
          : '无过期时间')
      );
    }
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>JWT Token</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="粘贴 JWT Token..."
          style="height:150rpx;font-family:monospace;font-size:20rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={decode}>解码</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {result && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>解码结果</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable style={{ whiteSpace: 'pre-wrap', fontSize: '22rpx', lineHeight: 1.6, fontFamily: 'monospace' }}>{result}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default JwtToolPage;
