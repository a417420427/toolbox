import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { HtmlEntityTool } from '@/utils/tools/htmlEntityTool';
import toolStyles from '@/styles/tool-common.module.scss';

const HtmlEntityPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isEncode, setIsEncode] = useState(true);

  const process = () => {
    setOutput(isEncode ? HtmlEntityTool.encode(input) : HtmlEntityTool.decode(input));
  };

  return (
    <View>
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
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入文本</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder={isEncode ? '输入包含 < > & 的文本...' : '输入 HTML 实体...'}
          style="height:200rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>执行</Button>
      </View>
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>{isEncode ? '编码结果' : '解码结果'}</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable className={toolStyles.monoText}>{output}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default HtmlEntityPage;
