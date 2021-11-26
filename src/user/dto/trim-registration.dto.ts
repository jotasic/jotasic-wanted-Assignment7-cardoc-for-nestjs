import { IsNumber, IsString } from 'class-validator';

export class TrimRegistrationDto {
  @IsString()
  id: string;

  @IsNumber()
  trimId: number;
}
