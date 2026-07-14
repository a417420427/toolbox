import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFolderDto {
  @ApiProperty({ example: '常用工具', description: '文件夹名称' })
  @IsString()
  name: string;
}
