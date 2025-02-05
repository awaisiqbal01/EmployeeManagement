import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateIdDto {
  @IsString()
  @IsNotEmpty({ message: 'ID should not be empty' })
  id: string;
}
