import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [EmailModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService], // Export so other modules can use UserService
})
export class UserModule {} 