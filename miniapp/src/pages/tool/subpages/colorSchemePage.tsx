import React, { useState } from 'react';
import { View, Text, Button } from '@tarojs/components';
import { ColorSchemeTool, colorHex } from '@/utils/tools/colorSchemeTool';
import toolStyles from '@/styles/tool-common.module.scss';

const ColorSchemePage: React.FC = () => {
  const [selectedPalette, setSelectedPalette] = useState('');
  const [customColors, setCustomColors] = useState<number[]>([]);

  const showComplementary = (color: number) => {
    const comp = ColorSchemeTool.complementary(color);
    const anal = ColorSchemeTool.analogous(color);
    const tri = ColorSchemeTool.triadic(color);
    setCustomColors([color, comp, ...anal, ...tri]);
    setSelectedPalette(colorHex(color));
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <Text className={toolStyles.sectionTitle}>配色方案</Text>
        {ColorSchemeTool.palettes.map(p => (
          <View key={p.name} className={toolStyles.card}>
            <Text className={toolStyles.cardTitle}>{p.name}</Text>
            <View style="display:flex;gap:8rpx;margin-top:8rpx">
              {p.colors.map((c, i) => (
                <View key={i} style="flex:1;text-align:center" onClick={() => showComplementary(c)}>
                  <View className={toolStyles.colorSwatch} style={{ backgroundColor: colorHex(c), width: '100%', height: '60rpx' }} />
                  <Text style="font-size:18rpx;color:#999">{colorHex(c)}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
      {customColors.length > 0 && (
        <View className={toolStyles.section}>
          <Text className={toolStyles.sectionTitle}>{`${selectedPalette} 配色扩展`}</Text>
          <View style="display:flex;gap:8rpx;flex-wrap:wrap">
            {customColors.map((c, i) => (
              <View key={i} className={toolStyles.gridItem} style="width:calc(33.333% - 8rpx)">
                <View className={toolStyles.colorSwatch} style={{ backgroundColor: colorHex(c), width: '100%', height: '60rpx' }} />
                <Text style="font-size:20rpx;color:#666;text-align:center;display:block;margin-top:4rpx">{colorHex(c)}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export default ColorSchemePage;
