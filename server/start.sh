#!/bin/bash
set -e

echo "========================================"
echo "  🧰 Toolbox — 后端启动脚本"
echo "========================================"

# ── 1. 检查依赖 ──
echo ""
echo "📦 检查 PostgreSQL..."
if ! command -v psql &> /dev/null; then
  echo "   ⚠️  psql 未找到，尝试启动 Homebrew PostgreSQL..."
  if brew list postgresql@16 &>/dev/null; then
    brew services start postgresql@16
  else
    echo "   ❌ 请先安装 PostgreSQL: brew install postgresql@16"
    exit 1
  fi
fi

echo "   ✅ PostgreSQL 已就绪"

# ── 2. 检查数据库是否存在 ──
echo ""
echo "🗄️  检查数据库..."
if ! psql -U toolbox -d toolbox -c "SELECT 1" &>/dev/null; then
  echo "   创建数据库..."
  createdb toolbox 2>/dev/null || echo "   ⚠️  数据库已存在或创建失败，继续..."
fi
echo "   ✅ 数据库就绪"

# ── 3. Prisma 迁移 ──
echo ""
echo "🔄 运行 Prisma 迁移..."
npx prisma migrate dev --name init
echo "   ✅ 迁移完成"

# ── 4. 构建 + 启动 ──
echo ""
echo "🔨 构建项目..."
pnpm build
echo "   ✅ 构建完成"

echo ""
echo "========================================"
echo "  🚀 启动后端服务器..."
echo "     http://localhost:3000"
echo "     https://localhost:3000/api/docs"
echo "========================================"
echo ""

pnpm start
