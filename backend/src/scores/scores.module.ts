import { Module } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { ScoresController } from './scores.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [ScoresController],
  providers: [ScoresService],
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {},
    }),
  ],
})
export class ScoresModule {}
