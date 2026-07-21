import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const categories = [
  { key: 'fun', label: '娱乐工具', description: '星座、画板、填色等', icon: 'cat_tools', color: '#f43f5e', sortOrder: 0 },
  { key: 'tools', label: '日常工具', description: '日期、健康等', icon: 'cat_tools', color: '#3b82f6', sortOrder: 1 },
  { key: 'formatters', label: '格式化 & 转换', description: 'JSON、SQL、颜色等', icon: 'cat_tools', color: '#10b981', sortOrder: 2 },
  { key: 'crypto', label: '编码 & 加密', description: 'Base64、Hash、AES等', icon: 'cat_tools', color: '#8b5cf6', sortOrder: 3 },
  { key: 'dev', label: '开发者工具', description: 'IP、Regex、Cron等', icon: 'cat_tools', color: '#f59e0b', sortOrder: 4 },
];

const tools = [
  { toolId: 'daily_fortune', name: '星座运势', description: '星座运势 / 幸运色 / 幸运数字', icon: 'smile', category: 'fun', sortOrder: 0 },
  { toolId: 'tarot', name: '塔罗占卜', description: '每日塔罗牌抽牌 / 占卜解读', icon: 'smile', category: 'fun', sortOrder: 1 },
  { toolId: 'drawing_board', name: '简易画板', description: '手写 / 画笔 / 颜色选择', icon: 'pen-tool', category: 'fun', sortOrder: 2 },
  { toolId: 'coloring_book', name: '绘画填色', description: '线稿模板填色', icon: 'paintbrush', category: 'fun', sortOrder: 3 },
  { toolId: 'emoji', name: 'Emoji 搜索', description: '搜索并复制 Emoji', icon: 'smile', category: 'fun', sortOrder: 4 },
  { toolId: 'random_selector', name: '随机选择器', description: '抛硬币 / 抽签 / 列表随机选', icon: 'dice', category: 'fun', sortOrder: 5 },
  { toolId: 'unit_converter', name: '单位换算', description: '长度 / 重量 / 温度等', icon: 'ruler', category: 'tools', sortOrder: 0 },
  { toolId: 'countdown', name: '倒计时', description: '设定目标日期，显示剩余时间', icon: 'clock', category: 'tools', sortOrder: 1 },
  { toolId: 'text_stats', name: '字数统计', description: '字符 / 单词 / 行数统计', icon: 'bar-chart', category: 'tools', sortOrder: 2 },
  { toolId: 'pomodoro', name: '番茄钟', description: '25分钟专注 / 5分钟休息', icon: 'timer', category: 'tools', sortOrder: 3 },
  { toolId: 'stopwatch', name: '秒表', description: '计时 / 分段计时 / 计圈', icon: 'stopwatch', category: 'tools', sortOrder: 4 },
  { toolId: 'mortgage', name: '房贷计算器', description: '等额本息 / 等额本金', icon: 'home', category: 'tools', sortOrder: 5 },
  { toolId: 'holiday', name: '节假日', description: '法定假日 / 日历标记', icon: 'calendar-check', category: 'tools', sortOrder: 6 },
  { toolId: 'anniversary', name: '纪念日', description: '恋爱 / 生日 / 倒数日', icon: 'heart', category: 'tools', sortOrder: 7 },
  { toolId: 'timezone', name: '世界时区', description: '全球时区 / 实时时间', icon: 'globe', category: 'tools', sortOrder: 8 },
  { toolId: 'investment', name: '投资计算', description: '复利 / 定投 / 收益', icon: 'trending-up', category: 'tools', sortOrder: 9 },
  { toolId: 'bmi', name: '健康指标', description: 'BMI / 体脂率 / BMR', icon: 'activity', category: 'tools', sortOrder: 10 },
  { toolId: 'retirement', name: '退休倒计时', description: '出生日期 / 工作生涯进度', icon: 'timer', category: 'tools', sortOrder: 11 },
  { toolId: 'json', name: 'JSON 工具', description: '格式化 / 压缩 / 校验', icon: 'braces', category: 'formatters', sortOrder: 0 },
  { toolId: 'base64', name: 'Base64 编解码', description: '文本 ↔ Base64', icon: 'file-code', category: 'formatters', sortOrder: 1 },
  { toolId: 'url', name: 'URL 编解码', description: 'encodeURI / decodeURI', icon: 'link', category: 'formatters', sortOrder: 2 },
  { toolId: 'timestamp', name: '时间戳工具', description: '时间戳 ↔ 日期', icon: 'clock', category: 'formatters', sortOrder: 3 },
  { toolId: 'color', name: '颜色工具', description: 'HEX ↔ RGB ↔ HSL', icon: 'palette', category: 'formatters', sortOrder: 4 },
  { toolId: 'sql_formatter', name: 'SQL 格式化', description: 'SQL 美化 / 压缩', icon: 'database', category: 'formatters', sortOrder: 5 },
  { toolId: 'xml_formatter', name: 'XML 格式化', description: 'XML 美化 / 压缩', icon: 'code', category: 'formatters', sortOrder: 6 },
  { toolId: 'yaml_json', name: 'YAML ↔ JSON', description: 'YAML 与 JSON 互转', icon: 'shuffle', category: 'formatters', sortOrder: 7 },
  { toolId: 'color_scheme', name: '配色方案', description: '调色板 / 互补色', icon: 'palette', category: 'formatters', sortOrder: 8 },
  { toolId: 'markdown_preview', name: 'Markdown 预览', description: 'Markdown → HTML', icon: 'file-text', category: 'formatters', sortOrder: 9 },
  { toolId: 'sort_tool', name: '排序 / 去重', description: '文本行排序、去重', icon: 'sort', category: 'formatters', sortOrder: 10 },
  { toolId: 'number_base', name: '进制转换', description: '2 / 8 / 10 / 16 进制', icon: 'hash', category: 'crypto', sortOrder: 0 },
  { toolId: 'password', name: '密码生成器', description: '可配置字符集的强密码', icon: 'key', category: 'crypto', sortOrder: 1 },
  { toolId: 'uuid', name: 'UUID 生成器', description: 'UUID v4 / NanoID', icon: 'fingerprint', category: 'crypto', sortOrder: 2 },
  { toolId: 'hash', name: '哈希工具', description: 'MD5 / SHA-1 / SHA-256', icon: 'shield', category: 'crypto', sortOrder: 3 },
  { toolId: 'jwt', name: 'JWT 解码器', description: '解析 token / 检查过期', icon: 'key', category: 'crypto', sortOrder: 4 },
  { toolId: 'aes', name: 'AES 加解密', description: 'AES-256 加解密工具', icon: 'lock', category: 'crypto', sortOrder: 5 },
  { toolId: 'diff', name: '文本对比', description: '两段文本差异高亮', icon: 'file-diff', category: 'dev', sortOrder: 0 },
  { toolId: 'regex', name: '正则测试器', description: '实时匹配 / Flags', icon: 'search', category: 'dev', sortOrder: 1 },
  { toolId: 'html_entity', name: 'HTML 实体编解码', description: '< → &lt;', icon: 'code', category: 'dev', sortOrder: 2 },
  { toolId: 'unicode', name: 'Unicode 码点查询', description: '字符 ↔ U+XXXX', icon: 'abc', category: 'dev', sortOrder: 3 },
  { toolId: 'cron', name: 'Cron 解析器', description: 'Cron → 可读描述', icon: 'clock', category: 'dev', sortOrder: 4 },
  { toolId: 'text_case', name: '文字格式互转', description: '大小写 / 驼峰 / 蛇形', icon: 'text', category: 'dev', sortOrder: 5 },
  { toolId: 'url_parser', name: 'URL 解析器', description: '协议 / 域名 / 参数', icon: 'link', category: 'dev', sortOrder: 6 },
  { toolId: 'regex_visualizer', name: '正则可视化', description: '正则表达式流程图', icon: 'git-branch', category: 'dev', sortOrder: 7 },
  { toolId: 'md_notebook', name: 'Markdown 笔记本', description: '本地 Markdown 笔记', icon: 'book', category: 'dev', sortOrder: 8 },
];

async function main() {
  for (const cat of categories) {
    await prisma.toolCategory.upsert({
      where: { key: cat.key },
      update: { label: cat.label, description: cat.description, icon: cat.icon, color: cat.color, sortOrder: cat.sortOrder },
      create: cat,
    });
  }

  for (const t of tools) {
    await prisma.toolDefinition.upsert({
      where: { toolId: t.toolId },
      update: { name: t.name, description: t.description, icon: t.icon, category: t.category, sortOrder: t.sortOrder },
      create: t,
    });
  }

  const password = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'demo@toolbox.app' },
    update: {},
    create: {
      email: 'demo@toolbox.app',
      name: 'Demo',
      password,
      favorites: {
        create: [
          { toolId: 'json', sortOrder: 0 },
          { toolId: 'unit_converter', sortOrder: 1 },
          { toolId: 'countdown', sortOrder: 2 },
        ],
      },
    },
  });

  console.log('✅ Seed 完成:');
  console.log(`   分类: ${categories.length} 个`);
  console.log(`   工具: ${tools.length} 个`);
  console.log(`   账号: demo@toolbox.app / 123456`);
  console.log(`   UID: ${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
