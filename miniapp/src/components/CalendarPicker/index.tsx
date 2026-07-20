import React, { useState } from 'react';
import { View, Text } from '@tarojs/components';
import Calendar, { type CalendarValue } from '@/components/Calendar';
import styles from './index.module.scss';

interface CalendarPickerProps {
  value: CalendarValue;
  onChange: (value: CalendarValue) => void;
  /** 标题，可选 */
  title?: string;
  /** 最小可选年份（默认 1920） */
  minYear?: number;
  /** 最大可选年份（默认当前年 + 50） */
  maxYear?: number;
}

function formatDate(v: CalendarValue): string {
  return `${v.year}年${v.month}月${v.day}日`;
}

/** 弹出式日历选择器：一行展示日期文字，点击弹出日历选择 */
const CalendarPicker: React.FC<CalendarPickerProps> = ({
  value,
  onChange,
  title,
  minYear,
  maxYear,
}) => {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: '24rpx' }}>
      {title && (
        <Text style={{ display: 'block', fontSize: '24rpx', fontWeight: 600, color: '#1a1a1a', marginBottom: '12rpx' }}>
          {title}
        </Text>
      )}
      {/* 触发行 */}
      <View
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: '72rpx', padding: '0 16rpx',
          background: '#f9fafb', border: '1rpx solid #e2e8f0', borderRadius: '8rpx',
        }}
        onClick={() => setShow(true)}
      >
        <Text style={{ fontSize: '28rpx', color: '#1a1a1a' }}>{formatDate(value)}</Text>
        <Text style={{ fontSize: '24rpx' }}>📅</Text>
      </View>

      {/* 弹窗 */}
      {show && (
        <View className={styles.overlay} onClick={() => setShow(false)}>
          <View className={styles.modal} onClick={e => e.stopPropagation()}>
            <Calendar
              title={title}
              value={value}
              onChange={(v) => { onChange(v); setShow(false); }}
              minYear={minYear}
              maxYear={maxYear}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CalendarPicker;
