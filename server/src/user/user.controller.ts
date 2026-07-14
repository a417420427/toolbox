import {
  Controller, Get, Post, Delete, Put,
  Body, Param, UseGuards, Req, HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { ReorderFavoritesDto } from './dto/reorder-favorites.dto';
import { CreateFolderDto } from './dto/create-folder.dto';
import { RenameFolderDto } from './dto/rename-folder.dto';
import { MoveFavoriteDto } from './dto/move-favorite.dto';

@ApiTags('用户')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private user: UserService) {}

  // ── Favorites ──

  @Get('favorites')
  @ApiOperation({ summary: '获取收藏列表（含文件夹）' })
  getFavorites(@Req() req: any) {
    return this.user.getFavorites(req.user.userId);
  }

  @Post('favorites')
  @ApiOperation({ summary: '添加收藏（可指定文件夹）' })
  addFavorite(@Req() req: any, @Body() dto: AddFavoriteDto) {
    return this.user.addFavorite(req.user.userId, dto.toolId, dto.folder);
  }

  @Delete('favorites/:toolId')
  @ApiOperation({ summary: '取消收藏' })
  removeFavorite(@Req() req: any, @Param('toolId') toolId: string) {
    return this.user.removeFavorite(req.user.userId, toolId);
  }

  @Put('favorites/reorder')
  @ApiOperation({ summary: '重新排序收藏' })
  reorder(@Req() req: any, @Body() dto: ReorderFavoritesDto) {
    return this.user.reorderFavorites(req.user.userId, dto.toolIds);
  }

  @Put('favorites/:toolId/move')
  @ApiOperation({ summary: '移动收藏到文件夹' })
  moveFavorite(@Req() req: any, @Param('toolId') toolId: string, @Body() dto: MoveFavoriteDto) {
    return this.user.moveFavorite(req.user.userId, toolId, dto.folder);
  }

  // ── Folders ──

  @Get('favorites/folders')
  @ApiOperation({ summary: '获取收藏文件夹列表' })
  getFolders(@Req() req: any) {
    return this.user.getFolders(req.user.userId);
  }

  @Post('favorites/folders')
  @ApiOperation({ summary: '创建收藏文件夹' })
  createFolder(@Req() req: any, @Body() dto: CreateFolderDto) {
    return this.user.createFolder(req.user.userId, dto.name);
  }

  @Put('favorites/folders/rename')
  @ApiOperation({ summary: '重命名收藏文件夹' })
  renameFolder(@Req() req: any, @Body() dto: RenameFolderDto) {
    return this.user.renameFolder(req.user.userId, dto.oldName, dto.newName);
  }

  @Delete('favorites/folders/:name')
  @HttpCode(204)
  @ApiOperation({ summary: '删除收藏文件夹（内收藏自动归入未分类）' })
  deleteFolder(@Req() req: any, @Param('name') name: string) {
    return this.user.deleteFolder(req.user.userId, name);
  }
}
