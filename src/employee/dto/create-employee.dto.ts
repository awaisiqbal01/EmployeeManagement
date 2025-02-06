import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  department: string;
  @IsString()
  title: string;
  // @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  salary: number;
  @IsString()
  @IsOptional()
  highestDegree: string;
}
