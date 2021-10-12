import { Module } from '@nestjs/common';
import { MessagesModule } from './messages/messages.module';
import { ReactionsModule } from './reactions/reactions.module';
import { UsersModule } from './users/users.module';
@Module({
  imports: [UsersModule, MessagesModule, ReactionsModule],
})
export class ComponentsModule {}
