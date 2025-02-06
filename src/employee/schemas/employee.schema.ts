import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type EmployeeDocument = Employee & Document;

@Schema({ timestamps: true })
export class Employee {
  @Prop()
  name: string;
  @Prop()
  email: string;
  @Prop()
  department: string;
  @Prop()
  title: string;
  @Prop()
  salary: number;
  @Prop()
  highestDegree: string;
  @Prop()
  createdAt: Date;
}
export const EmployeeSchema =
  SchemaFactory.createForClass(Employee);
