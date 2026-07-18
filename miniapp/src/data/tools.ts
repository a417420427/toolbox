import type { ToolDefinition, CategoryMeta, ToolCategory } from '@/types/tool';

// 分类元信息（顺序即展示顺序）
export const categories: CategoryMeta[] = [
  { key: 'tools', label: '日常工具', icon: 'cat_tools', color: '#3b82f6' },
  { key: 'formatters', label: '格式化 & 转换', icon: 'cat_formatters', color: '#8b5cf6' },
  { key: 'crypto', label: '编码 & 加密', icon: 'cat_crypto', color: '#10b981' },
  { key: 'dev', label: '开发者工具', icon: 'cat_dev', color: '#f59e0b' },
];

// 全部工具（对齐 Flutter ToolRegistry，icon 字段对应 icons.ts 中的 key）
export const tools: ToolDefinition[] = [
  // ── 日常工具 ──
  { id: 'calculator', name: '计算器', description: '日常计算 / 科学计算', icon: 'calculator', category: 'tools' },
  { id: 'unit_converter', name: '单位换算', description: '长度 / 重量 / 温度 / 面积 / 体积 / 数据存储', icon: 'ruler', category: 'tools' },
  { id: 'date_calc', name: '日期计算', description: '日期差 / 加减天数 / 工作日计算', icon: 'calendar', category: 'tools' },
  { id: 'countdown', name: '倒计时', description: '设定目标日期，显示剩余时间', icon: 'clock', category: 'tools' },
  { id: 'random_selector', name: '随机选择器', description: '抛硬币 / 抽签 / 列表随机选', icon: 'shuffle', category: 'tools' },
  { id: 'text_stats', name: '字数统计', description: '字符 / 单词 / 行数 实时统计', icon: 'bar_chart', category: 'tools' },
  { id: 'pomodoro', name: '番茄钟', description: '25分钟专注 / 5分钟休息', icon: 'timer', category: 'tools' },
  { id: 'stopwatch', name: '秒表', description: '计时 / 分段计时 / 计圈', icon: 'stopwatch', category: 'tools' },
  { id: 'mortgage', name: '房贷计算器', description: '等额本息 / 等额本金 / 利息计算', icon: 'bank', category: 'tools' },
  { id: 'holiday', name: '节假日', description: '法定假日 / 倒计时 / 节日查询', icon: 'event', category: 'tools' },
  { id: 'anniversary', name: '纪念日', description: '恋爱 / 生日 / 自定义倒数日', icon: 'heart', category: 'tools' },
  { id: 'timezone', name: '世界时区', description: '全球时区 / 实时时间 / 时差对比', icon: 'world', category: 'tools' },
  { id: 'emoji', name: 'Emoji 搜索', description: '搜索并复制 Emoji', icon: 'smile', category: 'tools' },
  { id: 'investment', name: '投资计算', description: '复利 / 定投 / 收益计算', icon: 'trending', category: 'tools' },
  { id: 'qr_code', name: '二维码生成', description: '文本 / 链接生成二维码', icon: 'qr', category: 'tools' },
  { id: 'bmi', name: '健康指标', description: 'BMI / 体脂率 / BMR 基础代谢', icon: 'heartbeat', category: 'tools' },

  // ── 格式化 & 转换 ──
  { id: 'sql_formatter', name: 'SQL 格式化', description: 'SQL 美化 / 压缩', icon: 'database', category: 'formatters' },
  { id: 'xml_formatter', name: 'XML 格式化', description: 'XML 美化 / 压缩', icon: 'code', category: 'formatters' },
  { id: 'yaml_json', name: 'YAML ↔ JSON', description: 'YAML 与 JSON 互转', icon: 'exchange', category: 'formatters' },
  { id: 'json', name: 'JSON 工具', description: '格式化 / 压缩 / 校验 JSON', icon: 'braces', category: 'formatters' },
  { id: 'base64', name: 'Base64 编解码', description: '文本 ↔ Base64 / 文件编码', icon: 'code', category: 'formatters' },
  { id: 'url', name: 'URL 编解码', description: 'encodeURI / decodeURIComponent', icon: 'link', category: 'formatters' },
  { id: 'timestamp', name: '时间戳工具', description: '时间戳 ↔ 日期 / 多种格式', icon: 'schedule', category: 'formatters' },
  { id: 'color', name: '颜色工具', description: 'HEX ↔ RGB ↔ HSL 互转', icon: 'palette', category: 'formatters' },
  { id: 'color_scheme', name: '配色方案', description: '调色板 / 互补色 / 配色推荐', icon: 'color_swatch', category: 'formatters' },
  { id: 'markdown_preview', name: 'Markdown 预览', description: '实时渲染 Markdown → HTML', icon: 'file_text', category: 'formatters' },
  { id: 'sort_tool', name: '排序 / 去重', description: '文本行排序、去重、统计', icon: 'sort', category: 'formatters' },

  // ── 编码 & 加密 ──
  { id: 'number_base', name: '进制转换', description: '2 / 8 / 10 / 16 进制互转', icon: 'binary', category: 'crypto' },
  { id: 'password', name: '密码生成器', description: '可配置字符集的强密码', icon: 'key', category: 'crypto' },
  { id: 'uuid', name: 'UUID 生成器', description: 'UUID v4 / NanoID 批量生成', icon: 'fingerprint', category: 'crypto' },
  { id: 'hash', name: '哈希工具', description: 'MD5 / SHA-1 / SHA-256 / SHA-512', icon: 'shield', category: 'crypto' },
  { id: 'jwt', name: 'JWT 解码器', description: '解析 token / 检查过期', icon: 'key', category: 'crypto' },
  { id: 'aes', name: 'AES 加解密', description: 'AES-256-CBC/ECB/CTR 加解密', icon: 'lock', category: 'crypto' },

  // ── 开发者工具 ──
  { id: 'ip_tool', name: 'IP 工具', description: 'CIDR / 子网掩码 / 地址计算', icon: 'language', category: 'dev' },
  { id: 'diff', name: '文本对比', description: '两段文本差异高亮对比', icon: 'diff', category: 'dev' },
  { id: 'regex', name: '正则测试器', description: '实时匹配高亮 / Flags 开关', icon: 'search', category: 'dev' },
  { id: 'html_entity', name: 'HTML 实体编解码', description: '< → &lt; / 解码还原', icon: 'html', category: 'dev' },
  { id: 'unicode', name: 'Unicode 码点查询', description: '字符 ↔ U+XXXX / 批量查询', icon: 'abc', category: 'dev' },
  { id: 'cron', name: 'Cron 解析器', description: 'Cron → 可读描述 / 执行时间预览', icon: 'clock', category: 'dev' },
  { id: 'text_case', name: '文字格式互转', description: '大小写 / 驼峰 / 蛇形 / 中划线', icon: 'text', category: 'dev' },
  { id: 'url_parser', name: 'URL 解析器', description: '协议 / 域名 / 查询参数解析', icon: 'route', category: 'dev' },
];

// 按分类分组
export const toolsByCategory = (cat: ToolCategory): ToolDefinition[] =>
  tools.filter((t) => t.category === cat);

// 按 id 查找
export const toolById = (id: string): ToolDefinition | undefined =>
  tools.find((t) => t.id === id);
