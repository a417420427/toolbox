import { IsString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({ example: 'json', description: '工具 ID（对应 ToolRegistry）' })
  @IsString()
  toolId: string;

  @ApiPropertyOptional({ example: '常用工具', description: '收藏文件夹名，不传则为未分类' })
  @IsOptional()
  @IsString()
  folder?: string;
}
