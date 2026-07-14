# 🧰 Toolbox — 个人效率工具箱

> 一套跨平台的个人效率工具合集。Web 端 + Flutter 移动/桌面端，覆盖日常工具、格式化、编码加密、开发者工具等。MVP 阶段以纯前端为主，无需后端即可使用。

## 技术栈

| 端 | 技术 |
|---|---|
| **移动端 / 桌面端** | Flutter 3.44 (iOS / Android / macOS / Windows / Linux / Web) |
| **Web** | React + Vite + TypeScript + Tailwind CSS + shadcn/ui（开发中） |
| **共享包（Dart）** | `packages/flutter_shared` — 工具逻辑 + 设计 Token + 通用组件 |
| **后端** | NestJS + Prisma + PostgreSQL + Redis (V2+) |
| **Python 微服务** | FastAPI (V2+，图片/PDF 处理) |
| **部署** | Docker + GitHub Actions |

## 项目结构

```
toolbox/
├── apps/
│   ├── web/                    # React Web + PWA（开发中）
│   │   ├── src/
│   │   │   ├── pages/          # 页面（按工具类型分组）
│   │   │   │   ├── formatters/ # 格式化类工具
│   │   │   │   ├── crypto/     # 加密编码类工具
│   │   │   │   ├── text/       # 文本处理类工具
│   │   │   │   └── dev/        # 开发者工具
│   │   │   ├── components/     # 通用 UI 组件
│   │   │   └── layouts/        # 布局组件
│   │   └── public/             # 静态资源
│   │
│   └── mobile/                 # Flutter 多端应用（已完成 MVP）
│       └── lib/
│           ├── main.dart       # 入口 + 自适应导航
│           └── pages/
│               ├── tools/      # 日常工具（6 个页面）
│               ├── formatters/ # 格式化工具（5 个页面）
│               ├── crypto/     # 编码加密工具（3 个页面）
│               ├── text/       # 文本处理（1 个页面）
│               └── dev/        # 开发者工具（5 个页面）
│
├── packages/
│   ├── shared/                 # 共享业务逻辑 (TypeScript) — 待完善
│   │   └── src/
│   │       ├── tools/          # 工具核心逻辑（纯函数）
│   │       └── types/          # 共享类型定义
│   │
│   └── flutter_shared/         # Flutter 公共包 (Dart) — 已完成
│       └── lib/
│           ├── theme/          # 设计 Token + ThemeData（映射 DESIGN.md）
│           ├── tools/          # 25 个文件：工具逻辑 + 结果类型 + 注册表
│           ├── widgets/        # ToolCard / CopyButton / ResultPanel / MonospaceText
│           └── api_client/     # Dio 封装 API 客户端（预留）
│
├── server/                     # NestJS 后端（V2+）
│   └── src/
│       ├── modules/
│       │   ├── tools/
│       │   ├── auth/
│       │   ├── user/
│       │   └── stats/
│       └── prisma/
│
├── docker/                     # Docker 部署配置
├── packages/design/            # 设计规范预览
│   └── DESIGN.md               # 统一设计语言
├── docs/SPEC.md                # 功能规格文档（"活的"）
├── .github/workflows/          # CI/CD 配置
└── README.md
```

## 功能概览 — 20 个工具 / 4 个分类

### 🛠 日常工具（6 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **计算器** | 基础四则运算 + 科学计算（sin/cos/tan/ln/log/阶乘/平方根/倒数/绝对值） | ✅ MVP |
| **单位换算** | 8 大类 60+ 单位：长度、重量、温度、面积、体积、数据存储、速度、时间 | ✅ MVP |
| **日期计算** | 日期差 / 加减年月日 / 工作日计算 / 年龄计算 | ✅ MVP |
| **倒计时** | 设定目标日期，实时秒级倒计时 / 已过时间 | ✅ MVP |
| **随机选择器** | 列表随机选 / 抽签 / 随机数字 / 抛硬币 / 随机颜色 | ✅ MVP |
| **字数统计** | 字符/单词/行数/中文字数/字节/数字/字母/标点/空格 实时统计 | ✅ MVP |

### 📐 格式化 & 转换（5 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **JSON 工具** | 格式化（2/4 空格缩进）、压缩、校验 + 示例 | ✅ MVP |
| **Base64 编解码** | 文本编解码、URL Safe 模式 | ✅ MVP |
| **URL 编解码** | encodeURIComponent / encodeURI、解码、混合编码智能识别 | ✅ MVP |
| **时间戳工具** | 秒/毫秒↔日期、ISO 8601 / 中国 / 美国格式、相对时间 | ✅ MVP |
| **颜色工具** | HEX / RGB / HSL / HSV 互转、颜色解析、色块预览、颜色名称 | ✅ MVP |

### 🔐 编码 & 加密（3 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **UUID 生成器** | UUID v4 / v7、NanoID、批量生成（1-100）、大写/去横线/花括号格式 | ✅ MVP |
| **哈希工具** | MD5 / SHA-1 / SHA-224 / SHA-256 / SHA-384 / SHA-512、实时多算法输出 | ✅ MVP |
| **JWT 解码器** | 解析 Header/Payload/Signature、过期检测、剩余时间 | ✅ MVP |

### 🧑‍💻 开发者工具（6 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **正则测试器** | 实时匹配、5 种 Flags 开关、常用模式速查、匹配列表 | ✅ MVP |
| **HTML 实体编解码** | <→&lt; 等 5 个预定义实体、十进制/十六进制解码 | ✅ MVP |
| **Unicode 码点查询** | 字符↔U+XXXX、批量查询、所属区块、控制字符名称 | ✅ MVP |
| **Cron 解析器** | 5 字段 / 6 字段、中文描述、接下来 5 次执行预览、12 个预设 | ✅ MVP |
| **文字格式互转** | 大写/小写/Title/Sentence/camelCase/PascalCase/snake_case/kebab-case/反转 | ✅ MVP |

### 📌 V2+ 计划

| 模块 | 说明 |
|---|---|
| 用户系统 | 邮箱注册/登录、GitHub/Google OAuth、JWT 认证 |
| 历史记录与收藏 | 跨设备同步、自定义常用工具面板 |
| 二维码工具 | 生成（纯前端）+ 解码（需后端） |
| 图片处理 | 压缩/格式转换/缩放/Exif（需后端或 WASM） |
| 文件格式互转 | YAML↔JSON、CSV↔JSON、XML↔JSON、SQL 格式化 |
| 国际化 | 中文 / 英文 |
| 全局搜索 | Cmd/Ctrl+K 快速搜索工具 |
| 快捷键 | Cmd/Ctrl+Enter 执行、自动复制 |

## 自适应布局

| 断点 | 宽度 | 布局 |
|---|---|---|
| 手机 | < 640px | 底部 NavigationBar + AppBar + 底部抽屉切换工具 |
| 平板/桌面 | ≥ 640px | NavigationRail + 工具列表 + 内容区三栏布局 |

## 设计规范

完整设计 Token 见 `packages/design/DESIGN.md`，包含：
- 完整色板（Brand / Neutral / Semantic / Accent）
- 字阶和字体栈（Inter + JetBrains Mono）
- 间距 / 圆角 / 阴影体系
- 组件样式约定（输入框 / 按钮 / 卡片 / 导航栏 / 结果面板）
- Flutter ThemeData 映射

## 开始开发

```bash
# 克隆后
cd toolbox

# Flutter 端（当前活跃开发中）
cd apps/mobile
flutter pub get
flutter run -d chrome     # Web 调试
flutter run -d macos      # macOS 桌面
flutter run               # 自动选择设备

# Web 端（React，开发中）
cd apps/web
pnpm install
pnpm dev

# 后端（V2+）
cd server
pnpm install
pnpm start:dev

# 数据库 (需要 Docker)
cd docker
docker compose up -d
```

## 构建验证

```bash
# 代码分析（零错误零警告目标）
cd apps/mobile && flutter analyze
cd packages/flutter_shared && flutter analyze

# 构建
flutter build web
flutter build macos
```

## License

MIT
