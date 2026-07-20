import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useFavoritesStore } from '@/stores';
import { toolById } from '@/data/tools';

const FavoritesPage: React.FC = () => {
  const apiFavorites = useFavoritesStore((s) => s.favorites);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadFavorites().finally(() => setLoading(false));
  }, []);

  const displayItems = apiFavorites.map((f) => {
    const meta = toolById(f.toolId);
    return {
      toolId: f.toolId,
      name: meta?.name ?? f.toolId,
      description: meta?.description ?? '',
    };
  });

  const handleOpenTool = (toolId: string) => {
    Taro.navigateTo({ url: `/pages/tool/index?toolId=${toolId}` });
  };

  const handleRemoveFavorite = async (toolId: string) => {
    await useFavoritesStore.getState().toggleFavorite(toolId, '', '', '');
    Taro.showToast({ title: '已取消收藏', icon: 'none' });
  };

  if (loading) {
    return (
      <View className={styles.page}>
        <View className={styles.placeholder}>
          <Text className={styles.title}>加载中...</Text>
        </View>
      </View>
    );
  }

  if (displayItems.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.placeholder}>
          <Text className={styles.icon}>⭐</Text>
          <Text className={styles.title}>还没有收藏</Text>
          <Text className={styles.desc}>在主页点击工具卡片的星标即可收藏</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.content}>
        <View className={styles.grid}>
          {displayItems.map((item) => (
            <View
              key={item.toolId}
              className={styles.toolCard}
              onClick={() => handleOpenTool(item.toolId)}
            >
              <View className={styles.toolInfo}>
                <Text className={styles.toolName}>{item.name}</Text>
                <Text className={styles.toolDesc}>{item.description}</Text>
              </View>
              <Text
                className={styles.removeBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(item.toolId);
                }}
              >
                ✕
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default FavoritesPage;
