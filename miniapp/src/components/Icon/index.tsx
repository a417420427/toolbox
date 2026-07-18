import React from 'react';
import { Image } from '@tarojs/components';
import { iconPaths } from '@/data/icons';

interface IconProps {
  name: string;
  size?: number; // rpx
  color?: string;
  strokeWidth?: number;
}

// 跨环境 base64 编码（H5 / Node / 小程序）
function toBase64(str: string): string {
  if (typeof btoa === 'function') return btoa(str);
  if (typeof Buffer !== 'undefined') return Buffer.from(str).toString('base64');
  // @ts-ignore
  if (typeof wx !== 'undefined' && wx.arrayBufferToBase64) {
    const buf = new Uint8Array(str.length);
    for (let i = 0; i < str.length; i++) buf[i] = str.charCodeAt(i);
    // @ts-ignore
    return wx.arrayBufferToBase64(buf.buffer);
  }
  return '';
}

/**
 * 线性图标组件，对齐 Flutter Material Outlined 风格
 * 用 Image 组件渲染 base64 SVG，兼容 H5 / 小程序
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 36,
  color = '#3b82f6',
  strokeWidth = 2,
}) => {
  const inner = iconPaths[name] || iconPaths.code;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  const src = `data:image/svg+xml;base64,${toBase64(svg)}`;

  return (
    <Image
      src={src}
      style={{
        width: `${size}rpx`,
        height: `${size}rpx`,
        flexShrink: 0,
        display: 'block',
      }}
      mode="aspectFit"
    />
  );
};

export default Icon;
