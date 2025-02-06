//https://docs.bullmq.io/guide/nestjs
//https://www.youtube.com/watch?v=ohVmmS0nLIw&t=708s
//https://docs.nestjs.com/techniques/queues
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { delay, Queue } from 'bullmq';

@Injectable()
export class EmailService {
    constructor(@InjectQueue('email') private readonly emailQueue: Queue){}
    async sendEmail(email: string, message: string, subject: string = "Wellcome Onboard"){
        await this.emailQueue.add('emailQeue', {email, message, subject}, {delay: 3000});
        console.log('=========>> EMAIL ADDED TO QUEUE <<============');
    }
}
