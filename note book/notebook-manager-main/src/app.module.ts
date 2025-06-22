import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotebookModule } from './notebook/notebook.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [PrismaModule, EmailModule, UserModule, AuthModule, NotebookModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
