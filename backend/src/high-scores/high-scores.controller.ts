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
  ValidationPipe,
} from '@nestjs/common';
import { HighScoresService } from './high-scores.service';
import type { UUID } from 'crypto';
import { NewHighScoreDto } from './dto/new-high-score.dto';
import type { HighScore } from 'generated/prisma';

@Controller('api/high-scores')
export class HighScoresController {
  constructor(private readonly highScoresService: HighScoresService) {}

  @Get()
  async findAll(): Promise<HighScore[]> {
    return this.highScoresService.findAll();
  }

  @Post()
  async createNewScore(
    @Body(new ValidationPipe()) newHighScore: NewHighScoreDto,
  ): Promise<HighScore> {
    return this.highScoresService.addHighScore(newHighScore);
  }

  @Delete(':uuid')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteHighScore(@Param('uuid', ParseUUIDPipe) id: UUID) {
    await this.highScoresService.deleteHighScore(id);
  }
}
