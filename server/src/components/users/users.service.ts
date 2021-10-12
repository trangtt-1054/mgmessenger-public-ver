import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateUserInput } from './dto/user-input';
import { User } from './entities/user';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  public async findUser(userFilter: Partial<User>) {
    return await this.usersRepository.findOne(userFilter);
  }

  public async getUsers({
    auth0UserId,
  }: {
    auth0UserId: string;
  }): Promise<User[]> {
    return await this.usersRepository
      .find({ auth0Id: Not(auth0UserId) })
      .catch((e) => {
        throw new InternalServerErrorException();
      });
  }

  public async createUser(createUserInput: CreateUserInput): Promise<User> {
    const newUser = this.usersRepository.create({
      ...createUserInput,
      isOnline: false,
    });
    await this.usersRepository.save(newUser).catch((e) => {
      new InternalServerErrorException();
    });

    return newUser;
  }

  public async updateUser(updateUserInput: Partial<User>): Promise<User> {
    const { id, isOnline } = updateUserInput;
    const user = await this.usersRepository.findOne({ id });
    user.isOnline = isOnline;
    await user.save();
    return user;
  }
}
