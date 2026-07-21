import { CategoryMeta, ToolDefinition } from '@/types/tool';

export const categories: CategoryMeta[] = [
  { key: 'fun', label: '娱乐工具', description: '星座、画板、填色等', icon: 'cat_tools', color: '#f43f5e' },
  { key: 'tools', label: '日常工具', description: '日期、健康等',icon: 'cat_tools',  color: '#3b82f6' },
  { key: 'formatters', label: '格式化 & 转换',icon: 'cat_tools',  description: 'JSON、SQL、颜色等', color: '#10b981' },
  // { key: 'crypto', label: '编码工具', description: 'Base64、Hash、AES等', color: '#8b5cf6' },
  { key: 'dev', label: '开发者工具', icon: 'cat_tools', description: 'IP、Regex、Cron等', color: '#f59e0b' },
];

export const tools: ToolDefinition[] = [
  // ── 娱乐工具 ──
  { id: 'daily_fortune', name: '星座运势', description: '星座运势 / 幸运色 / 幸运数字', icon: 'smile', category: 'fun' },
  { id: 'tarot', name: '塔罗占卜', description: '每日塔罗牌抽牌 / 占卜解读', icon: 'smile', category: 'fun' },
  { id: 'drawing_board', name: '简易画板', description: '手写 / 画笔 / 颜色选择', icon: 'pen-tool', category: 'fun' },
  { id: 'coloring_book', name: '绘画填色', description: '线稿模板填色', icon: 'paintbrush', category: 'fun' },
  // { id: 'weather', name: '天气查询', description: '实时天气 / 预报', icon: 'cloud-sun', category: 'fun' },
  { id: 'emoji', name: 'Emoji 搜索', description: '搜索并复制 Emoji', icon: 'smile', category: 'fun' },
  { id: 'random_selector', name: '随机选择器', description: '抛硬币 / 抽签 / 列表随机选', icon: 'dice', category: 'fun' },

  // ── 日常工具 ──
  // { id: 'calculator', name: '计算器', description: '日常计算 / 科学计算', icon: 'calculator', category: 'tools' },
  { id: 'unit_converter', name: '单位换算', description: '长度 / 重量 / 温度等', icon: 'ruler', category: 'tools' },
  // { id: 'date_calc', name: '日期计算', description: '日期差 / 加减天数 / 工作日', icon: 'calendar', category: 'tools' },
  { id: 'countdown', name: '倒计时', description: '设定目标日期，显示剩余时间', icon: 'clock', category: 'tools' },
  { id: 'text_stats', name: '字数统计', description: '字符 / 单词 / 行数统计', icon: 'bar-chart', category: 'tools' },
  { id: 'pomodoro', name: '番茄钟', description: '25分钟专注 / 5分钟休息', icon: 'timer', category: 'tools' },
  { id: 'stopwatch', name: '秒表', description: '计时 / 分段计时 / 计圈', icon: 'stopwatch', category: 'tools' },
  { id: 'mortgage', name: '房贷计算器', description: '等额本息 / 等额本金', icon: 'home', category: 'tools' },
  { id: 'holiday', name: '节假日', description: '法定假日 / 日历标记', icon: 'calendar-check', category: 'tools' },
  { id: 'anniversary', name: '纪念日', description: '恋爱 / 生日 / 倒数日', icon: 'heart', category: 'tools' },
  { id: 'timezone', name: '世界时区', description: '全球时区 / 实时时间', icon: 'globe', category: 'tools' },
  { id: 'investment', name: '投资计算', description: '复利 / 定投 / 收益', icon: 'trending-up', category: 'tools' },
  { id: 'bmi', name: '健康指标', description: 'BMI / 体脂率 / BMR', icon: 'activity', category: 'tools' },
  { id: 'retirement', name: '退休倒计时', description: '出生日期 / 工作生涯进度', icon: 'timer', category: 'tools' },

  // ── 格式化 & 转换 ──
  { id: 'json', name: 'JSON 工具', description: '格式化 / 压缩 / 校验', icon: 'braces', category: 'formatters' },
  { id: 'base64', name: 'Base64 编解码', description: '文本 ↔ Base64', icon: 'file-code', category: 'formatters' },
  { id: 'url', name: 'URL 编解码', description: 'encodeURI / decodeURI', icon: 'link', category: 'formatters' },
  { id: 'timestamp', name: '时间戳工具', description: '时间戳 ↔ 日期', icon: 'clock', category: 'formatters' },
  { id: 'color', name: '颜色工具', description: 'HEX ↔ RGB ↔ HSL', icon: 'palette', category: 'formatters' },
  { id: 'sql_formatter', name: 'SQL 格式化', description: 'SQL 美化 / 压缩', icon: 'database', category: 'formatters' },
  { id: 'xml_formatter', name: 'XML 格式化', description: 'XML 美化 / 压缩', icon: 'code', category: 'formatters' },
  { id: 'yaml_json', name: 'YAML ↔ JSON', description: 'YAML 与 JSON 互转', icon: 'shuffle', category: 'formatters' },
  { id: 'color_scheme', name: '配色方案', description: '调色板 / 互补色', icon: 'palette', category: 'formatters' },
  { id: 'markdown_preview', name: 'Markdown 预览', description: 'Markdown → HTML', icon: 'file-text', category: 'formatters' },
  { id: 'sort_tool', name: '排序 / 去重', description: '文本行排序、去重', icon: 'sort', category: 'formatters' },

  // ── 编码 & 加密 ──
  { id: 'number_base', name: '进制转换', description: '2 / 8 / 10 / 16 进制', icon: 'hash', category: 'crypto' },
  { id: 'password', name: '密码生成器', description: '可配置字符集的强密码', icon: 'key', category: 'crypto' },
  { id: 'uuid', name: 'UUID 生成器', description: 'UUID v4 / NanoID', icon: 'fingerprint', category: 'crypto' },
  { id: 'hash', name: '哈希工具', description: 'MD5 / SHA-1 / SHA-256', icon: 'shield', category: 'crypto' },
  { id: 'jwt', name: 'JWT 解码器', description: '解析 token / 检查过期', icon: 'key', category: 'crypto' },
  { id: 'aes', name: 'AES 加解密', description: 'AES-256 加解密工具', icon: 'lock', category: 'crypto' },

  // ── 开发者工具 ──
  // { id: 'ip_tool', name: 'IP 工具', description: 'CIDR / 子网掩码', icon: 'globe', category: 'dev' },
  { id: 'diff', name: '文本对比', description: '两段文本差异高亮', icon: 'file-diff', category: 'dev' },
  { id: 'regex', name: '正则测试器', description: '实时匹配 / Flags', icon: 'search', category: 'dev' },
  { id: 'html_entity', name: 'HTML 实体编解码', description: '< → &lt;', icon: 'code', category: 'dev' },
  { id: 'unicode', name: 'Unicode 码点查询', description: '字符 ↔ U+XXXX', icon: 'abc', category: 'dev' },
  { id: 'cron', name: 'Cron 解析器', description: 'Cron → 可读描述', icon: 'clock', category: 'dev' },
  { id: 'text_case', name: '文字格式互转', description: '大小写 / 驼峰 / 蛇形', icon: 'text', category: 'dev' },
  { id: 'url_parser', name: 'URL 解析器', description: '协议 / 域名 / 参数', icon: 'link', category: 'dev' },
  { id: 'regex_visualizer', name: '正则可视化', description: '正则表达式流程图', icon: 'git-branch', category: 'dev' },
  { id: 'md_notebook', name: 'Markdown 笔记本', description: '本地 Markdown 笔记', icon: 'book', category: 'dev' },
  // { id: 'lunar_calendar', name: '农历黄历', description: '公历农历互转', icon: 'calendar', category: 'dev' },
];

export function toolsByCategory(categoryKey: string): ToolDefinition[] {
  return tools.filter((t) => t.category === categoryKey);
}

export function toolById(id: string): ToolDefinition | undefined {
  return tools.find((t) => t.id === id);
}
