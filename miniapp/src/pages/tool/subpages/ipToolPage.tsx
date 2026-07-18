import React, { useState } from 'react';
import { View, Text, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { IpTool } from '@/utils/tools/ipTool';
import toolStyles from '@/styles/tool-common.module.scss';

const IpToolPage: React.FC = () => {
  const [ipInput, setIpInput] = useState('');
  const [cidrInput, setCidrInput] = useState('');
  const [prefix, setPrefix] = useState(24);
  const [results, setResults] = useState<Array<{ label: string; value: string }>>([]);

  const calculate = () => {
    if (!IpTool.isValidIp(ipInput)) {
      Taro.showToast({ title: '无效 IP 地址', icon: 'none' });
      return;
    }
    const items: Array<{ label: string; value: string }> = [
      { label: 'IP 地址', value: ipInput },
      { label: '子网掩码', value: IpTool.prefixToMask(prefix) },
      { label: 'CIDR', value: `${ipInput}/${prefix}` },
      { label: '网络地址', value: IpTool.networkAddress(ipInput, prefix) },
      { label: '广播地址', value: IpTool.broadcastAddress(ipInput, prefix) },
      { label: '可用主机数', value: `${IpTool.hostCount(prefix)}` },
    ];
    const first = IpTool.firstHost(ipInput, prefix);
    const last = IpTool.lastHost(ipInput, prefix);
    if (first) items.push({ label: '第一个主机', value: first });
    if (last) items.push({ label: '最后一个主机', value: last });

    if (cidrInput && IpTool.isValidIp(cidrInput)) {
      const inRange = IpTool.isInRange(cidrInput, ipInput, prefix);
      items.push({ label: `${cidrInput} 是否在范围内`, value: inRange ? '是 ✅' : '否 ❌' });
    }

    setResults(items);
  };

  const randomIp = () => {
    setIpInput(IpTool.randomIp());
  };

  return (
    <View>
      <View className={toolStyles.section}>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>IP 地址</Text>
          <Textarea
            className={toolStyles.textarea}
            value={ipInput}
            onInput={e => setIpInput(e.detail.value)}
            placeholder="如: 192.168.1.0"
            style={{ height: '80rpx', flex: 1 }}
          />
          <Button className={toolStyles.btnSecondary} onClick={randomIp} style={{ flexShrink: 0, width: '100rpx' }}>随机</Button>
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>前缀 /</Text>
          <View className={toolStyles.segmentedControl}>
            {[8, 16, 24, 27, 30, 32].map(n => (
              <Text
                key={n}
                className={`${toolStyles.segment} ${prefix === n ? toolStyles.segmentActive : ''}`}
                onClick={() => setPrefix(n)}
              >{n}</Text>
            ))}
          </View>
        </View>
        <View className={toolStyles.inputGroup}>
          <Text className={toolStyles.label}>检测 IP</Text>
          <Textarea
            className={toolStyles.textarea}
            value={cidrInput}
            onInput={e => setCidrInput(e.detail.value)}
            placeholder="可选: 检测某 IP 是否在范围内"
            style={{ height: '80rpx', flex: 1 }}
          />
        </View>
      </View>
      <View className={toolStyles.actionRow}>
        <Button className={toolStyles.btnPrimary} onClick={calculate}>计算</Button>
      </View>
      {results.length > 0 && (
        <View>
          {results.map(r => (
            <View key={r.label} className={toolStyles.section}>
              <View className={toolStyles.card}>
                <Text className={toolStyles.cardTitle}>{r.label}</Text>
                <Text selectable className={toolStyles.monoText}>{r.value}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default IpToolPage;
