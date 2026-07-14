import 'dart:convert';
import 'dart:typed_data';

import 'package:pointycastle/export.dart';

/// AES 加密模式
enum AesMode { cbc, ecb, ctr, gcm }

/// AES 密钥长度
enum AesKeySize { bits128, bits192, bits256 }

/// AES 加解密工具
class AesTool {
  AesTool._();

  /// 加密结果
  static ({String encrypted, String? error}) encrypt({
    required String plaintext,
    required String password,
    AesMode mode = AesMode.cbc,
    AesKeySize keySize = AesKeySize.bits256,
  }) {
    if (plaintext.isEmpty) return (encrypted: '', error: '明文不能为空');
    if (password.isEmpty) return (encrypted: '', error: '密码不能为空');

    try {
      final key = _deriveKey(password, keySize);
      final iv = _randomBytes(16);
      final plainBytes = utf8.encode(plaintext);
      final padded = _pad(Uint8List.fromList(plainBytes), 16);

      final cipher = _createCipher(mode, key, iv);
      final cipherBytes = cipher.process(padded);

      final totalLen = iv.length + cipherBytes.length;
      final combined = Uint8List(totalLen);
      combined.setRange(0, iv.length, iv);
      combined.setRange(iv.length, totalLen, cipherBytes);

      return (encrypted: base64.encode(combined), error: null);
    } catch (e) {
      return (encrypted: '', error: '加密失败: $e');
    }
  }

  /// 解密结果
  static ({String plaintext, String? error}) decrypt({
    required String encrypted,
    required String password,
    AesMode mode = AesMode.cbc,
    AesKeySize keySize = AesKeySize.bits256,
  }) {
    if (encrypted.isEmpty) return (plaintext: '', error: '密文不能为空');
    if (password.isEmpty) return (plaintext: '', error: '密码不能为空');

    try {
      final combined = base64.decode(encrypted);
      if (combined.length < 17) {
        return (plaintext: '', error: '密文格式错误');
      }

      final iv = combined.sublist(0, 16);
      final cipherBytes = combined.sublist(16);
      final key = _deriveKey(password, keySize);

      final cipher = _createCipher(mode, key, iv, encrypt: false);
      final decryptedPadded = cipher.process(Uint8List.fromList(cipherBytes));
      final decrypted = _unpad(decryptedPadded);

      return (plaintext: utf8.decode(decrypted), error: null);
    } catch (e) {
      return (plaintext: '', error: '解密失败: $e');
    }
  }

  /// 从密码派生密钥（PBKDF2-HMAC-SHA256）
  static Uint8List _deriveKey(String password, AesKeySize size) {
    final keyLen = switch (size) {
      AesKeySize.bits128 => 16,
      AesKeySize.bits192 => 24,
      AesKeySize.bits256 => 32,
    };

    final pbkdf2 = PBKDF2KeyDerivator(HMac(SHA256Digest(), 64));
    final salt = Uint8List.fromList(utf8.encode('toolbox-salt-2024'));
    pbkdf2.init(Pbkdf2Parameters(salt, 10000, keyLen));
    return pbkdf2.process(Uint8List.fromList(utf8.encode(password)));
  }

  /// 创建加密/解密器
  static BlockCipher _createCipher(AesMode mode, Uint8List key, Uint8List iv,
      {bool encrypt = true}) {
    final aes = AESEngine();

    switch (mode) {
      case AesMode.cbc:
        return CBCBlockCipher(aes)
          ..init(encrypt, ParametersWithIV(KeyParameter(key), iv));
      case AesMode.ecb:
        return ECBBlockCipher(aes)
          ..init(encrypt, KeyParameter(key));
      case AesMode.ctr:
        return SICBlockCipher(aes.blockSize, SICStreamCipher(aes))
          ..init(encrypt, ParametersWithIV(KeyParameter(key), iv));
      case AesMode.gcm:
        return GCMBlockCipher(aes)
          ..init(encrypt, AEADParameters(
            KeyParameter(key), 128, iv, Uint8List(0)));
    }
  }

  static Uint8List _randomBytes(int length) {
    final secureRandom = FortunaRandom();
    final seed = Uint8List(32);
    final now = DateTime.now().microsecondsSinceEpoch;
    for (var i = 0; i < 32; i++) {
      seed[i] = ((now >> ((i % 8) * 8)) & 0xff) ^ (i * 37 + 0xab);
    }
    secureRandom.seed(KeyParameter(seed));
    final bytes = Uint8List(length);
    for (var i = 0; i < length; i++) {
      bytes[i] = secureRandom.nextUint8();
    }
    return bytes;
  }

  /// PKCS7 填充
  static Uint8List _pad(Uint8List data, int blockSize) {
    final padLen = blockSize - (data.length % blockSize);
    final padded = Uint8List(data.length + padLen);
    padded.setRange(0, data.length, data);
    for (var i = data.length; i < padded.length; i++) {
      padded[i] = padLen;
    }
    return padded;
  }

  /// 移除 PKCS7 填充
  static Uint8List _unpad(Uint8List data) {
    if (data.isEmpty) return data;
    final padLen = data[data.length - 1];
    if (padLen > 16 || padLen <= 0) return data;
    for (var i = data.length - padLen; i < data.length; i++) {
      if (data[i] != padLen) return data;
    }
    return data.sublist(0, data.length - padLen);
  }
}
