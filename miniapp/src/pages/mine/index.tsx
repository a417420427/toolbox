import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';
import { useFavoritesStore } from '@/stores';

const MinePage: React.FC = () => {
  const handleClearFavorites = async () => {
    Taro.showModal({
      title: '确认清除',
      content: '确定要清除所有收藏数据吗？\n（此操作不可撤销）',
      success: async (res) => {
        if (res.confirm) {
          try {
            const store = useFavoritesStore.getState();
            for (const f of store.favorites) {
              store.toggleFavorite(f.toolId);
            }
            Taro.showToast({ title: '已清除', icon: 'success' });
          } catch {
            Taro.showToast({ title: '清除失败', icon: 'error' });
          }
        }
      },
    });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于工具箱',
      content: '工具箱 v1.0.0\n\n一个集成了日常工具、格式化转换、编码加密、开发者工具的微信小程序。',
      showCancel: false,
    });
  };

  return (
    <ScrollView scrollY className={styles.page}>
      <View className={styles.profileSection}>
        <View className={styles.avatar}>
          <Text className={styles.avatarText}>🧰</Text>
        </View>
        <Text className={styles.appName}>工具箱</Text>
        <Text className={styles.version}>v1.0.0</Text>
      </View>

      <View className={styles.menuSection}>
        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={() => {
            Taro.switchTab({ url: '/pages/favorites/index' });
          }}>
            <Text className={styles.menuIcon}>⭐</Text>
            <Text className={styles.menuLabel}>我的收藏</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => {
            Taro.showToast({ title: `共 ${useFavoritesStore.getState().favorites.length} 个收藏`, icon: 'none' });
          }}>
            <Text className={styles.menuIcon}>🧩</Text>
            <Text className={styles.menuLabel}>收藏统计</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>

        <View className={styles.menuGroup}>
          <View className={styles.menuItem} onClick={handleClearFavorites}>
            <Text className={styles.menuIcon}>🗑️</Text>
            <Text className={styles.menuLabel}>清除收藏数据</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={handleAbout}>
            <Text className={styles.menuIcon}>ℹ️</Text>
            <Text className={styles.menuLabel}>关于</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
        </View>
      </View>

      <View className={styles.footer}>
        <Text className={styles.footerText}>工具箱 · 本地收藏 · 无需登录</Text>
      </View>
    </ScrollView>
  );
};

export default MinePage;
