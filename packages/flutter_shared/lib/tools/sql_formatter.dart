/// SQL 格式化工具（简化版）
class SqlFormatter {
  SqlFormatter._();

  static final _keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL',
    'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'TABLE', 'ALTER', 'DROP', 'INDEX', 'VIEW',
    'JOIN', 'LEFT', 'RIGHT', 'INNER', 'OUTER', 'ON', 'AS',
    'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET',
    'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX',
    'BETWEEN', 'LIKE', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END',
    'UNION', 'ALL', 'EXCEPT', 'INTERSECT',
    'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'CONSTRAINT',
    'DEFAULT', 'NOT', 'NULL', 'CHECK', 'UNIQUE', 'AUTO_INCREMENT',
    'IF', 'EXISTS', 'BEGIN', 'COMMIT', 'ROLLBACK',
  ];

  static String format(String sql) {
    if (sql.trim().isEmpty) return '';

    // 大写关键字
    var result = sql;
    for (final kw in _keywords) {
      result = result.replaceAll(
        RegExp(kw, caseSensitive: false),
        kw,
      );
    }

    // 简单的缩进
    result = result
        .replaceAll(RegExp(r'\bSELECT\b', caseSensitive: false), '\nSELECT')
        .replaceAll(RegExp(r'\bFROM\b', caseSensitive: false), '\nFROM')
        .replaceAll(RegExp(r'\bWHERE\b', caseSensitive: false), '\nWHERE')
        .replaceAll(RegExp(r'\bAND\b(?![^(]*\))', caseSensitive: false), '\n  AND')
        .replaceAll(RegExp(r'\bOR\b(?![^(]*\))', caseSensitive: false), '\n  OR')
        .replaceAll(RegExp(r'\bORDER BY\b', caseSensitive: false), '\nORDER BY')
        .replaceAll(RegExp(r'\bGROUP BY\b', caseSensitive: false), '\nGROUP BY')
        .replaceAll(RegExp(r'\bHAVING\b', caseSensitive: false), '\nHAVING')
        .replaceAll(RegExp(r'\bLIMIT\b', caseSensitive: false), '\nLIMIT')
        .replaceAll(RegExp(r'\bJOIN\b', caseSensitive: false), '\nJOIN')
        .replaceAll(RegExp(r'\bLEFT JOIN\b', caseSensitive: false), '\nLEFT JOIN')
        .replaceAll(RegExp(r'\bRIGHT JOIN\b', caseSensitive: false), '\nRIGHT JOIN')
        .replaceAll(RegExp(r'\bINNER JOIN\b', caseSensitive: false), '\nINNER JOIN')
        .replaceAll(RegExp(r'\bON\b', caseSensitive: false), '\n  ON')
        .replaceAll(RegExp(r'\bSET\b', caseSensitive: false), '\nSET')
        .replaceAll(RegExp(r'\bVALUES\b', caseSensitive: false), '\nVALUES')
        .replaceAll(RegExp(r'\bINSERT INTO\b', caseSensitive: false), '\nINSERT INTO')
        .replaceAll(RegExp(r'\bUPDATE\b', caseSensitive: false), '\nUPDATE')
        .replaceAll(RegExp(r'\bDELETE FROM\b', caseSensitive: false), '\nDELETE FROM')
        .replaceAll(RegExp(r'\bUNION\b', caseSensitive: false), '\nUNION');

    result = result.trim();

    // 清理多空行
    result = result.replaceAll(RegExp(r'\n{3,}'), '\n\n');

    return result;
  }

  /// 压缩（单行）
  static String minify(String sql) {
    if (sql.trim().isEmpty) return '';
    return sql
        .replaceAll(RegExp(r'\s+'), ' ')
        .trim();
  }

  static ({String result, String? error}) process(String input, {bool isMinify = false}) {
    if (input.trim().isEmpty) {
      return (result: '', error: '请输入 SQL');
    }
    try {
      if (isMinify) {
        return (result: minify(input), error: null);
      }
      return (result: format(input), error: null);
    } catch (e) {
      return (result: input, error: '格式化失败: $e');
    }
  }
}
