/**
 * 绘画填色工具 — 内置线稿模板 / 颜色填充
 * 小程序版本：Canvas 2D 实现
 */

export interface ColoringTemplate {
  id: string;
  name: string;
  /** SVG 路径数据或绘图指令 */
  paths: ColoringPath[];
}

export interface ColoringPath {
  /** 闭合路径的描边点 (x,y 归一化 0~1) */
  points: { x: number; y: number }[];
  /** 已选颜色，null=未填色 */
  fillColor: string | null;
  strokeColor: string;
}

// 预设填充颜色
export const presetColors = [
  '#EF4444', '#F97316', '#EAB308', '#22C55E',
  '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6',
  '#F87171', '#FBBF24', '#34D399', '#60A5FA',
  '#A78BFA', '#F472B6', '#6EE7B7', '#FCD34D',
  '#fff', '#d4d4d8', '#a1a1aa', '#52525b',
];

// 内置线稿模板（简化的 SVG 路径点集）
export const templates: ColoringTemplate[] = [
  {
    id: 'star',
    name: '五角星',
    paths: [
      {
        points: [
          { x: 0.5, y: 0.08 },
          { x: 0.62, y: 0.34 },
          { x: 0.91, y: 0.35 },
          { x: 0.69, y: 0.54 },
          { x: 0.78, y: 0.85 },
          { x: 0.5, y: 0.67 },
          { x: 0.22, y: 0.85 },
          { x: 0.31, y: 0.54 },
          { x: 0.09, y: 0.35 },
          { x: 0.38, y: 0.34 },
        ],
        fillColor: null,
        strokeColor: '#1a1a1a',
      },
    ],
  },
  {
    id: 'flower',
    name: '花朵',
    paths: [
      // 花瓣1
      { points: [{ x: 0.5, y: 0.2 }, { x: 0.38, y: 0.08 }, { x: 0.5, y: 0.35 }, { x: 0.62, y: 0.08 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 花瓣2
      { points: [{ x: 0.68, y: 0.3 }, { x: 0.88, y: 0.2 }, { x: 0.65, y: 0.45 }, { x: 0.9, y: 0.42 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 花瓣3
      { points: [{ x: 0.7, y: 0.55 }, { x: 0.9, y: 0.68 }, { x: 0.65, y: 0.6 }, { x: 0.88, y: 0.8 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 花瓣4
      { points: [{ x: 0.5, y: 0.65 }, { x: 0.5, y: 0.9 }, { x: 0.5, y: 0.65 }, { x: 0.38, y: 0.85 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 花瓣5
      { points: [{ x: 0.3, y: 0.55 }, { x: 0.12, y: 0.7 }, { x: 0.35, y: 0.6 }, { x: 0.12, y: 0.82 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 花蕊
      { points: [{ x: 0.5, y: 0.4 }, { x: 0.45, y: 0.38 }, { x: 0.5, y: 0.55 }, { x: 0.55, y: 0.38 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 茎
      { points: [{ x: 0.5, y: 0.65 }, { x: 0.5, y: 0.95 }], fillColor: null, strokeColor: '#1a1a1a' },
    ],
  },
  {
    id: 'house',
    name: '小房子',
    paths: [
      // 屋顶
      { points: [{ x: 0.5, y: 0.15 }, { x: 0.9, y: 0.38 }, { x: 0.1, y: 0.38 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 墙体
      { points: [{ x: 0.15, y: 0.38 }, { x: 0.85, y: 0.38 }, { x: 0.85, y: 0.88 }, { x: 0.15, y: 0.88 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 门
      { points: [{ x: 0.4, y: 0.88 }, { x: 0.6, y: 0.88 }, { x: 0.6, y: 0.58 }, { x: 0.4, y: 0.58 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 左窗
      { points: [{ x: 0.22, y: 0.48 }, { x: 0.38, y: 0.48 }, { x: 0.38, y: 0.72 }, { x: 0.22, y: 0.72 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 右窗
      { points: [{ x: 0.62, y: 0.48 }, { x: 0.78, y: 0.48 }, { x: 0.78, y: 0.72 }, { x: 0.62, y: 0.72 }], fillColor: null, strokeColor: '#1a1a1a' },
    ],
  },
  {
    id: 'tree',
    name: '圣诞树',
    paths: [
      // 树冠层1
      { points: [{ x: 0.5, y: 0.08 }, { x: 0.78, y: 0.35 }, { x: 0.22, y: 0.35 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 树冠层2
      { points: [{ x: 0.5, y: 0.28 }, { x: 0.82, y: 0.58 }, { x: 0.18, y: 0.58 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 树冠层3
      { points: [{ x: 0.5, y: 0.48 }, { x: 0.85, y: 0.8 }, { x: 0.15, y: 0.8 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 树干
      { points: [{ x: 0.42, y: 0.8 }, { x: 0.58, y: 0.8 }, { x: 0.58, y: 0.95 }, { x: 0.42, y: 0.95 }], fillColor: null, strokeColor: '#1a1a1a' },
    ],
  },
  {
    id: 'fish',
    name: '小鱼',
    paths: [
      // 身体
      { points: [{ x: 0.1, y: 0.5 }, { x: 0.25, y: 0.2 }, { x: 0.7, y: 0.2 }, { x: 0.9, y: 0.5 }, { x: 0.7, y: 0.8 }, { x: 0.25, y: 0.8 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 尾巴
      { points: [{ x: 0.9, y: 0.5 }, { x: 1.0, y: 0.3 }, { x: 1.0, y: 0.7 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 眼睛
      { points: [{ x: 0.3, y: 0.38 }, { x: 0.38, y: 0.38 }, { x: 0.38, y: 0.46 }, { x: 0.3, y: 0.46 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 背鳍
      { points: [{ x: 0.5, y: 0.2 }, { x: 0.6, y: 0.08 }, { x: 0.7, y: 0.2 }], fillColor: null, strokeColor: '#1a1a1a' },
    ],
  },
  {
    id: 'butterfly',
    name: '蝴蝶',
    paths: [
      // 左翅上
      { points: [{ x: 0.5, y: 0.35 }, { x: 0.2, y: 0.1 }, { x: 0.1, y: 0.3 }, { x: 0.35, y: 0.45 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 左翅下
      { points: [{ x: 0.35, y: 0.45 }, { x: 0.08, y: 0.55 }, { x: 0.18, y: 0.8 }, { x: 0.5, y: 0.55 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 右翅上
      { points: [{ x: 0.5, y: 0.35 }, { x: 0.8, y: 0.1 }, { x: 0.9, y: 0.3 }, { x: 0.65, y: 0.45 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 右翅下
      { points: [{ x: 0.65, y: 0.45 }, { x: 0.92, y: 0.55 }, { x: 0.82, y: 0.8 }, { x: 0.5, y: 0.55 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 身体
      { points: [{ x: 0.47, y: 0.1 }, { x: 0.53, y: 0.1 }, { x: 0.53, y: 0.75 }, { x: 0.47, y: 0.75 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 触角左
      { points: [{ x: 0.48, y: 0.12 }, { x: 0.35, y: 0.02 }, { x: 0.38, y: 0.0 }], fillColor: null, strokeColor: '#1a1a1a' },
      // 触角右
      { points: [{ x: 0.52, y: 0.12 }, { x: 0.65, y: 0.02 }, { x: 0.62, y: 0.0 }], fillColor: null, strokeColor: '#1a1a1a' },
    ],
  },
];

export const ColoringBookTool = {
  templates,
  presetColors,

  /** 检查点是否在多边形内（射线法） */
  pointInPolygon(px: number, py: number, points: { x: number; y: number }[]): boolean {
    let inside = false;
    const n = points.length;
    for (let i = 0, j = n - 1; i < n; j = i++) {
      const xi = points[i].x, yi = points[i].y;
      const xj = points[j].x, yj = points[j].y;
      if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
        inside = !inside;
      }
    }
    return inside;
  },

  /** 根据模板和填充状态生成可绘制的路径数据 */
  getFillState(templateId: string, filledPaths: Record<number, string>): ColoringTemplate {
    const tmpl = templates.find(t => t.id === templateId) || templates[0];
    return {
      ...tmpl,
      paths: tmpl.paths.map((p, i) => ({
        ...p,
        fillColor: filledPaths[i] ?? null,
      })),
    };
  },
};
