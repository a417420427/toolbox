import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Canvas, Button, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ColoringBookTool, templates, presetColors } from '@/utils/tools/coloringBookTool';
import toolStyles from '@/styles/tool-common.module.scss';

const ColoringBookPage: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0].id);
  const [filledPaths, setFilledPaths] = useState<Record<number, string>>({});
  const [currentColor, setCurrentColor] = useState(presetColors[0]);
  const canvasRef = useRef<any>(null);
  const ctxRef = useRef<any>(null);
  const canvasW = 686;
  const canvasH = 500;
  const dprRef = useRef(1);

  useEffect(() => {
    const sys = Taro.getSystemInfoSync();
    dprRef.current = sys.pixelRatio || 1;
  }, []);

  const getCanvas = useCallback(() => {
    return new Promise<any>((resolve) => {
      const query = Taro.createSelectorQuery();
      query.select('#coloringCanvas').fields({ node: true, size: true }).exec((res) => {
        if (res[0]?.node) {
          const canvas = res[0].node;
          const ctx = canvas.getContext('2d');
          const dpr = dprRef.current;
          canvas.width = canvasW * dpr;
          canvas.height = canvasH * dpr;
          ctx.scale(dpr, dpr);
          resolve({ canvas, ctx });
        }
      });
    });
  }, []);

  const drawTemplate = useCallback(async (tmplId: string, fills: Record<number, string>) => {
    const result = await getCanvas();
    if (!result) return;
    const { ctx } = result;
    const tmpl = templates.find(t => t.id === tmplId) || templates[0];
    const pad = 30;
    const scaleX = (canvasW - pad * 2);
    const scaleY = (canvasH - pad * 2);

    ctx.clearRect(0, 0, canvasW, canvasH);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvasW, canvasH);

    tmpl.paths.forEach((path, idx) => {
      if (path.points.length < 2) return;
      ctx.beginPath();

      const first = path.points[0];
      ctx.moveTo(pad + first.x * scaleX, pad + first.y * scaleY);

      for (let i = 1; i < path.points.length; i++) {
        const p = path.points[i];
        ctx.lineTo(pad + p.x * scaleX, pad + p.y * scaleY);
      }

      ctx.closePath();

      // 填充
      const fillColor = fills[idx];
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }

      // 描边
      ctx.strokeStyle = path.strokeColor;
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    canvasRef.current = result.canvas;
    ctxRef.current = ctx;
  }, [getCanvas]);

  useEffect(() => {
    drawTemplate(selectedTemplate, filledPaths);
  }, [selectedTemplate, filledPaths, drawTemplate]);

  const handleCanvasTap = useCallback(async (e: any) => {
    const touch = e.touches?.[0] || e.detail;
    if (!touch) return;

    const query = Taro.createSelectorQuery();
    query.select('#coloringCanvas').boundingClientRect().exec((rects) => {
      const rect = rects[0];
      if (!rect) return;

      const tapX = (touch.x - rect.left) / rect.width;
      const tapY = (touch.y - rect.top) / rect.height;

      const tmpl = templates.find(t => t.id === selectedTemplate) || templates[0];

      for (let i = tmpl.paths.length - 1; i >= 0; i--) {
        const path = tmpl.paths[i];
        if (path.points.length < 3) continue;
        // 归一化坐标
        const normPoints = path.points.map(p => ({
          x: p.x,
          y: p.y,
        }));
        if (ColoringBookTool.pointInPolygon(tapX, tapY, normPoints)) {
          setFilledPaths(prev => ({
            ...prev,
            [i]: currentColor,
          }));
          Taro.vibrateShort({ type: 'light' }).catch(() => {});
          return;
        }
      }
    });
  }, [selectedTemplate, currentColor]);

  const clearAll = () => {
    Taro.showModal({
      title: '确认清空',
      content: '清除所有填色？',
      success: (r) => {
        if (r.confirm) setFilledPaths({});
      },
    });
  };

  const saveImage = async () => {
    drawTemplate(selectedTemplate, filledPaths);
    setTimeout(() => {
      const query = Taro.createSelectorQuery();
      query.select('#coloringCanvas').fields({ node: true }).exec((res) => {
        if (res[0]?.node) {
          Taro.canvasToTempFilePath({
            canvas: res[0].node,
            success: (r) => {
              Taro.saveImageToPhotosAlbum({
                filePath: r.tempFilePath,
                success: () => Taro.showToast({ title: '已保存', icon: 'success' }),
                fail: () => Taro.showToast({ title: '保存失败', icon: 'none' }),
              });
            },
            fail: () => Taro.showToast({ title: '导出失败', icon: 'none' }),
          });
        }
      });
    }, 300);
  };

  return (
    <ScrollView scrollY style={{ height: '100vh' }}>
      <View style={{ padding: '0 32rpx 32rpx' }}>
        {/* 画布 */}
        <View className={toolStyles.section}>
          <Canvas
            id="coloringCanvas"
            type="2d"
            style={{
              width: `${canvasW}rpx`,
              height: `${canvasH}rpx`,
              background: '#fff',
              border: '1rpx solid #e5e7eb',
              borderRadius: '12rpx',
            }}
            onTouchStart={handleCanvasTap}
          />
        </View>

        {/* 模板选择 */}
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>选择线稿</Text>
          <View className={toolStyles.row} style={{ flexWrap: 'wrap' }}>
            {templates.map((t) => (
              <Text
                key={t.id}
                className={`${toolStyles.chip} ${selectedTemplate === t.id ? toolStyles.chipActive : ''}`}
                onClick={() => {
                  setSelectedTemplate(t.id);
                  setFilledPaths({});
                }}
              >{t.name}</Text>
            ))}
          </View>
        </View>

        {/* 颜色选择 */}
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>选择颜色</Text>
          <View style={{ display: 'flex', flexWrap: 'wrap', gap: '8rpx' }}>
            {presetColors.map((c) => (
              <View
                key={c}
                onClick={() => setCurrentColor(c)}
                style={{
                  width: '48rpx',
                  height: '48rpx',
                  borderRadius: '50%',
                  background: c,
                  border: currentColor === c ? '3rpx solid #3b82f6' : '1rpx solid #e5e7eb',
                  boxSizing: 'border-box',
                  outline: c === '#fff' ? '1rpx solid #d1d5db' : 'none',
                }}
              />
            ))}
          </View>
        </View>

        {/* 操作按钮 */}
        <View className={toolStyles.actionRow}>
          <Button className={toolStyles.btnSecondary} onClick={() => setFilledPaths({})}>清空颜色</Button>
          <Button className={toolStyles.btnPrimary} onClick={saveImage}>保存到相册</Button>
        </View>
        <Text style={{ fontSize: '20rpx', color: '#9ca3af', marginTop: '8rpx', display: 'block' }}>
          提示：点击线稿内的区域即可填充所选颜色
        </Text>
      </View>
    </ScrollView>
  );
};

export default ColoringBookPage;
