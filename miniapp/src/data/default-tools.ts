import { CategoryMeta, ToolDefinition } from '@/types/tool';

// ── 默认工具数据（API 请求失败时使用） ──

const defaultApiCategories = [
  {
    id: "cmrukmei30000m4e818o8c7u7",
    key: "fun",
    label: "娱乐工具",
    description: "星座、画板、填色等",
    icon: "cat_tools",
    color: "#f43f5e",
    sortOrder: 0,
    enabled: true,
    createdAt: "2026-07-21T11:29:16.008Z",
    updatedAt: "2026-07-21T12:52:47.460Z",
    tools: [
      {
        id: "cmrukmeir0006m4e8yet0slv9",
        toolId: "daily_fortune",
        name: "星座运势",
        description: "星座运势 / 幸运色 / 幸运数字",
        icon: "smile",
        category: "fun",
        enabled: true,
        sortOrder: 0,
        createdAt: "2026-07-21T11:29:16.036Z",
        updatedAt: "2026-07-21T11:29:16.036Z",
      },
      {
        id: "cmrukmeiw0008m4e8nooyqb6t",
        toolId: "tarot",
        name: "塔罗占卜",
        description: "每日塔罗牌抽牌 / 占卜解读",
        icon: "smile",
        category: "fun",
        enabled: true,
        sortOrder: 1,
        createdAt: "2026-07-21T11:29:16.040Z",
        updatedAt: "2026-07-21T11:29:16.040Z",
      },
      {
        id: "cmrukmeiz000am4e8naxiio41",
        toolId: "drawing_board",
        name: "简易画板",
        description: "手写 / 画笔 / 颜色选择",
        icon: "pen-tool",
        category: "fun",
        enabled: true,
        sortOrder: 2,
        createdAt: "2026-07-21T11:29:16.043Z",
        updatedAt: "2026-07-21T11:29:16.043Z",
      },
      {
        id: "cmrukmej2000cm4e8qub3ezwx",
        toolId: "coloring_book",
        name: "绘画填色",
        description: "线稿模板填色",
        icon: "paintbrush",
        category: "fun",
        enabled: true,
        sortOrder: 3,
        createdAt: "2026-07-21T11:29:16.046Z",
        updatedAt: "2026-07-21T11:29:16.046Z",
      },
      {
        id: "cmrukmej5000em4e8c6hktne2",
        toolId: "emoji",
        name: "Emoji 搜索",
        description: "搜索并复制 Emoji",
        icon: "smile",
        category: "fun",
        enabled: true,
        sortOrder: 4,
        createdAt: "2026-07-21T11:29:16.049Z",
        updatedAt: "2026-07-21T11:29:16.049Z",
      },
      {
        id: "cmrukmej8000gm4e8nh4ec16s",
        toolId: "random_selector",
        name: "随机选择器",
        description: "抛硬币 / 抽签 / 列表随机选",
        icon: "dice",
        category: "fun",
        enabled: true,
        sortOrder: 5,
        createdAt: "2026-07-21T11:29:16.052Z",
        updatedAt: "2026-07-21T11:29:16.052Z",
      },
    ],
  },
  {
    id: "cmrukmeig0001m4e8gk6g7ndt",
    key: "tools",
    label: "日常工具",
    description: "日期、健康等",
    icon: "cat_tools",
    color: "#3b82f6",
    sortOrder: 1,
    enabled: true,
    createdAt: "2026-07-21T11:29:16.024Z",
    updatedAt: "2026-07-21T12:52:49.651Z",
    tools: [
      {
        id: "cmrukmejb000im4e89pd4ppod",
        toolId: "unit_converter",
        name: "单位换算",
        description: "长度 / 重量 / 温度等",
        icon: "ruler",
        category: "tools",
        enabled: true,
        sortOrder: 0,
        createdAt: "2026-07-21T11:29:16.055Z",
        updatedAt: "2026-07-21T11:29:16.055Z",
      },
      {
        id: "cmrukmeje000km4e8zem2sgjk",
        toolId: "countdown",
        name: "倒计时",
        description: "设定目标日期，显示剩余时间",
        icon: "clock",
        category: "tools",
        enabled: true,
        sortOrder: 1,
        createdAt: "2026-07-21T11:29:16.058Z",
        updatedAt: "2026-07-21T11:29:16.058Z",
      },
      {
        id: "cmrukmeji000mm4e8yrpbc0ud",
        toolId: "text_stats",
        name: "字数统计",
        description: "字符 / 单词 / 行数统计",
        icon: "bar-chart",
        category: "tools",
        enabled: true,
        sortOrder: 2,
        createdAt: "2026-07-21T11:29:16.062Z",
        updatedAt: "2026-07-21T11:29:16.062Z",
      },
      {
        id: "cmrukmejk000om4e804u7vshj",
        toolId: "pomodoro",
        name: "番茄钟",
        description: "25分钟专注 / 5分钟休息",
        icon: "timer",
        category: "tools",
        enabled: true,
        sortOrder: 3,
        createdAt: "2026-07-21T11:29:16.065Z",
        updatedAt: "2026-07-21T11:29:16.065Z",
      },
      {
        id: "cmrukmejn000qm4e8df6q3r8g",
        toolId: "stopwatch",
        name: "秒表",
        description: "计时 / 分段计时 / 计圈",
        icon: "stopwatch",
        category: "tools",
        enabled: true,
        sortOrder: 4,
        createdAt: "2026-07-21T11:29:16.067Z",
        updatedAt: "2026-07-21T11:29:16.067Z",
      },
      {
        id: "cmrukmeju000wm4e83ijoz5ud",
        toolId: "anniversary",
        name: "纪念日",
        description: "恋爱 / 生日 / 倒数日",
        icon: "heart",
        category: "tools",
        enabled: true,
        sortOrder: 7,
        createdAt: "2026-07-21T11:29:16.075Z",
        updatedAt: "2026-07-21T11:29:16.075Z",
      },
      {
        id: "cmrukmejx000ym4e8d4v4wg7q",
        toolId: "timezone",
        name: "世界时区",
        description: "全球时区 / 实时时间",
        icon: "globe",
        category: "tools",
        enabled: true,
        sortOrder: 8,
        createdAt: "2026-07-21T11:29:16.077Z",
        updatedAt: "2026-07-21T11:29:16.077Z",
      },
      {
        id: "cmrukmek20012m4e8wxm729go",
        toolId: "bmi",
        name: "健康指标",
        description: "BMI / 体脂率 / BMR",
        icon: "activity",
        category: "tools",
        enabled: true,
        sortOrder: 10,
        createdAt: "2026-07-21T11:29:16.083Z",
        updatedAt: "2026-07-21T11:29:16.083Z",
      },
      {
        id: "cmrukmek60014m4e8imajzx08",
        toolId: "retirement",
        name: "退休倒计时",
        description: "出生日期 / 工作生涯进度",
        icon: "timer",
        category: "tools",
        enabled: true,
        sortOrder: 11,
        createdAt: "2026-07-21T11:29:16.086Z",
        updatedAt: "2026-07-21T11:29:16.086Z",
      },
    ],
  },
];

function apiCategoryToLocal(api: typeof defaultApiCategories[number]) {
  return {
    key: api.key as any,
    label: api.label,
    description: api.description,
    icon: api.icon,
    color: api.color,
  };
}

function apiToolToLocal(api: typeof defaultApiCategories[number]['tools'][number]) {
  return {
    id: api.toolId,
    name: api.name,
    description: api.description,
    icon: api.icon,
    category: api.category as any,
  };
}

export function getDefaultCategories(): CategoryMeta[] {
  return defaultApiCategories.map(apiCategoryToLocal);
}

export function getDefaultTools(): ToolDefinition[] {
  const tools: ToolDefinition[] = [];
  for (const c of defaultApiCategories) {
    for (const t of c.tools) {
      tools.push(apiToolToLocal(t));
    }
  }
  return tools;
}
