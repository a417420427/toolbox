import React, { useState, useRef, useEffect } from 'react';
import { View, Text, Canvas, Textarea, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { RegexVisualizer, RegexNode } from '@/utils/tools/regexVisualizer';
import toolStyles from '@/styles/tool-common.module.scss';

const RegexVisualizerPage: React.FC = () => {
  const [pattern, setPattern] = useState('');
  const [nodes, setNodes] = useState<RegexNode[]>([]);
  const [description, setDescription] = useState('');
  const canvasRef = useRef<any>(null);

  const draw = () => {
    if (!pattern.trim()) {
      setNodes([]);
      setDescription('');
      return;
    }
    const parsed = RegexVisualizer.parse(pattern);
    setNodes(parsed);
    setDescription(RegexVisualizer.describe(parsed));
  };

  useEffect(() => {
    if (nodes.length === 0 || nodes[0].label === '无效') return;
    setTimeout(() => renderCanvas(), 100);
  }, [nodes]);

  const renderCanvas = () => {
    const query = Taro.createSelectorQuery();
    query.select('#vizCanvas').fields({ node: true, size: true }).exec((res) => {
      if (!res[0]?.node) return;
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const dpr = Taro.getSystemInfoSync().pixelRatio;
      const W = res[0].width || 686;
      const H = Math.max(400, nodes.length * 120);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);

      // 清空
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, W, H);

      // 绘制节点流
      const startX = 60;
      let y = 40;
      const nodeW = 120;
      const nodeH = 48;

      // 起始箭头
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(startX - 20, y + nodeH / 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.moveTo(startX - 14, y + nodeH / 2);
      ctx.lineTo(startX - 30, y + nodeH / 2 - 8);
      ctx.lineTo(startX - 30, y + nodeH / 2 + 8);
      ctx.fill();

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const color = RegexVisualizer.nodeColor(n.type);
        const x = startX;

        // 方向箭头
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x - 8, y + nodeH / 2);
        ctx.lineTo(x + 6, y + nodeH / 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x + 6, y + nodeH / 2);
        ctx.lineTo(x + 2, y + nodeH / 2 - 4);
        ctx.moveTo(x + 6, y + nodeH / 2);
        ctx.lineTo(x + 2, y + nodeH / 2 + 4);
        ctx.stroke();

        // 节点框
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x + 10, y, nodeW, nodeH, 8);
        ctx.fill();

        // 文字
        ctx.fillStyle = '#fff';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(n.label, x + 10 + nodeW / 2, y + nodeH / 2);

        // 详情文字
        if (n.detail) {
          ctx.fillStyle = '#64748b';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(n.detail, x + 10 + nodeW / 2, y + nodeH + 20);
        }

        // 子节点（简单缩进展示）
        if (n.children && n.children.length > 0) {
          ctx.fillStyle = '#64748b';
          ctx.font = '11px sans-serif';
          ctx.textAlign = 'left';
          n.children.forEach((child, ci) => {
            const cx = x + 20;
            const cy = y + nodeH + 40 + ci * 24;
            ctx.fillStyle = RegexVisualizer.nodeColor(child.type);
            ctx.fillRect(cx, cy + 4, 4, 14);
            ctx.fillStyle = '#475569';
            ctx.fillText(`${child.label}${child.detail ? ' → ' + child.detail : ''}`, cx + 10, cy + 15);
          });
          y += 60 + n.children.length * 24;
        } else {
          y += 80;
        }
      }

      // 终止箭头
      ctx.fillStyle = '#ef4444';
      y += 10;
      ctx.beginPath();
      ctx.moveTo(startX - 14, y + nodeH / 2);
      ctx.lineTo(startX + 6, y + nodeH / 2);
      ctx.lineTo(startX + 6, y + nodeH / 2 - 8);
      ctx.lineTo(startX + 20, y + nodeH / 2);
      ctx.lineTo(startX + 6, y + nodeH / 2 + 8);
      ctx.lineTo(startX + 6, y + nodeH / 2);
      ctx.closePath();
      ctx.fill();
    });
  };

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View style={{ padding: '0 32rpx 32rpx' }}>
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>正则表达式</Text>
          <Textarea
            className={toolStyles.textarea}
            value={pattern}
            onInput={(e) => setPattern(e.detail.value)}
            placeholder="例如: ^[a-z]+@[a-z]+\.[a-z]+$"
            style={{ height: '80rpx', lineHeight: '44rpx', paddingTop: '18rpx' }}
          />
          <Text style={{ fontSize: '20rpx', color: '#94a3b8', marginTop: '8rpx', display: 'block' }}>支持: 字符、\d\w\s、[...]、()分组、|或、*+?、^$锚点</Text>
        </View>

        <View className={toolStyles.actionRow}>
          <Button className={toolStyles.btnPrimary} onClick={draw}>可视化</Button>
        </View>

        {description && (
          <View className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>匹配说明</Text>
            <Text selectable style={{ fontSize: '24rpx', color: '#1a1a1a', lineHeight: 1.6 }}>
              {description}
            </Text>
          </View>
        )}

        {nodes.length > 0 && nodes[0].label === '无效' && (
          <View className={toolStyles.errorBox}>
            <Text className={toolStyles.errorText}>非法正则表达式</Text>
          </View>
        )}

        <View className={toolStyles.section}>
          <Canvas
            id="vizCanvas"
            type="2d"
            style={{
              width: '686rpx',
              height: '600rpx',
              background: '#fafafa',
              border: '1rpx solid #e5e7eb',
              borderRadius: '12rpx',
            }}
          />
        </View>

        {/* 示例 */}
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>试试这些</Text>
          <View className={toolStyles.row} style={{ flexWrap: 'wrap' }}>
            {['^[a-z]+@[a-z]+\\.[a-z]+$', '\\d{3}-\\d{8}', '(cat|dog|bird)', '^https?://', '[\\u4e00-\\u9fff]+', '\\b\\w+\\b'].map((s) => (
              <Text
                key={s}
                className={toolStyles.badge}
                onClick={() => {
                  setPattern(s);
                  setTimeout(() => draw(), 50);
                }}
                style={{ margin: '4rpx' }}
              >{s}</Text>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default RegexVisualizerPage;
