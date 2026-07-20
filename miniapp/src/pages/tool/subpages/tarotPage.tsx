import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import toolStyles from '@/styles/tool-common.module.scss';
import styles from './tarot.module.scss';
import { TarotStorage } from '@/utils/storage';

// ── 塔罗牌数据 ──
const TAROT_CARDS = [
  { name: '愚者', en: 'The Fool', meaningUpright: '新的开始、冒险、天真、无限可能', meaningReversed: '鲁莽、冒险、不成熟、犹豫不决', number: 0 },
  { name: '魔术师', en: 'The Magician', meaningUpright: '创造力、技能、自信、资源丰富', meaningReversed: '欺骗、浪费天赋、操纵、缺乏计划', number: 1 },
  { name: '女祭司', en: 'The High Priestess', meaningUpright: '直觉、内在智慧、神秘、潜意识', meaningReversed: '秘密、压抑直觉、表面现象、退缩', number: 2 },
  { name: '女皇', en: 'The Empress', meaningUpright: '丰收、滋养、美丽、母性', meaningReversed: '依赖、创造受阻、空虚、疏忽', number: 3 },
  { name: '皇帝', en: 'The Emperor', meaningUpright: '权威、稳定、结构、父亲形象', meaningReversed: '专制、 rigidity、控制欲、缺乏纪律', number: 4 },
  { name: '教皇', en: 'The Hierophant', meaningUpright: '传统、信仰、导师、精神指引', meaningReversed: '叛逆、打破传统、个人信念、固执', number: 5 },
  { name: '恋人', en: 'The Lovers', meaningUpright: '爱情、和谐、选择、价值观统一', meaningReversed: '不和谐、分裂、错误选择、价值观冲突', number: 6 },
  { name: '战车', en: 'The Chariot', meaningUpright: '胜利、决心、意志力、掌控', meaningReversed: '失控、缺乏方向、冲突、意志薄弱', number: 7 },
  { name: '力量', en: 'Strength', meaningUpright: '勇气、内心力量、耐心、温柔', meaningReversed: '软弱、自我怀疑、缺乏自信、退缩', number: 8 },
  { name: '隐士', en: 'The Hermit', meaningUpright: '内省、孤独、寻求真理、导师', meaningReversed: '孤立、孤独、迷失方向、逃避', number: 9 },
  { name: '命运之轮', en: 'Wheel of Fortune', meaningUpright: '改变、循环、命运、新的阶段', meaningReversed: '厄运、不顺、抗拒改变、停滞', number: 10 },
  { name: '正义', en: 'Justice', meaningUpright: '公平、真相、因果关系、法律', meaningReversed: '不公、欺骗、逃避责任、偏颇', number: 11 },
  { name: '倒吊人', en: 'The Hanged Man', meaningUpright: '暂停、奉献、新视角、放下', meaningReversed: '拖延、抗拒、停滞、不愿牺牲', number: 12 },
  { name: '死神', en: 'Death', meaningUpright: '结束、转变、放手、新开始', meaningReversed: '抗拒改变、停滞、恐惧、重复模式', number: 13 },
  { name: '节制', en: 'Temperance', meaningUpright: '平衡、和谐、耐心、适度', meaningReversed: '失衡、急功近利、冲突、缺乏耐性', number: 14 },
  { name: '恶魔', en: 'The Devil', meaningUpright: '束缚、物质主义、上瘾、欲望', meaningReversed: '解脱、觉醒、放下执念、恢复自由', number: 15 },
  { name: '高塔', en: 'The Tower', meaningUpright: '突然改变、崩溃、觉醒、颠覆', meaningReversed: '避免灾难、延迟、抵抗改变、恐惧', number: 16 },
  { name: '星星', en: 'The Star', meaningUpright: '希望、灵感、宁静、治愈', meaningReversed: '绝望、失去信仰、失望、灵感枯竭', number: 17 },
  { name: '月亮', en: 'The Moon', meaningUpright: '幻觉、恐惧、潜意识、不确定性', meaningReversed: '释放恐惧、看清真相、接受未知', number: 18 },
  { name: '太阳', en: 'The Sun', meaningUpright: '成功、喜悦、活力、成就感', meaningReversed: '暂时的暗淡、过度乐观、小挫折', number: 19 },
  { name: '审判', en: 'Judgement', meaningUpright: '重生、觉醒、自我评估、召唤', meaningReversed: '自我怀疑、拒绝反省、错过机会', number: 20 },
  { name: '世界', en: 'The World', meaningUpright: '完成、成就、圆满、旅行', meaningReversed: '未完成、延迟、捷径、不完整', number: 21 },
];

// 每日占卜种子
function dailySeed(): number {
  const now = new Date();
  let hash = 0;
  const s = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface DrawResult {
  card: typeof TAROT_CARDS[0];
  reversed: boolean;
  todayKey: string;
}

const TarotPage: React.FC = () => {
  const [draw, setDraw] = useState<DrawResult | null>(null);
  const [flipping, setFlipping] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const todayKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }, []);

  // 初始化：从本地加载今日占卜记录，保留完整内容
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    const record = TarotStorage.getHistory().find(r => r.date === todayKey) || null;
    if (record) {
      const card = TAROT_CARDS.find(c => c.number === record.number) || null;
      if (card) {
        // 需要用 setTimeout 避免 setState in render
        setTimeout(() => {
          setDraw({ card, reversed: record.reversed, todayKey });
          setShowCard(true);
          setLoaded(true);
        }, 0);
      } else {
        setLoaded(true);
      }
    } else {
      setLoaded(true);
    }
  }

  const alreadyDrawn = !!draw && showCard;

  const drawCard = () => {
    if (showCard && draw) return;

    setFlipping(true);
    setShowCard(false);

    const seed = dailySeed();
    const idx = seed % TAROT_CARDS.length;
    const reversed = Math.floor(seed / TAROT_CARDS.length) % 2 === 1;

    // 延迟模拟翻牌动画
    setTimeout(() => {
      const card = TAROT_CARDS[idx];
      const meaning = reversed ? card.meaningReversed : card.meaningUpright;
      setDraw({ card, reversed, todayKey });
      setFlipping(false);
      setShowCard(true);
      TarotStorage.saveTodayDraw({
        date: todayKey,
        cardName: card.name,
        cardEn: card.en,
        number: card.number,
        reversed,
        meaning,
      });
    }, 1200);
  };

  return (
    <ScrollView scrollY>
      {/* 卡片区 */}
      <View className={styles.cardArea}>
        {(() => {
          if (showCard && draw) {
            return (
              <View className={`${styles.flipCard} ${styles.flipped}`}>
                <View className={styles.flipInner}>
                  <View className={styles.flipFront}>
                    <Text className={styles.flipPattern}>? ✦</Text>
                  </View>
                  <View className={styles.flipBack}>
                    <Text className={styles.tarotNumber}>{draw.reversed ? 'ᐯ' : draw.card.number}</Text>
                    <Text className={styles.tarotName}>{draw.card.name}</Text>
                    <Text className={styles.tarotEn}>{draw.card.en}</Text>
                    <Text className={styles.tarotPosition}>
                      {draw.reversed ? '🔻 逆位' : '🔺 正位'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          }
          if (flipping) {
            return (
              <View className={`${styles.flipCard} ${styles.flipping}`}>
                <View className={styles.flipInner}>
                  <View className={styles.flipFront}>
                    <Text className={styles.flipPattern}>? ✦</Text>
                  </View>
                  <View className={styles.flipBack}>
                    <Text className={styles.flipPattern}>✦ ?</Text>
                  </View>
                </View>
              </View>
            );
          }

          return (
            <View className={styles.placeCard}>
              <Text className={styles.placeIcon}>🃏</Text>
              <Text className={styles.placeText}>点击下方抽牌</Text>
            </View>
          );
        })()}
      </View>

      {/* 解读 */}
      {draw && showCard && (
        <View style={{ marginTop: '24rpx' }}>
          <View className={styles.readingCard}>
            <Text className={styles.readingTitle}>🔮 占卜解读</Text>
            <Text className={styles.readingLabel}>
              {draw.reversed ? '逆位含义' : '正位含义'}
            </Text>
            <Text className={styles.readingText}>
              {draw.reversed ? draw.card.meaningReversed : draw.card.meaningUpright}
            </Text>
          </View>

          <View className={styles.tipCard}>
            <Text style={{ fontSize: '22rpx', color: '#64748b', lineHeight: 1.6 }}>
              塔罗牌提供的是一种可能性指引，最终的选择权永远在你手中。
              保持开放的心态，相信自己的直觉。
            </Text>
          </View>
        </View>
      )}

      {/* 抽牌按钮 */}
      <View className={styles.drawBtnWrap}>
        {showCard && draw ? (
          <View className={styles.drawBtn} style={{ background: '#e2e8f0', color: '#94a3b8' }}>
            <Text>明天再来</Text>
          </View>
        ) : (
          <View className={styles.drawBtn} onClick={drawCard}>
            <Text>✨ 今日占卜</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default TarotPage;
