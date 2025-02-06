import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EmployeeModule } from './employee/employee.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './email/email.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { BullModule } from '@nestjs/bullmq';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.DB_URL),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_URL,
        port: parseInt(process.env.REDIS_PORT),
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    EmployeeModule,
    EmailModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
