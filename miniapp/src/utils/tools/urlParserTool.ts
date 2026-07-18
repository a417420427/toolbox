/**
 * URL 解析工具
 * 移植自 flutter_shared/tools/url_parser_tool.dart
 */

export interface UrlParseResult {
  protocol: string;
  host: string;
  port: number | null;
  pathname: string;
  search: string;
  params: Record<string, string>;
  hash: string;
  isValid: boolean;
  error?: string;
}

export const UrlParserTool = {
  parse(url: string): UrlParseResult {
    if (!url.trim()) {
      return { protocol: '', host: '', port: null, pathname: '', search: '', params: {}, hash: '', isValid: false, error: 'URL 为空' };
    }

    let remaining = url.trim();

    // protocol
    let protocol = '';
    const protoMatch = remaining.match(/^([a-zA-Z][a-zA-Z0-9+\-.]*):\/\//);
    if (protoMatch) {
      protocol = protoMatch[1];
      remaining = remaining.substring(protoMatch[0].length);
    }

    // hash
    let hash = '';
    const hashIdx = remaining.indexOf('#');
    if (hashIdx !== -1) {
      hash = remaining.substring(hashIdx + 1);
      remaining = remaining.substring(0, hashIdx);
    }

    // search / params
    let search = '';
    const params: Record<string, string> = {};
    const qIdx = remaining.indexOf('?');
    if (qIdx !== -1) {
      search = remaining.substring(qIdx);
      remaining = remaining.substring(0, qIdx);

      const queryStr = search.substring(1);
      for (const pair of queryStr.split('&')) {
        if (!pair) continue;
        const eqIdx = pair.indexOf('=');
        if (eqIdx !== -1) {
          const key = this._decode(pair.substring(0, eqIdx));
          const value = this._decode(pair.substring(eqIdx + 1));
          params[key] = value;
        } else {
          params[this._decode(pair)] = '';
        }
      }
    }

    // auth
    const atIdx = remaining.lastIndexOf('@');
    if (atIdx !== -1) {
      remaining = remaining.substring(atIdx + 1);
    }

    // host + port + pathname
    let host = '';
    let port: number | null = null;
    let pathname = '/';

    if (remaining.startsWith('[')) {
      const closeBracket = remaining.indexOf(']');
      if (closeBracket !== -1) {
        host = remaining.substring(0, closeBracket + 1);
        remaining = remaining.substring(closeBracket + 1);
      }
    } else {
      const slashIdx = remaining.indexOf('/');
      const colonIdx = remaining.indexOf(':');

      if (colonIdx !== -1 && (slashIdx === -1 || colonIdx < slashIdx)) {
        host = remaining.substring(0, colonIdx);
        remaining = remaining.substring(colonIdx + 1);
        const endPortIdx = remaining.indexOf('/');
        const portStr = endPortIdx !== -1 ? remaining.substring(0, endPortIdx) : remaining;
        port = parseInt(portStr) || null;
        remaining = endPortIdx !== -1 ? remaining.substring(endPortIdx) : '';
      } else {
        if (slashIdx !== -1) {
          host = remaining.substring(0, slashIdx);
          remaining = remaining.substring(slashIdx);
        } else {
          host = remaining;
          remaining = '';
        }
      }
    }

    pathname = remaining || '/';

    return {
      protocol,
      host,
      port,
      pathname,
      search,
      params,
      hash,
      isValid: !!protocol && !!host,
      error: (!protocol || !host) ? '缺少协议或主机名' : undefined,
    };
  },

  encode(input: string): string {
    return encodeURIComponent(input);
  },

  decode(input: string): string {
    try {
      return decodeURIComponent(input);
    } catch {
      return input;
    }
  },

  _decode(s: string): string {
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  },
};
