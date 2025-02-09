import { Test, TestingModule } from '@nestjs/testing';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EmailService } from '../email/email.service';

describe('EmployeeController', () => {
  let controller: EmployeeController;
  let employeeService: EmployeeService;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [
        {
          provide: EmployeeService,
          useValue: {
            create: jest.fn().mockResolvedValue('created'),
            findAll: jest.fn().mockResolvedValue(['awais-i', 'awaos-s']),
            findOne: jest.fn().mockResolvedValue('employee'),
            update: jest.fn().mockResolvedValue('updated'),
            remove: jest.fn().mockResolvedValue('deleted'),
          }
        },
        {
          provide: EmailService,
          useValue: {
            sendEmail: jest.fn().mockResolvedValue('email sent'),
          },
        }
      ],
    }).compile();

    controller = module.get<EmployeeController>(EmployeeController);
    employeeService = module.get<EmployeeService>(EmployeeService);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call employeeService.create with the correct parameters and return the result', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'Awais sadozai',
        email: 'awais@m.com',
        department: 'dev',
        title: 'Developer',
        salary: 50000,
        highestDegree: 'Bachelor',
      };
      const result = await controller.create(createEmployeeDto);
      expect(employeeService.create).toHaveBeenCalledWith(createEmployeeDto);
      expect(result).toBe('created');
    });

    it('should throw an error if employeeService.create throws an error', async () => {
      const createEmployeeDto: CreateEmployeeDto = {
        name: 'Awais sadozai',
        email: 'awais@m.com',
        department: 'dev',
        title: 'Developer',
        salary: 50000,
        highestDegree: 'Bachelor',
      };
      jest.spyOn(employeeService, 'create').mockImplementationOnce(() => {
        throw new Error('invalid parameters');
      });
      await expect(controller.create(createEmployeeDto)).rejects.toThrow('invalid parameters');
    });
  });

  describe('findAll', () => {
    it('should call employeeService.findAll and return the result', async () => {
      const result = await controller.findAll();
      expect(employeeService.findAll).toHaveBeenCalled();
      expect(result).toEqual(['employee1', 'employee2']);
    });
  });

  describe('findOne', () => {
    it('should call employeeService.findOne with the correct id and return the result', async () => {
      const id = '123';
      const result = await controller.findOne(id);
      expect(employeeService.findOne).toHaveBeenCalledWith(id);
      expect(result).toBe('employee');
    });
  });

  describe('update', () => {
    it('should call employeeService.update with the correct id and updateEmployeeDto, and return the result', async () => {
      const id = '123';
      const updateEmployeeDto: UpdateEmployeeDto = {
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        department: 'dev',
        title: 'Senior Developer',
        salary: 60000,
        highestDegree: 'Master',
      };
      const result = await controller.update(id, updateEmployeeDto);
      expect(employeeService.update).toHaveBeenCalledWith(id, updateEmployeeDto);
      expect(result).toBe('updated');
    });
    it('should validate UpdateEmployeeDto and throw an error if validation fails', async () => {
      const invalidUpdateEmployeeDto = {
        email: 'invalid-email',
        salary: 'not-a-number',
      };
      const dtoInstance = plainToInstance(UpdateEmployeeDto, invalidUpdateEmployeeDto);
      const errors = await validate(dtoInstance);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should call employeeService.remove with the correct id and return the result', async () => {
      const id = '123';
      const result = await controller.remove(id)
      expect(employeeService.remove).toHaveBeenCalledWith(id);
      expect(result).toBe('deleted');
    });
  });
});