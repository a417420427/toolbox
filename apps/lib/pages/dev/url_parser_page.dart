import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

/// URL 解析器
class UrlParserPage extends StatefulWidget {
  const UrlParserPage({super.key});

  @override
  State<UrlParserPage> createState() => _UrlParserPageState();
}

class _UrlParserPageState extends State<UrlParserPage> {
  final _ctrl = TextEditingController(
    text: 'https://www.example.com:8080/path/to/page?name=张三&age=25&lang=zh#section1',
  );
  String _protocol = '';
  String _host = '';
  String _port = '—';
  String _pathname = '';
  String _search = '';
  String _hash = '';
  Map<String, String> _params = {};
  String? _error;

  void _parse() {
    final result = UrlParserTool.parse(_ctrl.text);
    setState(() {
      _protocol = result.protocol;
      _host = result.host;
      _port = result.port?.toString() ?? '—';
      _pathname = result.pathname;
      _search = result.search;
      _hash = result.hash;
      _params = result.params;
      _error = result.error;
    });
  }

  @override
  void initState() {
    super.initState();
    _parse();
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextField(
            controller: _ctrl,
            decoration: InputDecoration(
              labelText: 'URL',
              border: const OutlineInputBorder(),
              prefixIcon: const Icon(Icons.link, size: 20),
              suffixIcon: _ctrl.text.isNotEmpty
                  ? IconButton(
                      icon: const Icon(Icons.clear, size: 18),
                      onPressed: () {
                        _ctrl.clear();
                        _parse();
                      },
                    )
                  : null,
            ),
            style: const TextStyle(fontFamily: 'monospace', fontSize: 14),
            keyboardType: TextInputType.url,
            autocorrect: false,
            onChanged: (_) => _parse(),
          ),
          const SizedBox(height: 16),

          if (_error != null)
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Row(
                children: [
                  Icon(Icons.warning_amber, size: 18, color: AppColors.error),
                  const SizedBox(width: 8),
                  Expanded(child: Text(_error!, style: TextStyle(color: AppColors.error, fontSize: 13))),
                ],
              ),
            ),

          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  _partRow('协议', _protocol, Icons.alt_route),
                  const Divider(height: 16),
                  _partRow('主机名', _host, Icons.dns),
                  const Divider(height: 16),
                  _partRow('端口', _port, Icons.settings_ethernet),
                  const Divider(height: 16),
                  _partRow('路径', _pathname, Icons.folder_open),
                  if (_search.isNotEmpty) ...[
                    const Divider(height: 16),
                    _partRow('查询字符串', _search, Icons.search),
                  ],
                  if (_hash.isNotEmpty) ...[
                    const Divider(height: 16),
                    _partRow('Hash', '#$_hash', Icons.tag),
                  ],
                ],
              ),
            ),
          ),

          if (_params.isNotEmpty) ...[
            const SizedBox(height: 12),
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.list_alt, size: 18),
                        const SizedBox(width: 6),
                        const Text('查询参数', style: TextStyle(fontSize: 15, fontWeight: FontWeight.w600)),
                        const Spacer(),
                        Text('${_params.length} 个参数', style: TextStyle(fontSize: 12, color: AppColors.neutral400)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    ..._params.entries.map((entry) => Padding(
                      padding: const EdgeInsets.only(bottom: 4),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(6),
                        onTap: () {
                          Clipboard.setData(ClipboardData(text: '${entry.key}=${entry.value}'));
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('已复制参数'), duration: Duration(seconds: 1)),
                          );
                        },
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppColors.brand50,
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            children: [
                              Text(entry.key, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600, fontFamily: 'monospace')),
                              const SizedBox(width: 8),
                              Icon(Icons.arrow_right, size: 14, color: AppColors.neutral400),
                              const SizedBox(width: 4),
                              Expanded(
                                child: Text(entry.value, style: const TextStyle(fontSize: 13, fontFamily: 'monospace'), overflow: TextOverflow.ellipsis),
                              ),
                              Icon(Icons.copy, size: 14, color: AppColors.neutral400),
                            ],
                          ),
                        ),
                      ),
                    )),
                  ],
                ),
              ),
            ),
          ],

          const SizedBox(height: 16),

          Card(
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('快捷示例', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.neutral500)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    runSpacing: 6,
                    children: [
                      _sampleChip('简单 URL', 'https://example.com'),
                      _sampleChip('带端口', 'http://localhost:3000/api/users'),
                      _sampleChip('带查询参数', 'https://google.com/search?q=flutter&hl=zh-CN'),
                      _sampleChip('带 Hash', 'https://example.com/page#section-2'),
                      _sampleChip('IP 地址', 'http://192.168.1.1:8080/admin'),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _partRow(String label, String value, IconData icon) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Icon(icon, size: 16, color: AppColors.brand500),
        const SizedBox(width: 8),
        SizedBox(
          width: 80,
          child: Text(label, style: TextStyle(fontSize: 13, color: AppColors.neutral500)),
        ),
        Expanded(
          child: SelectableText(
            value,
            style: const TextStyle(fontSize: 14, fontFamily: 'monospace', fontWeight: FontWeight.w500),
          ),
        ),
        GestureDetector(
          onTap: () {
            Clipboard.setData(ClipboardData(text: value));
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('已复制 $label'), duration: const Duration(seconds: 1)),
            );
          },
          child: Icon(Icons.copy, size: 14, color: AppColors.neutral300),
        ),
      ],
    );
  }

  Widget _sampleChip(String label, String url) {
    return ActionChip(
      label: Text(label, style: const TextStyle(fontSize: 11)),
      onPressed: () {
        _ctrl.text = url;
        _parse();
      },
      visualDensity: VisualDensity.compact,
    );
  }
}
