import React, { useState } from 'react';
import { View, Text, Button, Picker } from '@tarojs/components';
import { UuidTool } from '@/utils/tools/uuidTool';
import toolStyles from '@/styles/tool-common.module.scss';

const UuidToolPage: React.FC = () => {
  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<string[]>([]);
  const [useUppercase, setUseUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = () => {
    const list: string[] = [];
    const isV7 = version === 'v7';
    for (let i = 0; i < count; i++) {
      let uuid = isV7 ? UuidTool.uuidV7() : UuidTool.uuidV4();
      uuid = UuidTool.format(uuid, { uppercase: useUppercase, noDashes });
      list.push(uuid);
    }
    setResults(list);
  };

  const generateNanoId = () => {
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      list.push(UuidTool.nanoId());
    }
    setResults(list);
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>类型</Text>
          <View className={toolStyles.segmentedControl}>
            <Text
              className={`${toolStyles.segment} ${version === 'v4' ? toolStyles.segmentActive : ''}`}
              onClick={() => setVersion('v4')}
            >UUID v4</Text>
            <Text
              className={`${toolStyles.segment} ${version === 'v7' ? toolStyles.segmentActive : ''}`}
              onClick={() => setVersion('v7')}
            >UUID v7</Text>
            <Text
              className={`${toolStyles.segment} ${version === 'nano' ? toolStyles.segmentActive : ''}`}
              onClick={() => setVersion('nano')}
            >NanoID</Text>
          </View>
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>数量</Text>
          <View className={toolStyles.segmentedControl}>
            {[1, 5, 10, 20].map(n => (
              <Text
                key={n}
                className={`${toolStyles.segment} ${count === n ? toolStyles.segmentActive : ''}`}
                onClick={() => setCount(n)}
              >{n}</Text>
            ))}
          </View>
        </View>
        {version !== 'nano' && (
          <View className={toolStyles.row}>
            <Text
              className={`${toolStyles.chip} ${useUppercase ? toolStyles.chipActive : ''}`}
              onClick={() => setUseUppercase(!useUppercase)}
            >大写</Text>
            <Text
              className={`${toolStyles.chip} ${noDashes ? toolStyles.chipActive : ''}`}
              onClick={() => setNoDashes(!noDashes)}
            >无连字符</Text>
          </View>
        )}
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={version === 'nano' ? generateNanoId : generate}>
          生成
        </Button>
      </View>
      {results.length > 0 && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>生成结果</Text>
          <View className={toolStyles.resultBox}>
            {results.map((uuid, i) => (
              <Text key={i} selectable className={toolStyles.monoText} style={{ padding: '4rpx 0', display: 'block' }}>
                {uuid}
              </Text>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default UuidToolPage;
