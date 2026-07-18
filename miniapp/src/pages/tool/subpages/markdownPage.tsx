import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import { MarkdownTool } from '@/utils/tools/markdownTool';
import toolStyles from '@/styles/tool-common.module.scss';

const sample = '# 标题\n\n这是一个 **Markdown** 预览工具。\n\n- 列表项 1\n- 列表项 2\n\n> 引用内容\n\n`行内代码`\n\n[链接](https://example.com)';

const MarkdownPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [html, setHtml] = useState('');
  const [showHtml, setShowHtml] = useState(false);

  const process = () => {
    setHtml(MarkdownTool.toHtml(input));
    setShowHtml(false);
  };

  const fillSample = () => setInput(sample);

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>Markdown 输入</Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder="输入 Markdown..."
          style="height:250rpx;font-family:monospace;font-size:24rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>预览</Button>
        <Button className={toolStyles.btnSecondary} onClick={fillSample}>填入示例</Button>
        {html && (
          <Button className={toolStyles.btnSecondary} onClick={() => setShowHtml(!showHtml)}>
            {showHtml ? '预览' : 'HTML'}
          </Button>
        )}
      </View>
      {html && !showHtml && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>渲染结果</Text>
          {/* Render HTML via dangerouslySetInnerHTML equivalent in Taro WebView or RichText */}
          <View
            className={toolStyles.resultBox}
            dangerouslySetInnerHTML={{ __html: html.match(/<body>(.*?)<\/body>/s)?.[1] || html }}
            style="overflow-x:auto"
          />
        </View>
      )}
      {html && showHtml && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>HTML 源码</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable className={toolStyles.monoText}>{html}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default MarkdownPage;
