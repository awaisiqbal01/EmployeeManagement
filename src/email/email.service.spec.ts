import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';

describe('EmailService', () => {
  let emailService: EmailService;
  let emailQueue: Queue;

  beforeEach(async () => {
    const mockQueue = {
      add: jest.fn().mockResolvedValue({}),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: 'BullQueue_email',
          useValue: mockQueue,
        },
      ],
    }).compile();
    emailService = module.get<EmailService>(EmailService);
    emailQueue = module.get<Queue>('BullQueue_email');
  });
  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });
  describe('sendEmail', () => {
    it('should add an email to the queue and return "email sent"', async () => {
      const email = 'awais@m.com';
      const message = 'Hello awais wellcome';
      const subject = 'Test email';

      const result = await emailService.sendEmail(email, message, subject);
      expect(emailQueue.add).toHaveBeenCalledWith(
        'emailQeue',
        { email, message, subject },
        { delay: 3000 },
      );
      expect(result).toBe('email sent');
    });

    it('should throw an error if email is missing', async () => {
      const email = '';
      const message = 'Test message';

      await expect(emailService.sendEmail(email, message)).rejects.toThrow(
        'Email and message are required',
      );
    });

    it('should throw an error if message is missing', async () => {
      const email = 'awais@m.com';
      const message = '';

      await expect(emailService.sendEmail(email, message)).rejects.toThrow(
        'Email and message are required',
      );
    });

    it('should throw an error if both email and message are missing', async () => {
      const email = '';
      const message = '';
      await expect(emailService.sendEmail(email, message)).rejects.toThrow(
        'Email and message are required',
      );
    });
  });
});