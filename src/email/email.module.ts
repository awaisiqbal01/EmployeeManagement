import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { BullModule } from '@nestjs/bullmq';
import { ProcessEmail } from './emil.processor';

@Module({
  imports:[
    BullModule.registerQueue({
      name: 'email'
    })
  ],
  providers: [EmailService, ProcessEmail],
  exports: [EmailService]
})
export class EmailModule {}
