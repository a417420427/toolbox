/// 纪念日/倒数日工具
class AnniversaryTool {
  AnniversaryTool._();

  static ({int days, String description}) calculate(DateTime target) {
    final now = DateTime.now();
    final diff = target.difference(now);

    if (diff.isNegative) {
      final abs = diff.abs();
      final d = abs.inDays;
      if (d == 0) return (days: 0, description: '就是今天！🎉');
      if (d < 365) {
        return (days: -d, description: '已经过去了 $d 天');
      }
      final years = d ~/ 365;
      final remain = d % 365;
      if (remain == 0) {
        return (days: -d, description: '$years 周年纪念 🎂');
      }
      return (days: -d, description: '$years 年零 $remain 天');
    }

    final d = diff.inDays;
    if (d == 0) return (days: 0, description: '就是今天！🎉');
    if (d < 365) {
      return (days: d, description: '还有 $d 天');
    }
    final years = d ~/ 365;
    return (days: d, description: '还有 $d 天（约 $years 年）');
  }

  static String formatDate(DateTime d) {
    return '${d.year}年${d.month}月${d.day}日';
  }
}
