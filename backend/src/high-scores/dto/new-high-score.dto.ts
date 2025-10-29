import { IsNotEmpty, IsString, IsInt, IsPositive } from 'class-validator';

export class NewHighScoreDto {
  @IsString()
  @IsNotEmpty()
  // @ts-ignore
  name: string;

  @IsInt()
  @IsPositive()
  // @ts-ignore
  score: number;
}
