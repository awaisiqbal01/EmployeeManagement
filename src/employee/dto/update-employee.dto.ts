import { PartialType } from '@nestjs/mapped-types';
import { CreateEmployeeDto } from './create-employee.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateEmployeeDto extends PartialType(CreateEmployeeDto) {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  email: string;
  @IsString()
  @IsOptional()
  department: string;
  @IsString()
  @IsOptional()
  title: string;
//   @IsNumber()
  @IsOptional()
  @Type(()=>Number)
  salary: number;
  @IsString()
  @IsOptional()
  highestDegree: string;
}
