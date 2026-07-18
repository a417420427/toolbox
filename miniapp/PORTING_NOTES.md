# 工具箱 微信小程序 — 移植完成说明

## 已完成

- 40 个工具逻辑文件 (`src/utils/tools/`)
- 40 个工具页面组件 (`src/pages/tool/subpages/`)
- 主页面路由更新
- 收藏页/我的页功能增强

## 已知问题与修复

### 1. SCSS 变量缺失
**问题**: `tool-common.module.scss` 引用了 `$font-weight-light` 但未定义。
**修复**: 已在 `variables.scss` 中添加 `$font-weight-light: 300;`

### 2. Node.js 版本要求
**问题**: Taro 4 需要 Node >= 18，当前环境 Node v12.22.12
**修复**: 使用 nvm 切换到高版本：
```bash
nvm install 20
nvm use 20
```

### 3. 待开发功能
- `qr_code` → 需引入二维码库 (如 weapp-qrcode)
- AES 加解密 → 需引入 crypto-js 或使用云函数
- 收藏云端同步 → 需接入后端 API
