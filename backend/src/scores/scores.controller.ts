import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import type { UUID } from 'crypto';
import type { NewHighScoreDto } from './dto/new-high-score.dto';
import type { HighScore } from 'generated/prisma';

@Controller('api/high-scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  async findAll(): Promise<HighScore[]> {
    return this.scoresService.findAll();
  }

  @Post()
  async createNewScore(
    @Body() newHighScore: NewHighScoreDto,
  ): Promise<HighScore> {
    return this.scoresService.addHighScore(newHighScore);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHighScore(@Param('id') id: UUID) {
    await this.scoresService.deleteHighScore(id);
  }
}
