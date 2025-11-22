import { Module } from '@nestjs/common';
import { HighScoresService } from './high-scores.service';
import { HighScoresController } from './high-scores.controller';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  controllers: [HighScoresController],
  providers: [HighScoresService],
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {},
    }),
  ],
})
export class ScoresModule {}
