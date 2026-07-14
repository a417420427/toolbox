import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReorderFavoritesDto {
  @ApiProperty({
    example: ['json', 'base64', 'timestamp'],
    description: '排序后的 toolId 列表（按期望顺序）',
  })
  @IsArray()
  @IsString({ each: true })
  toolIds: string[];
}
