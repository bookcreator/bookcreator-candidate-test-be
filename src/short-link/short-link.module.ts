import { Module } from '@nestjs/common';
import { ShortLinkService } from './short-link.service';
import { ShortLinkController } from './short-link.controller';
import { HashModule } from '../hash/hash.module';

@Module({
  imports: [HashModule],
  controllers: [ShortLinkController],
  providers: [ShortLinkService],
})
export class ShortLinkModule {}
