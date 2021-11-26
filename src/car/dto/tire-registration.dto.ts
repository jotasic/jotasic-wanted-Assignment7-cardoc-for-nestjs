import { IsNotEmpty, IsNumber } from 'class-validator';

export class TireRegistrationDto {
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  aspectRatio: number;

  @IsNumber()
  @IsNotEmpty()
  wheelSize: number;
}
