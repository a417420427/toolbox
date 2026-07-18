import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Input, Button } from '@tarojs/components';
import { CountdownTool } from '@/utils/tools/countdownTool';
import toolStyles from '@/styles/tool-common.module.scss';

const CountdownPage: React.FC = () => {
  const [targetDate, setTargetDate] = useState('2027-01-01');
  const [targetTime, setTargetTime] = useState('00:00');
  const [label, setLabel] = useState('元旦');
  const [result, setResult] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [running, setRunning] = useState(false);

  const updateCountdown = () => {
    const dt = new Date(`${targetDate}T${targetTime}:00`);
    if (isNaN(dt.getTime())) {
      setResult('请输入有效日期时间');
      return;
    }
    const r = CountdownTool.calculate(dt);
    const prefix = r.isPast ? '已过' : '剩余';
    setResult(
      `${label || '倒计时'}\n` +
      `目标: ${targetDate} ${targetTime}\n` +
      `${prefix}: ${r.days}天 ${r.hours}时 ${r.minutes}分 ${r.seconds}秒\n` +
      `${r.description}`
    );
  };

  const startTimer = () => {
    if (running) return;
    updateCountdown();
    setRunning(true);
    timerRef.current = setInterval(updateCountdown, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setRunning(false);
  };

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>目标</Text>
        <View className={toolStyles.inputGroup}>
          <Input className={toolStyles.input} type="text" value={targetDate} onInput={e => setTargetDate(e.detail.value)} placeholder="YYYY-MM-DD" style="flex:1" />
          <Input className={toolStyles.input} type="text" value={targetTime} onInput={e => setTargetTime(e.detail.value)} placeholder="HH:MM" style="flex:0.6" />
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>标签</Text>
          <Input className={toolStyles.input} type="text" value={label} onInput={e => setLabel(e.detail.value)} placeholder="名称" />
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={startTimer}>{running ? '刷新' : '开始倒计时'}</Button>
        {running && <Button className={toolStyles.btnSecondary} onClick={stopTimer}>停止</Button>}
      </View>
      {result && (
        <View className={toolStyles.section}>
          <View className={toolStyles.resultBox}>
            <Text selectable>{result}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default CountdownPage;
