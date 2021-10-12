import { Field, InputType } from '@nestjs/graphql';
import { Length } from 'class-validator';

@InputType()
export class ReactToMessageInput {
  @Field()
  messageId: string;

  @Field()
  @Length(1, undefined, { message: 'Honey, pick an icon!' })
  content: string; //keeping icon will make insert query fail => can not return null for non-nullable Reaction.id
}
