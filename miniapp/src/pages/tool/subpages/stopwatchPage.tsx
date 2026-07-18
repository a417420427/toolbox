import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { StopwatchTool } from '@/utils/tools/stopwatchTool';
import toolStyles from '@/styles/tool-common.module.scss';

type StopwatchStatus = 'idle' | 'running' | 'paused';

interface LapRecord {
  index: number;
  lapTime: number;
  totalTime: number;
}

const StopwatchPage: React.FC = () => {
  const [status, setStatus] = useState<StopwatchStatus>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);
  const [lapStart, setLapStart] = useState(0);

  const startTimeRef = useRef(0);
  const pausedElapsedRef = useRef(0);
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

  const tick = useCallback(() => {
    const now = Date.now();
    setElapsed(pausedElapsedRef.current + (now - startTimeRef.current));
  }, []);

  const start = () => {
    startTimeRef.current = Date.now();
    pausedElapsedRef.current = 0;
    setElapsed(0);
    setLaps([]);
    setLapStart(0);

    const interval = setInterval(tick, 30);
    timerRef.current = interval;
    setStatus('running');
  };

  const pause = () => {
    clearTimer();
    pausedElapsedRef.current = elapsed;
    setStatus('paused');
  };

  const resume = () => {
    startTimeRef.current = Date.now();
    const interval = setInterval(tick, 30);
    timerRef.current = interval;
    setStatus('running');
  };

  const reset = () => {
    clearTimer();
    setElapsed(0);
    setLaps([]);
    setLapStart(0);
    setStatus('idle');
  };

  const lap = () => {
    const totalNow = elapsed;
    const lapDiff = totalNow - lapStart;
    setLaps(prev => [...prev, { index: prev.length + 1, lapTime: lapDiff, totalTime: totalNow }]);
    setLapStart(totalNow);
  };

  return (
    <View>
      <View className={toolStyles.section} style="text-align:center;padding:40rpx 0">
        <Text style="font-size:96rpx;font-weight:bold;color:var(--color-primary, #4a90d9);font-variant-numeric:tabular-nums">
          {StopwatchTool.format(elapsed)}
        </Text>
        <Text style="font-size:24rpx;color:var(--color-text-tertiary, #999);margin-top:8rpx;display:block">
          {status === 'idle' && '准备就绪'}
          {status === 'running' && '计时中'}
          {status === 'paused' && '已暂停'}
        </Text>
      </View>
      <View className={toolStyles.actionRow} style="justify-content:center">
        {status === 'idle' && (
          <Button className={toolStyles.btnPrimary} onClick={start}>开始</Button>
        )}
        {status === 'running' && (
          <>
            <Button className={toolStyles.btnSecondary} onClick={pause}>暂停</Button>
            <Button className={toolStyles.btnPrimary} onClick={lap}>计次</Button>
          </>
        )}
        {status === 'paused' && (
          <>
            <Button className={toolStyles.btnPrimary} onClick={resume}>继续</Button>
            <Button className={toolStyles.btnSecondary} onClick={reset}>重置</Button>
          </>
        )}
      </View>
      {laps.length > 0 && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>计次记录</Text>
          {[...laps].reverse().map(l => (
            <View key={l.index} className={toolStyles.row} style="padding:8rpx 0;border-bottom:1rpx solid var(--color-border, #eee)">
              <Text style="flex:1;font-size:24rpx;color:var(--color-text-tertiary, #999)">
                计次 {l.index}
              </Text>
              <Text className={toolStyles.monoText} style="font-size:24rpx;width:160rpx;text-align:right">
                +{StopwatchTool.format(l.lapTime)}
              </Text>
              <Text className={toolStyles.monoText} style="font-size:24rpx;width:200rpx;text-align:right">
                {StopwatchTool.format(l.totalTime)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default StopwatchPage;
