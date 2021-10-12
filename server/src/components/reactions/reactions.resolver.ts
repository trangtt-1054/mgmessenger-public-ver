import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Resolver,
  Query,
  Subscription,
} from '@nestjs/graphql';
import {
  AuthenticationError,
  ForbiddenError,
  UserInputError,
} from 'apollo-server-express';
import { GqlAuthGuard } from '../../auth/auth.guard';
import { MessagesService } from '../messages/messages.service';
import { Reaction } from './entities/reaction';
import { UsersService } from '../users/users.service';
import { ReactToMessageInput } from './dto/reaction-input';
import { ReactionsService } from './reactions.service';
import { User } from '../users/entities/user';
import { PubSub } from 'graphql-subscriptions';

@Resolver()
export class ReactionsResolver {
  constructor(
    private reactionsService: ReactionsService,
    private usersService: UsersService,
    private messagesService: MessagesService,
  ) {}

  @Query((returns) => [Reaction])
  public async getReactions() {
    return await this.reactionsService.getAll();
  }

  @Mutation((returns) => Reaction)
  @UseGuards(GqlAuthGuard)
  public async reactToMessage(
    @Args('reactInput') reactInput: ReactToMessageInput,
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const { messageId, content } = reactInput;
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    const message = await this.messagesService.findMessage({ id: messageId });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');
    if (!message) throw new UserInputError('Sorry honey, message not found');
    if (message.from !== currentUser.id && message.to !== currentUser.id)
      throw new ForbiddenError(
        'Sweetie, you can only react to message that are to or from you',
      );

    const newReaction = await this.reactionsService
      .reactToMessage({
        messageId,
        content,
        userId: currentUser.id,
        message,
      })
      .catch((e) => {
        throw e;
      });
    pubsub.publish('NEW_REACTION', { newReaction });
    return newReaction;
  }

  @Subscription((returns) => Reaction, {
    name: 'NEW_REACTION',
    resolve(this: ReactionsResolver, value) {
      return value.newReaction;
    },
    async filter(
      payload: { newReaction: Reaction },
      variables: ReactToMessageInput,
      context,
    ) {
      const { newReaction } = payload;
      const { auth0UserId } = context;
      const currentUser: User = await this.usersService.findUser({
        auth0Id: auth0UserId,
      });
      if (
        newReaction.message.from === currentUser.id ||
        newReaction.message.to === currentUser.id
      )
        return true;
      return false;
    },
  })
  async newReaction(
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');
    return pubsub.asyncIterator('NEW_REACTION');
  }
}
