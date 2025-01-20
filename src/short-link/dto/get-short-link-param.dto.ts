import { ApiProperty } from '@nestjs/swagger';
import { IsBase62 } from '../../validators/base62-validator';

export class getShortLinkParamDto {
  @IsBase62()
  @ApiProperty()
  id: string;
}
