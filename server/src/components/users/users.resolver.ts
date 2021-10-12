import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Subscription,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import {
  CreateUserInput,
  OnlineStatus,
  OnlineStatusInput,
} from './dto/user-input';
import { UsersService } from './users.service';
import { User } from './entities/user';
import { GqlAuthGuard } from '../../auth/auth.guard';
import { PubSub } from 'graphql-subscriptions';
import { AuthenticationError } from 'apollo-server-express';
import { MessagesService } from '../messages/messages.service';

@Resolver()
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private messagesService: MessagesService,
  ) {}

  @Query((returns) => User)
  @UseGuards(GqlAuthGuard)
  public async findUser(
    @Context('auth0UserId') auth0UserId: string,
  ): Promise<User> {
    return await this.usersService
      .findUser({ auth0Id: auth0UserId })
      .catch((e) => {
        throw e;
      });
  }

  @Query((returns) => [User])
  @UseGuards(GqlAuthGuard)
  public async getUsers(
    @Context('auth0UserId') auth0UserId: string,
  ): Promise<User[]> {
    const currentUser = await this.findUser(auth0UserId);
    const allMessagesRelatedToCurrentUser =
      await this.messagesService.getMessagesForCurrentUser({
        userId: currentUser.id,
      });

    let users = await this.usersService.getUsers({ auth0UserId }).catch((e) => {
      throw e;
    });

    users = users.map((user) => {
      const latestMessage = allMessagesRelatedToCurrentUser.find(
        (m) => m.from === user.id || m.to === user.id,
      );
      user.latestMessage = latestMessage ? latestMessage.content : '';
      return user;
    });

    return users;
  }

  @Mutation((returns) => User)
  public async createUser(
    @Args('newUserData') newUserData: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.createUser(newUserData).catch((e) => {
      throw e;
    });
  }

  @Mutation((returns) => OnlineStatus)
  @UseGuards(GqlAuthGuard)
  public async setOnlineStatus(
    @Args('onlineStatusInput') onlineStatusInput: OnlineStatusInput,
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');

    const { isOnline } = onlineStatusInput;
    const payload = { isOnline, userId: currentUser.id };
    pubsub.publish('ONLINE_STATUS', payload);
    await this.usersService.updateUser({ id: currentUser.id, isOnline });
    return payload;
  }

  @Subscription((returns) => OnlineStatus, {
    name: 'ONLINE_STATUS',
    resolve: (value) => value,
    filter: () => {
      return true;
    },
  })
  async onlineStatus(
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');
    return pubsub.asyncIterator('ONLINE_STATUS');
  }
}
