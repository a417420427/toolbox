import React, { useState } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import { MortgageTool } from '@/utils/tools/mortgageTool';
import toolStyles from '@/styles/tool-common.module.scss';

const MortgagePage: React.FC = () => {
  const [principal, setPrincipal] = useState('1000000');
  const [annualRate, setAnnualRate] = useState('3.85');
  const [years, setYears] = useState('30');
  const [output, setOutput] = useState('');

  const process = () => {
    const p = parseFloat(principal);
    const rate = parseFloat(annualRate);
    const n = parseInt(years, 10) * 12;
    if (isNaN(p) || isNaN(rate) || isNaN(n) || p <= 0 || rate <= 0 || n <= 0) {
      setOutput('请输入有效的贷款金额、利率和年限');
      return;
    }
    const mr = rate / 100 / 12;
    const monthly = MortgageTool.equalPayment(p, mr, n);
    const totalP = monthly * n;
    const totalI = totalP - p;
    const firstP = MortgageTool.equalPrincipalFirst(p, mr, n);

    setOutput(
      `贷款总额: ${MortgageTool.format(p)}\n` +
      `年利率: ${rate}%\n` +
      `贷款期限: ${years} 年 (${n} 期)\n\n` +
      `【等额本息】\n` +
      `月供: ${MortgageTool.format(monthly)}\n` +
      `总还款: ${MortgageTool.format(totalP)}\n` +
      `总利息: ${MortgageTool.format(totalI)}\n\n` +
      `【等额本金】\n` +
      `首月还款: ${MortgageTool.format(firstP)}\n` +
      `每月递减: ${MortgageTool.format(p / n * mr)}\n` +
      `总利息: ${MortgageTool.format((p / n + p * mr + p / n * (1 + mr)) / 2 * n - p)}`
    );
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>房贷计算器</Text>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>贷款总额</Text>
          <Input className={toolStyles.input} type="text" value={principal} onInput={e => setPrincipal(e.detail.value)} placeholder="单位：元" />
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>年利率</Text>
          <Input className={toolStyles.input} type="text" value={annualRate} onInput={e => setAnnualRate(e.detail.value)} placeholder="%" />
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
          <Text className={toolStyles.sectionTitle}>计算结果</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
    </View>
  );
};

export default MortgagePage;
