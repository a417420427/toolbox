# 🎨 Design System — 个人效率工具箱

> 统一视觉语言，跨端一致性。
> 定义全局设计 Token，Web (Tailwind) 和 Flutter 共享同一套规范。

## 设计理念

- **干净、克制** — 工具类应用，内容第一，装饰第二
- **信息层级清晰** — 输入区 vs 输出区 vs 操作区，一目了然
- **全平台一致** — 同一套色板、间距、圆角、阴影，在不同端体验统一

---

## 色彩系统

### Brand（品牌色）

| Token | 色值 | 用途 |
|---|---|---|
| `brand-50` | #EFF6FF | 背景极浅 |
| `brand-100` | #DBEAFE | 背景浅 |
| `brand-200` | #BFDBFE | 悬停/边框浅 |
| `brand-300` | #93C5FD | 边框 |
| **`brand-400`** | **#60A5FA** | 次要强调 |
| **`brand-500`** | **#3B82F6** | **主要强调（默认）** |
| `brand-600` | #2563EB | 悬停/hover |
| `brand-700` | #1D4ED8 | 激活/active |
| `brand-800` | #1E40AF | 深色模式强调 |
| `brand-900` | #1E3A8A | 极深 |

### Neutral（中性色 — 文字/背景/边框）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `neutral-50` | #F8FAFC | #0F172A | 背景 |
| `neutral-100` | #F1F5F9 | #1E293B | 卡片/面板 |
| `neutral-200` | #E2E8F0 | #334155 | 边框/分割线 |
| `neutral-300` | #CBD5E1 | #475569 | 边框深 |
| `neutral-400` | #94A3B8 | #64748B | 次要文字 |
| `neutral-500` | #64748B | #94A3B8 | 正文 |
| `neutral-600` | #475569 | #CBD5E1 | 正文强调 |
| `neutral-700` | #334155 | #E2E8F0 | 标题 |
| `neutral-800` | #1E293B | #F1F5F9 | 标题强调 |
| `neutral-900` | #0F172A | #F8FAFC | 最强调 |

### Semantic（语义色）

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `success` | #10B981 | #34D399 | 成功/通过 |
| `warning` | #F59E0B | #FBBF24 | 警告 |
| `error` | #EF4444 | #F87171 | 错误 |
| `info` | #3B82F6 | #60A5FA | 信息 |

### Accent（多选品牌色 — 用户可切换）

| 主题 | 主色 | 适用场景 |
|---|---|---|
| **Blue** (默认) | #3B82F6 | 通用 |
| **Purple** | #8B5CF6 | 创意/开发 |
| **Green** | #10B981 | 生产力 |
| **Orange** | #F97316 | 活力 |
| **Rose** | #F43F5E | 个性化 |
| **Slate** | #64748B | 极简 |

---

## 排版

### 字阶

| Token | Size | Weight | Line Height | 用途 |
|---|---|---|---|---|
| `text-xs` | 12px | 400 | 16px | 辅助文字/标签 |
| `text-sm` | 14px | 400 | 20px | 正文次要 |
| **`text-base`** | **16px** | **400** | **24px** | **正文** |
| `text-lg` | 18px | 500 | 28px | 正文强调 |
| `text-xl` | 20px | 600 | 28px | 小标题 |
| `text-2xl` | 24px | 700 | 32px | 页面标题 |
| `text-3xl` | 30px | 700 | 36px | 大标题 |

### 字体栈

```css
/* Web */
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;

/* Flutter */
fontFamily: 'Inter', ...  // or system default
```

- **正文/UI**: Inter (无衬线) — 清晰、现代
- **代码**: JetBrains Mono / Fira Code (等宽) — JSON/正则/哈希等工具

---

## 间距

| Token | 值 | 用途 |
|---|---|---|
| `space-1` | 4px | 微间距 |
| `space-2` | 8px | 紧凑内边距 |
| `space-3` | 12px | 内边距/元素间距 |
| **`space-4`** | **16px** | **标准间距/卡片内边距** |
| `space-5` | 20px | 段落间距 |
| `space-6` | 24px | 区块间距 |
| `space-8` | 32px | 大区块间距 |
| `space-10` | 40px | 页面边距 |
| `space-12` | 48px | 大幅间距 |

---

## 圆角

| Token | 值 | 用途 |
|---|---|---|
| `radius-sm` | 4px | 标签/徽章 |
| **`radius-md`** | **8px** | **卡片/输入框/按钮** |
| `radius-lg` | 12px | 弹窗/大卡片 |
| `radius-xl` | 16px | 页面级容器 |
| `radius-full` | 9999px | 药丸按钮/头像 |

---

## 阴影

| Token | Light | Dark | 用途 |
|---|---|---|---|
| `shadow-sm` | 0 1px 2px rgba(0,0,0,0.05) | 同上但微弱 | 卡片浮动 |
| **`shadow-md`** | **0 4px 6px rgba(0,0,0,0.07)** | **0 4px 6px rgba(0,0,0,0.3)** | **弹窗/下拉** |
| `shadow-lg` | 0 10px 15px rgba(0,0,0,0.1) | 0 10px 15px rgba(0,0,0,0.4) | 模态框 |
| `shadow-xl` | 0 20px 25px rgba(0,0,0,0.15) | 0 20px 25px rgba(0,0,0,0.5) | 顶部通知 |

---

## 图标

- **风格**: 线性图标，1.5px stroke
- **推荐库**: Lucide Icons (Web) / Flutter Lucide Icons (Flutter)
- **尺寸**: 16px(内联) / 20px(工具类图标) / 24px(导航栏)

---

## 组件样式约定

### 输入框
```
├── 背景: neutral-50 (light) / neutral-900 (dark)
├── 边框: neutral-200 (light) / neutral-700 (dark)
├── 焦点: brand-500 边框 + ring-2 brand-200/800
├── 圆角: radius-md (8px)
└── 内边距: px-4 py-2.5 (16px 水平, 10px 垂直)
```

### 按钮
```
├── Primary: brand-500 bg → brand-600 hover → brand-700 active
├── Secondary: transparent bg + brand-500 border/text
├── Ghost: transparent bg + neutral-600 text + neutral-100 hover
├── Danger: error bg → error hover
├── 圆角: radius-md (8px)
└── 内边距: px-4 py-2 (16px 水平, 8px 垂直)
```

### 卡片 (ToolCard — 每个工具的容器)
```
├── 背景: white (light) / neutral-800 (dark)
├── 边框: neutral-200 (light) / neutral-700 (dark)
├── 圆角: radius-md (8px)
├── 阴影: shadow-sm
├── 内边距: space-4 (16px)
└── 悬停: shadow-md + border-brand-300
```

### 侧边栏导航
```
├── 宽度: 240px (桌面) / 折叠54px (平板) / 隐藏→底部Tab (手机)
├── 背景: neutral-50 (light) / neutral-900 (dark)
├── 菜单项: 44px 高度, text-sm
├── 激活态: brand-50 bg + brand-600 text + 左侧4px brand-500 竖条
└── 悬停态: neutral-100 bg
```

### 结果面板
```
├── 背景: neutral-50 (light) / neutral-900 (dark)
├── 圆角: radius-md (8px)
├── 内边距: space-4 (16px)
├── 字体: text-sm, 等宽 (代码类工具) / text-base, 正文 (文本类)
└── 复制按钮: 右上角, ghost 风格
```

---

## 动画

- **过渡**: 150-200ms ease-out
- **页面切换**: 淡入 (100ms)
- **工具切换**: 左侧滑入 (200ms ease-out)
- **暗色模式**: 过渡 color 0.3s, background 0.3s

---

## 响应式断点

| 断点 | 宽度 | 布局 |
|---|---|---|
| `sm` | < 640px | 手机: 底部 Tab + 全宽内容 |
| `md` | 640-1024px | 平板: 折叠侧栏 |
| `lg` | 1024-1440px | 桌面: 固定侧栏 240px |
| `xl` | > 1440px | 宽屏: 侧栏 + 内容居中 max-width 1200px |

---

## Flutter 端映射

Flutter 端使用相同的视觉 Token，通过 `ThemeData` 配置：

```dart
// Flutter Theme 对照
ThemeData(
  useMaterial3: true,
  colorScheme: ColorScheme(
    primary: Color(0xFF3B82F6),       // brand-500
    onPrimary: Colors.white,
    primaryContainer: Color(0xFFDBEAFE), // brand-100
    secondary: Color(0xFF64748B),     // neutral-500
    surface: Color(0xFFF8FAFC),       // neutral-50
    onSurface: Color(0xFF0F172A),     // neutral-900
    error: Color(0xFFEF4444),
    brightness: Brightness.light,
  ),
  cardTheme: CardThemeData(
    elevation: 1,
    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
    margin: EdgeInsets.all(16),
  ),
  inputDecorationTheme: InputDecorationTheme(
    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8)),
    contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
  ),
)
```

### 实际实现文件

| 设计概念 | 实现位置 |
|---|---|
| 色彩 Token（Brand/Neutral/Semantic） | `packages/flutter_shared/lib/theme/app_colors.dart` |
| 字阶 Token / 字体栈 | `packages/flutter_shared/lib/theme/app_typography.dart` |
| 间距 / 圆角 Token | `packages/flutter_shared/lib/theme/app_spacing.dart` |
| Light/Dark ThemeData | `packages/flutter_shared/lib/theme/app_theme.dart` |
| 工具卡片容器 | `packages/flutter_shared/lib/widgets/tool_card.dart` |
| 结果面板 | `packages/flutter_shared/lib/widgets/result_panel.dart` |
| 复制按钮 | `packages/flutter_shared/lib/widgets/copy_button.dart` |
| 等宽文字 | `packages/flutter_shared/lib/widgets/monospace_text.dart` |

### 自适应导航（实际实现）

```dart
// /Users/zlzk/Dev/personal/toolbox/apps/mobile/lib/main.dart
LayoutBuilder(
  builder: (context, constraints) {
    if (constraints.maxWidth >= 640) {
      return _buildWideLayout();   // NavigationRail + 200px 工具列表 + 内容区
    } else {
      return _buildNarrowLayout(); // NavigationBar + AppBar + 工具内容
    }
  },
)
```
