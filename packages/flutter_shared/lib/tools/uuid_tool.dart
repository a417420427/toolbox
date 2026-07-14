import 'dart:math';
import 'dart:typed_data';

/// UUID / NanoID 生成工具
class UuidTool {
  UuidTool._();

  static final Random _random = Random.secure();

  /// 生成 UUID v4
  static String uuidV4() {
    final bytes = Uint8List(16);
    for (int i = 0; i < 16; i++) {
      bytes[i] = _random.nextInt(256);
    }
    // 设置版本位 (4)
    bytes[6] = (bytes[6] & 0x0F) | 0x40;
    // 设置变体位
    bytes[8] = (bytes[8] & 0x3F) | 0x80;

    return '${_hex(bytes, 0, 4)}-'
        '${_hex(bytes, 4, 2)}-'
        '${_hex(bytes, 6, 2)}-'
        '${_hex(bytes, 8, 2)}-'
        '${_hex(bytes, 10, 6)}';
  }

  /// 生成 UUID v7 (按时间排序)
  static String uuidV7() {
    final ms = DateTime.now().millisecondsSinceEpoch;
    final bytes = Uint8List(16);

    // 前 48 位 = 毫秒时间戳
    bytes[0] = (ms >> 40) & 0xFF;
    bytes[1] = (ms >> 32) & 0xFF;
    bytes[2] = (ms >> 24) & 0xFF;
    bytes[3] = (ms >> 16) & 0xFF;
    bytes[4] = (ms >> 8) & 0xFF;
    bytes[5] = ms & 0xFF;

    // 随机填充
    for (int i = 6; i < 16; i++) {
      bytes[i] = _random.nextInt(256);
    }
    // 版本 7
    bytes[6] = (bytes[6] & 0x0F) | 0x70;
    // 变体
    bytes[8] = (bytes[8] & 0x3F) | 0x80;

    return '${_hex(bytes, 0, 4)}-'
        '${_hex(bytes, 4, 2)}-'
        '${_hex(bytes, 6, 2)}-'
        '${_hex(bytes, 8, 2)}-'
        '${_hex(bytes, 10, 6)}';
  }

  /// 生成 NanoID（默认 21 字符，使用 A-Za-z0-9_-）
  static String nanoId({int length = 21, String alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'}) {
    final mask = (2 << (alphabet.length.bitLength - 1).floor()) - 1;
    final step = (1.6 * mask * length / alphabet.length).ceil();
    final result = StringBuffer();

    while (result.length < length) {
      final bytes = Uint8List(step);
      for (int i = 0; i < step; i++) {
        bytes[i] = _random.nextInt(256);
      }
      for (int i = 0; i < step && result.length < length; i++) {
        final idx = bytes[i] & mask;
        if (idx < alphabet.length) {
          result.write(alphabet[idx]);
        }
      }
    }

    return result.toString();
  }

  /// 格式化 UUID
  static String format(String uuid, {bool uppercase = false, bool noDashes = false, bool curlyBraces = false}) {
    var result = uuid;
    if (uppercase) result = result.toUpperCase();
    if (noDashes) result = result.replaceAll('-', '');
    if (curlyBraces) result = '{$result}';
    return result;
  }

  /// 批量生成
  static List<String> bulkGenerate({int count = 5, bool v7 = false}) {
    count = count.clamp(1, 100);
    return List.generate(count, (_) => v7 ? uuidV7() : uuidV4());
  }

  static String _hex(Uint8List bytes, int start, int length) {
    final hex = StringBuffer();
    for (int i = start; i < start + length; i++) {
      hex.write(bytes[i].toRadixString(16).padLeft(2, '0'));
    }
    return hex.toString();
  }
}
