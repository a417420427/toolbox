import 'dart:typed_data';
import 'dart:ui' as ui;

/// 图片处理工具（纯 Dart，依赖 image 和 qr 包）
class ImageTool {
  ImageTool._();

  /// 二维码数据生成（调用 qr 包生成 raw 数据）
  static Uint8List? generateQrRaw(String text, {int moduleCount = 33}) {
    try {
      final qrCode = qr.QrCode.fromData(
        data: text,
        errorCorrection: qr.QrErrorCorrectLevel.H,
      );
      final qrImage = qr.QrImage(qrCode);
      // 返回模块矩阵（黑白像素，用 moduleCount x moduleCount 表示）
      return Uint8List(0); // 占位，实际用画布绘制
    } catch (_) {
      return null;
    }
  }

  /// 图片压缩（调整质量）
  static Future<Uint8List?> compressImage(Uint8List input, {int quality = 80}) async {
    try {
      final decoder = imglib.Decoder(input);
      final image = decoder.decode();
      if (image == null) return null;

      final encoder = imglib.JpegEncoder(quality: quality);
      final output = encoder.encode(image);
      return Uint8List.fromList(output);
    } catch (_) {
      return null;
    }
  }

  /// 调整尺寸
  static Future<Uint8List?> resizeImage(Uint8List input, {int maxWidth = 800, int maxHeight = 800}) async {
    try {
      final decoder = imglib.Decoder(input);
      final image = decoder.decode();
      if (image == null) return null;

      final srcW = image.width;
      final srcH = image.height;
      double scale = 1;
      if (srcW > maxWidth) scale = maxWidth / srcW;
      if (srcH * scale > maxHeight) scale = maxHeight / srcH;

      final newW = (srcW * scale).round();
      final newH = (srcH * scale).round();

      final resized = image.copyResized(newW, newH);
      final encoder = imglib.JpegEncoder(quality: 85);
      final output = encoder.encode(resized);
      return Uint8List.fromList(output);
    } catch (_) {
      return null;
    }
  }

  /// 格式转换
  static Future<Uint8List?> convertFormat(Uint8List input, String targetFormat) async {
    try {
      final decoder = imglib.Decoder(input);
      final image = decoder.decode();
      if (image == null) return null;

      switch (targetFormat.toLowerCase()) {
        case 'png':
          return Uint8List.fromList(imglib.PngEncoder().encode(image));
        case 'jpeg':
        case 'jpg':
          return Uint8List.fromList(imglib.JpegEncoder(quality: 90).encode(image));
        case 'webp':
          return Uint8List.fromList(imglib.WebPEncoder().encode(image));
        default:
          return null;
      }
    } catch (_) {
      return null;
    }
  }

  /// 获取图片信息
  static ({int width, int height, int sizeBytes})? getImageInfo(Uint8List data) {
    try {
      final decoder = imglib.Decoder(data);
      final image = decoder.decode();
      if (image == null) return null;
      return (width: image.width, height: image.height, sizeBytes: data.length);
    } catch (_) {
      return null;
    }
  }
}
