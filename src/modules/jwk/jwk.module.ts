import { Module } from '@nestjs/common';
import { JwkService } from './jwk.service';

@Module({
  providers: [JwkService],
  exports: [JwkService],
})
export class JwkModule {}
