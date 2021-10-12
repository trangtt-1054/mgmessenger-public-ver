import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class NewMessageInput {
  @Field()
  to: string;

  @Field()
  @Length(1, undefined, { message: "Honey, message content can't be empty." })
  content: string;
}

@InputType()
export class GetMessagesInput {
  @Field()
  from: string;
}

@ObjectType()
export class TypingStatusData {
  @Field()
  isTyping: boolean;

  @Field()
  to: string;

  @Field()
  from: string;
}

@InputType()
export class TypingStatusInput {
  @Field()
  isTyping: boolean;

  @Field()
  to: string;
}
