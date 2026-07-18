import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

interface FavoriteItem {
  toolId: string;
  name: string;
  description: string;
  icon: string;
  folder: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 尝试从本地存储加载收藏
    try {
      const stored = Taro.getStorageSync('favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch {}
  }, []);

  const handleOpenTool = (toolId: string) => {
    Taro.navigateTo({ url: `/pages/tool/index?toolId=${toolId}` });
  };

  const handleRemoveFavorite = (toolId: string) => {
    const updated = favorites.filter(f => f.toolId !== toolId);
    setFavorites(updated);
    Taro.setStorageSync('favorites', JSON.stringify(updated));
  };

  // 按文件夹分组
  const grouped = favorites.reduce<Record<string, FavoriteItem[]>>((acc, f) => {
    const folder = f.folder || '未分类';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(f);
    return acc;
  }, {});

  if (!isLoggedIn && favorites.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.placeholder}>
          <Text className={styles.icon}>⭐</Text>
          <Text className={styles.title}>我的收藏</Text>
          <Text className={styles.desc}>收藏你常用的工具，方便快速打开</Text>
          <Text className={styles.hint}>在工具详情页点击收藏按钮即可收藏</Text>
        </View>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View className={styles.page}>
        <View className={styles.placeholder}>
          <Text className={styles.icon}>⭐</Text>
          <Text className={styles.title}>还没有收藏</Text>
          <Text className={styles.desc}>在工具详情页点击收藏按钮即可收藏</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.content}>
        {Object.entries(grouped).map(([folder, items]) => (
          <View key={folder} className={styles.folderSection}>
            <Text className={styles.folderTitle}>{folder}</Text>
            <View className={styles.grid}>
              {items.map(item => (
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
        ))}
      </View>
    </ScrollView>
  );
};

export default FavoritesPage;
