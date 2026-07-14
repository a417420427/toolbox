import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RenameFolderDto {
  @ApiProperty({ example: '旧名称', description: '原文件夹名' })
  @IsString()
  oldName: string;

  @ApiProperty({ example: '新名称', description: '新文件夹名' })
  @IsString()
  newName: string;
}
