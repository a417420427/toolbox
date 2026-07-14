import 'dart:math';

/// BMI / 健康指标计算
class BmiTool {
  BmiTool._();

  /// 计算 BMI
  /// [weightKg] 体重(kg), [heightCm] 身高(cm)
  static double bmi(double weightKg, double heightCm) {
    if (heightCm <= 0 || weightKg <= 0) return double.nan;
    final h = heightCm / 100; // 转米
    return weightKg / (h * h);
  }

  /// BMI 分级（中国标准）
  static ({String label, String detail, int color}) bmiCategory(double bmi) {
    if (bmi.isNaN || bmi <= 0) return (label: '—', detail: '请输入有效数值', color: 0);
    if (bmi < 18.5) return (label: '偏瘦', detail: 'BMI < 18.5，建议适当增加营养摄入', color: 0xFF2196F3);
    if (bmi < 24) return (label: '正常', detail: '18.5 ≤ BMI < 24，继续保持！', color: 0xFF4CAF50);
    if (bmi < 28) return (label: '超重', detail: '24 ≤ BMI < 28，建议控制饮食、增加运动', color: 0xFFFF9800);
    return (label: '肥胖', detail: 'BMI ≥ 28，建议咨询专业人士制定减重计划', color: 0xFFF44336);
  }

  /// 基础代谢率 BMR（Mifflin-St Jeor 公式）
  /// [weightKg] 体重(kg), [heightCm] 身高(cm), [age] 年龄, [isMale] 是否男性
  static double bmr(double weightKg, double heightCm, int age, bool isMale) {
    final bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return isMale ? bmr + 5 : bmr - 161;
  }

  /// 活动系数
  static const List<({String label, double factor})> activityLevels = [
    (label: '久坐 (基本不运动)', factor: 1.2),
    (label: '轻度活动 (1-3天/周)', factor: 1.375),
    (label: '中度活动 (3-5天/周)', factor: 1.55),
    (label: '高强度活动 (6-7天/周)', factor: 1.725),
    (label: '极高强度 (运动员/体力劳动)', factor: 1.9),
  ];

  /// 每日热量需求 TDEE = BMR × 活动系数
  static double tdee(double bmrValue, double activityFactor) {
    return bmrValue * activityFactor;
  }

  /// 理想体重范围（Devine 公式）
  /// 返回 [下限, 上限] kg
  static List<double> idealWeightRange(int heightCm, bool isMale) {
    final hInInches = heightCm / 2.54;
    final base = isMale ? 50.0 : 45.5;
    final extra = (hInInches - 60) * (isMale ? 2.3 : 2.3);
    final ideal = base + extra;
    return [ideal * 0.9, ideal * 1.1];
  }

  /// 体脂率估算（BMI 法，仅粗略参考）
  /// [bmi] BMI 值, [age] 年龄, [isMale] 是否男性
  static double bodyFatPercentage(double bmi, int age, bool isMale) {
    // Deurenberg 公式
    final sex = isMale ? 1 : 0;
    return (1.20 * bmi) + (0.23 * age) - (10.8 * sex) - 5.4;
  }

  static String format(double value, {int decimals = 1}) {
    if (value.isNaN || value.isInfinite) return '—';
    return value.toStringAsFixed(decimals);
  }
}
