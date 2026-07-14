# 工具箱

个人效率工具箱 Flutter App

## 目录结构

```
toolbox/
├── apps/               ← Flutter 主应用（运行入口）
│   ├── lib/            ← 页面代码
│   ├── web/            ← Web 配置
│   ├── ios/            ← iOS 配置
│   └── android/        ← Android 配置
│
├── packages/
│   └── flutter_shared/ ← 共享包（主题、工具定义、API）
│
├── server/             ← Nest.js 后端
│   ├── src/
│   └── prisma/
│
├── ios_run.sh          ← iOS 模拟器启动脚本
└── README.md
```

## 开发

```bash
# 应用目录
cd apps

# Web
flutter run -d chrome

# iOS
flutter run -d <设备 UUID>

# macOS
flutter run -d macos
```

## 后端

```bash
cd server
pnpm install
pnpm start:dev
```

生产部署地址：`https://ibnlus.com/tool/api`（PM2 管理）
