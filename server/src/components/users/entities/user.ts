import { Field, ObjectType } from '@nestjs/graphql';
import { Reaction } from 'src/components/reactions/entities/reaction';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';

@Entity({ name: 'users' })
@ObjectType()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id!: string;

  @Column()
  @Field()
  auth0Id!: string;

  @Column()
  @Field()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Field(() => Boolean)
  @Column()
  isOnline: boolean;

  @Field(() => String)
  @Column({ nullable: true })
  latestMessage: string;

  @Field(() => String) //ko có type ở đây là bị lỗi Unable to infer GraphQL type from TypeScript reflection system
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Reaction, (reaction) => reaction.userId)
  reactions: Reaction[];
}
