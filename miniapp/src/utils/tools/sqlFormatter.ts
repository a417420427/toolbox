/**
 * SQL 格式化工具
 * 移植自 flutter_shared/tools/sql_formatter.dart
 */

export interface SqlProcessResult {
  result: string;
  error?: string;
}

const KEYWORDS = [
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

export const SqlFormatter = {
  format(sql: string): string {
    if (!sql.trim()) return '';

    // 大写关键字
    let result = sql;
    for (const kw of KEYWORDS) {
      result = result.replace(new RegExp(kw, 'gi'), kw);
    }

    // 缩进
    result = result
      .replace(/\bSELECT\b/gi, '\nSELECT')
      .replace(/\bFROM\b/gi, '\nFROM')
      .replace(/\bWHERE\b/gi, '\nWHERE')
      .replace(/\bAND\b(?![^(]*\))/gi, '\n  AND')
      .replace(/\bOR\b(?![^(]*\))/gi, '\n  OR')
      .replace(/\bORDER BY\b/gi, '\nORDER BY')
      .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
      .replace(/\bHAVING\b/gi, '\nHAVING')
      .replace(/\bLIMIT\b/gi, '\nLIMIT')
      .replace(/\bJOIN\b/gi, '\nJOIN')
      .replace(/\bLEFT JOIN\b/gi, '\nLEFT JOIN')
      .replace(/\bRIGHT JOIN\b/gi, '\nRIGHT JOIN')
      .replace(/\bINNER JOIN\b/gi, '\nINNER JOIN')
      .replace(/\bON\b/gi, '\n  ON')
      .replace(/\bSET\b/gi, '\nSET')
      .replace(/\bVALUES\b/gi, '\nVALUES')
      .replace(/\bINSERT INTO\b/gi, '\nINSERT INTO')
      .replace(/\bUPDATE\b/gi, '\nUPDATE')
      .replace(/\bDELETE FROM\b/gi, '\nDELETE FROM')
      .replace(/\bUNION\b/gi, '\nUNION');

    result = result.trim();
    result = result.replace(/\n{3,}/g, '\n\n');
    return result;
  },

  minify(sql: string): string {
    if (!sql.trim()) return '';
    return sql.replace(/\s+/g, ' ').trim();
  },

  process(input: string, isMinify = false): SqlProcessResult {
    if (!input.trim()) return { result: '', error: '请输入 SQL' };
    try {
      if (isMinify) return { result: this.minify(input) };
      return { result: this.format(input) };
    } catch (e: any) {
      return { result: input, error: `格式化失败: ${e.message}` };
    }
  },
};
