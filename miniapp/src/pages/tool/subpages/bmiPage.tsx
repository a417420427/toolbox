import React, { useState } from 'react';
import { View, Text, Input, Button, Picker } from '@tarojs/components';
import { BmiTool } from '@/utils/tools/bmiTool';
import toolStyles from '@/styles/tool-common.module.scss';

const BmiPage: React.FC = () => {
  const [weight, setWeight] = useState('70');
  const [height, setHeight] = useState('175');
  const [age, setAge] = useState('30');
  const [isMale, setIsMale] = useState(true);
  const [activityIdx, setActivityIdx] = useState(1);
  const [output, setOutput] = useState('');

  const process = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseInt(age, 10);
    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
      setOutput('请输入有效数值'); return;
    }

    const bmi = BmiTool.bmi(w, h);
    const cat = BmiTool.bmiCategory(bmi);
    const bmrVal = BmiTool.bmr(w, h, a, isMale);
    const act = BmiTool.activityLevels[activityIdx];
    const tdeeVal = BmiTool.tdee(bmrVal, act.factor);
    const [low, high] = BmiTool.idealWeightRange(h, isMale);
    const bf = BmiTool.bodyFatPercentage(bmi, a, isMale);

    setOutput(
      `身高: ${height} cm  体重: ${weight} kg  年龄: ${age}\n\n` +
      `【BMI】\n` +
      `BMI: ${BmiTool.format(bmi, 1)}\n` +
      `状态: ${cat.label}\n` +
      `建议: ${cat.detail}\n\n` +
      `【基础代谢】\n` +
      `BMR: ${BmiTool.format(bmrVal, 0)} kcal/天\n` +
      `TDEE: ${BmiTool.format(tdeeVal, 0)} kcal/天\n` +
      `（${act.label}）\n\n` +
      `【体脂估算】\n` +
      `体脂率: ${BmiTool.format(bf, 1)}%\n\n` +
      `【理想体重】\n` +
      `${BmiTool.format(low, 0)} ~ ${BmiTool.format(high, 0)} kg`
    );
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>体重(kg)</Text>
          <Input className={toolStyles.input} type="text" value={weight} onInput={e => setWeight(e.detail.value)} />
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>身高(cm)</Text>
          <Input className={toolStyles.input} type="text" value={height} onInput={e => setHeight(e.detail.value)} />
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>年龄</Text>
          <Input className={toolStyles.input} type="text" value={age} onInput={e => setAge(e.detail.value)} />
        </View>
        <View className={toolStyles.row}>
          <View className={toolStyles.segmentedControl}>
            <Text className={`${toolStyles.segment} ${isMale ? toolStyles.segmentActive : ''}`} onClick={() => setIsMale(true)}>男性</Text>
            <Text className={`${toolStyles.segment} ${!isMale ? toolStyles.segmentActive : ''}`} onClick={() => setIsMale(false)}>女性</Text>
          </View>
        </View>
        <Picker mode="selector" range={BmiTool.activityLevels.map(a => a.label)} value={activityIdx} onChange={e => setActivityIdx(parseInt(e.detail.value, 10))}>
          <View className={toolStyles.select}>
            <Text>{BmiTool.activityLevels[activityIdx].label}</Text>
          </View>
        </Picker>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>计算</Button>
      </View>
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>健康指标</Text>
          <View className={toolStyles.resultBox}><Text selectable className={toolStyles.monoText}>{output}</Text></View>
        </View>
      )}
    </View>
  );
};

export default BmiPage;
