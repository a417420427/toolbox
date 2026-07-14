# 🧰 Toolbox — 个人效率工具箱

> 一套跨平台的个人效率工具合集。Web 端 + Flutter 移动/桌面端 + 后端 API，覆盖开发者和日常常用的格式化、编码、加密、文本处理等工具。

## 技术栈

| 端 | 技术 |
|---|---|
| **Web** | React + Vite + TypeScript + Tailwind CSS + shadcn/ui |
| **移动端 / 桌面端** | Flutter (iOS / Android / macOS / Windows / Linux) |
| **后端** | NestJS + Prisma + PostgreSQL + Redis |
| **Python 微服务** | FastAPI (可选，图片/PDF 处理) |
| **部署** | Docker + GitHub Actions |

## 项目结构

```
toolbox/
├── apps/
│   ├── web/                    # React Web + PWA
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
│   └── mobile/                 # Flutter 多端应用
│       ├── lib/
│       │   ├── main.dart
│       │   ├── core/           # 基础架构层（主题/路由/网络/存储）
│       │   ├── features/       # 按功能拆分（tools/auth/history/favorites）
│       │   └── shared/         # 通用组件 + 工具函数
│       ├── ios/
│       ├── android/
│       ├── macos/
│       ├── windows/
│       └── linux/
│
├── packages/
│   ├── shared/                 # 共享业务逻辑 (TypeScript)
│   │   ├── src/
│   │   │   ├── tools/          # 工具核心逻辑（纯函数）
│   │   │   ├── types/          # 共享类型定义
│   │   │   └── api-client/     # API 客户端
│   │   └── package.json
│   │
│   └── flutter_shared/         # Flutter 公共包 (Dart)
│       ├── lib/
│       │   ├── tools/          # Dart 版工具逻辑
│       │   ├── widgets/        # 跨平台通用组件
│       │   └── api_client/     # Dio 封装 API 客户端
│       └── pubspec.yaml
│
├── server/                     # NestJS 后端
│   ├── src/
│   │   ├── modules/
│   │   │   ├── tools/          # 工具 API（服务端处理）
│   │   │   ├── auth/           # 认证（JWT + OAuth）
│   │   │   ├── user/           # 用户管理
│   │   │   └── stats/          # 使用统计
│   │   └── main.ts
│   └── prisma/                 # 数据库 Schema + 迁移
│
├── docker/                     # Docker 部署配置
│   ├── docker-compose.yml
│   ├── Dockerfile.server
│   └── nginx.conf
│
├── .github/workflows/          # CI/CD 配置
├── package.json                # pnpm workspaces monorepo 根
└── README.md
```

## 功能规划

### MVP
**格式化 & 转换**
- JSON 格式化/压缩/校验
- Base64 编解码
- URL 编解码
- 时间戳 ↔ 日期互转
- 颜色格式转换 (HEX / RGB / HSL / HSV)

**编码 & 加密**
- UUID / ULID / NanoID 生成
- MD5 / SHA1 / SHA256 / SHA512 哈希
- JWT 解码与验证

**文本处理**
- 字符/单词/行数统计
- 大小写/驼峰/蛇形/中划线互转
- 正则表达式测试器

**开发者工具**
- HTML 实体编解码
- Unicode 码点查询
- Cron 表达式解析

### V2+
- 用户系统（注册/登录/社交登录）
- 历史记录与收藏夹
- 自定义常用工具面板
- 图片处理（压缩/格式转换）
- YAML ↔ JSON / SQL 格式化 / Diff 对比
- 二维码生成/解码
- 暗色主题 + 快捷键系统
- API 开放

## 开发路线图

| Phase | 内容 | 时间 |
|---|---|---|
| 1 | 基础搭建（monorepo + 后端 + Web + Flutter 脚手架） | Week 1-2 |
| 2 | Web 端核心工具开发 + PWA | Week 3-4 |
| 3 | Flutter 端工具翻译 + 自适应 UI | Week 5-6 |
| 4 | 用户系统 + 跨设备同步 | Week 7-8 |
| 5 | App Store 发布 + 增值功能 | Week 9-10 |

## 开始开发

```bash
# 克隆后
cd toolbox

# Web 端
cd apps/web
pnpm install
pnpm dev

# Flutter 端
cd apps/mobile
flutter pub get
flutter run

# 后端
cd server
pnpm install
pnpm start:dev

# 数据库 (需要 Docker)
cd docker
docker compose up -d
```

## License

MIT
