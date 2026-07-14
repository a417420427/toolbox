import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

import 'pages/formatters/json_page.dart';
import 'pages/formatters/base64_page.dart';
import 'pages/formatters/url_page.dart';
import 'pages/formatters/timestamp_page.dart';
import 'pages/formatters/color_page.dart';
import 'pages/crypto/uuid_page.dart';
import 'pages/crypto/hash_page.dart';
import 'pages/crypto/jwt_page.dart';
import 'pages/text/text_stats_page.dart';
import 'pages/text/text_case_page.dart';
import 'pages/text/regex_page.dart';
// 日常工具
import 'pages/tools/calculator_page.dart';
import 'pages/tools/unit_converter_page.dart';
import 'pages/tools/date_calc_page.dart';
import 'pages/tools/countdown_page.dart';
import 'pages/tools/random_selector_page.dart';
import 'pages/dev/html_entity_page.dart';
import 'pages/dev/unicode_page.dart';
import 'pages/dev/cron_page.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.landscapeLeft,
    DeviceOrientation.landscapeRight,
  ]);
  runApp(const ToolboxApp());
}

class ToolboxApp extends StatelessWidget {
  const ToolboxApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '工具箱',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      themeMode: ThemeMode.system,
      home: const HomePage(),
    );
  }
}

/// 主页面 — 自适应导航（手机 BottomNav / 桌面 NavigationRail）
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedCategory = 0;
  String? _selectedToolId;

  final List<ToolCategory> _categories = ToolCategory.values;

  List<ToolDefinition> get _currentTools =>
      ToolRegistry.byCategory(_categories[_selectedCategory]);

  @override
  void initState() {
    super.initState();
    // 默认选中第一个工具
    final tools = _currentTools;
    if (tools.isNotEmpty) {
      _selectedToolId = tools.first.id;
    }
  }

  void _onCategoryChanged(int index) {
    setState(() {
      _selectedCategory = index;
      final tools = ToolRegistry.byCategory(_categories[index]);
      _selectedToolId = tools.isNotEmpty ? tools.first.id : null;
    });
  }

  void _onToolSelected(String toolId) {
    setState(() {
      _selectedToolId = toolId;
    });
  }

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 640;

        if (isWide) {
          return _buildWideLayout();
        } else {
          return _buildNarrowLayout();
        }
      },
    );
  }

  Widget _buildWideLayout() {
    return Scaffold(
      body: SafeArea(
        child: Row(
          children: [
            // 左侧分类导航
            NavigationRail(
              selectedIndex: _selectedCategory,
              onDestinationSelected: _onCategoryChanged,
              labelType: NavigationRailLabelType.all,
              backgroundColor: Theme.of(context).colorScheme.surface,
              indicatorColor: AppColors.brand100,
              leading: Padding(
                padding: const EdgeInsets.symmetric(vertical: 12),
                child: Icon(Icons.build_outlined, color: AppColors.brand500, size: 28),
              ),
              destinations: _categories.map((cat) {
                return NavigationRailDestination(
                  icon: Icon(cat.icon),
                  selectedIcon: Icon(cat.icon, color: AppColors.brand500),
                  label: Text(cat.label, style: const TextStyle(fontSize: 12)),
                );
              }).toList(),
            ),
            const VerticalDivider(width: 1),
            // 工具列表
            SizedBox(
              width: 200,
              child: _buildToolList(),
            ),
            const VerticalDivider(width: 1),
            // 工具内容区
            Expanded(
              child: _buildToolContent(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildNarrowLayout() {
    return Scaffold(
      appBar: AppBar(
        title: Text(_categories[_selectedCategory].label),
        actions: [
          if (_selectedToolId != null)
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: IconButton(
                icon: const Icon(Icons.list),
                onPressed: () => _showToolDrawer(),
                tooltip: '切换工具',
              ),
            ),
        ],
      ),
      body: _buildToolContent(),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _selectedCategory,
        onDestinationSelected: _onCategoryChanged,
        indicatorColor: AppColors.brand100,
        destinations: _categories.map((cat) {
          return NavigationDestination(
            icon: Icon(cat.icon),
            selectedIcon: Icon(cat.icon, color: AppColors.brand500),
            label: cat.label,
          );
        }).toList(),
      ),
    );
  }

  Widget _buildToolList() {
    final tools = _currentTools;
    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: ListView.builder(
        padding: const EdgeInsets.symmetric(vertical: 8),
        itemCount: tools.length,
        itemBuilder: (context, index) {
          final tool = tools[index];
          final selected = tool.id == _selectedToolId;
          return Material(
            color: Colors.transparent,
            child: ListTile(
              selected: selected,
              selectedTileColor: AppColors.brand50,
              leading: Icon(
                tool.icon,
                size: 20,
                color: selected ? AppColors.brand500 : AppColors.neutral500,
              ),
              title: Text(
                tool.name,
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                  color: selected ? AppColors.brand700 : null,
                ),
              ),
              subtitle: Text(
                tool.description,
                style: const TextStyle(fontSize: 11),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              dense: true,
              onTap: () => _onToolSelected(tool.id),
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.zero,
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildToolContent() {
    if (_selectedToolId == null) {
      return const Center(child: Text('选择一个工具'));
    }

    return ToolPageContainer(toolId: _selectedToolId!);
  }

  void _showToolDrawer() {
    showModalBottomSheet(
      context: context,
      builder: (context) => SizedBox(
        height: 400,
        child: _buildToolList(),
      ),
    );
  }
}

/// 工具页面容器 — 根据 toolId 渲染对应页面
class ToolPageContainer extends StatelessWidget {
  final String toolId;

  const ToolPageContainer({super.key, required this.toolId});

  @override
  Widget build(BuildContext context) {
    return _buildToolPage(toolId);
  }

  Widget _buildToolPage(String id) {
    // 日常工具
    if (id == 'calculator') return const CalculatorPage();
    if (id == 'unit_converter') return const UnitConverterPage();
    if (id == 'date_calc') return const DateCalcPage();
    if (id == 'countdown') return const CountdownPage();
    if (id == 'random_selector') return const RandomSelectorPage();
    if (id == 'text_stats') return const TextStatsToolPage();
    // 格式化类
    if (id == 'json') return const JsonToolPage();
    if (id == 'base64') return const Base64ToolPage();
    if (id == 'url') return const UrlToolPage();
    if (id == 'timestamp') return const TimestampToolPage();
    if (id == 'color') return const ColorToolPage();
    // 编码加密
    if (id == 'uuid') return const UuidToolPage();
    if (id == 'hash') return const HashToolPage();
    if (id == 'jwt') return const JwtToolPage();
    // 开发者工具
    if (id == 'text_case') return const TextCaseToolPage();
    if (id == 'regex') return const RegexToolPage();
    if (id == 'html_entity') return const HtmlEntityToolPage();
    if (id == 'unicode') return const UnicodeToolPage();
    if (id == 'cron') return const CronToolPage();

    return const Center(child: Text('工具开发中...'));
  }
}
