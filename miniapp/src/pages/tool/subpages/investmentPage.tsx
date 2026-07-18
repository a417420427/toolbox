import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import { InvestmentTool } from '@/utils/tools/investmentTool';
import toolStyles from '@/styles/tool-common.module.scss';

const InvestmentPage: React.FC = () => {
  const [mode, setMode] = useState('fv'); // fv | fvMonthly | required
  const [principal, setPrincipal] = useState('100000');
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('8');
  const [years, setYears] = useState('10');
  const [target, setTarget] = useState('1000000');
  const [output, setOutput] = useState('');

  const process = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate);
    const y = parseInt(years, 10);
    if (isNaN(p) || isNaN(r) || isNaN(y) || y <= 0) { setOutput('请输入有效数值'); return; }

    switch (mode) {
      case 'fv': {
        const fv = InvestmentTool.futureValue(p, r, y);
        setOutput(
          `本金: ${InvestmentTool.format(p)}\n` +
          `年化收益率: ${r}%\n` +
          `期限: ${y} 年\n\n` +
          `复利终值: ${InvestmentTool.format(fv)}\n` +
          `收益: ${InvestmentTool.format(fv - p)}`
        );
        break;
      }
      case 'fvMonthly': {
        const m = parseFloat(monthly);
        if (isNaN(m)) { setOutput('请输入月定投金额'); return; }
        const fv = InvestmentTool.futureValueWithMonthly(p, m, r, y);
        const totalIn = p + m * 12 * y;
        setOutput(
          `本金: ${InvestmentTool.format(p)}\n` +
          `月定投: ${InvestmentTool.format(m)}\n` +
          `年化收益率: ${r}%\n` +
          `期限: ${y} 年\n\n` +
          `终值: ${InvestmentTool.format(fv)}\n` +
          `总投入: ${InvestmentTool.format(totalIn)}\n` +
          `收益: ${InvestmentTool.format(fv - totalIn)}`
        );
        break;
      }
      case 'required': {
        const t = parseFloat(target);
        if (isNaN(t)) { setOutput('请输入目标金额'); return; }
        const rp = InvestmentTool.requiredPrincipal(t, r, y);
        setOutput(
          `目标: ${InvestmentTool.format(t)}\n` +
          `年化收益率: ${r}%\n` +
          `期限: ${y} 年\n\n` +
          `需一次性投入: ${InvestmentTool.format(rp)}`
        );
        break;
      }
    }
  };

  return (
    <View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          <Text className={`${toolStyles.segment} ${mode === 'fv' ? toolStyles.segmentActive : ''}`} onClick={() => setMode('fv')}>复利</Text>
          <Text className={`${toolStyles.segment} ${mode === 'fvMonthly' ? toolStyles.segmentActive : ''}`} onClick={() => setMode('fvMonthly')}>定投</Text>
          <Text className={`${toolStyles.segment} ${mode === 'required' ? toolStyles.segmentActive : ''}`} onClick={() => setMode('required')}>反算本金</Text>
        </View>
      </View>
      <View className={toolStyles.section}>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>本金</Text>
          <Input className={toolStyles.input} type="text" value={principal} onInput={e => setPrincipal(e.detail.value)} placeholder="元" />
        </View>
        {mode === 'fvMonthly' && (
          <View className={toolStyles.inputGroup}>
            <Text className={toolStyles.label}>月定投</Text>
            <Input className={toolStyles.input} type="text" value={monthly} onInput={e => setMonthly(e.detail.value)} placeholder="元" />
          </View>
        )}
        {mode === 'required' && (
          <View className={toolStyles.inputGroup}>
            <Text className={toolStyles.label}>目标</Text>
            <Input className={toolStyles.input} type="text" value={target} onInput={e => setTarget(e.detail.value)} placeholder="元" />
          </View>
        )}
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>年化%</Text>
          <Input className={toolStyles.input} type="text" value={rate} onInput={e => setRate(e.detail.value)} placeholder="%" />
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>期限</Text>
          <Input className={toolStyles.input} type="text" value={years} onInput={e => setYears(e.detail.value)} placeholder="年" />
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>计算</Button>
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

export default InvestmentPage;
