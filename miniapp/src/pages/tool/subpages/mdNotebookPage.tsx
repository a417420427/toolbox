import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, Textarea, Button, ScrollView, Swiper, SwiperItem, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { MdNotebookTool, NotebookEntry } from '@/utils/tools/mdNotebookTool';
import { MarkdownTool } from '@/utils/tools/markdownTool';
import toolStyles from '@/styles/tool-common.module.scss';

const MdNotebookPage: React.FC = () => {
  const [entries, setEntries] = useState<NotebookEntry[]>([]);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState('');
  const [showList, setShowList] = useState(true);

  const loadEntries = useCallback(() => {
    setEntries(MdNotebookTool.getAll());
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const currentEntry = useMemo(() => {
    if (!currentId) return null;
    return entries.find(e => e.id === currentId) || null;
  }, [currentId, entries]);

  const filteredEntries = useMemo(() => {
    if (!search.trim()) return entries;
    const q = search.toLowerCase();
    return entries.filter(e =>
      e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q)
    );
  }, [entries, search]);

  const sortedEntries = useMemo(() => {
    return [...filteredEntries].sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [filteredEntries]);

  const selectEntry = (entry: NotebookEntry) => {
    setCurrentId(entry.id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setPreview(false);
    setShowList(false);
  };

  const createNew = () => {
    const entry = MdNotebookTool.create('', '');
    setCurrentId(entry.id);
    setEditTitle(entry.title);
    setEditContent(entry.content);
    setPreview(false);
    setShowList(false);
    loadEntries();
  };

  const saveCurrent = () => {
    if (!currentId) return;
    MdNotebookTool.update(currentId, { title: editTitle, content: editContent });
    loadEntries();
    Taro.showToast({ title: '已保存', icon: 'success' });
  };

  const deleteCurrent = () => {
    if (!currentId) return;
    Taro.showModal({
      title: '确认删除',
      content: '删除后不可恢复',
      success: (r) => {
        if (r.confirm) {
          MdNotebookTool.delete(currentId);
          setCurrentId(null);
          setEditTitle('');
          setEditContent('');
          setShowList(true);
          loadEntries();
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      },
    });
  };

  const togglePin = () => {
    if (!currentId) return;
    MdNotebookTool.togglePin(currentId);
    loadEntries();
  };

  const htmlPreview = useMemo(() => {
    if (!editContent) return '';
    return MarkdownTool.toHtml(editContent);
  }, [editContent]);

  const backToList = () => {
    saveCurrent();
    setShowList(true);
  };

  if (showList) {
    return (
      <View>
        {/* 搜索 */}
        <View className={toolStyles.section}>
          <Input
            className={toolStyles.singleInput}
            placeholder="搜索笔记..."
            value={search}
            onInput={e => setSearch(e.detail.value)}
          />
        </View>

        {/* 新建按钮 */}
        <View className={toolStyles.actionRow}>
          <Button className={toolStyles.btnPrimary} onClick={createNew}>✏️ 新建笔记</Button>
        </View>

        {/* 笔记列表 */}
        {sortedEntries.length === 0 && (
          <View style={{ textAlign: 'center', padding: '60rpx 0' }}>
            <Text style={{ fontSize: '28rpx', color: '#9ca3af' }}>
              {search ? '没有匹配的笔记' : '还没有笔记，点击上方按钮创建'}
            </Text>
          </View>
        )}

        {sortedEntries.map((entry) => (
          <View
            key={entry.id}
            className={toolStyles.card}
            onClick={() => selectEntry(entry)}
            style={{
              borderLeft: entry.pinned ? '4rpx solid #f59e0b' : '4rpx solid transparent',
            }}
          >
            <View style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{
                fontSize: '28rpx',
                fontWeight: 600,
                color: '#1a1a1a',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {entry.pinned ? '📌 ' : ''}{entry.title || '未命名笔记'}
              </Text>
              <Text style={{ fontSize: '20rpx', color: '#9ca3af', flexShrink: 0, marginLeft: '8rpx' }}>
                {MdNotebookTool.formatTime(entry.updatedAt)}
              </Text>
            </View>
            <Text style={{
              fontSize: '22rpx',
              color: '#6b7280',
              marginTop: '6rpx',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '100%',
            }}>
              {entry.content.substring(0, 100) || '空笔记'}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  // 编辑模式
  return (
    <View>
      {/* 标题输入 */}
      <View className={toolStyles.section}>
        <Input
          className={toolStyles.singleInput}
          placeholder="笔记标题"
          value={editTitle}
          onInput={e => setEditTitle(e.detail.value)}
          style={{ fontSize: '28rpx', fontWeight: 600 }}
        />
      </View>

      {/* 内容编辑/预览切换 */}
      {!preview ? (
        <View className={toolStyles.section}>
          <Textarea
            className={toolStyles.textarea}
            placeholder="输入 Markdown 内容..."
            value={editContent}
            onInput={e => setEditContent(e.detail.value)}
            style={{ height: '400rpx', fontFamily: 'monospace', fontSize: '24rpx' }}
          />
        </View>
      ) : (
        <View className={toolStyles.section}>
          <View className={toolStyles.resultBox} style={{ minHeight: '400rpx' }}>
            <View
              dangerouslySetInnerHTML={{
                __html: htmlPreview.match(/<body>(.*?)<\/body>/s)?.[1] || htmlPreview || '<p style="color:#999">无内容</p>',
              }}
              style={{ fontSize: '28rpx', lineHeight: 1.6 }}
            />
          </View>
        </View>
      )}

      {/* 操作按钮 */}
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnSecondary} onClick={backToList}>← 返回</Button>
        <Button className={toolStyles.btnPrimary} onClick={saveCurrent}>💾 保存</Button>
        <Button className={toolStyles.btnSecondary} onClick={togglePin}>
          {currentEntry?.pinned ? '📌 取消置顶' : '📌 置顶'}
        </Button>
        <Button className={toolStyles.btnSecondary} onClick={() => setPreview(!preview)}>
          {preview ? '✏️ 编辑' : '👁️ 预览'}
        </Button>
        <Button className={toolStyles.btnSecondary} onClick={deleteCurrent} style={{ color: '#ef4444', borderColor: '#ef4444' }}>
          🗑️ 删除
        </Button>
      </View>

      <Text style={{ fontSize: '20rpx', color: '#9ca3af', display: 'block', marginTop: '8rpx' }}>
        支持 Markdown 格式：**粗体**、*斜体*、`代码`、[链接](url)、# 标题、- 列表
      </Text>
    </View>
  );
};

export default MdNotebookPage;
