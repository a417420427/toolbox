/**
 * 番茄钟工具
 * 移植自 flutter_shared/tools/pomodoro_tool.dart
 */

export const PomodoroTool = {
  defaultWork: 25,
  defaultBreak: 5,
  defaultLongBreak: 15,
  longBreakInterval: 4,

  phaseLabel(phaseIndex: number): string {
    switch (phaseIndex) {
      case 0: return '工作中';
      case 1: return '短休息';
      case 2: return '长休息';
      default: return '';
    }
  },
};
