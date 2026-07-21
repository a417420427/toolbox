import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useFavoritesStore } from './stores';
// 全局样式
import './app.scss';

function App(props) {
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);

  // 启动时加载收藏
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useDidShow(() => {});

  useDidHide(() => {});

  return props.children;
}

export default App;
