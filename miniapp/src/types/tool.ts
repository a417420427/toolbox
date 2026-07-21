// 工具分类
export type ToolCategory = 'tools' | 'formatters' | 'crypto' | 'dev' | 'fun';

// 单个工具的元信息
export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  icon: string; // icon name，对应 icons.ts 中的 key
  category: ToolCategory;
}

// 分类元信息
export interface CategoryMeta {
  key: ToolCategory;
  description: string;
  label: string;
  icon: string; // icon name
  color: string; // hex 色，用于分类标识
}
