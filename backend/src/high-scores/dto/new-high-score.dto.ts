import {
  IsNotEmpty,
  IsString,
  MaxLength,
  IsInt,
  IsPositive,
} from 'class-validator';

export class NewHighScoreDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(18)
  // @ts-ignore
  name: string;

  @IsInt()
  @IsPositive()
  // @ts-ignore
  score: number;
}
