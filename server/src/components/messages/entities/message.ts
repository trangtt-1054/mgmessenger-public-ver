import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { Reaction } from '../../reactions/entities/reaction';

@Entity({ name: 'messages' })
@ObjectType()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id!: string;

  @Column()
  @Field()
  from!: string;

  @Column()
  @Field()
  to!: string;

  @Column()
  @Field()
  content: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Reaction])
  @OneToMany(() => Reaction, (reaction) => reaction.message)
  reactions: Reaction[];
}
