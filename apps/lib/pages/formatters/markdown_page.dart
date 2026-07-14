import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// Markdown 预览 — 实时渲染
class MarkdownPage extends StatefulWidget {
  const MarkdownPage({super.key});

  @override
  State<MarkdownPage> createState() => _MarkdownPageState();
}

class _MarkdownPageState extends State<MarkdownPage> {
  final _ctrl = TextEditingController(
    text: '# Hello\n\n这是 **Markdown** 预览工具。\n\n```dart\nvoid main() {\n  print("Hello");\n}\n```\n\n- 列表项 1\n- 列表项 2\n\n> 引用文本',
  );
  bool _showPreview = true;
  String _html = '';

  void _update() {
    setState(() {
      _html = MarkdownTool.toHtml(_ctrl.text);
    });
  }

  @override
  void initState() {
    super.initState();
    _update();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // 切换栏
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Row(
            children: [
              Expanded(
                child: SegmentedButton<bool>(
                  segments: const [
                    ButtonSegment(value: false, label: Text('编辑'), icon: Icon(Icons.edit, size: 16)),
                    ButtonSegment(value: true, label: Text('预览'), icon: Icon(Icons.visibility, size: 16)),
                  ],
                  selected: {_showPreview},
                  onSelectionChanged: (v) => setState(() => _showPreview = v.first),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: _ctrl.text));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('已复制'), duration: Duration(seconds: 1)),
                  );
                },
                icon: const Icon(Icons.copy, size: 20),
                tooltip: '复制 Markdown',
              ),
              IconButton(
                onPressed: () {
                  Clipboard.setData(ClipboardData(text: _html));
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('HTML 已复制'), duration: Duration(seconds: 1)),
                  );
                },
                icon: const Icon(Icons.code, size: 20),
                tooltip: '复制 HTML',
              ),
            ],
          ),
        ),

        // 编辑区 / 预览区
        Expanded(
          child: _showPreview ? _buildPreview() : _buildEditor(),
        ),
      ],
    );
  }

  Widget _buildEditor() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 12),
      child: TextField(
        controller: _ctrl,
        maxLines: null,
        expands: true,
        textAlignVertical: TextAlignVertical.top,
        style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
        decoration: const InputDecoration(
          border: OutlineInputBorder(),
          contentPadding: EdgeInsets.all(12),
          hintText: '输入 Markdown...',
        ),
        onChanged: (_) => _update(),
      ),
    );
  }

  Widget _buildPreview() {
    if (_html.isEmpty) {
      return Center(
        child: Text('输入 Markdown 后预览', style: TextStyle(color: AppColors.neutral400)),
      );
    }

    // 使用 WebView 来显示 HTML（Flutter 内置的 HtmlElementView 需要 web 平台，
    // 这里用文本+内联样式渲染更实际的方式）
    return SingleChildScrollView(
      padding: const EdgeInsets.all(12),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 简单的文本渲染 — 更精确的做法是用 flutter_markdown 包
          // 但这里我们展示一个简易的文本解析结果
          _renderSimpleMarkdown(_ctrl.text),
        ],
      ),
    );
  }

  /// 简易的 Markdown → Widget 渲染
  Widget _renderSimpleMarkdown(String text) {
    final lines = text.split('\n');
    final widgets = <Widget>[];
    int i = 0;

    while (i < lines.length) {
      final line = lines[i];
      final trimmed = line.trim();

      if (trimmed.isEmpty) {
        i++;
        continue;
      }

      // 代码块
      if (trimmed.startsWith('```')) {
        final codeLines = <String>[];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.add(lines[i]);
          i++;
        }
        i++;
        widgets.add(
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(12),
            margin: const EdgeInsets.only(bottom: 8),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8),
            ),
            child: SelectableText(
              codeLines.join('\n'),
              style: const TextStyle(fontFamily: 'monospace', fontSize: 13),
            ),
          ),
        );
        continue;
      }

      // 标题
      if (trimmed.startsWith('###### ')) { widgets.add(Text(trimmed.substring(7), style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold))); i++; continue; }
      if (trimmed.startsWith('##### ')) { widgets.add(Text(trimmed.substring(6), style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold))); i++; continue; }
      if (trimmed.startsWith('#### ')) { widgets.add(Text(trimmed.substring(5), style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold))); i++; continue; }
      if (trimmed.startsWith('### ')) { widgets.add(Text(trimmed.substring(4), style: const TextStyle(fontSize: 17, fontWeight: FontWeight.bold))); i++; continue; }
      if (trimmed.startsWith('## ')) { widgets.add(Text(trimmed.substring(3), style: const TextStyle(fontSize: 19, fontWeight: FontWeight.bold))); i++; continue; }
      if (trimmed.startsWith('# ')) { widgets.add(Text(trimmed.substring(2), style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold))); i++; continue; }

      // 列表
      if (RegExp(r'^[-*+]\s').hasMatch(trimmed)) {
        final items = <String>[];
        while (i < lines.length && RegExp(r'^[-*+]\s').hasMatch(lines[i].trim())) {
          items.add(lines[i].trim().substring(2).trim());
          i++;
        }
        widgets.add(Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: items.map((item) => Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('  •  ', style: TextStyle(fontSize: 14)),
              Expanded(child: Text(item, style: const TextStyle(fontSize: 14))),
            ],
          )).toList(),
        ));
        widgets.add(const SizedBox(height: 4));
        continue;
      }

      // 引用
      if (trimmed.startsWith('> ')) {
        final quoteLines = <String>[];
        while (i < lines.length && lines[i].trim().startsWith('> ')) {
          quoteLines.add(lines[i].trim().substring(2));
          i++;
        }
        widgets.add(
          Container(
            width: double.infinity,
            padding: const EdgeInsets.fromLTRB(12, 4, 12, 4),
            margin: const EdgeInsets.only(bottom: 8),
            decoration: const BoxDecoration(
              border: Border(left: BorderSide(color: Colors.grey, width: 3)),
            ),
            child: Text(quoteLines.join('\n'), style: TextStyle(color: Colors.grey.shade600, fontSize: 14)),
          ),
        );
        continue;
      }

      // 分割线
      if (RegExp(r'^(-{3,}|\*{3,})$').hasMatch(trimmed)) {
        widgets.add(const Divider(height: 24));
        i++;
        continue;
      }

      // 普通段落
      widgets.add(Padding(
        padding: const EdgeInsets.only(bottom: 8),
        child: _renderInlineText(trimmed),
      ));
      i++;
    }

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: widgets,
    );
  }

  Widget _renderInlineText(String text) {
    // 粗体 ** **
    final boldParts = text.split(RegExp(r'\*\*(.+?)\*\*'));
    final spans = <InlineSpan>[];
    bool isBold = false;
    for (final part in boldParts) {
      if (part.isEmpty) { isBold = !isBold; continue; }
      if (isBold) {
        spans.add(TextSpan(text: part, style: const TextStyle(fontWeight: FontWeight.bold)));
      } else {
        // 检查斜体
        final italicParts = part.split(RegExp(r'\*(.+?)\*'));
        bool isItalic = false;
        for (final ip in italicParts) {
          if (ip.isEmpty) { isItalic = !isItalic; continue; }
          spans.add(TextSpan(
            text: ip,
            style: TextStyle(fontStyle: isItalic ? FontStyle.italic : FontStyle.normal),
          ));
          isItalic = !isItalic;
        }
      }
      isBold = !isBold;
    }

    return RichText(
      text: TextSpan(
        style: const TextStyle(fontSize: 14, color: Colors.black87),
        children: spans,
      ),
    );
  }
}
