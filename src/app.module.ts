import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { SecurityModule } from './shared/security/security.module';
import { UserModule } from './modules/user/user.module';
import { JwkModule } from './modules/jwk/jwk.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    SecurityModule,
    UserModule,
    JwkModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
