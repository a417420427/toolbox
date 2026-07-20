import React, { useState, useMemo } from 'react';
import { View, Text, Picker, ScrollView } from '@tarojs/components';
import CalendarPicker from '@/components/CalendarPicker';
import type { CalendarValue } from '@/components/CalendarPicker';
import toolStyles from '@/styles/tool-common.module.scss';
import styles from './dailyFortune.module.scss';

// ── 星座数据 ──
const ZODIACS = [
  { name: '白羊座', en: 'Aries', dates: [3, 21, 4, 19], symbol: '♈' },
  { name: '金牛座', en: 'Taurus', dates: [4, 20, 5, 20], symbol: '♉' },
  { name: '双子座', en: 'Gemini', dates: [5, 21, 6, 21], symbol: '♊' },
  { name: '巨蟹座', en: 'Cancer', dates: [6, 22, 7, 22], symbol: '♋' },
  { name: '狮子座', en: 'Leo', dates: [7, 23, 8, 22], symbol: '♌' },
  { name: '处女座', en: 'Virgo', dates: [8, 23, 9, 22], symbol: '♍' },
  { name: '天秤座', en: 'Libra', dates: [9, 23, 10, 23], symbol: '♎' },
  { name: '天蝎座', en: 'Scorpio', dates: [10, 24, 11, 22], symbol: '♏' },
  { name: '射手座', en: 'Sagittarius', dates: [11, 23, 12, 21], symbol: '♐' },
  { name: '摩羯座', en: 'Capricorn', dates: [12, 22, 1, 19], symbol: '♑' },
  { name: '水瓶座', en: 'Aquarius', dates: [1, 20, 2, 18], symbol: '♒' },
  { name: '双鱼座', en: 'Pisces', dates: [2, 19, 3, 20], symbol: '♓' },
];

function getZodiac(month: number, day: number): { name: string; en: string; symbol: string } | null {
  const md = month * 100 + day;
  if (md >= 321 && md <= 419) return ZODIACS[0];
  if (md >= 420 && md <= 520) return ZODIACS[1];
  if (md >= 521 && md <= 621) return ZODIACS[2];
  if (md >= 622 && md <= 722) return ZODIACS[3];
  if (md >= 723 && md <= 822) return ZODIACS[4];
  if (md >= 823 && md <= 922) return ZODIACS[5];
  if (md >= 923 && md <= 1023) return ZODIACS[6];
  if (md >= 1024 && md <= 1122) return ZODIACS[7];
  if (md >= 1123 && md <= 1221) return ZODIACS[8];
  if (md >= 1222 || md <= 119) return ZODIACS[9];
  if (md >= 120 && md <= 218) return ZODIACS[10];
  if (md >= 219 && md <= 320) return ZODIACS[11];
  return null;
}

// ── 运势模拟 ──
const LUCK_TYPES: { key: string; label: string; emoji: string }[] = [
  { key: 'overall', label: '综合运势', emoji: '⭐' },
  { key: 'love', label: '爱情运势', emoji: '💕' },
  { key: 'career', label: '事业运势', emoji: '💼' },
  { key: 'wealth', label: '财运运势', emoji: '💰' },
  { key: 'health', label: '健康运势', emoji: '🏃' },
];

function generateHoroscope(name: string): { score: number; text: string }[] {
  // 用名字哈希做种子，保证同星座同天结果一致
  let hash = 0;
  const today = new Date();
  const seedStr = `${name}-${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
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
    const score = Math.floor(nextRand() * 31) + 70; // 70~100
    const texts = DESCRIPTIONS[lt.key];
    const text = texts[Math.floor(nextRand() * texts.length)];
    return { score, text };
  });
}

// ── 幸运信息 ──
function getLuckyInfo(name: string): { color: string; number: number; direction: string } {
  let hash = 0;
  const today = new Date();
  const seedStr = `${name}-${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;
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
const defaultBirth: CalendarValue = {
  year: TODAY.getFullYear() - 25,
  month: TODAY.getMonth() + 1,
  day: TODAY.getDate(),
};

const DailyFortunePage: React.FC = () => {
  const [birth, setBirth] = useState<CalendarValue>(defaultBirth);
  const [selectedZodiac, setSelectedZodiac] = useState<number | null>(null);

  // 根据生日推算星座
  const zodiacByBirth = useMemo(() => getZodiac(birth.month, birth.day), [birth]);

  // 手动选择或自动推算
  const activeZodiac = selectedZodiac !== null
    ? ZODIACS[selectedZodiac]
    : zodiacByBirth;

  const horoscope = useMemo(() => {
    if (!activeZodiac) return null;
    return generateHoroscope(activeZodiac.name);
  }, [activeZodiac]);

  const luckyInfo = useMemo(() => {
    if (!activeZodiac) return null;
    return getLuckyInfo(activeZodiac.name);
  }, [activeZodiac]);

  return (
    <ScrollView scrollY>
      {/* 生日选择 */}
      <CalendarPicker
        title='出生日期（自动推算星座）'
        value={birth}
        onChange={setBirth}
      />

      {/* 星座选择条 */}
      <View className={styles.zodiacStrip}>
        {ZODIACS.map((z, i) => (
          <View
            key={i}
            className={`${styles.zodiacTag} ${selectedZodiac === i || (selectedZodiac === null && zodiacByBirth?.name === z.name) ? styles.zodiacTagActive : ''}`}
            onClick={() => setSelectedZodiac(i)}
          >
            <Text className={styles.zodiacSymbol}>{z.symbol}</Text>
            <Text className={styles.zodiacName}>{z.name}</Text>
          </View>
        ))}
      </View>

      {/* 当前星座信息 */}
      {activeZodiac && (
        <View className={styles.zodiacHeader}>
          <Text className={styles.zodiacBigSymbol}>{activeZodiac.symbol}</Text>
          <Text className={styles.zodiacBigName}>{activeZodiac.name}</Text>
          <Text className={styles.zodiacEn}>{activeZodiac.en}</Text>
          <Text className={styles.zodiacDate}>
            {activeZodiac.dates[0]}月{activeZodiac.dates[1]}日 - {activeZodiac.dates[2]}月{activeZodiac.dates[3]}日
          </Text>
        </View>
      )}

      {/* 运势内容 */}
      {horoscope && (
        <View style={{ marginTop: '16rpx' }}>
          <Text className={styles.sectionTitle}>
            {TODAY.getFullYear()}年{TODAY.getMonth() + 1}月{TODAY.getDate()}日 运势
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
      )}

      {/* 幸运信息 */}
      {luckyInfo && (
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
      )}
    </ScrollView>
  );
};

export default DailyFortunePage;
