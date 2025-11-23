import { Injectable } from '@nestjs/common';
import { HighScore } from '../../generated/prisma';
import { PrismaService } from 'nestjs-prisma';
import { NewHighScoreDto } from './dto/new-high-score.dto';
import { UUID } from 'crypto';

@Injectable()
export class HighScoresService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<HighScore[]> {
    return this.prisma.highScore.findMany({
      orderBy: [{ score: 'desc' }],
    });
  }

  async addHighScore(data: NewHighScoreDto): Promise<HighScore> {
    return this.prisma.highScore.create({
      data,
    });
  }

  async deleteHighScore(id: UUID): Promise<void> {
    await this.prisma.highScore.delete({
      where: { id },
    });
  }
}
