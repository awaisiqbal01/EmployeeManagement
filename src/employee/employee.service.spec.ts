import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeService } from './employee.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from './schemas/employee.schema';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { EmailService } from 'src/email/email.service';

describe('EmployeeService', () => {
  let employeeService: EmployeeService;
  let employeeModel: Model<Employee>;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getModelToken(Employee.name),
          useValue: {
            create: jest.fn(),
            aggregate: jest.fn(),
            find: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
          },
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue('email sent'),
          },
        },
      ],
    }).compile();
    employeeService = module.get<EmployeeService>(EmployeeService);
    employeeModel = module.get<Model<Employee>>(getModelToken(Employee.name));
    emailService = module.get<EmailService>(EmailService);
  });
  it('should be defined', () => {
    expect(employeeService).toBeDefined();
  });
  describe('create', () => {
    it('should create a new employee and send an email', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'Awais Sadozai',
        email: 'awais@example.com',
        department: 'Engineering',
        title: 'Developer',
        salary: 50000,
        highestDegree: 'Bachelor',
      };
      const mockEmployee = {
        _id: 'invalied_123',
        ...createEmployeeDto,
      };
      jest.spyOn(employeeModel, 'create').mockResolvedValue(mockEmployee as any);
      const result = await employeeService.create(createEmployeeDto);
      expect(employeeModel.create).toHaveBeenCalledWith({
        name: createEmployeeDto.name,
        email: createEmployeeDto.email,
        department: createEmployeeDto.department || '',
        title: createEmployeeDto.title || '',
        salary: createEmployeeDto.salary,
        highestDegree: createEmployeeDto.highestDegree || '',
      });
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        createEmployeeDto.email,
        `Hello, ${createEmployeeDto.name} well to employee managment!`,
      );
      expect(result).toEqual(mockEmployee);
    });
  });

  describe('findAll', () => {
    it('should return a list of employees with pagination', async () => {
      const mockEmployees = [
        { _id: 'invalied_123', name: 'awais-i' },
        { _id: 'invalied_321', name: 'awais-s' },
      ];
      jest.spyOn(employeeModel, 'aggregate').mockResolvedValue(mockEmployees);
      const pageSize = 10;
      const pageNumber = 1;
      const result = await employeeService.findAll(pageSize, pageNumber);
      expect(employeeModel.aggregate).toHaveBeenCalledWith([
        { $sort: { createdAt: -1 } },
        { $skip: pageNumber * pageNumber },
        { $limit: pageSize },
      ]);
      expect(result).toEqual(mockEmployees);
    });
  });

  describe('findOne', () => {
    it('should return an employee by id', async () => {
      const mockEmployee = { _id: 'invalied_123', name: 'Awais Sadozai' };
      jest.spyOn(employeeModel, 'find').mockResolvedValue([mockEmployee]);
      const result = await employeeService.findOne('invalied_123');
      expect(employeeModel.find).toHaveBeenCalledWith({ _id: 'invalied_123' });
      expect(result).toEqual([mockEmployee]);
    });
  });

  describe('update', () => {
    it('should update an employee and return the updated record', async () => {
      const updateEmployeeDto: CreateEmployeeDto = {
        name: 'Awais sadozai',
        email: 'awais@m.com',
        department: 'dev',
        title: 'Developer',
        salary: 50000,
        highestDegree: 'Bachelor',
      };
      const mockUpdatedEmployee = {
        _id: 'invalied_123',
        name: 'Awais Sadozai Updt',
      };
      jest.spyOn(employeeModel, 'findOneAndUpdate').mockResolvedValue(mockUpdatedEmployee);
      const result = await employeeService.update('123', updateEmployeeDto)
      expect(employeeModel.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: 'valide_123' },
        { $set: updateEmployeeDto },
        { new: true },
      );
      expect(result).toEqual(mockUpdatedEmployee);
    });
    it('should throw NotFoundException if id is not provided', async () => {
      await expect(employeeService.update('', {} as UpdateEmployeeDto)).rejects.toThrow(
        'User  not found to update',
      );
    });
  });

  // describe('remove', () => {
  //   it('should delete an employee and return a success message', async () => {
  //     const mockDeletedEmployee = { _id: '', name: 'Awais Sadozai' };
  //     jest.spyOn(employeeModel, 'findByIdAndDelete').mockResolvedValue(mockDeletedEmployee);
  //     const result = await employeeService.remove('_id');
  //     expect(employeeModel.findByIdAndDelete).toHaveBeenCalledWith({ _id: '' });
  //     expect(result).toEqual(`user  deleted`);
  //   });
  //   it('should throw NotFoundException if id is not provided', async () => {
  //     await expect(employeeService.remove('')).rejects.toThrow('User  not found to update');
  //   });
  //   it('should throw NotFoundException if employee is not found', async () => {
  //     jest.spyOn(employeeModel, 'findByIdAndDelete').mockResolvedValue(null);
  //     await expect(employeeService.remove('invalied_123')).rejects.toThrow(
  //       'User with invalied_123 not found to remove',
  //     );
  //   });
  // });
});