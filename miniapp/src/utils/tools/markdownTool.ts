/**
 * Markdown 预览工具 — Markdown → HTML
 * 移植自 flutter_shared/tools/markdown_tool.dart
 */

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function inlineToHtml(text: string): string {
  let result = escapeHtml(text);

  // 图片 ![alt](url)
  result = result.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_m, alt, url) =>
    `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}">`);

  // 链接 [text](url)
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) =>
    `<a href="${escapeHtml(url)}">${text}</a>`);

  // 行内代码
  result = result.replace(/`([^`]+)`/g, (_m, code) => `<code>${escapeHtml(code)}</code>`);

  // 粗体
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // 斜体
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<em>$1</em>');

  // 删除线
  result = result.replace(/~~(.+?)~~/g, '<del>$1</del>');

  return result;
}

export const MarkdownTool = {
  toHtml(markdown: string): string {
    if (!markdown.trim()) return '';

    const lines = markdown.split('\n');
    const body: string[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      // 空行
      if (!trimmed) { body.push('<br>'); i++; continue; }

      // 代码块
      if (trimmed.startsWith('```')) {
        const lang = trimmed.substring(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].trim().startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        i++;
        const code = escapeHtml(codeLines.join('\n'));
        if (lang) body.push(`<pre><code class="language-${lang}">${code}</code></pre>`);
        else body.push(`<pre><code>${code}</code></pre>`);
        continue;
      }

      // 引用
      if (trimmed.startsWith('> ')) {
        body.push('<blockquote>');
        while (i < lines.length) {
          const t = lines[i].trim();
          if (t.startsWith('> ')) { body.push(`${inlineToHtml(t.substring(2))}<br>`); i++; }
          else if (t === '>') { i++; }
          else break;
        }
        body.push('</blockquote>');
        continue;
      }

      // 分隔线
      if (/^(-{3,}|\*{3,})$/.test(trimmed)) { body.push('<hr>'); i++; continue; }

      // 标题
      if (trimmed.startsWith('###### ')) { body.push(`<h6>${inlineToHtml(trimmed.substring(7))}</h6>`); i++; continue; }
      if (trimmed.startsWith('##### ')) { body.push(`<h5>${inlineToHtml(trimmed.substring(6))}</h5>`); i++; continue; }
      if (trimmed.startsWith('#### ')) { body.push(`<h4>${inlineToHtml(trimmed.substring(5))}</h4>`); i++; continue; }
      if (trimmed.startsWith('### ')) { body.push(`<h3>${inlineToHtml(trimmed.substring(4))}</h3>`); i++; continue; }
      if (trimmed.startsWith('## ')) { body.push(`<h2>${inlineToHtml(trimmed.substring(3))}</h2>`); i++; continue; }
      if (trimmed.startsWith('# ')) { body.push(`<h1>${inlineToHtml(trimmed.substring(2))}</h1>`); i++; continue; }

      // 无序列表
      if (/^[-*+]\s/.test(trimmed)) {
        body.push('<ul>');
        while (i < lines.length && /^[-*+]\s/.test(lines[i].trim())) {
          body.push(`<li>${inlineToHtml(lines[i].trim().substring(2).trim())}</li>`);
          i++;
        }
        body.push('</ul>');
        continue;
      }

      // 有序列表
      if (/^\d+\.\s/.test(trimmed)) {
        body.push('<ol>');
        while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
          const t = lines[i].trim();
          body.push(`<li>${inlineToHtml(t.substring(t.indexOf('.') + 1).trim())}</li>`);
          i++;
        }
        body.push('</ol>');
        continue;
      }

      // 表格（简化处理）
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        body.push('<table><thead><tr>');
        const headerCells = trimmed.substring(1, trimmed.length - 1).split('|').map(c => c.trim());
        for (const cell of headerCells) body.push(`<th>${inlineToHtml(cell)}</th>`);
        body.push('</tr></thead><tbody>');
        i++;
        if (i < lines.length && /^\|[-:\s|]+\|$/.test(lines[i].trim())) i++;
        while (i < lines.length) {
          const t = lines[i].trim();
          if (t.startsWith('|') && t.endsWith('|')) {
            body.push('<tr>');
            const cells = t.substring(1, t.length - 1).split('|').map(c => c.trim());
            for (const cell of cells) body.push(`<td>${inlineToHtml(cell)}</td>`);
            body.push('</tr>');
            i++;
          } else break;
        }
        body.push('</tbody></table>');
        continue;
      }

      // 普通段落
      body.push(`<p>${inlineToHtml(trimmed)}</p>`);
      i++;
    }

    return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
body{font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;max-width:100%;padding:16px;font-size:16px;line-height:1.6;color:#1a1a1a;overflow-wrap:break-word}
pre{background:#f4f4f4;padding:12px;border-radius:6px;overflow-x:auto;font-size:14px}
code{background:#f0f0f0;padding:2px 6px;border-radius:3px;font-size:0.9em}
pre code{background:none;padding:0}
table{border-collapse:collapse;width:100%}
th,td{border:1px solid #ddd;padding:8px;text-align:left}
th{background:#f5f5f5;font-weight:600}
blockquote{border-left:4px solid #ddd;margin:0;padding-left:16px;color:#666}
hr{border:none;border-top:2px solid #eee;margin:16px 0}
img{max-width:100%}a{color:#0366d6}
h1,h2,h3,h4,h5,h6{margin-top:20px;margin-bottom:10px}
ul,ol{padding-left:24px}
@media(prefers-color-scheme:dark){
body{background:#1a1a2e;color:#e0e0e0}pre,code{background:#2a2a3e}
th,td{border-color:#333}th{background:#2a2a3e}
blockquote{border-color:#444;color:#999}hr{border-color:#333}a{color:#58a6ff}
}</style></head><body>${body.join('')}</body></html>`;
  },
};
