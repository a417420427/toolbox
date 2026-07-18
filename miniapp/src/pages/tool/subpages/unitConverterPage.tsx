import React, { useState } from 'react';
import { View, Text, Textarea, Button, Picker } from '@tarojs/components';
import { UnitConverterTool } from '@/utils/tools/unitConverterTool';
import toolStyles from '@/styles/tool-common.module.scss';

const UnitConverterPage: React.FC = () => {
  const [categoryIdx, setCategoryIdx] = useState(0);
  const [value, setValue] = useState('');
  const [fromIdx, setFromIdx] = useState(0);
  const [toIdx, setToIdx] = useState(1);
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | undefined>();

  const cats = UnitConverterTool.categories;
  const units = UnitConverterTool.unitsFor(cats[categoryIdx]);

  const convert = () => {
    const v = parseFloat(value);
    if (isNaN(v)) { setError('请输入有效数字'); setResult(''); return; }
    const r = UnitConverterTool.convert({ category: cats[categoryIdx], value: v, fromIndex: fromIdx, toIndex: toIdx });
    if (r.error) { setError(r.error); setResult(''); return; }
    setError(undefined);
    setResult(`${formatNum(v)} ${units[fromIdx]} = ${formatNum(r.result)} ${units[toIdx]}`);
  };

  const formatNum = (n: number) => isNaN(n) ? '—' : parseFloat(n.toFixed(6)).toString();

  // reset indices when category changes
  const changeCategory = (idx: number) => {
    setCategoryIdx(idx);
    setFromIdx(0);
    setToIdx(Math.min(1, UnitConverterTool.unitsFor(cats[idx]).length - 1));
  };

  return (
    <View style={{ padding: '0 32rpx 32rpx' }}>
      {/* 分类选择 */}
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>分类</Text>
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8rpx' }}>
          {cats.map((c, i) => (
            <Text
              key={c}
              onClick={() => changeCategory(i)}
              style={{
                padding: '8rpx 20rpx',
                fontSize: '22rpx',
                borderRadius: '999rpx',
                border: '1rpx solid #e5e7eb',
                background: i === categoryIdx ? 'rgba(59,130,246,0.1)' : '#fff',
                color: i === categoryIdx ? '#3b82f6' : '#6b7280',
                fontWeight: i === categoryIdx ? 500 : 400,
                lineHeight: '40rpx',
              }}
            >{c}</Text>
          ))}
        </View>
      </View>

      {/* 数值 */}
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>数值</Text>
        <Textarea
          className={toolStyles.textarea}
          value={value}
          onInput={e => setValue(e.detail.value)}
          placeholder="输入数值"
          style={{ height: '72rpx', lineHeight: '44rpx', paddingTop: '14rpx', paddingBottom: '14rpx' }}
        />
      </View>

      {/* 从 */}
      <View style={{ display: 'flex', alignItems: 'center', marginBottom: '16rpx', gap: '16rpx' }}>
        <Text style={{ fontSize: '22rpx', color: '#6b7280', flexShrink: 0, minWidth: '50rpx' }}>从</Text>
        <Picker
          mode="selector"
          range={units}
          value={fromIdx}
          onChange={e => setFromIdx(parseInt(e.detail.value as string))}
          style={{ flex: 1 }}
        >
          <View style={{
            height: '72rpx',
            padding: '0 16rpx',
            background: '#f9fafb',
            border: '1rpx solid #e5e7eb',
            borderRadius: '12rpx',
            fontSize: '24rpx',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}>
            <Text>{units[fromIdx]}</Text>
          </View>
        </Picker>
      </View>

      {/* 到 */}
      <View style={{ display: 'flex', alignItems: 'center', marginBottom: '16rpx', gap: '16rpx' }}>
        <Text style={{ fontSize: '22rpx', color: '#6b7280', flexShrink: 0, minWidth: '50rpx' }}>到</Text>
        <Picker
          mode="selector"
          range={units}
          value={toIdx}
          onChange={e => setToIdx(parseInt(e.detail.value as string))}
          style={{ flex: 1 }}
        >
          <View style={{
            height: '72rpx',
            padding: '0 16rpx',
            background: '#f9fafb',
            border: '1rpx solid #e5e7eb',
            borderRadius: '12rpx',
            fontSize: '24rpx',
            color: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}>
            <Text>{units[toIdx]}</Text>
          </View>
        </Picker>
      </View>

      {/* 快捷目标 */}
      {units.length > 0 && (
        <View style={{ display: 'flex', flexWrap: 'wrap', gap: '6rpx', marginBottom: '16rpx' }}>
          <Text style={{ fontSize: '20rpx', color: '#9ca3af', lineHeight: '48rpx', marginRight: '8rpx' }}>快捷→</Text>
          {units.map((u, i) => (i === fromIdx || i === toIdx) ? null : (
            <Text
              key={i}
              onClick={() => setToIdx(i)}
              style={{
                padding: '4rpx 14rpx',
                fontSize: '20rpx',
                borderRadius: '4rpx',
                border: '1rpx solid #e5e7eb',
                color: '#6b7280',
                lineHeight: '36rpx',
                background: '#fff',
              }}
            >{u.split('(')[0] || u}</Text>
          ))}
        </View>
      )}

      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={convert}>换算</Button>
      </View>

      {error && (
        <View className={toolStyles.errorBox}>
          <Text className={toolStyles.errorText}>{error}</Text>
        </View>
      )}
      {result && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>换算结果</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable style={{ fontSize: '28rpx', lineHeight: 1.6 }}>{result}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default UnitConverterPage;
