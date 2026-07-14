#!/bin/bash
# ========================================
#  🧰 Toolbox — iOS 模拟器启动脚本
# ========================================

set -e

FLUTTER="$HOME/flutter/bin/flutter"

echo "📱 检查 iOS 模拟器..."
$FLUTTER emulators --launch apple_ios_simulator 2>/dev/null || true
sleep 3

# 找到已启动的模拟器 UUID
DEVICE=$($FLUTTER devices 2>/dev/null | grep 'simulator' | head -1 | awk -F' • ' '{print $2}' | awk '{print $1}')
if [ -z "$DEVICE" ]; then
  echo "⚠️  未能识别启动的模拟器设备"
  $FLUTTER devices
  echo ""
  echo "请从上面列表复制设备 ID 后运行:"
  echo "  $FLUTTER run -d <设备ID>"
  exit 1
fi

echo "   ✅ 模拟器: $DEVICE"

echo ""
echo "🚀 启动应用 (debug mode)..."
cd "$(dirname "$0")/apps"
$FLUTTER run -d "$DEVICE"
