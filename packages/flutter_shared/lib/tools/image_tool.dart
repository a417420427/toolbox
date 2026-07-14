import 'dart:typed_data';

import 'package:image/image.dart' as img;
import 'package:qr/qr.dart';

/// 图片处理工具（纯 Dart，依赖 image 和 qr 包）
class ImageTool {
  ImageTool._();

  /// 二维码数据生成（调用 qr 包生成 raw 数据）
  static Uint8List? generateQrRaw(String text, {int moduleCount = 33}) {
    try {
      final qrCode = QrCode(
        payload: QrPayload.fromString(text),
        errorCorrectLevel: QrErrorCorrectLevel.high,
      );
      // QrImage encodes the QR code into a pixel matrix
      final qrImage = QrImage(qrCode);
      // Return a moduleCount x moduleCount raw pixel representation
      final size = qrImage.moduleCount;
      final pixels = Uint8List(size * size);
      for (var r = 0; r < size; r++) {
        for (var c = 0; c < size; c++) {
          pixels[r * size + c] = qrImage.isDark(r, c) ? 0 : 255;
        }
      }
      return pixels;
    } catch (_) {
      return null;
    }
  }

  /// 图片压缩（调整质量）
  static Future<Uint8List?> compressImage(Uint8List input, {int quality = 80}) async {
    try {
      final image = img.decodeImage(input);
      if (image == null) return null;

      final output = img.encodeJpg(image, quality: quality);
      return Uint8List.fromList(output);
    } catch (_) {
      return null;
    }
  }

  /// 调整尺寸
  static Future<Uint8List?> resizeImage(Uint8List input, {int maxWidth = 800, int maxHeight = 800}) async {
    try {
      final image = img.decodeImage(input);
      if (image == null) return null;

      final srcW = image.width;
      final srcH = image.height;
      double scale = 1;
      if (srcW > maxWidth) scale = maxWidth / srcW;
      if (srcH * scale > maxHeight) scale = maxHeight / srcH;

      final newW = (srcW * scale).round();
      final newH = (srcH * scale).round();

      final resized = img.copyResize(image, width: newW, height: newH);
      final output = img.encodeJpg(resized, quality: 85);
      return Uint8List.fromList(output);
    } catch (_) {
      return null;
    }
  }

  /// 格式转换
  static Future<Uint8List?> convertFormat(Uint8List input, String targetFormat) async {
    try {
      final image = img.decodeImage(input);
      if (image == null) return null;

      switch (targetFormat.toLowerCase()) {
        case 'png':
          return Uint8List.fromList(img.encodePng(image));
        case 'jpeg':
        case 'jpg':
          return Uint8List.fromList(img.encodeJpg(image, quality: 90));
        case 'webp':
          return Uint8List.fromList(img.encodeWebP(image));
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
      final image = img.decodeImage(data);
      if (image == null) return null;
      return (width: image.width, height: image.height, sizeBytes: data.length);
    } catch (_) {
      return null;
    }
  }
}
