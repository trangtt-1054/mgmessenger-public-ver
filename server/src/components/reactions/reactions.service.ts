import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../messages/entities/message';
import { Reaction } from './entities/reaction';

const icons = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];

@Injectable()
export class ReactionsService {
  constructor(
    @InjectRepository(Reaction)
    private reactionRepository: Repository<Reaction>,
  ) {}

  public async getAll() {
    return await this.reactionRepository.find();
  }

  public async reactToMessage({
    messageId,
    userId,
    content,
    message,
  }: {
    messageId: string;
    userId: string;
    content: string;
    message: Message;
  }): Promise<Reaction> {
    const reaction = await this.reactionRepository.findOne({
      where: { messageId, userId },
      relations: ['message'], //expose `message` field on Reaction
    });

    if (reaction) {
      reaction.content = content;
      await reaction.save();
    } else {
      const newReaction = this.reactionRepository.create({
        messageId,
        userId,
        content,
        message,
      });
      await this.reactionRepository.save(newReaction).catch((e) => {
        throw new InternalServerErrorException();
      });
      return newReaction;
    }

    return reaction;
  }
}
