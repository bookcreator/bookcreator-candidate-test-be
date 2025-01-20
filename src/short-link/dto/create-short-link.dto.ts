import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsUrl } from 'class-validator';

export class CreateShortLinkDto {
  @IsUrl(
    { require_protocol: true },
    { message: 'url must be a full URL address including protocol' },
  )
  @ApiProperty({
    format: 'url',
    example: 'https://httpbin.org',
    description: 'Full url including protocol',
  })
  // Remove any trailing slashes
  @Transform(({ value }) =>
    typeof value === 'string' ? value.replace(/\/+$/, '') : value,
  )
  /**
   * @Property full url to be shortened
   */
  url: string;
}
