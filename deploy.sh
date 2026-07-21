#!/bin/bash
set -e

echo "===== 1. Build admin 前端 ====="
cd "$(dirname "$0")/admin"
npx vite build

echo ""
echo "===== 2. 部署 admin ====="
DIST="../admin/dist"
rm -rf /opt/toolbox-admin
cp -r "$DIST" /opt/toolbox-admin
chmod -R 755 /opt/toolbox-admin

echo ""
echo "===== 3. 编译 server ====="
cd ../server
rm -rf dist tsconfig.tsbuildinfo
npx prisma generate
npm run build

echo ""
echo "===== 4. 重启服务 ====="
pm2 restart toolbox-server

echo ""
echo "✅ 部署完成"
