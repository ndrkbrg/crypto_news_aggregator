import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [NewsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
