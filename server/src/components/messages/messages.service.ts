import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { NewMessageInput } from './dto/message-input';
import { Message } from './entities/message';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
  ) {}

  public async findMessage({ id }: { id: string }) {
    return await this.messagesRepository.findOne(id);
  }

  public async getMessages({
    from,
    currentUserId,
  }: {
    from: string;
    currentUserId: string;
  }) {
    //https://orkhan.gitbook.io/typeorm/docs/find-options
    const userIds = [from, currentUserId];
    const messages = this.messagesRepository.find({
      where: {
        from: In(userIds),
        to: In(userIds),
      },
      order: {
        createdAt: 'ASC',
      },
      relations: ['reactions'],
      //Nếu ko expose relations sẽ bị lỗi Cannot return null for non-nullable field Message.reactions. Cái này giống như ResolveField()
    });

    return messages;
  }

  public async getMessagesForCurrentUser({ userId }: { userId: string }) {
    //https://orkhan.gitbook.io/typeorm/docs/find-options đoạn "Querying with OR operator"
    const messages = this.messagesRepository
      .find({
        where: [{ from: userId }, { to: userId }],
        order: {
          createdAt: 'DESC',
        },
      })
      .catch((e) => {
        throw new InternalServerErrorException();
      });
    return messages;
  }

  public async addMessage({
    newMessageInput,
    senderId,
  }: {
    newMessageInput: NewMessageInput;
    senderId: string;
  }): Promise<Message> {
    const { to, content } = newMessageInput;
    const newMessage = this.messagesRepository.create({
      to,
      content,
      from: senderId,
      reactions: [],
    });
    await this.messagesRepository.save(newMessage).catch((e) => {
      new InternalServerErrorException();
    });

    return newMessage;
  }
}
