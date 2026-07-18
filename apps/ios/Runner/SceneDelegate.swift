import Flutter
import UIKit

class SceneDelegate: FlutterSceneDelegate {

    override func scene(
        _ scene: UIScene,
        openURLContexts URLContexts: Set<UIOpenURLContext>
    ) {
        guard let url = URLContexts.first?.url else { return }
        handleToolboxDeepLink(url)
    }

    override func scene(
        _ scene: UIScene,
        continue userActivity: NSUserActivity
    ) {
        // 支持 Universal Links (可选)
        if userActivity.activityType == NSUserActivityTypeBrowsingWeb,
           let url = userActivity.webpageURL {
            handleToolboxDeepLink(url)
        }
    }

    /// 解析 `toolbox://tool/{toolId}` 格式的 Deep Link
    private func handleToolboxDeepLink(_ url: URL) {
        guard url.scheme == "toolbox" else { return }

        let path = url.path  // e.g. "/tool/calculator"
        guard path.hasPrefix("/tool/") else { return }

        let toolId = path.replacingOccurrences(of: "/tool/", with: "")
        guard !toolId.isEmpty else { return }

            // 通过 MethodChannel 通知 Flutter 跳转到对应工具
        let engine = (window?.rootViewController as? FlutterViewController)?.engine
            ?? (value(forKey: "flutterEngine") as? FlutterEngine)
        if let messenger = engine?.binaryMessenger ?? (window?.rootViewController as? FlutterViewController)?.binaryMessenger {
            let channel = FlutterMethodChannel(
                name: "com.toolbox/deeplink",
                binaryMessenger: messenger
            )
            channel.invokeMethod("openTool", arguments: toolId)
        }
    }
}
