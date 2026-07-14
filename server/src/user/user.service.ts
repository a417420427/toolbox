import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  // ── Favorites ──

  async getFavorites(userId: string) {
    const favorites = await this.prisma.toolFavorite.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      select: { toolId: true, folder: true, sortOrder: true },
    });
    return favorites.map((f) => ({
      toolId: f.toolId,
      folder: f.folder || '',
      sortOrder: f.sortOrder,
    }));
  }

  async addFavorite(userId: string, toolId: string, folder?: string) {
    const max = await this.prisma.toolFavorite.findFirst({
      where: { userId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    await this.prisma.toolFavorite.upsert({
      where: { userId_toolId: { userId, toolId } },
      update: { folder: folder ?? '' },
      create: {
        userId,
        toolId,
        folder: folder ?? '',
        sortOrder: (max?.sortOrder ?? -1) + 1,
      },
    });

    return this.getFavorites(userId);
  }

  async removeFavorite(userId: string, toolId: string) {
    try {
      await this.prisma.toolFavorite.delete({
        where: { userId_toolId: { userId, toolId } },
      });
    } catch {
      throw new NotFoundException('收藏不存在');
    }
    return this.getFavorites(userId);
  }

  async reorderFavorites(userId: string, toolIds: string[]) {
    await this.prisma.toolFavorite.deleteMany({ where: { userId } });
    await this.prisma.toolFavorite.createMany({
      data: toolIds.map((toolId, i) => ({
        userId,
        toolId,
        sortOrder: i,
      })),
    });
    return this.getFavorites(userId);
  }

  async moveFavorite(userId: string, toolId: string, folder: string) {
    try {
      await this.prisma.toolFavorite.update({
        where: { userId_toolId: { userId, toolId } },
        data: { folder },
      });
    } catch {
      throw new NotFoundException('收藏不存在');
    }
    return this.getFavorites(userId);
  }

  // ── Favorite Folders ──

  async getFolders(userId: string) {
    const folders = await this.prisma.favoriteFolder.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, sortOrder: true },
    });

    // 追加收藏中存在的未关联文件夹名
    const usedFolders = await this.prisma.toolFavorite.findMany({
      where: { userId, folder: { not: '' } },
      distinct: ['folder'],
      select: { folder: true },
    });
    const usedFolderNames = usedFolders.map((f) => f.folder);
    const registeredNames = new Set(folders.map((f) => f.name));
    const orphans = usedFolderNames.filter((n) => !registeredNames.has(n));

    return [
      ...folders,
      ...orphans.map((name, i) => ({
        id: `__orphan_${name}`,
        name,
        sortOrder: folders.length + i,
      })),
    ];
  }

  async createFolder(userId: string, name: string) {
    if (!name.trim()) throw new ConflictException('文件夹名不能为空');

    const existing = await this.prisma.favoriteFolder.findUnique({
      where: { userId_name: { userId, name: name.trim() } },
    });
    if (existing) throw new ConflictException('文件夹名已存在');

    const max = await this.prisma.favoriteFolder.findFirst({
      where: { userId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    const folder = await this.prisma.favoriteFolder.create({
      data: {
        userId,
        name: name.trim(),
        sortOrder: (max?.sortOrder ?? -1) + 1,
      },
    });

    return { id: folder.id, name: folder.name, sortOrder: folder.sortOrder };
  }

  async renameFolder(userId: string, oldName: string, newName: string) {
    if (!newName.trim()) throw new ConflictException('文件夹名不能为空');

    const folder = await this.prisma.favoriteFolder.findUnique({
      where: { userId_name: { userId, name: oldName } },
    });
    if (!folder) throw new NotFoundException('文件夹不存在');

    const conflict = await this.prisma.favoriteFolder.findUnique({
      where: { userId_name: { userId, name: newName.trim() } },
    });
    if (conflict) throw new ConflictException('目标文件夹名已存在');

    // 重命名 FavoriteFolder 记录
    await this.prisma.favoriteFolder.update({
      where: { id: folder.id },
      data: { name: newName.trim() },
    });

    // 同步更新 ToolFavorite 中的 folder 字段
    await this.prisma.toolFavorite.updateMany({
      where: { userId, folder: oldName },
      data: { folder: newName.trim() },
    });
  }

  async deleteFolder(userId: string, name: string) {
    // 删除 Folder 记录
    try {
      await this.prisma.favoriteFolder.delete({
        where: { userId_name: { userId, name } },
      });
    } catch {
      throw new NotFoundException('文件夹不存在');
    }

    // 将该文件夹内的收藏移入"未分类"
    await this.prisma.toolFavorite.updateMany({
      where: { userId, folder: name },
      data: { folder: '' },
    });
  }
}
