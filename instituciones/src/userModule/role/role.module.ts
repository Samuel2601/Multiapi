import { Module } from '@nestjs/common';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsModule } from 'src/socket.io/notifications.module';
import { PermisoModule } from '../permiso/permiso.module';
import { User } from 'src/entity/User';
import { Permission } from 'src/entity/Permission';
import { Role } from 'src/entity/Role';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]), // Usa TypeOrmModule en lugar de MongooseModule
    NotificationsModule,
    PermisoModule,
  ],
  providers: [RoleService],
  controllers: [RoleController],
  exports: [RoleService],
})
export class RoleModule {}
