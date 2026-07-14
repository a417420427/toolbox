import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// 番茄钟工具
class PomodoroPage extends StatefulWidget {
  const PomodoroPage({super.key});

  @override
  State<PomodoroPage> createState() => _PomodoroPageState();
}

class _PomodoroPageState extends State<PomodoroPage> {
  // 0=工作, 1=短休息, 2=长休息
  int _phase = 0;
  int _cycleCount = 0;
  int _secondsLeft = PomodoroTool.defaultWork * 60;
  bool _running = false;
  Timer? _timer;

  // 自定义配置
  int _workMinutes = PomodoroTool.defaultWork;
  int _breakMinutes = PomodoroTool.defaultBreak;
  int _longBreakMinutes = PomodoroTool.defaultLongBreak;

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _start() {
    if (_running) {
      _timer?.cancel();
      setState(() => _running = false);
      return;
    }
    _running = true;
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (!mounted) return;
      setState(() {
        if (_secondsLeft > 0) {
          _secondsLeft--;
        } else {
          _nextPhase();
        }
      });
    });
    notifyListeners();
  }

  void _nextPhase() {
    HapticFeedback.mediumImpact();
    _timer?.cancel();
    _running = false;

    if (_phase == 0) {
      // 工作结束
      _cycleCount++;
      if (_cycleCount % PomodoroTool.longBreakInterval == 0) {
        _phase = 2;
        _secondsLeft = _longBreakMinutes * 60;
      } else {
        _phase = 1;
        _secondsLeft = _breakMinutes * 60;
      }
    } else {
      // 休息结束
      _phase = 0;
      _secondsLeft = _workMinutes * 60;
    }
    notifyListeners();
    _start();
  }

  void _reset() {
    _timer?.cancel();
    setState(() {
      _phase = 0;
      _cycleCount = 0;
      _secondsLeft = _workMinutes * 60;
      _running = false;
    });
  }

  String get _phaseLabel {
    return switch (_phase) {
      0 => '专注工作',
      1 => '短休息',
      2 => '长休息',
      _ => '',
    };
  }

  Color get _phaseColor {
    return switch (_phase) {
      0 => const Color(0xFFE53935),   // 红色
      1 => const Color(0xFF43A047),   // 绿色
      2 => const Color(0xFF1E88E5),   // 蓝色
      _ => AppColors.brand500,
    };
  }

  String get _timeDisplay {
    final m = (_secondsLeft ~/ 60).toString().padLeft(2, '0');
    final s = (_secondsLeft % 60).toString().padLeft(2, '0');
    return '$m:$s';
  }

  double get _progress {
    final total = switch (_phase) {
      0 => _workMinutes * 60,
      1 => _breakMinutes * 60,
      2 => _longBreakMinutes * 60,
      _ => 1,
    };
    return total > 0 ? _secondsLeft / total : 0;
  }

  void _showSettings() {
    final wCtrl = TextEditingController(text: _workMinutes.toString());
    final bCtrl = TextEditingController(text: _breakMinutes.toString());
    final lCtrl = TextEditingController(text: _longBreakMinutes.toString());

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('番茄钟设置'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: wCtrl, decoration: const InputDecoration(labelText: '工作时长 (分钟)', border: OutlineInputBorder()), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextField(controller: bCtrl, decoration: const InputDecoration(labelText: '短休息 (分钟)', border: OutlineInputBorder()), keyboardType: TextInputType.number),
            const SizedBox(height: 12),
            TextField(controller: lCtrl, decoration: const InputDecoration(labelText: '长休息 (分钟)', border: OutlineInputBorder()), keyboardType: TextInputType.number),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('取消')),
          FilledButton(onPressed: () {
            final w = int.tryParse(wCtrl.text) ?? PomodoroTool.defaultWork;
            final b = int.tryParse(bCtrl.text) ?? PomodoroTool.defaultBreak;
            final l = int.tryParse(lCtrl.text) ?? PomodoroTool.defaultLongBreak;
            if (w < 1 || b < 1 || l < 1) return;
            setState(() {
              _workMinutes = w;
              _breakMinutes = b;
              _longBreakMinutes = l;
              if (!_running) {
                _secondsLeft = w * 60;
              }
            });
            Navigator.of(ctx).pop();
          }, child: const Text('保存')),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const Spacer(flex: 2),
        // 阶段标签
        Text(_phaseLabel, style: TextStyle(fontSize: 16, color: _phaseColor, fontWeight: FontWeight.w600)),
        const SizedBox(height: 8),
        // 进度圆环 + 时间
        SizedBox(
          width: 220, height: 220,
          child: Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 220, height: 220,
                child: CircularProgressIndicator(
                  value: _progress,
                  strokeWidth: 8,
                  backgroundColor: AppColors.neutral200,
                  valueColor: AlwaysStoppedAnimation(_phaseColor),
                ),
              ),
              Text(_timeDisplay, style: TextStyle(fontSize: 48, fontWeight: FontWeight.w300, fontFamily: 'monospace', color: _phaseColor)),
            ],
          ),
        ),
        const SizedBox(height: 8),
        Text('已完成 $_cycleCount 个番茄', style: const TextStyle(fontSize: 13, color: AppColors.neutral400)),
        const Spacer(flex: 2),
        // 按钮区
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            IconButton(
              icon: const Icon(Icons.settings_outlined),
              onPressed: _showSettings,
              tooltip: '设置',
            ),
            const SizedBox(width: 24),
            SizedBox(
              width: 120,
              child: FilledButton.icon(
                onPressed: _start,
                icon: Icon(_running ? Icons.pause : Icons.play_arrow),
                label: Text(_running ? '暂停' : '开始'),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  textStyle: const TextStyle(fontSize: 16),
                  backgroundColor: _phaseColor,
                ),
              ),
            ),
            const SizedBox(width: 24),
            IconButton(
              icon: const Icon(Icons.replay_outlined),
              onPressed: _reset,
              tooltip: '重置',
            ),
          ],
        ),
        const Spacer(flex: 1),
      ],
    );
  }

  void notifyListeners() {
    if (mounted) setState(() {});
  }
}
