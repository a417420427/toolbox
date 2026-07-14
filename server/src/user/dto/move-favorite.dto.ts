import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MoveFavoriteDto {
  @ApiProperty({ example: '常用工具', description: '目标文件夹名，空字符串为未分类' })
  @IsString()
  folder: string;
}
