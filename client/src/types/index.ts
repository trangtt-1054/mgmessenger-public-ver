import { User as UserResponse, Message } from '../generated/graphql';

export interface RootAppState {
  homePage: HomeState;
}

export type User = UserResponse & { messages: Message[] };

export interface HomeState {
  currentUser: User | null;
  users: User[];
}

export interface SelectedUser {
  id: string;
  username: string;
  messages: Message[];
}
