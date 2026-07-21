#!/bin/bash
set -e

# ════════════════════════════════════════
#  Toolbox 部署脚本
#  1. build admin 前端
#  2. 走 git push 到远程
#  3. 远程 pull + 编译 + 重启
# ════════════════════════════════════════

echo "===== 1. Build admin 前端 ====="
cd "$(dirname "$0")/admin"
npx vite build

echo ""
echo "===== 2. Git commit & push ====="
cd ..
git add -A
git commit -m "deploy: $(date '+%Y-%m-%d %H:%M')"
git push

echo ""
echo "===== 3. 远程部署 ====="
ssh -p 22 root@39.106.172.134 "
  set -e
  echo '--- git pull ---'
  cd ~/workspace/toolbox
  git stash 2>/dev/null || true
  git pull

  echo ''
  echo '--- 部署 admin 前端 ---'
  rm -rf /opt/toolbox-admin
  cp -r admin/dist /opt/toolbox-admin
  chmod -R 755 /opt/toolbox-admin

  echo ''
  echo '--- 编译 server ---'
  cd ~/workspace/toolbox/server
  rm -rf dist tsconfig.tsbuildinfo
  npx prisma generate
  npm run build

  echo ''
  echo '--- 重启服务 ---'
  pm2 restart toolbox-server

  echo ''
  echo '✅ 部署完成'
"

echo ""
echo "===== 本地完成 ====="
