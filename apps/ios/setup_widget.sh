#!/bin/bash
# ============================================================
# 将 ToolboxWidget Extension 添加到 Xcode 项目
# 使用方法: cd apps/ios && bash setup_widget.sh
# ============================================================

set -euo pipefail
cd "$(dirname "$0")"

PROJECT="Runner.xcodeproj"
WIDGET_DIR="ToolboxWidget"
WIDGET_SRC="ToolboxWidget/ToolboxWidget.swift"
WIDGET_BUNDLE="ToolboxWidget/ToolboxWidgetBundle.swift"
WIDGET_PLIST="ToolboxWidget/Info.plist"

if [ ! -d "$PROJECT" ]; then
  echo "❌ 未找到 $PROJECT — 请确保在 apps/ios 目录下执行"
  exit 1
fi

if [ ! -f "$WIDGET_SRC" ]; then
  echo "❌ 未找到 $WIDGET_SRC — 小组件源文件缺失"
  exit 1
fi

echo "✅ 文件已就绪"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  请在 Xcode 中手动添加 Widget Extension Target"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "步骤："
echo "  1. 用 Xcode 打开 Runner.xcworkspace"
echo "  2. File → Add Target..."
echo "  3. 搜索并选择 \"Widget Extension\""
echo "     （iOS 平台，不要勾选 Include Configuration Intent）"
echo "  4. Product Name: ToolboxWidget"
echo "  5. Bundle Identifier: \$(PRODUCT_BUNDLE_IDENTIFIER).widget"
echo "  6. Language: Swift"
echo "  7. 点 Finish"
echo ""
echo "  8. Xcode 会自动生成一些模板文件，将它们删除："
echo "     - ToolboxWidget/ToolboxWidget.swift (替换为我们已有的)"
echo "     - ToolboxWidget/ToolboxWidgetControl.swift (如有)"
echo "     - ToolboxWidget/AppIntent.swift (如有)"
echo ""
echo "  9. 确保 Group 文件引用指向我们的文件："
echo "     - ToolboxWidget.swift (已有)"
echo "     - ToolboxWidgetBundle.swift"
echo "     - Info.plist"
echo ""
echo "  10. 重要配置项："
echo "      - Minimum Deployment: iOS 17.0+ (WidgetKit 推荐)"
echo "      - Signing: 使用与 Runner 相同的 Team"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "添加完成后，Xcode 会自动处理 .appex bundle 的嵌入。"
echo "Product → Run 即可编译并运行带小组件的 App。"
echo ""
echo "小组件 URL Scheme 说明："
echo "  - Flutter 端已配置 toolbox:// URL Scheme"
echo "  - 小组件点击发送 toolbox://tool/{toolId}"
echo "  - SceneDelegate 解析后通过 MethodChannel 传给 Flutter 跳转"
echo ""
