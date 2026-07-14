import 'package:flutter/material.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// IP 工具
class IpToolPage extends StatefulWidget {
  const IpToolPage({super.key});

  @override
  State<IpToolPage> createState() => _IpToolPageState();
}

class _IpToolPageState extends State<IpToolPage> {
  final TextEditingController _ipCtrl = TextEditingController(text: '192.168.1.0');
  int _prefix = 24;

  String _networkAddr = '';
  String _broadcast = '';
  String _mask = '';
  int _hostCount = 0;
  String? _firstHost;
  String? _lastHost;
  String? _error;

  void _calculate() {
    final ip = _ipCtrl.text.trim();
    if (!IpTool.isValidIp(ip)) {
      setState(() { _error = '无效的 IP 地址'; _networkAddr = ''; _broadcast = ''; _mask = ''; _hostCount = 0; _firstHost = null; _lastHost = null; });
      return;
    }
    if (!IpTool.isValidPrefix(_prefix)) {
      setState(() => _error = '无效的前缀长度');
      return;
    }
    setState(() {
      _error = null;
      _mask = IpTool.prefixToMask(_prefix);
      _networkAddr = IpTool.networkAddress(ip, _prefix);
      _broadcast = IpTool.broadcastAddress(ip, _prefix);
      _hostCount = IpTool.hostCount(_prefix);
      _firstHost = IpTool.firstHost(ip, _prefix);
      _lastHost = IpTool.lastHost(ip, _prefix);
    });
  }

  @override
  void initState() {
    super.initState();
    _calculate();
  }

  @override
  void dispose() {
    _ipCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  TextField(
                    controller: _ipCtrl,
                    decoration: const InputDecoration(
                      labelText: 'IP 地址',
                      border: OutlineInputBorder(),
                      hintText: '192.168.1.0',
                    ),
                    onChanged: (_) => _calculate(),
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      const Text('前缀长度: /', style: TextStyle(fontSize: 14)),
                      Expanded(
                        child: Slider(
                          value: _prefix.toDouble(),
                          min: 0, max: 32,
                          divisions: 32,
                          label: '/$_prefix',
                          onChanged: (v) => setState(() { _prefix = v.round(); _calculate(); }),
                        ),
                      ),
                      SizedBox(
                        width: 48,
                        child: Text('$_prefix', style: const TextStyle(fontWeight: FontWeight.w600, fontFamily: 'monospace', fontSize: 16)),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          if (_error != null)
            Card(
              color: AppColors.error.withAlpha(20),
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Text(_error!, style: TextStyle(color: AppColors.error)),
              ),
            )
          else ..._buildResults(),
        ],
      ),
    );
  }

  List<Widget> _buildResults() {
    return [
      _resultCard('子网掩码', _mask),
      _resultCard('网络地址', _networkAddr),
      _resultCard('广播地址', _broadcast),
      _resultCard('可用主机数', '$_hostCount'),
      if (_firstHost != null) _resultCard('第一个可用 IP', _firstHost!),
      if (_lastHost != null) _resultCard('最后一个可用 IP', _lastHost!),
    ];
  }

  Widget _resultCard(String label, String value) {
    return Card(
      child: ListTile(
        title: Text(label, style: const TextStyle(fontSize: 13, color: AppColors.neutral500)),
        trailing: SelectableText(value, style: const TextStyle(fontWeight: FontWeight.w600, fontFamily: 'monospace', fontSize: 15)),
      ),
    );
  }
}
