import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:toolbox_flutter_shared/toolbox_flutter_shared.dart';

import 'providers/auth_provider.dart';
import 'pages/auth/auth_page.dart';
import 'pages/auth/favorites_page.dart';
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
import 'pages/tools/calculator_page.dart';
import 'pages/tools/unit_converter_page.dart';
import 'pages/tools/date_calc_page.dart';
import 'pages/tools/countdown_page.dart';
import 'pages/tools/random_selector_page.dart';
import 'pages/tools/pomodoro_page.dart';
import 'pages/tools/stopwatch_page.dart';
import 'pages/tools/mortgage_page.dart';
import 'pages/tools/holiday_page.dart';
import 'pages/tools/anniversary_page.dart';
import 'pages/tools/timezone_page.dart';
import 'pages/tools/emoji_page.dart';
import 'pages/tools/investment_page.dart';
import 'pages/tools/qr_code_page.dart';
import 'pages/dev/html_entity_page.dart';
import 'pages/dev/unicode_page.dart';
import 'pages/dev/cron_page.dart';
import 'pages/dev/ip_tool_page.dart';
import 'pages/dev/diff_page.dart';
import 'pages/crypto/number_base_page.dart';
import 'pages/crypto/password_page.dart';
import 'pages/formatters/sql_formatter_page.dart';
import 'pages/formatters/yaml_json_page.dart';
import 'pages/formatters/xml_formatter_page.dart';
import 'pages/formatters/color_scheme_page.dart';
import 'pages/tools/bmi_page.dart';
import 'pages/formatters/markdown_page.dart';
import 'pages/formatters/sort_page.dart';
import 'pages/dev/url_parser_page.dart';
import 'pages/crypto/aes_page.dart';

/// 抑制 Flutter Web 已知的 viewInsets 断言错误
/// 参考: https://github.com/flutter/flutter/issues?q=ViewInsets+cannot+be+negative
void _suppressViewInsetsAssertion() {
  FlutterError.onError = (details) {
    if (details.exceptionAsString().contains('ViewInsets cannot be negative')) {
      return;
    }
    FlutterError.presentError(details);
  };
}

void main() async {
  _suppressViewInsetsAssertion();
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
    return ChangeNotifierProvider(
      create: (_) => AuthProvider()..tryRestore(),
      child: MaterialApp(
        title: '工具箱',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.light(),
        darkTheme: AppTheme.dark(),
        themeMode: ThemeMode.system,
        home: const HomePage(),

      ),
    );
  }
}

/// 导航项目
enum _Tab { tools, profile, favorites }

/// 主页面 — 3 个 Tab
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  _Tab _tab = _Tab.tools;
  String? _selectedToolId;

  // Dashboard 分类折叠状态
  final Set<ToolCategory> _collapsedCategories = {};

  @override
  void initState() {
    super.initState();
  }

  bool get _isOnDashboard => _selectedToolId == null;

  Map<ToolCategory, List<ToolDefinition>> get _groupedTools {
    final map = <ToolCategory, List<ToolDefinition>>{};
    for (final cat in ToolCategory.values) {
      map[cat] = ToolRegistry.byCategory(cat);
    }
    return map;
  }

  void _onToolSelected(String toolId) {
    setState(() => _selectedToolId = toolId);
  }


  void _goBackToDashboard() {
    setState(() => _selectedToolId = null);
  }

  void _toggleCategory(ToolCategory cat) {
    setState(() {
      if (_collapsedCategories.contains(cat)) {
        _collapsedCategories.remove(cat);
      } else {
        _collapsedCategories.add(cat);
      }
    });
  }

  /// 收藏按钮点击：已收藏则取消，未收藏则弹文件夹选择（有多个文件夹时）
  void _handleFavorite(
    BuildContext context,
    AuthProvider auth,
    ToolDefinition tool,
  ) {
    if (auth.isFavorite(tool.id)) {
      // 已收藏 -> 直接取消
      auth.toggleFavorite(tool.id);
      return;
    }

    final realFolders = auth.folders.where((f) => f.name != '未分类').toList();
    if (realFolders.isEmpty) {
      // 没有文件夹 -> 直接收藏到未分类
      auth.toggleFavorite(tool.id);
    } else {
      // 有文件夹 -> 弹选择框
      _showFavoriteFolderPicker(context, auth, tool.id, realFolders);
    }
  }

  void _showFavoriteFolderPicker(
    BuildContext context,
    AuthProvider auth,
    String toolId,
    List<FavoriteFolder> realFolders,
  ) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Padding(
              padding: EdgeInsets.all(16),
              child: Text(
                '收藏到文件夹',
                style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
              ),
            ),
            const Divider(height: 1),
            ListTile(
              leading: Icon(
                Icons.folder_outlined,
                color: AppColors.warning,
                size: 20,
              ),
              title: const Text('未分类'),
              onTap: () {
                Navigator.of(ctx).pop();
                auth.toggleFavorite(toolId);
              },
            ),
            ...realFolders.map(
              (f) => ListTile(
                leading: Icon(Icons.folder, color: AppColors.warning, size: 20),
                title: Text(f.name),
                onTap: () {
                  Navigator.of(ctx).pop();
                  auth.toggleFavorite(toolId, folder: f.name);
                },
              ),
            ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }

  // ── 导航索引映射 ──
  int get _navIndex => switch (_tab) {
    _Tab.tools => 0,
    _Tab.profile => 1,
    _Tab.favorites => 2,
  };

  void _onNavChanged(int index) {
    setState(() {
      _tab = switch (index) {
        0 => _Tab.tools,
        1 => _Tab.profile,
        2 => _Tab.favorites,
        _ => _Tab.tools,
      };
    });
  }

  // 校验收藏 tab 是否可见
  bool get _showFavoritesTab => context.watch<AuthProvider>().isLoggedIn;

  @override
  Widget build(BuildContext context) {
    final tabCount = _showFavoritesTab ? 3 : 2;
    return LayoutBuilder(
      builder: (context, constraints) {
        final isWide = constraints.maxWidth >= 640;
        if (isWide) {
          return _buildWideLayout(tabCount);
        } else {
          return _buildNarrowLayout(tabCount);
        }
      },
    );
  }

  // ══════════ NavigationRail/Bar 共享的目标列表 ══════════

  List<NavigationRailDestination> get _railDestinations => [
    const NavigationRailDestination(
      icon: Icon(Icons.widgets_outlined),
      selectedIcon: Icon(Icons.widgets, color: AppColors.brand500),
      label: Text('工具', style: TextStyle(fontSize: 12)),
    ),
    if (_showFavoritesTab)
      const NavigationRailDestination(
        icon: Icon(Icons.star_border),
        selectedIcon: Icon(Icons.star, color: AppColors.warning),
        label: Text('收藏', style: TextStyle(fontSize: 12)),
      ),
    const NavigationRailDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person, color: AppColors.brand500),
      label: Text('我的', style: TextStyle(fontSize: 12)),
    ),
  ];

  List<NavigationDestination> get _barDestinations => [
    const NavigationDestination(
      icon: Icon(Icons.widgets_outlined),
      selectedIcon: Icon(Icons.widgets),
      label: '工具',
    ),
    const NavigationDestination(
      icon: Icon(Icons.person_outline),
      selectedIcon: Icon(Icons.person),
      label: '我的',
    ),
    if (_showFavoritesTab)
      const NavigationDestination(
        icon: Icon(Icons.star_border),
        selectedIcon: Icon(Icons.star),
        label: '收藏',
      ),
  ];

  /// 根据屏幕宽度计算缩放系数（仅在宽屏下应用）
  double _responsiveScale(double maxWidth) {
    return (maxWidth / 400).clamp(0.85, 1.3);
  }

  /// 宽屏下内容居中 + 最大宽度限制
  Widget _wrappedBody(double maxWidth) {
    const contentMaxWidth = 1200.0;
    return Align(
      alignment: Alignment.topCenter,
      child: SizedBox(
        width: contentMaxWidth,
        child: _buildBody(),
      ),
    );
  }

  // ══════════ 宽屏 ══════════

  Widget _buildWideLayout(int tabCount) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final maxWidth = constraints.maxWidth;
        return Scaffold(
          body: SafeArea(
            child: Row(
              children: [
                NavigationRail(
                  selectedIndex: _navIndex,
                  onDestinationSelected: _onNavChanged,
                  labelType: NavigationRailLabelType.all,
                  backgroundColor: Theme.of(context).colorScheme.surface,
                  indicatorColor: AppColors.brand100,
                  leading: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    child: Icon(
                      Icons.build_outlined,
                      color: AppColors.brand500,
                      size: 28,
                    ),
                  ),
                  destinations: _railDestinations,
                ),
                const VerticalDivider(width: 1),
                Expanded(child: _wrappedBody(maxWidth)),
              ],
            ),
          ),
        );
      },
    );
  }

  // ══════════ 窄屏 ══════════

  Widget _buildNarrowLayout(int tabCount) {
    return Scaffold(
      appBar: _buildAppBar(),
      body: _buildBody(),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _navIndex,
        onDestinationSelected: _onNavChanged,
        indicatorColor: AppColors.brand100,
        destinations: _barDestinations,
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    switch (_tab) {
      case _Tab.profile:
        return AppBar(title: const Text('我的'));
      case _Tab.favorites:
        return AppBar(title: const Text('收藏'));
      case _Tab.tools:
        if (_isOnDashboard) return AppBar(title: const Text('工具箱'));
        return AppBar(
          title: Text(ToolRegistry.byId(_selectedToolId!)?.name ?? '工具箱'),
          leading: InkWell(
            onTap: _goBackToDashboard,
            borderRadius: BorderRadius.circular(20),
            child: Container(
              width: 40,
              height: 40,
              alignment: Alignment.center,
              child: const Icon(Icons.arrow_back),
            ),
          ),
          actions: [
            Padding(
              padding: const EdgeInsets.only(right: 8),
              child: IconButton(
                icon: const Icon(Icons.list),
                onPressed: _showToolDrawer,
                tooltip: '切换工具',
              ),
            ),
          ],
        );
    }
  }

  // ══════════ 内容切换 ══════════

  Widget _buildBody() {
    switch (_tab) {
      case _Tab.profile:
        return const AuthPage();
      case _Tab.favorites:
        return FavoritesPage(
          onOpenTool: (toolId) {
            _onToolSelected(toolId);
            setState(() => _tab = _Tab.tools);
          },
        );
      case _Tab.tools:
        if (_isOnDashboard) return _buildDashboard();
        return _buildToolContent();
    }
  }

  // ═══════════════════════════
  //  Dashboard
  // ═══════════════════════════

  Widget _buildDashboard() {
    final auth = context.watch<AuthProvider>();
    return LayoutBuilder(
      builder: (context, constraints) {
        final scale = _responsiveScale(constraints.maxWidth);
        final padding = (16 * scale).clamp(12.0, 24.0);
        return SingleChildScrollView(
          padding: EdgeInsets.all(padding),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: _groupedTools.entries.map((entry) {
              return _buildCategorySection(entry.key, entry.value, auth);
            }).toList(),
          ),
        );
      },
    );
  }

  Widget _buildCategorySection(
    ToolCategory cat,
    List<ToolDefinition> tools,
    AuthProvider auth,
  ) {
    final collapsed = _collapsedCategories.contains(cat);
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 分类标题（可点击折叠）
          InkWell(
            onTap: () => _toggleCategory(cat),
            borderRadius: BorderRadius.circular(8),
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 8),
              child: Row(
                children: [
                  Icon(cat.icon, size: 18, color: AppColors.brand500),
                  const SizedBox(width: 6),
                  Text(
                    cat.label,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    '${tools.length}',
                    style: const TextStyle(
                      fontSize: 12,
                      color: AppColors.neutral400,
                    ),
                  ),
                  const Spacer(),
                  Icon(
                    collapsed ? Icons.expand_more : Icons.expand_less,
                    size: 20,
                    color: AppColors.neutral400,
                  ),
                ],
              ),
            ),
          ),
          // 工具网格
          if (!collapsed)
            LayoutBuilder(
              builder: (context, constraints) {
                final crossAxisCount = constraints.maxWidth > 900
                    ? 6
                    : constraints.maxWidth > 600
                        ? 4
                        : 3;
                final spacing =
                    (8.0 * _responsiveScale(constraints.maxWidth)).clamp(6.0, 14.0);
                final itemWidth =
                    (constraints.maxWidth - spacing * (crossAxisCount - 1)) /
                        crossAxisCount;
                return GridView.builder(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: crossAxisCount,
                    mainAxisSpacing: spacing,
                    crossAxisSpacing: spacing,
                    childAspectRatio: 1.0,
                  ),
                  itemCount: tools.length,
                  itemBuilder: (context, index) {
                    final tool = tools[index];
                    return _ToolGridItem(
                      itemWidth: itemWidth,
                      tool: tool,
                      favorited: auth.isFavorite(tool.id),
                      onTap: () => _onToolSelected(tool.id),
                      onFavorite: auth.isLoggedIn
                          ? () => _handleFavorite(context, auth, tool)
                          : null,
                    );
                  },
                );
              },
            ),
        ],
      ),
    );
  }

  // ══════════ 侧栏 ══════════

  Widget _buildCategoryToolList() {
    return Container(
      color: Theme.of(context).colorScheme.surface,
      child: ListView(
        padding: const EdgeInsets.symmetric(vertical: 4),
        children: _groupedTools.entries.map((entry) {
          final cat = entry.key;
          final tools = entry.value;
          return Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                child: Row(
                  children: [
                    Icon(cat.icon, size: 16, color: AppColors.neutral400),
                    const SizedBox(width: 6),
                    Text(
                      cat.label,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: AppColors.neutral400,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ),
              ...tools.map((tool) {
                final selected = tool.id == _selectedToolId;
                return Material(
                  color: Colors.transparent,
                  child: ListTile(
                    dense: true,
                    selected: selected,
                    selectedTileColor: AppColors.brand50,
                    leading: Icon(
                      tool.icon,
                      size: 18,
                      color: selected
                          ? AppColors.brand500
                          : AppColors.neutral500,
                    ),
                    title: Text(
                      tool.name,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: selected
                            ? FontWeight.w600
                            : FontWeight.w400,
                        color: selected ? AppColors.brand700 : null,
                      ),
                    ),
                    onTap: () => _onToolSelected(tool.id),
                    shape: const RoundedRectangleBorder(
                      borderRadius: BorderRadius.zero,
                    ),
                    visualDensity: VisualDensity.compact,
                  ),
                );
              }),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildToolContent() {
    if (_selectedToolId == null) return _buildDashboard();
    return ToolPageContainer(
      toolId: _selectedToolId!,
      onBack: _goBackToDashboard,
    );
  }

  void _showToolDrawer() {
    showModalBottomSheet(
      context: context,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.6,
        maxChildSize: 0.85,
        minChildSize: 0.4,
        expand: false,
        builder: (ctx, scrollController) {
          return Column(
            children: [
              const SizedBox(height: 8),
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: AppColors.neutral300,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 12),
              Expanded(child: _buildCategoryToolList()),
            ],
          );
        },
      ),
    );
  }
}

// ═══════════════════════════════════
//  Dashboard 网格子项
// ═══════════════════════════════════

class _ToolGridItem extends StatelessWidget {
  final ToolDefinition tool;
  final bool favorited;
  final VoidCallback onTap;
  final VoidCallback? onFavorite;
  final VoidCallback? onAddToHomeScreen;
  final double itemWidth;

  const _ToolGridItem({
    required this.itemWidth,
    required this.tool,
    required this.favorited,
    required this.onTap,
    this.onFavorite,
    this.onAddToHomeScreen,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    // 根据网格项宽度自适应尺寸
    double iconSize, nameSize, descSize;
    if (itemWidth > 120) {
      iconSize = 32;
      nameSize = 13;
      descSize = 11;
    } else if (itemWidth > 90) {
      iconSize = 28;
      nameSize = 12;
      descSize = 10;
    } else {
      iconSize = 24;
      nameSize = 11;
      descSize = 9;
    }

    return GestureDetector(
      onTap: onTap,
      onLongPress: () => _showContextMenu(context),
      child: Padding(
        padding: const EdgeInsets.all(2),
        child: Container(
          decoration: BoxDecoration(
            color: isDark ? AppColors.neutralDark100 : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: isDark ? AppColors.neutralDark200 : AppColors.neutral200,
            ),
          ),
          child: Stack(
            children: [
              Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Icon(tool.icon, size: iconSize, color: AppColors.brand500),
                    const SizedBox(height: 6),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 6),
                      child: Text(
                        tool.name,
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: nameSize,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                    if (tool.description.isNotEmpty)
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 6),
                        child: Text(
                          tool.description,
                          textAlign: TextAlign.center,
                          maxLines: 2,
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontSize: descSize,
                            color: AppColors.neutral400,
                            height: 1.3,
                          ),
                        ),
                      ),
                  ],
                ),
              ),
              if (onFavorite != null)
                Positioned(
                  top: 4,
                  right: 4,
                  child: GestureDetector(
                    onTap: onFavorite,
                    child: Icon(
                      favorited ? Icons.star : Icons.star_border,
                      size: itemWidth > 100 ? 16 : 14,
                      color: favorited ? AppColors.warning : AppColors.neutral300,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  void _showContextMenu(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (ctx) => SafeArea(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12),
              child: Text(
                tool.name,
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 16),
              ),
            ),
            const Divider(height: 1),
            if (onAddToHomeScreen != null)
              ListTile(
                leading: const Icon(Icons.widgets_outlined, color: AppColors.brand500),
                title: const Text('添加到桌面小组件'),
                subtitle: const Text('长按桌面添加后快速打开此工具'),
                onTap: () {
                  Navigator.of(ctx).pop();
                  onAddToHomeScreen!();
                },
              ),
            if (onFavorite != null)
              ListTile(
                leading: Icon(
                  favorited ? Icons.star : Icons.star_border,
                  color: favorited ? AppColors.warning : AppColors.neutral600,
                ),
                title: Text(favorited ? '取消收藏' : '收藏'),
                onTap: () {
                  Navigator.of(ctx).pop();
                  onFavorite!();
                },
              ),
            const SizedBox(height: 8),
          ],
        ),
      ),
    );
  }
}

/// 工具页面容器
class ToolPageContainer extends StatelessWidget {
  final String toolId;
  final VoidCallback? onBack;

  const ToolPageContainer({super.key, required this.toolId, this.onBack});

  @override
  Widget build(BuildContext context) {
    return _buildToolPage(toolId);
  }

  Widget _buildToolPage(String id) {
    if (id == 'calculator') return const CalculatorPage();
    if (id == 'unit_converter') return const UnitConverterPage();
    if (id == 'date_calc') return const DateCalcPage();
    if (id == 'countdown') return const CountdownPage();
    if (id == 'random_selector') return const RandomSelectorPage();
    if (id == 'text_stats') return const TextStatsToolPage();
    if (id == 'json') return const JsonToolPage();
    if (id == 'base64') return const Base64ToolPage();
    if (id == 'url') return const UrlToolPage();
    if (id == 'timestamp') return const TimestampToolPage();
    if (id == 'color') return const ColorToolPage();
    if (id == 'color_scheme') return const ColorSchemePage();
    if (id == 'uuid') return const UuidToolPage();
    if (id == 'hash') return const HashToolPage();
    if (id == 'jwt') return const JwtToolPage();
    if (id == 'text_case') return const TextCaseToolPage();
    if (id == 'regex') return const RegexToolPage();
    if (id == 'html_entity') return const HtmlEntityToolPage();
    if (id == 'unicode') return const UnicodeToolPage();
    if (id == 'cron') return const CronToolPage();
    if (id == 'sql_formatter') return const SqlFormatterPage();
    if (id == 'yaml_json') return const YamlJsonPage();
    if (id == 'xml_formatter') return const XmlFormatterPage();
    if (id == 'emoji') return const EmojiPage();
    if (id == 'investment') return const InvestmentPage();
    if (id == 'qr_code') return const QrCodePage();
    if (id == 'number_base') return const NumberBasePage();
    if (id == 'password') return const PasswordPage();
    if (id == 'ip_tool') return const IpToolPage();
    if (id == 'diff') return const DiffPage();
    if (id == 'pomodoro') return const PomodoroPage();
    if (id == 'stopwatch') return const StopwatchPage();
    if (id == 'mortgage') return const MortgagePage();
    if (id == 'holiday') return const HolidayPage();
    if (id == 'anniversary') return const AnniversaryPage();
    if (id == 'timezone') return const TimeZonePage();
    if (id == 'bmi') return const BmiPage();
    if (id == 'markdown_preview') return const MarkdownPage();
    if (id == 'sort_tool') return const SortPage();
    if (id == 'url_parser') return const UrlParserPage();
    if (id == 'aes') return const AesPage();
    return const Center(child: Text('工具开发中...'));
  }
}
