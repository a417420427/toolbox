import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { PasswordGenerator } from '@/utils/tools/passwordTool';
import toolStyles from '@/styles/tool-common.module.scss';

const PasswordPage: React.FC = () => {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useDigits, setUseDigits] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [password, setPassword] = useState('');

  const generate = () => {
    const pwd = PasswordGenerator.generate({
      length, useLower, useUpper, useDigits, useSymbols, excludeAmbiguous,
    });
    setPassword(pwd);
  };

  const copyPassword = () => {
    Taro.setClipboardData({ data: password }).then(() => {
      Taro.showToast({ title: '已复制', icon: 'success' });
    });
  };

  const strength = PasswordGenerator.strength(password);

  return (
    <View>
      <View className={toolStyles.section}>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>长度</Text>
          <View className={toolStyles.segmentedControl}>
            {[8, 12, 16, 24, 32].map(n => (
              <Text
                key={n}
                className={`${toolStyles.segment} ${length === n ? toolStyles.segmentActive : ''}`}
                onClick={() => setLength(n)}
              >{n}</Text>
            ))}
          </View>
        </View>
        {[
          [useLower, '小写 a-z', () => setUseLower(!useLower)],
          [useUpper, '大写 A-Z', () => setUseUpper(!useUpper)],
          [useDigits, '数字 0-9', () => setUseDigits(!useDigits)],
          [useSymbols, '符号 !@#', () => setUseSymbols(!useSymbols)],
          [excludeAmbiguous, '排除易混淆', () => setExcludeAmbiguous(!excludeAmbiguous)],
        ].map(([selected, label, onClick]) => (
          <Text
            key={label as string}
            className={`${toolStyles.chip} ${selected ? toolStyles.chipActive : ''}`}
            onClick={onClick as () => void}
            style={{ display: 'inline-block', margin: '4rpx' }}
          >{label as string}</Text>
        ))}
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={generate}>生成密码</Button>
      </View>
      {password && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>
            密码 {password && `(${PasswordGenerator.strengthLabel(strength)})`}
          </Text>
          <View className={toolStyles.resultBox}>
            <Text selectable className={toolStyles.monoText} style={{ fontSize: '28rpx' }}>{password}</Text>
          </View>
          <View className={toolStyles.actionRow}>
            <Button className={toolStyles.btnSecondary} onClick={copyPassword}>复制</Button>
            <Button className={toolStyles.btnSecondary} onClick={generate}>重新生成</Button>
          </View>
        </View>
      )}
    </View>
  );
};

export default PasswordPage;
