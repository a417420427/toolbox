import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Canvas, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import toolStyles from '@/styles/tool-common.module.scss';

type DrawMode = 'pen' | 'eraser' | 'clear';

const DrawingBoardPage: React.FC = () => {
  const [color, setColor] = useState('#1a1a1a');
  const [lineWidth, setLineWidth] = useState(4);
  const [mode, setMode] = useState<DrawMode>('pen');
  const canvasRef = useRef<any>(null);
  const ctxRef = useRef<any>(null);
  const isDrawing = useRef(false);

  const colors = ['#1a1a1a', '#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

  useEffect(() => {
    const query = Taro.createSelectorQuery();
    query.select('#drawCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]?.node) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = Taro.getSystemInfoSync().pixelRatio;
          canvas.width = canvas._width * dpr || 686 * dpr;
          canvas.height = canvas._height * dpr || 600 * dpr;
          ctx.scale(dpr, dpr);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctxRef.current = ctx;
          canvasRef.current = canvas;
        }
      });
  }, []);

  const getPos = (e: any) => {
    const touch = e.touches?.[0] || e;
    const rect = { left: 0, top: 0 };
    try {
      const q = Taro.createSelectorQuery();
      q.select('#drawCanvas').boundingClientRect().exec((r) => {
        if (r[0]) { rect.left = r[0].left; rect.top = r[0].top; }
      });
    } catch {}
    return {
      x: (touch.x || touch.clientX || 0) - (rect.left || 0),
      y: (touch.y || touch.clientY || 0) - (rect.top || 0),
    };
  };

  const startDraw = (e: any) => {
    if (!ctxRef.current) return;
    isDrawing.current = true;
    const pos = getPos(e);
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(pos.x, pos.y);
  };

  const draw = (e: any) => {
    if (!isDrawing.current || !ctxRef.current) return;
    const ctx = ctxRef.current;
    const pos = getPos(e);

    if (mode === 'eraser') {
      ctx.clearRect(pos.x - 10, pos.y - 10, 20, 20);
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    }
  };

  const stopDraw = () => {
    if (!ctxRef.current) return;
    isDrawing.current = false;
    ctxRef.current.closePath();
  };

  const clearCanvas = () => {
    if (!ctxRef.current || !canvasRef.current) return;
    Taro.showModal({
      title: '确认清空',
      content: '确定要清空画板吗？',
      success: (r) => {
        if (r.confirm) {
          const ctx = ctxRef.current;
          ctx.clearRect(0, 0, canvasRef.current._width || 686, canvasRef.current._height || 600);
        }
      },
    });
  };

  const saveImage = () => {
    Taro.canvasToTempFilePath({
      canvas: canvasRef.current,
      success: (res) => {
        Taro.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: () => Taro.showToast({ title: '已保存', icon: 'success' }),
          fail: () => Taro.showToast({ title: '保存失败', icon: 'none' }),
        });
      },
      fail: () => Taro.showToast({ title: '导出失败', icon: 'none' }),
    });
  };

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View style={{ padding: '0 32rpx 32rpx' }}>
        {/* 画布 */}
        <View className={toolStyles.section}>
          <Canvas
            id="drawCanvas"
            type="2d"
            style={{
              width: '686rpx',
              height: '600rpx',
              background: '#fff',
              border: '1rpx solid #e5e7eb',
              borderRadius: '12rpx',
            }}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </View>

        {/* 模式选择 */}
        <View className={toolStyles.row}>
          <View className={toolStyles.segmentedControl}>
            <Text
              className={`${toolStyles.segment} ${mode === 'pen' ? toolStyles.segmentActive : ''}`}
              onClick={() => setMode('pen')}
            >✏️ 画笔</Text>
            <Text
              className={`${toolStyles.segment} ${mode === 'eraser' ? toolStyles.segmentActive : ''}`}
              onClick={() => setMode('eraser')}
            >🧹 橡皮</Text>
          </View>
        </View>

        {/* 颜色选择 */}
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>颜色</Text>
          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8rpx' }}>
            {colors.map((c) => (
              <View
                key={c}
                onClick={() => setColor(c)}
                style={{
                  width: '48rpx',
                  height: '48rpx',
                  borderRadius: '50%',
                  background: c,
                  border: color === c ? '3rpx solid #3b82f6' : '1rpx solid #e5e7eb',
                  boxSizing: 'border-box',
                }}
              />
            ))}
          </View>
        </View>

        {/* 粗细 */}
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>粗细</Text>
          <View className={toolStyles.row}>
            {[2, 4, 6, 10].map((w) => (
              <Text
                key={w}
                className={`${toolStyles.chip} ${lineWidth === w ? toolStyles.chipActive : ''}`}
                onClick={() => setLineWidth(w)}
              >{w}px</Text>
            ))}
          </View>
        </View>

        {/* 操作按钮 */}
        <View className={toolStyles.actionRow}>
          <Button className={toolStyles.btnSecondary} onClick={clearCanvas}>清空</Button>
          <Button className={toolStyles.btnPrimary} onClick={saveImage}>保存到相册</Button>
        </View>
      </View>
    </ScrollView>
  );
};

export default DrawingBoardPage;
