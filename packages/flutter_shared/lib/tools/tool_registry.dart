import 'package:flutter/material.dart';
import 'tool_definition.dart';
import 'tool_category.dart';

/// 所有工具的注册表
class ToolRegistry {
  ToolRegistry._();

  static final List<ToolDefinition> _all = [
    // ── 日常工具 ──
    const ToolDefinition(
      id: 'calculator',
      name: '计算器',
      description: '日常计算 / 科学计算',
      icon: Icons.calculate_outlined,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'unit_converter',
      name: '单位换算',
      description: '长度 / 重量 / 温度 / 面积 / 体积 / 数据存储',
      icon: Icons.straighten,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'date_calc',
      name: '日期计算',
      description: '日期差 / 加减天数 / 工作日计算',
      icon: Icons.date_range,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'countdown',
      name: '倒计时',
      description: '设定目标日期，显示剩余时间',
      icon: Icons.timer_outlined,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'random_selector',
      name: '随机选择器',
      description: '抛硬币 / 抽签 / 列表随机选',
      icon: Icons.shuffle,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'text_stats',
      name: '字数统计',
      description: '字符 / 单词 / 行数 实时统计',
      icon: Icons.bar_chart,
      category: ToolCategory.tools,
    ),

    // ── 格式化 & 转换 ──
    const ToolDefinition(
      id: 'sql_formatter',
      name: 'SQL 格式化',
      description: 'SQL 美化 / 压缩',
      icon: Icons.storage,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'xml_formatter',
      name: 'XML 格式化',
      description: 'XML 美化 / 压缩',
      icon: Icons.code,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'yaml_json',
      name: 'YAML ↔ JSON',
      description: 'YAML 与 JSON 互转',
      icon: Icons.swap_horiz,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'json',
      name: 'JSON 工具',
      description: '格式化 / 压缩 / 校验 JSON',
      icon: Icons.data_object,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'base64',
      name: 'Base64 编解码',
      description: '文本 ↔ Base64 / 文件编码',
      icon: Icons.code,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'url',
      name: 'URL 编解码',
      description: 'encodeURI / decodeURIComponent',
      icon: Icons.link,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'timestamp',
      name: '时间戳工具',
      description: '时间戳 ↔ 日期 / 多种格式',
      icon: Icons.schedule,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'color',
      name: '颜色工具',
      description: 'HEX ↔ RGB ↔ HSL 互转',
      icon: Icons.palette,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'color_scheme',
      name: '配色方案',
      description: '调色板 / 互补色 / 配色推荐',
      icon: Icons.color_lens,
      category: ToolCategory.formatters,
    ),

    // ── 编码 & 加密 ──
    const ToolDefinition(
      id: 'number_base',
      name: '进制转换',
      description: '2 / 8 / 10 / 16 进制互转',
      icon: Icons.numbers,
      category: ToolCategory.crypto,
    ),
    const ToolDefinition(
      id: 'password',
      name: '密码生成器',
      description: '可配置字符集的强密码',
      icon: Icons.password,
      category: ToolCategory.crypto,
    ),
    const ToolDefinition(
      id: 'uuid',
      name: 'UUID 生成器',
      description: 'UUID v4 / NanoID 批量生成',
      icon: Icons.fingerprint,
      category: ToolCategory.crypto,
    ),
    const ToolDefinition(
      id: 'hash',
      name: '哈希工具',
      description: 'MD5 / SHA-1 / SHA-256 / SHA-512',
      icon: Icons.shield,
      category: ToolCategory.crypto,
    ),
    const ToolDefinition(
      id: 'jwt',
      name: 'JWT 解码器',
      description: '解析 token / 检查过期',
      icon: Icons.key,
      category: ToolCategory.crypto,
    ),

    // ── 开发者工具 ──
    const ToolDefinition(
      id: 'ip_tool',
      name: 'IP 工具',
      description: 'CIDR / 子网掩码 / 地址计算',
      icon: Icons.language,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'diff',
      name: '文本对比',
      description: '两段文本差异高亮对比',
      icon: Icons.compare_arrows,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'regex',
      name: '正则测试器',
      description: '实时匹配高亮 / Flags 开关',
      icon: Icons.manage_search,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'html_entity',
      name: 'HTML 实体编解码',
      description: '< → &lt; / 解码还原',
      icon: Icons.html,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'unicode',
      name: 'Unicode 码点查询',
      description: '字符 ↔ U+XXXX / 批量查询',
      icon: Icons.abc,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'cron',
      name: 'Cron 解析器',
      description: 'Cron → 可读描述 / 执行时间预览',
      icon: Icons.timer,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'text_case',
      name: '文字格式互转',
      description: '大小写 / 驼峰 / 蛇形 / 中划线',
      icon: Icons.text_format,
      category: ToolCategory.dev,
    ),

    // ── 新增日常工具 ──
    const ToolDefinition(
      id: 'pomodoro',
      name: '番茄钟',
      description: '25分钟专注 / 5分钟休息',
      icon: Icons.timer_outlined,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'stopwatch',
      name: '秒表',
      description: '计时 / 分段计时 / 计圈',
      icon: Icons.timer,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'mortgage',
      name: '房贷计算器',
      description: '等额本息 / 等额本金 / 利息计算',
      icon: Icons.account_balance,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'holiday',
      name: '节假日',
      description: '法定假日 / 倒计时 / 节日查询',
      icon: Icons.event,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'anniversary',
      name: '纪念日',
      description: '恋爱 / 生日 / 自定义倒数日',
      icon: Icons.favorite,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'timezone',
      name: '世界时区',
      description: '全球时区 / 实时时间 / 时差对比',
      icon: Icons.public,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'emoji',
      name: 'Emoji 搜索',
      description: '搜索并复制 Emoji',
      icon: Icons.emoji_emotions,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'investment',
      name: '投资计算',
      description: '复利 / 定投 / 收益计算',
      icon: Icons.trending_up,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'qr_code',
      name: '二维码生成',
      description: '文本 / 链接生成二维码',
      icon: Icons.qr_code,
      category: ToolCategory.tools,
    ),

    // ── V2 新增工具 ──
    const ToolDefinition(
      id: 'bmi',
      name: '健康指标',
      description: 'BMI / 体脂率 / BMR 基础代谢',
      icon: Icons.monitor_heart_outlined,
      category: ToolCategory.tools,
    ),
    const ToolDefinition(
      id: 'markdown_preview',
      name: 'Markdown 预览',
      description: '实时渲染 Markdown → HTML',
      icon: Icons.description,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'sort_tool',
      name: '排序 / 去重',
      description: '文本行排序、去重、统计',
      icon: Icons.sort,
      category: ToolCategory.formatters,
    ),
    const ToolDefinition(
      id: 'url_parser',
      name: 'URL 解析器',
      description: '协议 / 域名 / 查询参数解析',
      icon: Icons.alt_route,
      category: ToolCategory.dev,
    ),
    const ToolDefinition(
      id: 'aes',
      name: 'AES 加解密',
      description: 'AES-256-CBC/ECB/CTR 加解密',
      icon: Icons.enhanced_encryption,
      category: ToolCategory.crypto,
    ),
  ];

  static List<ToolDefinition> all() => List.unmodifiable(_all);

  static List<ToolDefinition> byCategory(ToolCategory cat) =>
      _all.where((t) => t.category == cat).toList();

  static ToolDefinition? byId(String id) {
    try {
      return _all.firstWhere((t) => t.id == id);
    } catch (_) {
      return null;
    }
  }
}
