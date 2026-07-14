/// 番茄钟工具
class PomodoroTool {
  PomodoroTool._();

  static const defaultWork = 25;
  static const defaultBreak = 5;
  static const defaultLongBreak = 15;
  static const longBreakInterval = 4;

  /// 阶段描述
  static String phaseLabel(int phaseIndex) {
    return switch (phaseIndex) {
      0 => '工作中',
      1 => '短休息',
      2 => '长休息',
      _ => '',
    };
  }
}
