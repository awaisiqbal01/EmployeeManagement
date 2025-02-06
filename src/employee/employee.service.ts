import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './schemas/employee.schema';
import { EmailService } from 'src/email/email.service';
// import { ValidateIdDto } from './dto/validateId.dto';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    private readonly emailService: EmailService
  ) {}

  async create(employeeData: CreateEmployeeDto) {
    console.log(employeeData);
    const newEmployee = await this.employeeModel.create({
      name: employeeData.name,
      email: employeeData.email,
      department: employeeData.department || "",
      title: employeeData.title || "",
      salary: employeeData.salary,
      highestDegree: employeeData.highestDegree || "",

    });
    this.emailService.sendEmail(employeeData.email, 'Hello well to employee managment!');
    return newEmployee;
  }

  async findAll(pageSize: number = 10, pageNumber: number = 1) {
    // return await this.employeeModel.find({});
    const employeeList =  await this.employeeModel.aggregate([
      {$sort: {createdAt: -1}},
      {$skip: pageNumber*pageNumber},
      {$limit: pageSize}
    ]);
    return employeeList;
  }

  async findOne(id: string) {
    return await this.employeeModel.find({"_id": id});
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if(!id) throw new NotFoundException(`User ${id} not found to update`); //can be add custome validator decorator here
    console.log('----------------->> Update >>', id);
    const updatedEmployee = await this.employeeModel.findOneAndUpdate(
      {"_id": id},
      {$set: updateEmployeeDto},
      {new: true}
    );
    return updatedEmployee;
  }

  async remove(id: string) {
    if(!id) throw new NotFoundException(`User ${id} not found to update`); ///same here custome validatro can be added instead manuall exception throw
    console.log('----------------->> Deleted >>', id);
    const deleteEmployee = await this.employeeModel.findByIdAndDelete({"_id": id});
    if(!deleteEmployee) throw new NotFoundException(`User with ${id} not found to remove`);
    return `user ${id} deleted`;
  }
}
