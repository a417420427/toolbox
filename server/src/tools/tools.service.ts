import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ToolsService {
  constructor(private prisma: PrismaService) {}

  // ── 公开查询（仅 enabled） ──

  /** 获取所有启用的分类（含启用的工具） */
  async getCategories() {
    return this.prisma.toolCategory.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  /** 获取某一分类下启用的工具 */
  async getToolsByCategory(categoryKey: string) {
    return this.prisma.toolDefinition.findMany({
      where: { category: categoryKey, enabled: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  /** 获取所有启用的工具 */
  async getAllTools() {
    return this.prisma.toolDefinition.findMany({
      where: { enabled: true },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  /** 获取单个工具详情 */
  async getTool(toolId: string) {
    const tool = await this.prisma.toolDefinition.findUnique({
      where: { toolId, enabled: true },
    });
    if (!tool) throw new NotFoundException('工具不存在');
    return tool;
  }

  // ── 管理 API（全量查询，含 disabled） ──

  async getAllCategories() {
    return this.prisma.toolCategory.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getAllToolsForAdmin() {
    return this.prisma.toolDefinition.findMany({
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  // ── Category CRUD ──

  async createCategory(data: {
    key: string;
    label: string;
    description?: string;
    icon?: string;
    color?: string;
    sortOrder?: number;
  }) {
    const existing = await this.prisma.toolCategory.findUnique({
      where: { key: data.key },
    });
    if (existing) throw new ConflictException('分类 key 已存在');

    return this.prisma.toolCategory.create({ data });
  }

  async updateCategory(
    key: string,
    data: Partial<{
      label: string;
      description: string;
      icon: string;
      color: string;
      sortOrder: number;
      enabled: boolean;
    }>,
  ) {
    const cat = await this.prisma.toolCategory.findUnique({ where: { key } });
    if (!cat) throw new NotFoundException('分类不存在');

    return this.prisma.toolCategory.update({ where: { key }, data });
  }

  async deleteCategory(key: string) {
    const toolsCount = await this.prisma.toolDefinition.count({
      where: { category: key },
    });
    if (toolsCount > 0) {
      throw new ConflictException(
        `该分类下还有 ${toolsCount} 个工具，请先迁移或删除`,
      );
    }
    try {
      await this.prisma.toolCategory.delete({ where: { key } });
    } catch {
      throw new NotFoundException('分类不存在');
    }
  }

  // ── ToolDefinition CRUD ──

  async createTool(data: {
    toolId: string;
    name: string;
    description?: string;
    icon?: string;
    category: string;
    sortOrder?: number;
  }) {
    // 校验分类存在
    const cat = await this.prisma.toolCategory.findUnique({
      where: { key: data.category },
    });
    if (!cat) throw new NotFoundException('分类不存在，请先创建分类');

    const existing = await this.prisma.toolDefinition.findUnique({
      where: { toolId: data.toolId },
    });
    if (existing) throw new ConflictException('工具 toolId 已存在');

    return this.prisma.toolDefinition.create({ data });
  }

  async updateTool(
    toolId: string,
    data: Partial<{
      name: string;
      description: string;
      icon: string;
      category: string;
      enabled: boolean;
      sortOrder: number;
    }>,
  ) {
    if (data.category) {
      const cat = await this.prisma.toolCategory.findUnique({
        where: { key: data.category },
      });
      if (!cat) throw new NotFoundException('目标分类不存在');
    }

    const tool = await this.prisma.toolDefinition.findUnique({
      where: { toolId },
    });
    if (!tool) throw new NotFoundException('工具不存在');

    return this.prisma.toolDefinition.update({ where: { toolId }, data });
  }

  async deleteTool(toolId: string) {
    try {
      // 同时删除用户收藏（外键可选，这里手动清理）
      await this.prisma.toolFavorite.deleteMany({ where: { toolId } });
      await this.prisma.toolDefinition.delete({ where: { toolId } });
    } catch {
      throw new NotFoundException('工具不存在');
    }
  }

  async getToolById(toolId: string) {
    const tool = await this.prisma.toolDefinition.findUnique({
      where: { toolId },
    });
    if (!tool) throw new NotFoundException('工具不存在');
    return tool;
  }
}
