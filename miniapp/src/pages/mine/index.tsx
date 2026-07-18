import React from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import styles from './index.module.scss';

const MinePage: React.FC = () => {
  const handleClearFavorites = () => {
    Taro.showModal({
      title: '确认清除',
      content: '确定要清除所有收藏数据吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.setStorageSync('favorites', JSON.stringify([]));
          Taro.showToast({ title: '已清除', icon: 'success' });
        }
      },
    });
  };

  const handleAbout = () => {
    Taro.showModal({
      title: '关于工具箱',
      content: '工具箱 v1.0.0\n\n一个集成了日常工具、格式化转换、编码加密、开发者工具的微信小程序。\n\n数据使用本地存储，不会上传任何个人信息。',
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
            Taro.setTabBarItem({
              index: 1,
              text: '收藏',
              iconPath: 'assets/tabbar/favorites.png',
              selectedIconPath: 'assets/tabbar/favorites-selected.png',
            });
            Taro.switchTab({ url: '/pages/favorites/index' });
          }}>
            <Text className={styles.menuIcon}>⭐</Text>
            <Text className={styles.menuLabel}>我的收藏</Text>
            <Text className={styles.menuArrow}>›</Text>
          </View>
          <View className={styles.menuItem} onClick={() => {
            // 查看所有工具统计
            Taro.showToast({ title: '共 45 个工具', icon: 'none' });
          }}>
            <Text className={styles.menuIcon}>🧩</Text>
            <Text className={styles.menuLabel}>工具统计</Text>
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
        <Text className={styles.footerText}>工具箱 · 本地数据 · 无需登录</Text>
      </View>
    </ScrollView>
  );
};

export default MinePage;
