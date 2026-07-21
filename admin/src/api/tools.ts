import { request } from './request';

// ── 类型 ──

export interface Category {
  id: string;
  key: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  sortOrder: number;
  enabled: boolean;
}

export interface ToolItem {
  id: string;
  toolId: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  enabled: boolean;
  sortOrder: number;
}

// ── 公开接口 ──

export interface CategoryWithTools extends Category {
  tools: ToolItem[];
}

export async function getPublicCategories(): Promise<CategoryWithTools[]> {
  return request('/api/tools/categories');
}

// ── 管理接口 ──

export async function getAdminCategories(): Promise<Category[]> {
  return request('/api/tools/admin/categories');
}

export async function createCategory(data: {
  key: string;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
}): Promise<Category> {
  return request('/api/tools/admin/categories', { method: 'POST', body: data });
}

export async function updateCategory(
  key: string,
  data: Partial<{
    label: string;
    description: string;
    icon: string;
    color: string;
    sortOrder: number;
    enabled: boolean;
  }>,
): Promise<Category> {
  return request(`/api/tools/admin/categories/${key}`, { method: 'PUT', body: data });
}

export async function deleteCategory(key: string): Promise<void> {
  return request(`/api/tools/admin/categories/${key}`, { method: 'DELETE' });
}

export async function getAdminTools(): Promise<ToolItem[]> {
  return request('/api/tools/admin/tools');
}

export async function createTool(data: {
  toolId: string;
  name: string;
  description?: string;
  icon?: string;
  category: string;
  sortOrder?: number;
}): Promise<ToolItem> {
  return request('/api/tools/admin/tools', { method: 'POST', body: data });
}

export async function updateTool(
  toolId: string,
  data: Partial<{
    name: string;
    description: string;
    icon: string;
    category: string;
    enabled: boolean;
    sortOrder: number;
  }>,
): Promise<ToolItem> {
  return request(`/api/tools/admin/tools/${toolId}`, { method: 'PUT', body: data });
}

export async function deleteTool(toolId: string): Promise<void> {
  return request(`/api/tools/admin/tools/${toolId}`, { method: 'DELETE' });
}
