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
import { NewHighScore } from './dto/new-high-score.dto';

@Controller('scores')
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Get()
  findAll() {
    return [
      { name: 'Bob', score: 200 },
      { name: 'Mary', score: 300 },
    ];
  }

  @Post()
  createNewScore(@Body() newHighScore: NewHighScore) {
    return {
      ...newHighScore,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteHighScore(@Param('id') id: UUID) {}
}
