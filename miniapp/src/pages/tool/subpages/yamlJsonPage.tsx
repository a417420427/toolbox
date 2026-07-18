import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { YamlJsonConverter } from '@/utils/tools/yamlJsonTool';
import toolStyles from '@/styles/tool-common.module.scss';

const modes = [
  { value: 'yaml2json', label: 'YAML → JSON' },
  { value: 'json2yaml', label: 'JSON → YAML' },
];

const sampleYaml = 'name: 张三\nage: 30\ncity: 北京\nactive: true';
const sampleJson = '{\n  "name": "张三",\n  "age": 30,\n  "city": "北京"\n}';

const YamlJsonPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('yaml2json');
  const [error, setError] = useState<string | undefined>();

  const process = () => {
    if (!input.trim()) { setOutput(''); setError('请输入内容'); return; }
    try {
      if (mode === 'yaml2json') {
        const result = YamlJsonConverter.yamlToJson(input);
        setOutput(result);
        setError(undefined);
      } else {
        const result = YamlJsonConverter.jsonToYaml(input);
        setOutput(result);
        setError(undefined);
      }
    } catch (e: any) {
      setError(`转换失败: ${e.message}`);
      setOutput('');
    }
  };

  const fillSample = () => setInput(mode === 'yaml2json' ? sampleYaml : sampleJson);

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>输入</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="粘贴 YAML 或 JSON..."
          style="height:200rpx;font-family:monospace;font-size:24rpx"
        />
      </View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          {modes.map(m => (
            <Text key={m.value} className={`${toolStyles.segment} ${mode === m.value ? toolStyles.segmentActive : ''}`} onClick={() => setMode(m.value)}>{m.label}</Text>
          ))}
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>转换</Button>
        <Button className={toolStyles.btnSecondary} onClick={fillSample}>填入示例</Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}><Text className={toolStyles.errorText}>{error}</Text></View>
      )}
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>输出</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
    </View>
  );
};

export default YamlJsonPage;
