import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getFavorites(userId: string) {
    const favorites = await this.prisma.toolFavorite.findMany({
      where: { userId },
      orderBy: { sortOrder: 'asc' },
      select: { toolId: true, sortOrder: true },
    });
    return favorites.map((f) => f.toolId);
  }

  async addFavorite(userId: string, toolId: string) {
    const max = await this.prisma.toolFavorite.findFirst({
      where: { userId },
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    });

    await this.prisma.toolFavorite.upsert({
      where: { userId_toolId: { userId, toolId } },
      update: {},
      create: {
        userId,
        toolId,
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
    // 删除所有后重建（简单粗暴，收藏量不大）
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
}
