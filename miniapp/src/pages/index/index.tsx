import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro, { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import { categories, toolsByCategory } from '@/data/tools';
import type { ToolCategory } from '@/types/tool';
import Icon from '@/components/Icon';

const IndexPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState<Set<ToolCategory>>(new Set());
  const [keyword, setKeyword] = useState('');

  const filteredCategories = useMemo(() => {
    const kw = keyword.trim().toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        tools: kw
          ? toolsByCategory(cat.key).filter(
              (t) =>
                t.name.toLowerCase().includes(kw) ||
                t.description.toLowerCase().includes(kw) ||
                t.id.toLowerCase().includes(kw)
            )
          : toolsByCategory(cat.key),
      }))
      .filter((c) => c.tools.length > 0);
  }, [keyword]);

  const toggleCollapse = (cat: ToolCategory) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const handleToolTap = (toolId: string) => {
    Taro.navigateTo({ url: `/pages/tool/index?toolId=${toolId}` });
  };

  // 分享到好友
  useShareAppMessage(
    useCallback(() => ({
      title: '个人工具箱 - 实用工具合集',
      path: '/pages/index/index',
    }), [])
  );

  // 分享到朋友圈
  useShareTimeline(
    useCallback(() => ({
      title: '个人工具箱',
      query: '',
    }), [])
  );

  const totalCount = useMemo(
    () => categories.reduce((sum, c) => sum + toolsByCategory(c.key).length, 0),
    []
  );

  return (
    <ScrollView scrollY className={styles.page} enhanced showScrollbar={false}>
      {/* 顶部搜索栏 */}
      <View className={styles.header}>
        <View className={styles.headerTitleRow}>
          <Text className={styles.headerTitle}>工具箱</Text>
          <Text className={styles.headerCount}>共 {totalCount} 个工具</Text>
        </View>
        <View className={styles.searchWrap}>
          <View className={styles.searchIcon}>
            <Icon name="search" size={28} color="#94a3b8" strokeWidth={2} />
          </View>
          <Input
            className={styles.searchInput}
            type="text"
            placeholder="搜索工具名称或描述"
            placeholderClass={styles.searchPlaceholder}
            value={keyword}
            onInput={(e) => setKeyword(e.detail.value)}
          />
          {keyword && (
            <Text className={styles.searchClear} onClick={() => setKeyword('')}>
              ✕
            </Text>
          )}
        </View>
      </View>

      {/* 分类工具列表 */}
      <View className={styles.content}>
        {filteredCategories.length === 0 && (
          <View className={styles.empty}>
            <Icon name="search" size={64} color="#cbd5e1" strokeWidth={1.5} />
            <Text className={styles.emptyText}>未找到匹配的工具</Text>
          </View>
        )}
        {filteredCategories.map((cat) => {
          const isCollapsed = collapsed.has(cat.key);
          return (
            <View key={cat.key} className={styles.section}>
              <View
                className={styles.sectionHeader}
                onClick={() => toggleCollapse(cat.key)}
              >
                <View className={styles.sectionIcon}>
                  <Icon name={cat.icon} size={32} color={cat.color} strokeWidth={2} />
                </View>
                <Text className={styles.sectionTitle}>{cat.label}</Text>
                <Text className={styles.sectionCount}>{cat.tools.length}</Text>
                <Text
                  className={classnames(
                    styles.sectionArrow,
                    isCollapsed && styles.sectionArrowCollapsed
                  )}
                >
                  ▾
                </Text>
              </View>
              {!isCollapsed && (
                <View className={styles.grid}>
                  {cat.tools.map((tool) => (
                    <View
                      key={tool.id}
                      className={styles.toolCard}
                      onClick={() => handleToolTap(tool.id)}
                    >
                      <View className={styles.toolIconWrap}>
                        <Icon name={tool.icon} size={40} color="#3b82f6" strokeWidth={1.8} />
                      </View>
                      <Text className={styles.toolName}>{tool.name}</Text>
                      <Text className={styles.toolDesc}>{tool.description}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View className={styles.footer}>
        <Text className={styles.footerText}>工具箱 · 更多工具持续上线</Text>
      </View>
    </ScrollView>
  );
};

export default IndexPage;
