import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Length, IsEmail } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @Length(3, 20)
  username: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  auth0Id: string;
}

@InputType()
export class OnlineStatusInput {
  @Field()
  isOnline: boolean;
}

@ObjectType()
export class OnlineStatus {
  @Field()
  userId: string;

  @Field()
  isOnline: boolean;
}
