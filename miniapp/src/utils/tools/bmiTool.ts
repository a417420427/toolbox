/**
 * BMI / 健康指标计算
 * 移植自 flutter_shared/tools/bmi_tool.dart
 */

export interface BmiCategory {
  label: string;
  detail: string;
  color: string;
}

export const BmiTool = {
  bmi(weightKg: number, heightCm: number): number {
    if (heightCm <= 0 || weightKg <= 0) return NaN;
    const h = heightCm / 100;
    return weightKg / (h * h);
  },

  bmiCategory(bmi: number): BmiCategory {
    if (isNaN(bmi) || bmi <= 0) return { label: '—', detail: '请输入有效数值', color: '#999' };
    if (bmi < 18.5) return { label: '偏瘦', detail: 'BMI < 18.5，建议适当增加营养摄入', color: '#2196F3' };
    if (bmi < 24) return { label: '正常', detail: '18.5 ≤ BMI < 24，继续保持！', color: '#4CAF50' };
    if (bmi < 28) return { label: '超重', detail: '24 ≤ BMI < 28，建议控制饮食、增加运动', color: '#FF9800' };
    return { label: '肥胖', detail: 'BMI ≥ 28，建议咨询专业人士制定减重计划', color: '#F44336' };
  },

  bmr(weightKg: number, heightCm: number, age: number, isMale: boolean): number {
    const bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return isMale ? bmr + 5 : bmr - 161;
  },

  activityLevels: [
    { label: '久坐 (基本不运动)', factor: 1.2 },
    { label: '轻度活动 (1-3天/周)', factor: 1.375 },
    { label: '中度活动 (3-5天/周)', factor: 1.55 },
    { label: '高强度活动 (6-7天/周)', factor: 1.725 },
    { label: '极高强度 (运动员/体力劳动)', factor: 1.9 },
  ],

  tdee(bmrValue: number, activityFactor: number): number {
    return bmrValue * activityFactor;
  },

  idealWeightRange(heightCm: number, _isMale: boolean): [number, number] {
    const hInInches = heightCm / 2.54;
    const base = 48.0;
    const extra = (hInInches - 60) * 2.3;
    const ideal = base + extra;
    return [ideal * 0.9, ideal * 1.1];
  },

  bodyFatPercentage(bmi: number, age: number, isMale: boolean): number {
    const sex = isMale ? 1 : 0;
    return (1.20 * bmi) + (0.23 * age) - (10.8 * sex) - 5.4;
  },

  format(value: number, decimals = 1): string {
    if (isNaN(value) || !isFinite(value)) return '—';
    return value.toFixed(decimals);
  },
};
