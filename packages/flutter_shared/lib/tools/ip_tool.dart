import 'dart:math' as dartmath;

/// IP 工具
class IpTool {
  IpTool._();

  /// CIDR → 子网掩码
  static String prefixToMask(int prefix) {
    final mask = (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF;
    return '${(mask >> 24) & 0xFF}.${(mask >> 16) & 0xFF}.${(mask >> 8) & 0xFF}.${mask & 0xFF}';
  }

  /// 网络地址
  static String networkAddress(String ip, int prefix) {
    final ipInt = _ipToInt(ip);
    final mask = (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF;
    return _intToIp(ipInt & mask);
  }

  /// 广播地址
  static String broadcastAddress(String ip, int prefix) {
    final ipInt = _ipToInt(ip);
    final mask = (0xFFFFFFFF << (32 - prefix)) & 0xFFFFFFFF;
    return _intToIp(ipInt | ~mask & 0xFFFFFFFF);
  }

  /// 主机数量
  static int hostCount(int prefix) {
    if (prefix >= 31) return prefix == 31 ? 2 : 1;
    return (1 << (32 - prefix)) - 2;
  }

  /// 第一个可用主机
  static String? firstHost(String ip, int prefix) {
    if (prefix >= 31) return null;
    final net = _ipToInt(networkAddress(ip, prefix));
    return _intToIp(net + 1);
  }

  /// 最后一个可用主机
  static String? lastHost(String ip, int prefix) {
    if (prefix >= 31) return null;
    final broadcast = _ipToInt(broadcastAddress(ip, prefix));
    return _intToIp(broadcast - 1);
  }

  /// IP 范围
  static bool isInRange(String ip, String networkIp, int prefix) {
    final ipInt = _ipToInt(ip);
    final netInt = _ipToInt(networkAddress(networkIp, prefix));
    final broadcastInt = _ipToInt(broadcastAddress(networkIp, prefix));
    return ipInt >= netInt && ipInt <= broadcastInt;
  }

  static int _ipToInt(String ip) {
    final parts = ip.split('.').map(int.parse).toList();
    return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
  }

  static String _intToIp(int value) {
    return '${(value >> 24) & 0xFF}.${(value >> 16) & 0xFF}.${(value >> 8) & 0xFF}.${value & 0xFF}';
  }

  /// 验证 IP 格式
  static bool isValidIp(String ip) {
    final parts = ip.split('.');
    if (parts.length != 4) return false;
    return parts.every((p) {
      final n = int.tryParse(p);
      return n != null && n >= 0 && n <= 255;
    });
  }

  /// 验证 CIDR 前缀
  static bool isValidPrefix(int prefix) => prefix >= 0 && prefix <= 32;

  /// 生成随机 IPv4
  static String randomIp() {
    final r = dartmath.Random();
    return '${r.nextInt(256)}.${r.nextInt(256)}.${r.nextInt(256)}.${r.nextInt(256)}';
  }
}
