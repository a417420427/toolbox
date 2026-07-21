import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import CalendarPicker from '@/components/CalendarPicker';
import type { CalendarValue } from '@/components/CalendarPicker';
import toolStyles from '@/styles/tool-common.module.scss';
import styles from './dailyFortune.module.scss';

// ── 星座数据 ──
const ZODIACS = [
  { idx: 0, name: '白羊座', en: 'Aries', dates: [3, 21, 4, 19], symbol: '♈' },
  { idx: 1, name: '金牛座', en: 'Taurus', dates: [4, 20, 5, 20], symbol: '♉' },
  { idx: 2, name: '双子座', en: 'Gemini', dates: [5, 21, 6, 21], symbol: '♊' },
  { idx: 3, name: '巨蟹座', en: 'Cancer', dates: [6, 22, 7, 22], symbol: '♋' },
  { idx: 4, name: '狮子座', en: 'Leo', dates: [7, 23, 8, 22], symbol: '♌' },
  { idx: 5, name: '处女座', en: 'Virgo', dates: [8, 23, 9, 22], symbol: '♍' },
  { idx: 6, name: '天秤座', en: 'Libra', dates: [9, 23, 10, 23], symbol: '♎' },
  { idx: 7, name: '天蝎座', en: 'Scorpio', dates: [10, 24, 11, 22], symbol: '♏' },
  { idx: 8, name: '射手座', en: 'Sagittarius', dates: [11, 23, 12, 21], symbol: '♐' },
  { idx: 9, name: '摩羯座', en: 'Capricorn', dates: [12, 22, 1, 19], symbol: '♑' },
  { idx: 10, name: '水瓶座', en: 'Aquarius', dates: [1, 20, 2, 18], symbol: '♒' },
  { idx: 11, name: '双鱼座', en: 'Pisces', dates: [2, 19, 3, 20], symbol: '♓' },
];

/** 根据月日推算星座 */
function getZodiacByMD(month: number, day: number): number {
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return 0;
  if (md >= 420 && md <= 520) return 1;
  if (md >= 521 && md <= 621) return 2;
  if (md >= 622 && md <= 722) return 3;
  if (md >= 723 && md <= 822) return 4;
  if (md >= 823 && md <= 922) return 5;
  if (md >= 923 && md <= 1023) return 6;
  if (md >= 1024 && md <= 1122) return 7;
  if (md >= 1123 && md <= 1221) return 8;
  if (md >= 1222 || md <= 119) return 9;
  if (md >= 120 && md <= 218) return 10;
  return 11;
}

/** 获取星座当年的第一天（CalendarValue） */
function getZodiacFirstDay(idx: number, year: number): CalendarValue {
  const z = ZODIACS[idx];
  let m = z.dates[0];
  let d = z.dates[1];
  // 摩羯座跨年：12/22 ~ 1/19，取当年的第一段
  if (idx === 9) {
    // 摩羯座第一天是 12 月 22 日
    return { year, month: 12, day: 22 };
  }
  // 水瓶、双鱼取当年（月份大于等于当前年）
  return { year, month: m, day: d };
}

// ── 运势类型 ──
const LUCK_TYPES: { key: string; label: string; emoji: string }[] = [
  { key: 'overall', label: '综合运势', emoji: '⭐' },
  { key: 'love', label: '爱情运势', emoji: '💕' },
  { key: 'career', label: '事业运势', emoji: '💼' },
  { key: 'wealth', label: '财运运势', emoji: '💰' },
  { key: 'health', label: '健康运势', emoji: '🏃' },
];

function generateHoroscope(name: string, queryDate: Date): { score: number; text: string }[] {
  let hash = 0;
  const seedStr = `${name}-${queryDate.getFullYear()}${queryDate.getMonth() + 1}${queryDate.getDate()}`;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }

  const nextRand = () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };

  const DESCRIPTIONS: Record<string, string[]> = {
    overall: [
      '今天精力充沛，适合推进重要项目，把握机会！',
      '整体运势平稳，适合规划未来，不宜冒进。',
      '可能会有小波折，保持冷静应对即可。',
      '运势不错，心情愉悦，适合社交活动。',
      '今天灵感迸发，适合创意类工作。',
      '能量满满的一天，勇往直前吧！',
    ],
    love: [
      '单身者有机会遇见心仪对象，主动一点！',
      '有伴侣者感情甜蜜，适合约会。',
      '感情上顺其自然就好，不要强求。',
      '今天魅力值飙升，容易吸引他人目光。',
      '沟通是今天的主题，多倾听对方的心声。',
      '爱情运势平稳，享受当下的美好时光。',
    ],
    career: [
      '工作效率高，适合完成积压任务。',
      '同事关系融洽，合作顺利。',
      '可能会遇到挑战，但也是成长的机会。',
      '有贵人相助，事业上会有小突破。',
      '适合学习新技能，为未来铺路。',
      '今天宜低调行事，稳扎稳打。',
    ],
    wealth: [
      '财运不错，可能有意外之财。',
      '适合理财规划，但不宜冲动消费。',
      '投资需谨慎，不要轻信他人建议。',
      '今天消费欲较强，注意控制预算。',
      '财运平稳，收支平衡。',
      '适合开拓新的收入渠道。',
    ],
    health: [
      '身体状况良好，适合运动锻炼。',
      '注意作息规律，避免熬夜。',
      '精神状态不错，保持积极心态。',
      '今天适合户外活动，呼吸新鲜空气。',
      '注意饮食健康，少吃油腻食物。',
      '整体状态在线，继续保持好习惯。',
    ],
  };

  return LUCK_TYPES.map((lt) => {
    const score = Math.floor(nextRand() * 31) + 70;
    const texts = DESCRIPTIONS[lt.key];
    const text = texts[Math.floor(nextRand() * texts.length)];
    return { score, text };
  });
}

function getLuckyInfo(name: string, queryDate: Date): { color: string; number: number; direction: string } {
  let hash = 0;
  const seedStr = `${name}-${queryDate.getFullYear()}${queryDate.getMonth() + 1}${queryDate.getDate()}`;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash) + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const nextRand = () => {
    hash = (hash * 1103515245 + 12345) & 0x7fffffff;
    return hash / 0x7fffffff;
  };

  const colors = ['红色', '蓝色', '金色', '绿色', '紫色', '白色', '粉色', '橙色'];
  const directions = ['东方', '南方', '西方', '北方', '东南', '西南', '东北', '西北'];

  return {
    color: colors[Math.floor(nextRand() * colors.length)],
    number: Math.floor(nextRand() * 30) + 1,
    direction: directions[Math.floor(nextRand() * directions.length)],
  };
}

const TODAY = new Date();
const defaultDate: CalendarValue = {
  year: TODAY.getFullYear(),
  month: TODAY.getMonth() + 1,
  day: TODAY.getDate(),
};

const DailyFortunePage: React.FC = () => {
  const [queryDate, setQueryDate] = useState<CalendarValue>(defaultDate);

  // 根据查询日期推算星座索引
  const dateZodiacIdx = getZodiacByMD(queryDate.month, queryDate.day);

  // 当前选中的星座索引（默认跟随日期）
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const activeIdx = selectedIdx ?? dateZodiacIdx;
  const activeZodiac = ZODIACS[activeIdx];

  // 查询日期 Date 对象
  const queryDateObj = useMemo(
    () => new Date(queryDate.year, queryDate.month - 1, queryDate.day),
    [queryDate]
  );

  const horoscope = useMemo(() => {
    return generateHoroscope(activeZodiac.name, queryDateObj);
  }, [activeZodiac, queryDateObj]);

  const luckyInfo = useMemo(() => {
    return getLuckyInfo(activeZodiac.name, queryDateObj);
  }, [activeZodiac, queryDateObj]);

  // 选星座 → 跳到星座当年第一天
  const handleSelectZodiac = useCallback((idx: number) => {
    setSelectedIdx(idx);
    const firstDay = getZodiacFirstDay(idx, queryDate.year);
    setQueryDate(firstDay);
  }, [queryDate.year]);

  // 选日期 → 自动切换到对应星座
  const handleDateChange = useCallback((v: CalendarValue) => {
    setQueryDate(v);
    // 手动选了日期后清除手动选择的星座，回退到日期推算
    setSelectedIdx(null);
  }, []);

  return (
    <ScrollView scrollY>
      {/* 查询日期 */}
      <CalendarPicker
        title='选择日期'
        value={queryDate}
        onChange={handleDateChange}
      />

      {/* 星座选择条 */}
      <View className={styles.zodiacStrip}>
        {ZODIACS.map((z) => (
          <View
            key={z.idx}
            className={`${styles.zodiacTag} ${activeIdx === z.idx ? styles.zodiacTagActive : ''}`}
            onClick={() => handleSelectZodiac(z.idx)}
          >
            <Text className={styles.zodiacSymbol}>{z.symbol}</Text>
            <Text className={styles.zodiacName}>{z.name}</Text>
          </View>
        ))}
      </View>

      {/* 当前星座信息 */}
      <View className={styles.zodiacHeader}>
        <Text className={styles.zodiacBigSymbol}>{activeZodiac.symbol}</Text>
        <Text className={styles.zodiacBigName}>{activeZodiac.name}</Text>
        <Text className={styles.zodiacEn}>{activeZodiac.en}</Text>
        <Text className={styles.zodiacDate}>
          {activeZodiac.dates[0]}月{activeZodiac.dates[1]}日 - {activeZodiac.dates[2]}月{activeZodiac.dates[3]}日
        </Text>
      </View>

      {/* 运势内容 */}
      <View style={{ marginTop: '16rpx' }}>
        <Text className={styles.sectionTitle}>
          {queryDate.year}年{queryDate.month}月{queryDate.day}日 运势
        </Text>

        {horoscope.map((h, i) => (
          <View key={i} className={styles.luckCard}>
            <View className={styles.luckHeader}>
              <Text className={styles.luckEmoji}>{LUCK_TYPES[i].emoji}</Text>
              <Text className={styles.luckLabel}>{LUCK_TYPES[i].label}</Text>
              <View className={styles.luckScoreWrap}>
                <View className={styles.luckScoreBg}>
                  <View className={styles.luckScoreFill} style={{ width: `${h.score}%` }} />
                </View>
                <Text className={styles.luckScoreText}>{h.score}%</Text>
              </View>
            </View>
            <Text className={styles.luckDesc}>{h.text}</Text>
          </View>
        ))}
      </View>

      {/* 幸运信息 */}
      <View className={styles.luckyInfoWrap}>
        <View className={styles.luckyInfoItem}>
          <Text className={styles.luckyInfoLabel}>🟣 幸运色</Text>
          <Text className={styles.luckyInfoValue}>{luckyInfo.color}</Text>
        </View>
        <View className={styles.luckyInfoItem}>
          <Text className={styles.luckyInfoLabel}>🔢 幸运数字</Text>
          <Text className={styles.luckyInfoValue}>{luckyInfo.number}</Text>
        </View>
        <View className={styles.luckyInfoItem}>
          <Text className={styles.luckyInfoLabel}>🧭 幸运方向</Text>
          <Text className={styles.luckyInfoValue}>{luckyInfo.direction}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DailyFortunePage;
