import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { PomodoroTool } from '@/utils/tools/pomodoroTool';
import toolStyles from '@/styles/tool-common.module.scss';

type PomodoroPhase = 'work' | 'break';
type TimerStatus = 'idle' | 'running' | 'paused';

const PomodoroPage: React.FC = () => {
  const [workMinutes, setWorkMinutes] = useState(PomodoroTool.defaultWork);
  const [breakMinutes, setBreakMinutes] = useState(PomodoroTool.defaultBreak);
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [status, setStatus] = useState<TimerStatus>('idle');
  const [secondsLeft, setSecondsLeft] = useState(PomodoroTool.defaultWork * 60);
  const [sessionCount, setSessionCount] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  const startTimer = useCallback(() => {
    clearTimer();
    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          if (phase === 'work') {
            setSessionCount(c => c + 1);
            const isLongBreak = (sessionCount + 1) % PomodoroTool.longBreakInterval === 0;
            const breakLen = isLongBreak ? PomodoroTool.defaultLongBreak : breakMinutes;
            setPhase('break');
            setSecondsLeft(breakLen * 60);
          } else {
            setPhase('work');
            setSecondsLeft(workMinutes * 60);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    timerRef.current = interval;
    setStatus('running');
  }, [phase, workMinutes, breakMinutes, sessionCount, clearTimer]);

  const start = () => {
    if (status === 'idle') {
      setSecondsLeft(phase === 'work' ? workMinutes * 60 : breakMinutes * 60);
    }
    startTimer();
  };

  const pause = () => {
    clearTimer();
    setStatus('paused');
  };

  const resume = () => {
    startTimer();
  };

  const reset = () => {
    clearTimer();
    setStatus('idle');
    setPhase('work');
    setSecondsLeft(workMinutes * 60);
    setSessionCount(0);
  };

  const toggleWorkTime = (val: number) => {
    setWorkMinutes(val);
    if (status === 'idle' && phase === 'work') setSecondsLeft(val * 60);
  };

  const toggleBreakTime = (val: number) => {
    setBreakMinutes(val);
    if (status === 'idle' && phase === 'break') setSecondsLeft(val * 60);
  };

  const formatTime = (totalSec: number): string => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const phaseLabel = phase === 'work' ? '工作中' : '休息中';

  return (
    <View>
      <View className={toolStyles.section} style="text-align:center;padding:40rpx 0">
        <Text style="font-size:32rpx;color:var(--color-text-secondary, #888);margin-bottom:16rpx;display:block">
          {phaseLabel} · 已完成 {sessionCount} 个番茄
        </Text>
        <Text style="font-size:96rpx;font-weight:bold;color:var(--color-primary, #4a90d9);font-variant-numeric:tabular-nums">
          {formatTime(secondsLeft)}
        </Text>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>工作时长 (分钟)</Text>
        <View className={toolStyles.row}>
          {[15, 20, 25, 30, 45].map(m => (
            <Text
              key={m}
              className={`${toolStyles.chip} ${workMinutes === m ? toolStyles.chipActive : ''}`}
              onClick={() => toggleWorkTime(m)}
              style={status !== 'idle' ? 'opacity:0.5;pointer-events:none' : ''}
            >{m}分钟</Text>
          ))}
        </View>
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>休息时长 (分钟)</Text>
        <View className={toolStyles.row}>
          {[3, 5, 10, 15].map(m => (
            <Text
              key={m}
              className={`${toolStyles.chip} ${breakMinutes === m ? toolStyles.chipActive : ''}`}
              onClick={() => toggleBreakTime(m)}
              style={status !== 'idle' ? 'opacity:0.5;pointer-events:none' : ''}
            >{m}分钟</Text>
          ))}
        </View>
      </View>
      <View className={toolStyles.actionRow} style="justify-content:center">
        {status === 'idle' && (
          <Button className={toolStyles.btnPrimary} onClick={start}>开始</Button>
        )}
        {status === 'running' && (
          <Button className={toolStyles.btnSecondary} onClick={pause}>暂停</Button>
        )}
        {status === 'paused' && (
          <Button className={toolStyles.btnPrimary} onClick={resume}>继续</Button>
        )}
        {status !== 'idle' && (
          <Button className={toolStyles.btnSecondary} onClick={reset}>重置</Button>
        )}
      </View>
    </View>
  );
};

export default PomodoroPage;
