import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { ColorTool } from '@/utils/tools/colorTool';
import toolStyles from '@/styles/tool-common.module.scss';

const modes = [
  { value: 'hex2rgb', label: 'HEX→RGB' },
  { value: 'rgb2hex', label: 'RGB→HEX' },
  { value: 'parse', label: '自动解析' },
];

const ColorToolPage: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState('hex2rgb');
  const [previewColor, setPreviewColor] = useState('');

  const process = () => {
    if (mode === 'hex2rgb') {
      const rgb = ColorTool.fromHex(input);
      if (!rgb) { setOutput('无效的 HEX 颜色值'); setPreviewColor(''); return; }
      const hsl = ColorTool.toHsl(rgb.r, rgb.g, rgb.b);
      const name = ColorTool.name(rgb.r, rgb.g, rgb.b);
      setOutput(
        `HEX: ${ColorTool.toHex(rgb.r, rgb.g, rgb.b)}\n` +
        `RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n` +
        `HSL: hsl(${Math.round(hsl.h)}, ${(hsl.s * 100).toFixed(1)}%, ${(hsl.l * 100).toFixed(1)}%)\n` +
        `颜色名: ${name}`
      );
      setPreviewColor(ColorTool.toHex(rgb.r, rgb.g, rgb.b));
    } else if (mode === 'rgb2hex') {
      const match = input.match(/(\d+)/g);
      if (!match || match.length < 3) { setOutput('请输入 RGB 值，如: 255, 0, 0'); setPreviewColor(''); return; }
      const [r, g, b] = [parseInt(match[0]), parseInt(match[1]), parseInt(match[2])];
      const hsl = ColorTool.toHsl(r, g, b);
      const name = ColorTool.name(r, g, b);
      setOutput(
        `HEX: ${ColorTool.toHex(r, g, b)}\n` +
        `RGB: rgb(${r}, ${g}, ${b})\n` +
        `HSL: hsl(${Math.round(hsl.h)}, ${(hsl.s * 100).toFixed(1)}%, ${(hsl.l * 100).toFixed(1)}%)\n` +
        `颜色名: ${name}`
      );
      setPreviewColor(ColorTool.toHex(r, g, b));
    } else {
      const rgb = ColorTool.parse(input);
      if (!rgb) { setOutput('无法解析该颜色值'); setPreviewColor(''); return; }
      const hsl = ColorTool.toHsl(rgb.r, rgb.g, rgb.b);
      const name = ColorTool.name(rgb.r, rgb.g, rgb.b);
      setOutput(
        `HEX: ${ColorTool.toHex(rgb.r, rgb.g, rgb.b)}\n` +
        `RGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\n` +
        `HSL: hsl(${Math.round(hsl.h)}, ${(hsl.s * 100).toFixed(1)}%, ${(hsl.l * 100).toFixed(1)}%)\n` +
        `颜色名: ${name}`
      );
      setPreviewColor(ColorTool.toHex(rgb.r, rgb.g, rgb.b));
    }
  };

  return (
    <View>
      <View className={toolStyles.row}>
        <View className={toolStyles.segmentedControl}>
          {modes.map(m => (
            <Text
              key={m.value}
              className={`${toolStyles.segment} ${mode === m.value ? toolStyles.segmentActive : ''}`}
              onClick={() => setMode(m.value)}
            >{m.label}</Text>
          ))}
        </View>
        {previewColor && (
          <View
            className={toolStyles.colorSwatch}
            style={{ backgroundColor: previewColor }}
          />
        )}
      </View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>
          {mode === 'hex2rgb' ? '输入 HEX (如 #FF0000)' : mode === 'rgb2hex' ? '输入 RGB (如 255, 0, 0)' : '输入颜色值'}
        </Text>
        <Textarea
          className={toolStyles.textarea}
          value={input}
          onInput={e => setInput(e.detail.value)}
          placeholder={mode === 'hex2rgb' ? '#FF0000' : mode === 'rgb2hex' ? '255, 0, 0' : '#FF0000 或 rgb(255,0,0) 或 hsl(0,100%,50%)'}
          style="height:100rpx"
        />
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={process}>转换</Button>
      </View>
      {output && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>结果</Text>
          <View className={toolStyles.resultBox}>
            <Text selectable style={{ whiteSpace: 'pre-wrap', fontSize: '24rpx', lineHeight: 1.6 }}>{output}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ColorToolPage;
