import {
  Controller, Get, Post, Delete,
  Body, Param, UseGuards, Req, Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { ReorderFavoritesDto } from './dto/reorder-favorites.dto';

@ApiTags('用户')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/user')
export class UserController {
  constructor(private user: UserService) {}

  @Get('favorites')
  @ApiOperation({ summary: '获取收藏列表' })
  getFavorites(@Req() req: any) {
    return this.user.getFavorites(req.user.userId);
  }

  @Post('favorites')
  @ApiOperation({ summary: '添加收藏' })
  addFavorite(@Req() req: any, @Body() dto: AddFavoriteDto) {
    return this.user.addFavorite(req.user.userId, dto.toolId);
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
}
