# 🧰 Toolbox — 个人效率工具箱

> 一套跨平台的个人效率工具合集。Flutter 移动/桌面端，覆盖日常工具、格式化、编码加密、开发者工具等。纯前端离线可用，无需后端。

## 技术栈

| 端 | 技术 |
|---|---|
| **移动端 / 桌面端** | Flutter 3.44 (iOS / Android / macOS / Windows / Linux / Web) |
| **Web** | React + Vite + TypeScript + Tailwind CSS + shadcn/ui（开发中） |
| **共享包（Dart）** | `packages/flutter_shared` — 工具逻辑 + 设计 Token + 通用组件 |
| **后端** | NestJS + Prisma + PostgreSQL + Redis (V2+) |
| **部署** | Docker + GitHub Actions |

## 项目结构

```
toolbox/
├── apps/
│   ├── web/                    # React Web + PWA（开发中）
│   └── mobile/                 # Flutter 多端应用（已完成，37 个工具）
│       └── lib/
│           ├── main.dart       # 入口 + 自适应导航
│           └── pages/
│               ├── tools/      # 日常工具（14 个页面）
│               ├── formatters/ # 格式化工具（8 个页面）
│               ├── crypto/     # 编码加密工具（5 个页面）
│               ├── dev/        # 开发者工具（7 个页面）
│               └── auth/       # 收藏 & 用户（2 个）
│
├── packages/
│   └── flutter_shared/         # Flutter 公共包 (Dart) — 44 个文件
│       └── lib/
│           ├── theme/          # 设计 Token + ThemeData
│           ├── tools/          # 38 个 Dart 文件：工具逻辑 + 结果类型 + 注册表
│           ├── widgets/        # ToolCard / CopyButton / ResultPanel / MonospaceText
│           └── api_client/     # Dio 封装 API 客户端
│
├── server/                     # NestJS 后端（V2+，收藏系统已完成）
│   └── src/
│       ├── user/               # 收藏 + 文件夹 CRUD API
│       └── prisma/             # PostgreSQL schema
│
├── docs/SPEC.md                # 功能规格文档
├── packages/design/DESIGN.md   # 设计规范
├── ios_run.sh                  # iOS 模拟器启动脚本
└── start.sh                    # 后端启动脚本
```

---

## 📦 工具总览 — 37 个工具 / 4 个分类

### 🛠 日常工具（15 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **计算器** | 四则运算 + 科学计算（sin/cos/tan/ln/log/阶乘/平方根/倒数/绝对值/幂） | ✅ |
| **单位换算** | 8 大类 60+ 单位：长度、重量、温度、面积、体积、数据、速度、时间 | ✅ |
| **日期计算** | 日期差 / 加减年月日 / 工作日 / 年龄计算（闰年/月末截断） | ✅ |
| **倒计时** | 设定目标，实时秒级倒计时 / 已过时间，中文描述 | ✅ |
| **随机选择器** | 列表随机选 / 抽签 / 随机数字 / 抛硬币 / 随机颜色 | ✅ |
| **字数统计** | 字符/单词/行数/中文字数/字节/数字/字母/标点/空格 实时统计 | ✅ |
| **番茄钟** ⭐ | 25min 工作 / 5min 休息循环，长休息 / 自定义时长，圆形进度条 | ✅ |
| **秒表** ⭐ | 计时 / 暂停 / 计圈，毫秒精度，圈数记录 | ✅ |
| **房贷计算器** ⭐ | 等额本息 / 等额本金，月供/总利息/还款总额 | ✅ |
| **节假日** ⭐ | 法定假日列表（春节/清明/端午/中秋），最近节日倒计时，年度浏览 | ✅ |
| **纪念日** ⭐ | 自定义倒数日 / 已过天数，多个纪念日，自动计算周年 | ✅ |
| **世界时区** ⭐ | 17 个全球时区实时时间，搜索过滤，与北京时间时差 | ✅ |
| **Emoji 搜索** ⭐ | 200+ Emoji 按分类/关键词搜索，一键复制 | ✅ |
| **投资计算** ⭐ | 复利终值 / 每月定投 / 总投入 vs 总收益 | ✅ |
| **二维码生成** ⭐ | 文本/链接 → 二维码，CustomPainter 绘制，纠错级别 H | ✅ |

> ⭐ = 本次迭代新增

### 📐 格式化 & 转换（9 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **JSON 工具** | 格式化（2/4空格缩进）/ 压缩 / 校验 / 示例 | ✅ |
| **Base64 编解码** | 文本 ↔ Base64，URL Safe 模式 | ✅ |
| **URL 编解码** | encodeURIComponent / encodeURI，混合编码智能识别 | ✅ |
| **时间戳工具** | 秒/毫秒 ↔ 日期，ISO/中国/美国格式，相对时间 | ✅ |
| **颜色工具** | HEX / RGB / HSL / HSV 互转，颜色解析，色块预览 | ✅ |
| **SQL 格式化** ⭐ | SQL 关键字大写 + 智能缩进 / 压缩 | ✅ |
| **XML 格式化** ⭐ | XML 标签缩进 / 压缩 | ✅ |
| **YAML ↔ JSON** ⭐ | 双向转换，自动格式检测 | ✅ |
| **配色方案** ⭐ | 15 种预设调色板，互补色/类似色/三分色生成 | ✅ |

### 🔐 编码 & 加密（5 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **UUID 生成器** | UUID v4/v7 / NanoID，批量生成（1-100），多种格式 | ✅ |
| **哈希工具** | MD5 / SHA-1 / SHA-256 / SHA-512 等 6 种算法实时多输出 | ✅ |
| **JWT 解码器** | 解析 Header/Payload/Signature，过期检测 | ✅ |
| **进制转换** ⭐ | 2 / 8 / 10 / 16 进制实时互转 | ✅ |
| **密码生成器** ⭐ | 可配置长度/字符集/易混淆排除，强度评分 | ✅ |

### 🧑‍💻 开发者工具（8 个）

| 工具 | 核心能力 | 状态 |
|---|---|---|
| **正则测试器** | 实时匹配高亮 / 5 种 Flags / 常用模式速查表 | ✅ |
| **HTML 实体编解码** | < → &lt; 等预定义实体，十进制/十六进制解码 | ✅ |
| **Unicode 码点查询** | 字符 ↔ U+XXXX，批量查询，区块信息 | ✅ |
| **Cron 解析器** | 5 字段 → 中文描述，5 次执行预览，12 个预设 | ✅ |
| **文字格式互转** | 大写/小写/Sentence/camelCase/snake_case/kebab-case 等 | ✅ |
| **IP 工具** ⭐ | CIDR / 子网掩码 / 网络地址 / 广播地址 / 主机范围 | ✅ |
| **文本对比(Diff)** ⭐ | 左右双栏输入，LCS 行级差异高亮（+/- 标记） | ✅ |
| **配色方案** | 见格式化类（跨分类） | ✅ |

---

## 收藏系统（已完成）

支持登录后收藏工具、按文件夹管理、收藏时选文件夹。

### API 列表

| 方法 | 路径 | 功能 |
|---|---|---|
| `GET` | `/api/user/favorites` | 获取收藏列表（含文件夹） |
| `POST` | `/api/user/favorites` | 添加收藏（可选 folder 参数） |
| `DELETE` | `/api/user/favorites/:toolId` | 取消收藏 |
| `PUT` | `/api/user/favorites/reorder` | 重新排序 |
| `PUT` | `/api/user/favorites/:toolId/move` | 移动收藏到文件夹 |
| `GET` | `/api/user/favorites/folders` | 获取文件夹列表 |
| `POST` | `/api/user/favorites/folders` | 创建文件夹 |
| `PUT` | `/api/user/favorites/folders/rename` | 重命名文件夹 |
| `DELETE` | `/api/user/favorites/folders/:name` | 删除文件夹（内容归入未分类） |

### Prisma Schema

```prisma
model ToolFavorite {
  id        String   @id @default(cuid())
  userId    String
  toolId    String
  folder    String   @default("")   // 空=未分类
  sortOrder Int      @default(0)
  createdAt DateTime @default(now())
  user      User     @relation(...)
  @@unique([userId, toolId])
}

model FavoriteFolder {
  id        String   @id @default(cuid())
  userId    String
  name      String
  sortOrder Int      @default(0)
  user      User     @relation(...)
  @@unique([userId, name])
}
```

---

## 自适应布局

| 断点 | 宽度 | 布局 |
|---|---|---|
| 手机 | < 640px | 底部 NavigationBar + AppBar + 底部抽屉切换工具 |
| 平板/桌面 | ≥ 640px | NavigationRail + 三栏布局（打开工具后只显示内容） |

---

## 开始开发

```bash
# Flutter 端（当前活跃）
cd apps/mobile
flutter pub get
flutter run -d "iPhone 17 Pro"  # iOS 模拟器
flutter run -d macos             # macOS 桌面
flutter run -d chrome            # Web 调试

# 代码分析
cd apps/mobile && flutter analyze

# 后端（V2+）
cd server
pnpm install
pnpm start:dev

# 数据库
cd docker && docker compose up -d
```

## 启动脚本

```bash
# iOS 模拟器
bash ios_run.sh

# 后端
cd server && bash start.sh
```

## License

MIT
