import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from 'typeorm';
import { User } from '../../users/entities/user';
import { Message } from '../../messages/entities/message';

@Entity({ name: 'reactions' })
@ObjectType()
export class Reaction extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id!: string;

  @Column()
  @Field()
  content!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  messageId: string;

  @Field()
  @Column()
  userId: string;

  @Field(() => Message)
  @ManyToOne(() => Message, (message) => message.reactions)
  message: Message;

  @ManyToOne(() => User, (user) => user.reactions)
  user: User;
}

//Sau khi thêm entity ko cần migrate gì cả, start lại server nó tự migrate cho mình
