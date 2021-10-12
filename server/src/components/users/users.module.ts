import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { User } from './entities/user';
import { MessagesModule } from '../messages/messages.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => MessagesModule)],
  //Vì bên MessagesModule đã import UsersModule => phải forwardRef MessagesModule nếu ko sẽ bị lỗi circular of dependencies
  //https://docs.nestjs.com/fundamentals/circular-dependency#module-forward-reference
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
