import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { Base64Tool } from '@/utils/tools/base64Tool';
import toolStyles from '@/styles/tool-common.module.scss';

const Base64ToolPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);
  const [urlSafe, setUrlSafe] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const process = () => {
    if (isEncode) {
      const r = urlSafe ? Base64Tool.encodeUrlSafe(input) : Base64Tool.encode(input);
      setOutput(r);
      setError(undefined);
    } else {
      const r = Base64Tool.decode(input);
      setOutput(r.result);
      setError(r.error);
    }
  };

  return (
    <View style={{ padding: '0 32rpx 32rpx' }}>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>{isEncode ? '原始文本' : 'Base64 字符串'}</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder={isEncode ? '输入要编码的文本...' : '输入 Base64 字符串...'}
          style={{ height: '200rpx', fontFamily: 'monospace', fontSize: '24rpx' }}
        />
      </View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          <Text
            className={`${toolStyles.segment} ${isEncode ? toolStyles.segmentActive : ''}`}
            onClick={() => setIsEncode(true)}
          >编码</Text>
          <Text
            className={`${toolStyles.segment} ${!isEncode ? toolStyles.segmentActive : ''}`}
            onClick={() => setIsEncode(false)}
          >解码</Text>
        </View>
        {isEncode && (
          <Text
            className={`${toolStyles.chip} ${urlSafe ? toolStyles.chipActive : ''}`}
            onClick={() => setUrlSafe(!urlSafe)}
          >URL Safe</Text>
        )}
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>执行</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>{isEncode ? 'Base64 结果' : '解码结果'}</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable className={toolStyles.monoText}>{output}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Base64ToolPage;
