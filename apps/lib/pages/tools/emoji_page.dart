import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// Emoji 搜索
class EmojiPage extends StatefulWidget {
  const EmojiPage({super.key});

  @override
  State<EmojiPage> createState() => _EmojiPageState();
}

class _EmojiPageState extends State<EmojiPage> {
  final TextEditingController _searchCtrl = TextEditingController();
  String _selectedCategory = '笑脸';
  List<(String, String, String)> _results = EmojiSearch.byCategory('笑脸');

  @override
  void initState() {
    super.initState();
    _searchCtrl.addListener(_search);
  }

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  void _search() {
    final q = _searchCtrl.text.trim();
    setState(() {
      if (q.isEmpty) {
        _results = EmojiSearch.byCategory(_selectedCategory);
      } else {
        _results = EmojiSearch.search(q);
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 搜索
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
          child: TextField(
            controller: _searchCtrl,
            decoration: InputDecoration(
              hintText: '搜索 Emoji…',
              prefixIcon: const Icon(Icons.search, size: 20),
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              contentPadding: const EdgeInsets.symmetric(vertical: 10),
            ),
          ),
        ),
        // 分类标签
        SizedBox(
          height: 40,
          child: ListView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            children: EmojiSearch.categories.map((cat) {
              final selected = cat == _selectedCategory && _searchCtrl.text.isEmpty;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: ChoiceChip(
                  label: Text(cat, style: const TextStyle(fontSize: 12)),
                  selected: selected,
                  onSelected: (_) {
                    setState(() {
                      _selectedCategory = cat;
                      _results = EmojiSearch.byCategory(cat);
                      _searchCtrl.clear();
                    });
                  },
                ),
              );
            }).toList(),
          ),
        ),
        const Divider(height: 16),
        // Emoji 网格
        Expanded(
          child: _results.isEmpty
              ? const Center(child: Text('没有找到匹配的 Emoji', style: TextStyle(color: AppColors.neutral400)))
              : GridView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 6,
                    mainAxisSpacing: 4,
                    crossAxisSpacing: 4,
                    childAspectRatio: 1,
                  ),
                  itemCount: _results.length,
                  itemBuilder: (context, index) {
                    final e = _results[index];
                    return Tooltip(
                      message: e.$2,
                      child: GestureDetector(
                        onTap: () {
                          Clipboard.setData(ClipboardData(text: e.$1));
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('已复制 ${e.$1}'), duration: const Duration(seconds: 1)),
                          );
                        },
                        child: Container(
                          decoration: BoxDecoration(
                            color: Theme.of(context).colorScheme.surface,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: AppColors.neutral200),
                          ),
                          child: Center(
                            child: Text(e.$1, style: const TextStyle(fontSize: 24)),
                          ),
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
