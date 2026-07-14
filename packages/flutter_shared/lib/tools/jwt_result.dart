/// JWT 解码结果
class JwtResult {
  final Map<String, dynamic> header;
  final Map<String, dynamic> payload;
  final String signature;

  /// 是否过期
  bool get isExpired {
    if (payload.containsKey('exp')) {
      final exp = payload['exp'];
      if (exp is num) {
        return DateTime.now().millisecondsSinceEpoch > exp * 1000;
      }
    }
    return false;
  }

  /// 剩余有效秒数
  int? get remainingSeconds {
    if (payload.containsKey('exp')) {
      final exp = payload['exp'];
      if (exp is num) {
        return (exp * 1000 - DateTime.now().millisecondsSinceEpoch) ~/ 1000;
      }
    }
    return null;
  }

  /// 签发时间
  DateTime? get issuedAt {
    if (payload.containsKey('iat')) {
      final iat = payload['iat'];
      if (iat is num) {
        return DateTime.fromMillisecondsSinceEpoch((iat * 1000).toInt());
      }
    }
    return null;
  }

  const JwtResult({
    required this.header,
    required this.payload,
    required this.signature,
  });
}
