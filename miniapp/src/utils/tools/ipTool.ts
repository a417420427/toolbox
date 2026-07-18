/**
 * IP 工具
 * 移植自 flutter_shared/tools/ip_tool.dart
 */

function ipToInt(ip: string): number {
  const parts = ip.split('.').map(n => parseInt(n));
  return (parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3];
}

function intToIp(value: number): string {
  return `${(value >> 24) & 0xFF}.${(value >> 16) & 0xFF}.${(value >> 8) & 0xFF}.${value & 0xFF}`;
}

export const IpTool = {
  /** CIDR → 子网掩码 */
  prefixToMask(prefix: number): string {
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    return intToIp(mask);
  },

  /** 网络地址 */
  networkAddress(ip: string, prefix: number): string {
    const ipInt = ipToInt(ip);
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    return intToIp(ipInt & mask);
  },

  /** 广播地址 */
  broadcastAddress(ip: string, prefix: number): string {
    const ipInt = ipToInt(ip);
    const mask = (0xFFFFFFFF << (32 - prefix)) >>> 0;
    const wildcard = ~mask >>> 0;
    return intToIp(ipInt | wildcard);
  },

  /** 主机数量 */
  hostCount(prefix: number): number {
    if (prefix >= 31) return prefix === 31 ? 2 : 1;
    return (1 << (32 - prefix)) - 2;
  },

  /** 第一个可用主机 */
  firstHost(ip: string, prefix: number): string | null {
    if (prefix >= 31) return null;
    const net = ipToInt(this.networkAddress(ip, prefix));
    return intToIp(net + 1);
  },

  /** 最后一个可用主机 */
  lastHost(ip: string, prefix: number): string | null {
    if (prefix >= 31) return null;
    const broadcast = ipToInt(this.broadcastAddress(ip, prefix));
    return intToIp(broadcast - 1);
  },

  /** 验证 IP 格式 */
  isValidIp(ip: string): boolean {
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(p => {
      const n = parseInt(p);
      return !isNaN(n) && n >= 0 && n <= 255;
    });
  },

  /** 验证 CIDR 前缀 */
  isValidPrefix(prefix: number): boolean {
    return prefix >= 0 && prefix <= 32;
  },

  /** 生成随机 IPv4 */
  randomIp(): string {
    return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');
  },
};
