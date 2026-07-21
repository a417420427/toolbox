import {
  Controller, Get, Post, Put, Delete,
  Body, Param, UseGuards, Query, HttpCode,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ToolsService } from './tools.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateToolDto,
  UpdateToolDto,
} from './dto/tools.dto';

@ApiTags('工具配置')
@Controller('api/tools')
export class ToolsController {
  constructor(private tools: ToolsService) {}

  // ═══════════════════════════════════════
  //  公开接口（无需登录）
  // ═══════════════════════════════════════

  @Get('categories')
  @ApiOperation({ summary: '获取所有启用的工具分类（含工具列表）' })
  async getCategories() {
    const cats = await this.tools.getCategories();
    const result = [];
    for (const cat of cats) {
      const tools = await this.tools.getToolsByCategory(cat.key);
      result.push({ ...cat, tools });
    }
    return result;
  }

  @Get('all')
  @ApiOperation({ summary: '获取所有启用的工具（扁平列表）' })
  getAllTools() {
    return this.tools.getAllTools();
  }

  @Get(':toolId')
  @ApiOperation({ summary: '获取单个工具详情' })
  getTool(@Param('toolId') toolId: string) {
    return this.tools.getTool(toolId);
  }

  // ═══════════════════════════════════════
  //  管理接口（需登录，供管理页面调用）
  // ═══════════════════════════════════════

  // ── Category ──

  @Get('admin/categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[管理] 获取全部分类（含禁用）' })
  getAllCategories() {
    return this.tools.getAllCategories();
  }

  @Post('admin/categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[管理] 创建分类' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.tools.createCategory(dto);
  }

  @Put('admin/categories/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[管理] 更新分类' })
  updateCategory(@Param('key') key: string, @Body() dto: UpdateCategoryDto) {
    return this.tools.updateCategory(key, dto);
  }

  @Delete('admin/categories/:key')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: '[管理] 删除分类（需先清空工具）' })
  deleteCategory(@Param('key') key: string) {
    return this.tools.deleteCategory(key);
  }

  // ── Tool ──

  @Get('admin/tools')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[管理] 获取全部工具（含禁用）' })
  getAllToolsAdmin() {
    return this.tools.getAllToolsForAdmin();
  }

  @Post('admin/tools')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[管理] 创建工具' })
  createTool(@Body() dto: CreateToolDto) {
    return this.tools.createTool(dto);
  }

  @Put('admin/tools/:toolId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '[管理] 更新工具' })
  updateTool(@Param('toolId') toolId: string, @Body() dto: UpdateToolDto) {
    return this.tools.updateTool(toolId, dto);
  }

  @Delete('admin/tools/:toolId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ summary: '[管理] 删除工具' })
  deleteTool(@Param('toolId') toolId: string) {
    return this.tools.deleteTool(toolId);
  }
}
