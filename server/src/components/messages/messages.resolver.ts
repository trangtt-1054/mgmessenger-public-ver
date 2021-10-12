import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { PubSub } from 'graphql-subscriptions';
import { GqlAuthGuard } from '../../auth/auth.guard';
import { User } from '../users/entities/user';
import { UsersService } from '../users/users.service';
import {
  GetMessagesInput,
  NewMessageInput,
  TypingStatusData,
  TypingStatusInput,
} from './dto/message-input';
import { Message } from './entities/message';
import { MessagesService } from './messages.service';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private messagesService: MessagesService,
    private usersService: UsersService,
  ) {}

  @Query((returns) => [Message])
  @UseGuards(GqlAuthGuard)
  public async getMessages(
    @Args('getMessagesParam') getMessagesParam: GetMessagesInput,
    @Context('auth0UserId') auth0UserId: string,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');

    const { from } = getMessagesParam;
    const otherUser = await this.usersService.findUser({ id: from });
    if (!otherUser) throw new UserInputError('Honey, user not found!');

    return await this.messagesService.getMessages({
      from,
      currentUserId: currentUser.id,
    });
  }

  @Mutation((returns) => Message)
  @UseGuards(GqlAuthGuard)
  public async addMessage(
    @Args('newMessageData') newMessageData: NewMessageInput,
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');

    const { to } = newMessageData;
    const recipient = await this.usersService.findUser({ id: to });
    if (!recipient) throw new UserInputError('Honey, recipient not found!');

    if (to === currentUser.id)
      throw new UserInputError("Honey, you can't send message to yourself!");

    const newMessage = await this.messagesService
      .addMessage({ newMessageInput: newMessageData, senderId: currentUser.id })
      .catch((e) => {
        throw e;
      });

    pubsub.publish('NEW_MESSAGE', { newMessage });
    return newMessage;
  }

  @Mutation((returns) => TypingStatusData)
  @UseGuards(GqlAuthGuard)
  public async setTypingStatus(
    @Args('typingStatusInput') typingStatusInput: TypingStatusInput,
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');

    const { isTyping, to } = typingStatusInput;
    const payload = { isTyping, to, from: currentUser.id };
    pubsub.publish('TYPING_STATUS', payload);
    return payload;
  }

  @Subscription((returns) => Message, {
    name: 'NEW_MESSAGE',
    resolve(this: MessagesResolver, value) {
      return value.newMessage; //value: { newMessage: Message } => have to return value.newMessage
    },
    async filter(
      payload: { newMessage: Message },
      variables: NewMessageInput,
      context,
    ) {
      const { newMessage } = payload;
      const { auth0UserId } = context;
      const currentUser: User = await this.usersService.findUser({
        auth0Id: auth0UserId,
      });
      if (
        newMessage.to === currentUser.id ||
        newMessage.from === currentUser.id
      )
        return true;
      return false;
    },
  })
  async newMessage(
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');
    return pubsub.asyncIterator('NEW_MESSAGE');
  }

  @Subscription(() => TypingStatusData, {
    name: 'TYPING_STATUS',
    resolve: (value) => value,
    async filter(
      payload: TypingStatusData,
      variables: NewMessageInput,
      context,
    ) {
      const { to } = payload;
      const { auth0UserId } = context;
      const currentUser: User = await this.usersService.findUser({
        auth0Id: auth0UserId,
      });
      if (to === currentUser.id) return true;
      return false;
    },
  })
  async typingStatus(
    @Context('auth0UserId') auth0UserId: string,
    @Context('pubsub') pubsub: PubSub,
  ) {
    const currentUser = await this.usersService.findUser({
      auth0Id: auth0UserId,
    });
    if (!currentUser)
      throw new AuthenticationError('Sorry, you are unauthenticated!');
    return pubsub.asyncIterator('TYPING_STATUS');
  }
}
