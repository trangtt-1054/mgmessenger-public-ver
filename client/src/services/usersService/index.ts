import {
  MutationCreateUserArgs,
  User,
  RegisterDocument,
  FindUserDocument,
  GetUsersDocument,
  SetOnlineStatusDocument,
} from '../../generated/graphql';
import { apolloClient } from '../../graphql';

class usersService {
  public async register(
    registerData: MutationCreateUserArgs
  ): Promise<{ createUser: User } | null> {
    const res = await apolloClient
      .mutate({ mutation: RegisterDocument, variables: registerData })
      .catch((e) => {
        throw e;
      });

    if (res && res.data) return res.data;
    return null;
  }

  public async findUser(): Promise<{
    user: User;
    loading: boolean;
  } | null> {
    const { data, loading } = await apolloClient
      .query({ query: FindUserDocument })
      .catch((e) => {
        throw e;
      });
    return { user: data.findUser, loading };
  }

  public async getUsers(): Promise<User[]> {
    const res = await apolloClient
      .query({ query: GetUsersDocument })
      .catch((e) => {
        throw e;
      });

    if (res && res.data) return res.data.getUsers;
    return [];
  }

  public async setOnlineStatus(onlineStatusInput: { isOnline: boolean }) {
    await apolloClient
      .mutate({
        mutation: SetOnlineStatusDocument,
        variables: { onlineStatusInput },
      })
      .catch((e) => {
        throw e;
      });
  }
}

export default new usersService();
