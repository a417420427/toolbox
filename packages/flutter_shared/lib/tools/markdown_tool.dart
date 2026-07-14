/// Markdown 预览工具
/// 
/// 纯 Dart 实现的简易 Markdown → HTML 转换器。
/// 覆盖常用语法：标题、粗体、斜体、代码、链接、图片、列表、引用、表格、分隔线。
class MarkdownTool {
  MarkdownTool._();

  /// 将 Markdown 文本转换为 HTML
  static String toHtml(String markdown) {
    if (markdown.trim().isEmpty) return '';

    final lines = markdown.split('\n');
    final html = StringBuffer();
    final body = StringBuffer();

    int i = 0;
    while (i < lines.length) {
      final line = lines[i];
      final trimmed = line.trim();

      // 空行
      if (trimmed.isEmpty) {
        body.write('<br>');
        i++;
        continue;
      }

      // 代码块（```）
      if (trimmed.startsWith('```')) {
        final lang = trimmed.substring(3).trim();
        final codeLines = <String>[];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.add(lines[i]);
          i++;
        }
        i++; // 跳过结束 ```
        final code = codeLines.join('\n');
        final escaped = _escapeHtml(code);
        if (lang.isNotEmpty) {
          body.write('<pre><code class="language-$lang">$escaped</code></pre>');
        } else {
          body.write('<pre><code>$escaped</code></pre>');
        }
        continue;
      }

      // 引用块 >
      if (trimmed.startsWith('> ')) {
        body.write('<blockquote>');
        while (i < lines.length) {
          final t = lines[i].trim();
          if (t.startsWith('> ')) {
            body.write('${_inlineToHtml(t.substring(2))}<br>');
            i++;
          } else if (t == '>') {
            i++;
          } else {
            break;
          }
        }
        body.write('</blockquote>');
        continue;
      }

      // 分隔线 --- 或 ***
      if (RegExp(r'^(-{3,}|\*{3,})$').hasMatch(trimmed)) {
        body.write('<hr>');
        i++;
        continue;
      }

      // 标题 ##~
      if (trimmed.startsWith('###### ')) {
        body.write('<h6>${_inlineToHtml(trimmed.substring(7))}</h6>');
        i++;
        continue;
      }
      if (trimmed.startsWith('##### ')) {
        body.write('<h5>${_inlineToHtml(trimmed.substring(6))}</h5>');
        i++;
        continue;
      }
      if (trimmed.startsWith('#### ')) {
        body.write('<h4>${_inlineToHtml(trimmed.substring(5))}</h4>');
        i++;
        continue;
      }
      if (trimmed.startsWith('### ')) {
        body.write('<h3>${_inlineToHtml(trimmed.substring(4))}</h3>');
        i++;
        continue;
      }
      if (trimmed.startsWith('## ')) {
        body.write('<h2>${_inlineToHtml(trimmed.substring(3))}</h2>');
        i++;
        continue;
      }
      if (trimmed.startsWith('# ')) {
        body.write('<h1>${_inlineToHtml(trimmed.substring(2))}</h1>');
        i++;
        continue;
      }

      // 无序列表 - / * / +
      if (RegExp(r'^[-*+]\s').hasMatch(trimmed)) {
        body.write('<ul>');
        while (i < lines.length) {
          final t = lines[i].trim();
          if (RegExp(r'^[-*+]\s').hasMatch(t)) {
            body.write('<li>${_inlineToHtml(t.substring(2).trim())}</li>');
            i++;
          } else {
            break;
          }
        }
        body.write('</ul>');
        continue;
      }

      // 有序列表 1. 2.
      if (RegExp(r'^\d+\.\s').hasMatch(trimmed)) {
        body.write('<ol>');
        while (i < lines.length) {
          final t = lines[i].trim();
          if (RegExp(r'^\d+\.\s').hasMatch(t)) {
            final content = t.substring(t.indexOf('.') + 1).trim();
            body.write('<li>${_inlineToHtml(content)}</li>');
            i++;
          } else {
            break;
          }
        }
        body.write('</ol>');
        continue;
      }

      // 表格
      if (trimmed.startsWith('|') && trimmed.endsWith('|') && _isTableRow(lines, i)) {
        body.write('<table><thead><tr>');
        final headerCells = _parseTableRow(trimmed);
        for (final cell in headerCells) {
          body.write('<th>${_inlineToHtml(cell.trim())}</th>');
        }
        body.write('</tr></thead><tbody>');
        i++;
        // 跳过对齐行
        if (i < lines.length && _isTableAlignmentRow(lines[i].trim())) {
          i++;
        }
        while (i < lines.length) {
          final t = lines[i].trim();
          if (t.startsWith('|') && t.endsWith('|')) {
            body.write('<tr>');
            final cells = _parseTableRow(t);
            for (final cell in cells) {
              body.write('<td>${_inlineToHtml(cell.trim())}</td>');
            }
            body.write('</tr>');
            i++;
          } else {
            break;
          }
        }
        body.write('</tbody></table>');
        continue;
      }

      // 普通段落
      body.write('<p>${_inlineToHtml(trimmed)}</p>');
      i++;
    }

    html.write('<!doctype html><html><head>'
        '<meta charset="utf-8">'
        '<meta name="viewport" content="width=device-width,initial-scale=1">'
        '<style>'
        'body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;'
        'max-width:100%;padding:16px;font-size:16px;line-height:1.6;color:#1a1a1a;overflow-wrap:break-word}'
        'pre{background:#f4f4f4;padding:12px;border-radius:6px;overflow-x:auto;font-size:14px}'
        'code{background:#f0f0f0;padding:2px 6px;border-radius:3px;font-size:0.9em}'
        'pre code{background:none;padding:0}'
        'table{border-collapse:collapse;width:100%}'
        'th,td{border:1px solid #ddd;padding:8px;text-align:left}'
        'th{background:#f5f5f5;font-weight:600}'
        'blockquote{border-left:4px solid #ddd;margin:0;padding-left:16px;color:#666}'
        'hr{border:none;border-top:2px solid #eee;margin:16px 0}'
        'img{max-width:100%}'
        'a{color:#0366d6}'
        'h1,h2,h3,h4,h5,h6{margin-top:20px;margin-bottom:10px}'
        'ul,ol{padding-left:24px}'
        // dark mode
        '@media(prefers-color-scheme:dark){'
        'body{background:#1a1a2e;color:#e0e0e0}'
        'pre,code{background:#2a2a3e}'
        'th,td{border-color:#333}'
        'th{background:#2a2a3e}'
        'blockquote{border-color:#444;color:#999}'
        'hr{border-color:#333}'
        'a{color:#58a6ff}'
        '}'
        '</style></head><body>');
    html.write(body.toString());
    html.write('</body></html>');
    return html.toString();
  }

  /// 行内语法处理
  static String _inlineToHtml(String text) {
    var result = _escapeHtml(text);

    // 图片 ![alt](url)
    result = result.replaceAllMapped(
      RegExp(r'!\[([^\]]*)\]\(([^)]+)\)'),
      (m) => '<img src="${_escapeAttr(m.group(2)!)}" alt="${_escapeAttr(m.group(1)!)}">',
    );

    // 链接 [text](url)
    result = result.replaceAllMapped(
      RegExp(r'\[([^\]]+)\]\(([^)]+)\)'),
      (m) => '<a href="${_escapeAttr(m.group(2)!)}">${m.group(1)}</a>',
    );

    // 行内代码 `code`
    result = result.replaceAllMapped(
      RegExp(r'`([^`]+)`'),
      (m) => '<code>${_escapeHtml(m.group(1)!)}</code>',
    );

    // 粗体 **text** 或 __text__
    result = result.replaceAllMapped(
      RegExp(r'\*\*(.+?)\*\*'),
      (m) => '<strong>${m.group(1)}</strong>',
    );
    result = result.replaceAllMapped(
      RegExp(r'__(.+?)__'),
      (m) => '<strong>${m.group(1)}</strong>',
    );

    // 斜体 *text* 或 _text_
    result = result.replaceAllMapped(
      RegExp(r'\*(.+?)\*'),
      (m) => '<em>${m.group(1)}</em>',
    );
    result = result.replaceAllMapped(
      RegExp(r'_(.+?)_'),
      (m) => '<em>${m.group(1)}</em>',
    );

    // 删除线 ~~text~~
    result = result.replaceAllMapped(
      RegExp(r'~~(.+?)~~'),
      (m) => '<del>${m.group(1)}</del>',
    );

    return result;
  }

  static String _escapeHtml(String s) {
    return s
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;');
  }

  static String _escapeAttr(String s) {
    return s
        .replaceAll('&', '&amp;')
        .replaceAll('"', '&quot;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;');
  }

  static bool _isTableRow(List<String> lines, int i) {
    final t = lines[i].trim();
    return t.startsWith('|') && t.endsWith('|') && t.contains('|');
  }

  static bool _isTableAlignmentRow(String s) {
    return RegExp(r'^\|[-:\s|]+\|$').hasMatch(s);
  }

  static List<String> _parseTableRow(String s) {
    final inner = s.substring(1, s.length - 1);
    return inner.split('|').map((c) => c.trim()).toList();
  }
}
