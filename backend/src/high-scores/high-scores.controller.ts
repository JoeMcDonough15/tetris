import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ScoresService } from './high-scores.service';
import type { UUID } from 'crypto';
import { NewHighScoreDto } from './dto/new-high-score.dto';
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

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHighScore(@Param('uuid', ParseUUIDPipe) id: UUID) {
    await this.scoresService.deleteHighScore(id);
  }
}
