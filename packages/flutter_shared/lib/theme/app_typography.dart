import 'package:flutter/material.dart';

/// 字阶 Token — 对应 DESIGN.md 排版部分
class AppTypography {
  AppTypography._();

  static const String fontSans = 'Inter';
  static const String fontMono = 'JetBrains Mono';

  // ── TextStyles ──
  static const textXs = TextStyle(fontSize: 12, fontWeight: FontWeight.w400, height: 1.33);
  static const textSm = TextStyle(fontSize: 14, fontWeight: FontWeight.w400, height: 1.43);
  static const textBase = TextStyle(fontSize: 16, fontWeight: FontWeight.w400, height: 1.5);
  static const textLg = TextStyle(fontSize: 18, fontWeight: FontWeight.w500, height: 1.55);
  static const textXl = TextStyle(fontSize: 20, fontWeight: FontWeight.w600, height: 1.4);
  static const text2xl = TextStyle(fontSize: 24, fontWeight: FontWeight.w700, height: 1.33);
  static const text3xl = TextStyle(fontSize: 30, fontWeight: FontWeight.w700, height: 1.2);

  // ── Mono variants ──
  static const monoSm = TextStyle(fontSize: 14, fontWeight: FontWeight.w400, fontFamily: fontMono);
  static const monoBase = TextStyle(fontSize: 16, fontWeight: FontWeight.w400, fontFamily: fontMono);
}
