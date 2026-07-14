/// 图片处理工具
class ImageUtils {
  ImageUtils._();

  /// 文件大小格式化
  static String formatBytes(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }

  /// 图片分辨率归类
  static String resolutionLabel(int width, int height) {
    final mp = (width * height) / 1000000;
    if (mp < 0.3) return '低清';
    if (mp < 2) return '普清';
    if (mp < 8) return '高清';
    if (mp < 20) return '超清';
    return '极高';
  }

  /// 常用图片尺寸模板
  static const List<({String name, int width, int height})> templates = [
    (name: '头像(1:1)', width: 200, height: 200),
    (name: '公众号封面(2.35:1)', width: 900, height: 383),
    (name: '小红书(3:4)', width: 600, height: 800),
    (name: '朋友圈(1:1)', width: 500, height: 500),
    (name: '微博(16:9)', width: 320, height: 180),
    (name: 'B站封面(5:4)', width: 500, height: 400),
    (name: '抖音(9:16)', width: 400, height: 711),
    (name: '电脑壁纸(16:9)', width: 1920, height: 1080),
    (name: '手机壁纸(9:19.5)', width: 1080, height: 2340),
    (name: '名片(1.6:1)', width: 640, height: 400),
  ];
}
