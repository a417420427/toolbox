import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';
import 'dart:async';

/// 纪念日 / 倒数日
class AnniversaryPage extends StatefulWidget {
  const AnniversaryPage({super.key});

  @override
  State<AnniversaryPage> createState() => _AnniversaryPageState();
}

class _AnniversaryPageState extends State<AnniversaryPage> {
  final List<_AnniversaryItem> _items = [];
  Timer? _timer;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) {
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  void _addItem() {
    final nameCtrl = TextEditingController();
    DateTime selected = DateTime.now().add(const Duration(days: 30));
    String label = '倒数日';

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setDialogState) => AlertDialog(
          title: const Text('添加纪念日'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameCtrl,
                decoration: const InputDecoration(labelText: '名称', border: OutlineInputBorder(), hintText: '例: 恋爱纪念日'),
                autofocus: true,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () async {
                        final picked = await showDatePicker(
                          context: ctx,
                          initialDate: selected,
                          firstDate: DateTime(2000),
                          lastDate: DateTime(2100),
                        );
                        if (picked != null) {
                          setDialogState(() => selected = picked);
                        }
                      },
                      icon: const Icon(Icons.calendar_today, size: 16),
                      label: Text('${selected.year}/${selected.month}/${selected.day}'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              SegmentedButton<String>(
                segments: const [
                  ButtonSegment(value: 'countdown', label: Text('倒数日')),
                  ButtonSegment(value: 'since', label: Text('已过天数')),
                ],
                selected: {label},
                onSelectionChanged: (v) => setDialogState(() => label = v.first),
              ),
            ],
          ),
          actions: [
            TextButton(onPressed: () => Navigator.of(ctx).pop(), child: const Text('取消')),
            FilledButton(
              onPressed: () {
                if (nameCtrl.text.trim().isEmpty) return;
                setState(() {
                  _items.add(_AnniversaryItem(
                    name: nameCtrl.text.trim(),
                    date: selected,
                    isCountdown: label == 'countdown',
                  ));
                });
                Navigator.of(ctx).pop();
              },
              child: const Text('添加'),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        if (_items.isEmpty)
          Expanded(
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.favorite_border, size: 64, color: AppColors.neutral300),
                  const SizedBox(height: 16),
                  const Text('还没有纪念日', style: TextStyle(fontSize: 16, color: AppColors.neutral400)),
                  const SizedBox(height: 8),
                  TextButton.icon(
                    onPressed: _addItem,
                    icon: const Icon(Icons.add),
                    label: const Text('添加纪念日'),
                  ),
                ],
              ),
            ),
          )
        else
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _items.length + 1, // +1 添加按钮
              itemBuilder: (context, index) {
                if (index == 0) {
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12),
                    child: OutlinedButton.icon(
                      onPressed: _addItem,
                      icon: const Icon(Icons.add),
                      label: const Text('添加'),
                    ),
                  );
                }
                final item = _items[index - 1];
                final result = AnniversaryTool.calculate(item.date);
                return _AnniversaryCard(
                  name: item.name,
                  date: item.date,
                  result: result,
                  onDelete: () => setState(() => _items.removeAt(index - 1)),
                );
              },
            ),
          ),
      ],
    );
  }
}

class _AnniversaryItem {
  final String name;
  final DateTime date;
  final bool isCountdown;

  _AnniversaryItem({required this.name, required this.date, this.isCountdown = true});
}

class _AnniversaryCard extends StatelessWidget {
  final String name;
  final DateTime date;
  final ({int days, String description}) result;
  final VoidCallback onDelete;

  const _AnniversaryCard({
    required this.name,
    required this.date,
    required this.result,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final isPast = result.days < 0;
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                const SizedBox(height: 4),
                Text(AnniversaryTool.formatDate(date), style: const TextStyle(fontSize: 12, color: AppColors.neutral400)),
                const SizedBox(height: 8),
                Text(
                  result.description,
                  style: TextStyle(fontSize: 14, color: isPast ? AppColors.warning : AppColors.brand500),
                ),
              ],
            ),
            const Spacer(),
            IconButton(
              icon: const Icon(Icons.delete_outline, size: 18, color: AppColors.error),
              onPressed: onDelete,
              tooltip: '删除',
            ),
          ],
        ),
      ),
    );
  }
}
