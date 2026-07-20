import { useCallback, useMemo } from 'react';
import { useShareAppMessage, useShareTimeline } from '@tarojs/taro';
import type { ShareAppMessageReturn } from '@tarojs/taro';
import { toolById } from '@/data/tools';

/**
 * 为工具页面注册分享功能
 * 自动根据当前工具生成分享标题和路径
 */
export function useToolShare(toolId: string): void {
  const tool = useMemo(() => toolById(toolId), [toolId]);

  // 分享给朋友
  useShareAppMessage(
    useCallback((): ShareAppMessageReturn => {
      const path = toolId ? `/pages/tool/index?toolId=${toolId}` : '/pages/index/index';
      return {
        title: tool?.name
          ? `🔧 ${tool.name} - 个人工具箱`
          : '个人工具箱 - 实用工具合集',
        path,
        // 使用默认截图作为分享图
      };
    }, [toolId, tool?.name]),
  );

  // 分享到朋友圈
  useShareTimeline(
    useCallback(() => {
      const query = toolId ? `toolId=${toolId}` : '';
      return {
        title: tool?.name
          ? `🔧 ${tool.name} - 个人工具箱`
          : '个人工具箱',
        query,
      };
    }, [toolId, tool?.name]),
  );

}
