import { CategoryMeta, ToolDefinition } from '@/types/tool';
import { request } from '@/services/request';
import { getDefaultCategories, getDefaultTools } from './default-tools';

// ── 接口返回的数据结构 ──

interface ApiCategory {
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  enabled: boolean;
  tools: ApiTool[];
}

interface ApiTool {
  toolId: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  enabled: boolean;
  sortOrder: number;
}

// ── 本地缓存（避免首页反复请求） ──

let cachedCategories: CategoryMeta[] | null = null;
let cachedTools: ToolDefinition[] | null = null;

function apiCategoryToLocal(api: ApiCategory): CategoryMeta {
  return {
    key: api.key as any,
    label: api.label,
    description: api.description,
    icon: api.icon,
    color: api.color,
  };
}

function apiToolToLocal(api: ApiTool): ToolDefinition {
  return {
    id: api.toolId,
    name: api.name,
    description: api.description,
    icon: api.icon,
    category: api.category as any,
  };
}

// ── 初始化（启动时调用一次即可） ──

let initPromise: Promise<void> | null = null;

/**
 * 从服务端加载工具配置并缓存
 * 页面 onLoad / 组件 mount 时调用
 */
export async function initTools(): Promise<void> {
  if (cachedCategories && cachedTools) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    try {
      const data: ApiCategory[] = await request('/api/tools/categories');

      const cats: CategoryMeta[] = [];
      const tools: ToolDefinition[] = [];

      for (const c of data) {
        cats.push(apiCategoryToLocal(c));
        for (const t of c.tools) {
          tools.push(apiToolToLocal(t));
        }
      }

      cachedCategories = cats;
      cachedTools = tools;
    } catch (e) {
      console.warn('[tools] 加载工具配置失败，使用默认数据:', e);
      cachedCategories = getDefaultCategories();
      cachedTools = getDefaultTools();
    }
  })();

  return initPromise;
}

// ── 导出（与原来相同的 API 签名） ──

export function getTools(): ToolDefinition[] {
  return cachedTools ?? [];
}

export function getCategories(): CategoryMeta[] {
  return cachedCategories ?? [];
}

export function toolsByCategory(categoryKey: string): ToolDefinition[] {
  return (cachedTools ?? []).filter((t) => t.category === categoryKey);
}

export function toolById(id: string): ToolDefinition | undefined {
  return (cachedTools ?? []).find((t) => t.id === id);
}

/** 获取总工具数 */
export function getTotalToolCount(): number {
  return cachedTools?.length ?? 0;
}

/** 获取所有分类（含工具） */
export function getCategoryList(): { category: CategoryMeta; tools: ToolDefinition[] }[] {
  return (getCategories() ?? []).map((cat) => ({
    category: cat,
    tools: toolsByCategory(cat.key),
  }));
}

/** 刷新工具配置（管理页面编辑后调用） */
export function clearCache() {
  cachedCategories = null;
  cachedTools = null;
  initPromise = null;
}
