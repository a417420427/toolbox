import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

// ── Category ──

export class CreateCategoryDto {
  @ApiProperty({ description: '分类标识，如 fun / tools', example: 'fun' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  key: string;

  @ApiProperty({ description: '显示名称', example: '娱乐工具' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  label: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ description: '图标名' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  icon?: string;

  @ApiPropertyOptional({ description: '颜色 HEX' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  color?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ description: '显示名称' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  label?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ description: '图标名' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  icon?: string;

  @ApiPropertyOptional({ description: '颜色 HEX' })
  @IsOptional()
  @IsString()
  @MaxLength(16)
  color?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '启用/禁用' })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

// ── Tool ──

export class CreateToolDto {
  @ApiProperty({ description: '工具标识，对应路由/组件名', example: 'json' })
  @IsString()
  @MinLength(1)
  @MaxLength(64)
  toolId: string;

  @ApiProperty({ description: '显示名称', example: 'JSON 工具' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  name: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ description: '图标名' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  icon?: string;

  @ApiProperty({ description: '所属分类 key', example: 'formatters' })
  @IsString()
  @MinLength(1)
  @MaxLength(32)
  category: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class UpdateToolDto {
  @ApiPropertyOptional({ description: '显示名称' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  name?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;

  @ApiPropertyOptional({ description: '图标名' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  icon?: string;

  @ApiPropertyOptional({ description: '所属分类 key' })
  @IsOptional()
  @IsString()
  @MaxLength(32)
  category?: string;

  @ApiPropertyOptional({ description: '排序' })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '启用/禁用' })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}
