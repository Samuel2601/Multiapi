import { Module } from '@nestjs/common';
import { PermisoController } from './permiso.controller';
import { PermisoService } from './permiso.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/socket.io/notifications.module';
import { EmailModule } from 'src/common/email/email.module';
import { User } from 'src/entity/User';
import { Permission } from 'src/entity/Permission';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Permission]),
    NotificationsModule,
    EmailModule,
  ],
  providers: [PermisoService],
  controllers: [PermisoController],
  exports: [PermisoService],
})
export class PermisoModule {}
