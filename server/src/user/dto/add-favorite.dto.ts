import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({ example: 'json', description: '工具 ID（对应 ToolRegistry）' })
  @IsString()
  toolId: string;
}
