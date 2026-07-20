import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useAuthStore, useFavoritesStore } from './stores';
// 全局样式
import './app.scss';

function App(props) {
  const login = useAuthStore((s) => s.login);
  const ready = useAuthStore((s) => s.ready);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const token = useAuthStore((s) => s.token);

  // 启动时微信自动登录
  useEffect(() => {
    login();
  }, [login]);

  // 登录完成后加载收藏
  useEffect(() => {
    if (ready) {
      loadFavorites();
    }
  }, [ready, loadFavorites]);

  useEffect(() => {
    // 收藏数据变化时重新加载（比如取消收藏后的同步）
    if (token) {
      loadFavorites();
    }
  }, [token, loadFavorites]);

  useDidShow(() => {});

  useDidHide(() => {});

  return props.children;
}

export default App;
