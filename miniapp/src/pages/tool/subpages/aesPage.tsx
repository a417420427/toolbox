import React, { useState } from 'react';
import { View, Text, Textarea, Button, Picker } from '@tarojs/components';
import { AesTool, AesMode, AesKeySize } from '@/utils/tools/aesTool';
import toolStyles from '@/styles/tool-common.module.scss';

const modeOptions = [
  { value: AesMode.cbc, label: 'CBC' },
  { value: AesMode.ecb, label: 'ECB' },
  { value: AesMode.ctr, label: 'CTR' },
  { value: AesMode.gcm, label: 'GCM' },
];

const keySizeOptions = [
  { value: AesKeySize.bits128, label: '128-bit' },
  { value: AesKeySize.bits192, label: '192-bit' },
  { value: AesKeySize.bits256, label: '256-bit' },
];

const AesPage: React.FC = () => {
  const [mode, setMode] = useState(AesMode.cbc);
  const [keySize, setKeySize] = useState(AesKeySize.bits256);
  const [isEncrypt, setIsEncrypt] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [password, setPassword] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const process = async () => {
    setLoading(true);
    setError(undefined);
    setOutput('');

    try {
      if (isEncrypt) {
        const r = await AesTool.encrypt({ plaintext: textInput, password, mode, keySize });
        setOutput(r.encrypted);
        setError(r.error);
      } else {
        const r = await AesTool.decrypt({ encrypted: textInput, password, mode, keySize });
        setOutput(r.plaintext);
        setError(r.error);
      }
    } catch (e: any) {
      setError(`操作失败: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const swapMode = () => {
    setIsEncrypt(!isEncrypt);
    if (output) {
      setTextInput(output);
      setOutput('');
    }
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>模式</Text>
        <View className={toolStyles.row}>
          <View className={toolStyles.segmentedControl}>
            <Text
              className={`${toolStyles.segment} ${isEncrypt ? toolStyles.segmentActive : ''}`}
              onClick={() => setIsEncrypt(true)}
            >加密</Text>
            <Text
              className={`${toolStyles.segment} ${!isEncrypt ? toolStyles.segmentActive : ''}`}
              onClick={() => setIsEncrypt(false)}
            >解密</Text>
          </View>
        </View>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>算法设置</Text>
        <View className={toolStyles.row}>
          {modeOptions.map(m => (
            <Text
              key={m.value}
              className={`${toolStyles.chip} ${mode === m.value ? toolStyles.chipActive : ''}`}
              onClick={() => setMode(m.value)}
            >{m.label}</Text>
          ))}
        </View>
        <View className={toolStyles.row} style="marginTop:8rpx">
          {keySizeOptions.map(k => (
            <Text
              key={k.value}
              className={`${toolStyles.chip} ${keySize === k.value ? toolStyles.chipActive : ''}`}
              onClick={() => setKeySize(k.value)}
            >{k.label}</Text>
          ))}
        </View>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>{isEncrypt ? '明文' : '密文'}</Text>
        <Textarea
          className={toolStyles.textarea}
          value={textInput}
          onInput={e => setTextInput(e.detail.value)}
          placeholder={isEncrypt ? '输入要加密的文本...' : '输入 Base64 密文...'}
          style="height:160rpx;font-family:monospace;font-size:24rpx"
        />
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>密码</Text>
        <Textarea
          className={toolStyles.textarea}
          value={password}
          onInput={e => setPassword(e.detail.value)}
          placeholder="输入密码..."
          style="height:80rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process} disabled={loading}>
          {loading ? '处理中...' : isEncrypt ? '加密' : '解密'}
        </Button>
        <Button className={toolStyles.btnSecondary} onClick={swapMode}>
          交换模式
        </Button>
      </View>
      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>{isEncrypt ? '密文 (Base64)' : '明文'}</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable className={toolStyles.monoText}>{output}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AesPage;
