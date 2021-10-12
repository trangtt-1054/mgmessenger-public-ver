import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { MessagesModule } from '../messages/messages.module';
import { ReactionsService } from './reactions.service';
import { ReactionsResolver } from './reactions.resolver';
import { Reaction } from './entities/reaction';

@Module({
  imports: [TypeOrmModule.forFeature([Reaction]), UsersModule, MessagesModule],
  providers: [ReactionsService, ReactionsResolver],
  exports: [ReactionsService],
})
export class ReactionsModule {}
