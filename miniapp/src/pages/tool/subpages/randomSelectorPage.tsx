import React, { useState } from 'react';
import { View, Text, Textarea, Input, Button } from '@tarojs/components';
import { RandomSelectorTool } from '@/utils/tools/randomSelectorTool';
import toolStyles from '@/styles/tool-common.module.scss';

const modes = [
  { value: 'coin', label: '抛硬币' },
  { value: 'number', label: '随机数字' },
  { value: 'pick', label: '随机选' },
  { value: 'lots', label: '抽签' },
  { value: 'color', label: '随机颜色' },
];

const RandomSelectorPage: React.FC = () => {
  const [mode, setMode] = useState('coin');
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [items, setItems] = useState('');
  const [lotsCount, setLotsCount] = useState('3');
  const [output, setOutput] = useState('');

  const process = () => {
    switch (mode) {
      case 'coin': {
        setOutput(`抛硬币结果: ${RandomSelectorTool.flipCoin()}`);
        break;
      }
      case 'number': {
        const lo = parseInt(min, 10);
        const hi = parseInt(max, 10);
        if (isNaN(lo) || isNaN(hi)) { setOutput('请输入有效数字范围'); return; }
        setOutput(`随机数字 (${min}~${max}): ${RandomSelectorTool.randomInt(lo, hi)}`);
        break;
      }
      case 'pick': {
        const r = RandomSelectorTool.pickFromList(items);
        if (r.error) { setOutput(r.error); return; }
        setOutput(`选中: ${r.result}`);
        break;
      }
      case 'lots': {
        const ct = parseInt(lotsCount, 10);
        if (isNaN(ct) || ct < 1) { setOutput('请输入有效数量'); return; }
        const res = RandomSelectorTool.drawLots(items, ct);
        setOutput(`抽签结果 (${res.length} 个):\n${res.join('\n')}`);
        break;
      }
      case 'color': {
        const c = RandomSelectorTool.randomColor();
        setOutput(`随机颜色:\nHEX: ${c.hex}\nRGB: (${c.r}, ${c.g}, ${c.b})`);
        break;
      }
    }
  };

  return (
    <View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          {modes.map(m => (
            <Text key={m.value} className={`${toolStyles.segment} ${mode === m.value ? toolStyles.segmentActive : ''}`} onClick={() => setMode(m.value)}>{m.label}</Text>
          ))}
        </View>
      </View>
      {mode === 'number' && (
        <View className={toolStyles.inputGroup}>
          <Input className={toolStyles.input} type="text" value={min} onInput={e => setMin(e.detail.value)} placeholder="最小值" style="flex:1" />
          <Text>~</Text>
          <Input className={toolStyles.input} type="text" value={max} onInput={e => setMax(e.detail.value)} placeholder="最大值" style="flex:1" />
        </View>
      )}
      {(mode === 'pick' || mode === 'lots') && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>{'选项（用逗号或换行分隔）'}</Text>
          <Textarea className={toolStyles.textarea} value={items} onInput={e => setItems(e.detail.value)} placeholder="选项1, 选项2, 选项3" style="height:150rpx" />
        </View>
      )}
      {mode === 'lots' && (
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>抽取数</Text>
          <Input className={toolStyles.input} type="text" value={lotsCount} onInput={e => setLotsCount(e.detail.value)} placeholder="数量" />
        </View>
      )}
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>
          {mode === 'coin' ? '抛一次' : mode === 'color' ? '生成' : '执行'}
        </Button>
      </View>
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>结果</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
    </View>
  );
};

export default RandomSelectorPage;
