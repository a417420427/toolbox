/// 备忘录 / 速记工具
class MemoTool {
  MemoTool._();

  static const List<({String name, int seconds})> presets = [
    (name: '1 分钟', seconds: 60),
    (name: '3 分钟', seconds: 180),
    (name: '5 分钟', seconds: 300),
    (name: '10 分钟', seconds: 600),
    (name: '15 分钟', seconds: 900),
    (name: '30 分钟', seconds: 1800),
    (name: '1 小时', seconds: 3600),
  ];

  static String formatTimer(int seconds) {
    if (seconds < 60) return '$seconds 秒';
    if (seconds < 3600) return '${seconds ~/ 60} 分 ${seconds % 60} 秒';
    final h = seconds ~/ 3600;
    final m = (seconds % 3600) ~/ 60;
    return '$h 时 $m 分';
  }
}
