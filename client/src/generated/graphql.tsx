import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateUserInput = {
  username: Scalars['String'];
  email: Scalars['String'];
  auth0Id: Scalars['String'];
};

export type GetMessagesInput = {
  from: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['String'];
  from: Scalars['String'];
  to: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  reactions: Array<Reaction>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createUser: User;
  setOnlineStatus: OnlineStatus;
  addMessage: Message;
  setTypingStatus: TypingStatusData;
  reactToMessage: Reaction;
};


export type MutationCreateUserArgs = {
  newUserData: CreateUserInput;
};


export type MutationSetOnlineStatusArgs = {
  onlineStatusInput: OnlineStatusInput;
};


export type MutationAddMessageArgs = {
  newMessageData: NewMessageInput;
};


export type MutationSetTypingStatusArgs = {
  typingStatusInput: TypingStatusInput;
};


export type MutationReactToMessageArgs = {
  reactInput: ReactToMessageInput;
};

export type NewMessageInput = {
  to: Scalars['String'];
  content: Scalars['String'];
};

export type OnlineStatus = {
  __typename?: 'OnlineStatus';
  userId: Scalars['String'];
  isOnline: Scalars['Boolean'];
};

export type OnlineStatusInput = {
  isOnline: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  findUser: User;
  getUsers: Array<User>;
  getMessages: Array<Message>;
  getReactions: Array<Reaction>;
};


export type QueryGetMessagesArgs = {
  getMessagesParam: GetMessagesInput;
};

export type ReactToMessageInput = {
  messageId: Scalars['String'];
  content: Scalars['String'];
};

export type Reaction = {
  __typename?: 'Reaction';
  id: Scalars['String'];
  content: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  messageId: Scalars['String'];
  userId: Scalars['String'];
  message: Message;
};

export type Subscription = {
  __typename?: 'Subscription';
  ONLINE_STATUS: OnlineStatus;
  NEW_MESSAGE: Message;
  TYPING_STATUS: TypingStatusData;
  NEW_REACTION: Reaction;
};

export type TypingStatusData = {
  __typename?: 'TypingStatusData';
  isTyping: Scalars['Boolean'];
  to: Scalars['String'];
  from: Scalars['String'];
};

export type TypingStatusInput = {
  isTyping: Scalars['Boolean'];
  to: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['String'];
  auth0Id: Scalars['String'];
  username: Scalars['String'];
  isOnline: Scalars['Boolean'];
  latestMessage: Scalars['String'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type AddMessageMutationVariables = Exact<{
  newMessageData: NewMessageInput;
}>;


export type AddMessageMutation = { __typename?: 'Mutation', addMessage: { __typename?: 'Message', id: string, content: string, from: string, to: string, createdAt: string, reactions: Array<{ __typename?: 'Reaction', id: string, content: string, messageId: string, userId: string }> } };

export type ReactToMessageMutationVariables = Exact<{
  reactInput: ReactToMessageInput;
}>;


export type ReactToMessageMutation = { __typename?: 'Mutation', reactToMessage: { __typename?: 'Reaction', id: string, content: string, userId: string, createdAt: string, updatedAt: string, message: { __typename?: 'Message', id: string, from: string, to: string } } };

export type RegisterMutationVariables = Exact<{
  newUserData: CreateUserInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', createUser: { __typename?: 'User', id: string, auth0Id: string, username: string, createdAt: string } };

export type SetOnlineStatusMutationVariables = Exact<{
  onlineStatusInput: OnlineStatusInput;
}>;


export type SetOnlineStatusMutation = { __typename?: 'Mutation', setOnlineStatus: { __typename?: 'OnlineStatus', isOnline: boolean, userId: string } };

export type SetTypingStatusMutationVariables = Exact<{
  typingStatusInput: TypingStatusInput;
}>;


export type SetTypingStatusMutation = { __typename?: 'Mutation', setTypingStatus: { __typename?: 'TypingStatusData', from: string, to: string, isTyping: boolean } };

export type FindUserQueryVariables = Exact<{ [key: string]: never; }>;


export type FindUserQuery = { __typename?: 'Query', findUser: { __typename?: 'User', username: string, id: string, auth0Id: string, createdAt: string } };

export type GetMessagesQueryVariables = Exact<{
  getMessagesParam: GetMessagesInput;
}>;


export type GetMessagesQuery = { __typename?: 'Query', getMessages: Array<{ __typename?: 'Message', id: string, from: string, to: string, content: string, createdAt: string, reactions: Array<{ __typename?: 'Reaction', content: string, messageId: string, userId: string }> }> };

export type GetUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUsersQuery = { __typename?: 'Query', getUsers: Array<{ __typename?: 'User', username: string, id: string, auth0Id: string, createdAt: string, isOnline: boolean, latestMessage: string }> };

export type NewMessageSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewMessageSubscription = { __typename?: 'Subscription', NEW_MESSAGE: { __typename?: 'Message', from: string, to: string, content: string, createdAt: string, id: string } };

export type NewReactionSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type NewReactionSubscription = { __typename?: 'Subscription', NEW_REACTION: { __typename?: 'Reaction', id: string, content: string, userId: string, messageId: string, message: { __typename?: 'Message', id: string, from: string, to: string } } };

export type OnlineStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type OnlineStatusSubscription = { __typename?: 'Subscription', ONLINE_STATUS: { __typename?: 'OnlineStatus', userId: string, isOnline: boolean } };

export type TypingStatusSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type TypingStatusSubscription = { __typename?: 'Subscription', TYPING_STATUS: { __typename?: 'TypingStatusData', from: string, to: string, isTyping: boolean } };


export const AddMessageDocument = gql`
    mutation addMessage($newMessageData: NewMessageInput!) {
  addMessage(newMessageData: $newMessageData) {
    id
    content
    from
    to
    createdAt
    reactions {
      id
      content
      messageId
      userId
    }
  }
}
    `;
export type AddMessageMutationFn = Apollo.MutationFunction<AddMessageMutation, AddMessageMutationVariables>;

/**
 * __useAddMessageMutation__
 *
 * To run a mutation, you first call `useAddMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMessageMutation, { data, loading, error }] = useAddMessageMutation({
 *   variables: {
 *      newMessageData: // value for 'newMessageData'
 *   },
 * });
 */
export function useAddMessageMutation(baseOptions?: Apollo.MutationHookOptions<AddMessageMutation, AddMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddMessageMutation, AddMessageMutationVariables>(AddMessageDocument, options);
      }
export type AddMessageMutationHookResult = ReturnType<typeof useAddMessageMutation>;
export type AddMessageMutationResult = Apollo.MutationResult<AddMessageMutation>;
export type AddMessageMutationOptions = Apollo.BaseMutationOptions<AddMessageMutation, AddMessageMutationVariables>;
export const ReactToMessageDocument = gql`
    mutation reactToMessage($reactInput: ReactToMessageInput!) {
  reactToMessage(reactInput: $reactInput) {
    id
    content
    userId
    message {
      id
      from
      to
    }
    createdAt
    updatedAt
  }
}
    `;
export type ReactToMessageMutationFn = Apollo.MutationFunction<ReactToMessageMutation, ReactToMessageMutationVariables>;

/**
 * __useReactToMessageMutation__
 *
 * To run a mutation, you first call `useReactToMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useReactToMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [reactToMessageMutation, { data, loading, error }] = useReactToMessageMutation({
 *   variables: {
 *      reactInput: // value for 'reactInput'
 *   },
 * });
 */
export function useReactToMessageMutation(baseOptions?: Apollo.MutationHookOptions<ReactToMessageMutation, ReactToMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ReactToMessageMutation, ReactToMessageMutationVariables>(ReactToMessageDocument, options);
      }
export type ReactToMessageMutationHookResult = ReturnType<typeof useReactToMessageMutation>;
export type ReactToMessageMutationResult = Apollo.MutationResult<ReactToMessageMutation>;
export type ReactToMessageMutationOptions = Apollo.BaseMutationOptions<ReactToMessageMutation, ReactToMessageMutationVariables>;
export const RegisterDocument = gql`
    mutation register($newUserData: CreateUserInput!) {
  createUser(newUserData: $newUserData) {
    id
    auth0Id
    username
    createdAt
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      newUserData: // value for 'newUserData'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SetOnlineStatusDocument = gql`
    mutation setOnlineStatus($onlineStatusInput: OnlineStatusInput!) {
  setOnlineStatus(onlineStatusInput: $onlineStatusInput) {
    isOnline
    userId
  }
}
    `;
export type SetOnlineStatusMutationFn = Apollo.MutationFunction<SetOnlineStatusMutation, SetOnlineStatusMutationVariables>;

/**
 * __useSetOnlineStatusMutation__
 *
 * To run a mutation, you first call `useSetOnlineStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetOnlineStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setOnlineStatusMutation, { data, loading, error }] = useSetOnlineStatusMutation({
 *   variables: {
 *      onlineStatusInput: // value for 'onlineStatusInput'
 *   },
 * });
 */
export function useSetOnlineStatusMutation(baseOptions?: Apollo.MutationHookOptions<SetOnlineStatusMutation, SetOnlineStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetOnlineStatusMutation, SetOnlineStatusMutationVariables>(SetOnlineStatusDocument, options);
      }
export type SetOnlineStatusMutationHookResult = ReturnType<typeof useSetOnlineStatusMutation>;
export type SetOnlineStatusMutationResult = Apollo.MutationResult<SetOnlineStatusMutation>;
export type SetOnlineStatusMutationOptions = Apollo.BaseMutationOptions<SetOnlineStatusMutation, SetOnlineStatusMutationVariables>;
export const SetTypingStatusDocument = gql`
    mutation setTypingStatus($typingStatusInput: TypingStatusInput!) {
  setTypingStatus(typingStatusInput: $typingStatusInput) {
    from
    to
    isTyping
  }
}
    `;
export type SetTypingStatusMutationFn = Apollo.MutationFunction<SetTypingStatusMutation, SetTypingStatusMutationVariables>;

/**
 * __useSetTypingStatusMutation__
 *
 * To run a mutation, you first call `useSetTypingStatusMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetTypingStatusMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setTypingStatusMutation, { data, loading, error }] = useSetTypingStatusMutation({
 *   variables: {
 *      typingStatusInput: // value for 'typingStatusInput'
 *   },
 * });
 */
export function useSetTypingStatusMutation(baseOptions?: Apollo.MutationHookOptions<SetTypingStatusMutation, SetTypingStatusMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetTypingStatusMutation, SetTypingStatusMutationVariables>(SetTypingStatusDocument, options);
      }
export type SetTypingStatusMutationHookResult = ReturnType<typeof useSetTypingStatusMutation>;
export type SetTypingStatusMutationResult = Apollo.MutationResult<SetTypingStatusMutation>;
export type SetTypingStatusMutationOptions = Apollo.BaseMutationOptions<SetTypingStatusMutation, SetTypingStatusMutationVariables>;
export const FindUserDocument = gql`
    query findUser {
  findUser {
    username
    id
    auth0Id
    createdAt
  }
}
    `;

/**
 * __useFindUserQuery__
 *
 * To run a query within a React component, call `useFindUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useFindUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFindUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useFindUserQuery(baseOptions?: Apollo.QueryHookOptions<FindUserQuery, FindUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, options);
      }
export function useFindUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FindUserQuery, FindUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FindUserQuery, FindUserQueryVariables>(FindUserDocument, options);
        }
export type FindUserQueryHookResult = ReturnType<typeof useFindUserQuery>;
export type FindUserLazyQueryHookResult = ReturnType<typeof useFindUserLazyQuery>;
export type FindUserQueryResult = Apollo.QueryResult<FindUserQuery, FindUserQueryVariables>;
export const GetMessagesDocument = gql`
    query getMessages($getMessagesParam: GetMessagesInput!) {
  getMessages(getMessagesParam: $getMessagesParam) {
    id
    from
    to
    content
    createdAt
    reactions {
      content
      messageId
      userId
    }
  }
}
    `;

/**
 * __useGetMessagesQuery__
 *
 * To run a query within a React component, call `useGetMessagesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesQuery({
 *   variables: {
 *      getMessagesParam: // value for 'getMessagesParam'
 *   },
 * });
 */
export function useGetMessagesQuery(baseOptions: Apollo.QueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
      }
export function useGetMessagesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesQuery, GetMessagesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessagesQuery, GetMessagesQueryVariables>(GetMessagesDocument, options);
        }
export type GetMessagesQueryHookResult = ReturnType<typeof useGetMessagesQuery>;
export type GetMessagesLazyQueryHookResult = ReturnType<typeof useGetMessagesLazyQuery>;
export type GetMessagesQueryResult = Apollo.QueryResult<GetMessagesQuery, GetMessagesQueryVariables>;
export const GetUsersDocument = gql`
    query getUsers {
  getUsers {
    username
    id
    auth0Id
    createdAt
    isOnline
    latestMessage
  }
}
    `;

/**
 * __useGetUsersQuery__
 *
 * To run a query within a React component, call `useGetUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
      }
export function useGetUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUsersQuery, GetUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUsersQuery, GetUsersQueryVariables>(GetUsersDocument, options);
        }
export type GetUsersQueryHookResult = ReturnType<typeof useGetUsersQuery>;
export type GetUsersLazyQueryHookResult = ReturnType<typeof useGetUsersLazyQuery>;
export type GetUsersQueryResult = Apollo.QueryResult<GetUsersQuery, GetUsersQueryVariables>;
export const NewMessageDocument = gql`
    subscription newMessage {
  NEW_MESSAGE {
    from
    to
    content
    createdAt
    id
  }
}
    `;

/**
 * __useNewMessageSubscription__
 *
 * To run a query within a React component, call `useNewMessageSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewMessageSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewMessageSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewMessageSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewMessageSubscription, NewMessageSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewMessageSubscription, NewMessageSubscriptionVariables>(NewMessageDocument, options);
      }
export type NewMessageSubscriptionHookResult = ReturnType<typeof useNewMessageSubscription>;
export type NewMessageSubscriptionResult = Apollo.SubscriptionResult<NewMessageSubscription>;
export const NewReactionDocument = gql`
    subscription newReaction {
  NEW_REACTION {
    id
    content
    userId
    messageId
    message {
      id
      from
      to
    }
  }
}
    `;

/**
 * __useNewReactionSubscription__
 *
 * To run a query within a React component, call `useNewReactionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNewReactionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNewReactionSubscription({
 *   variables: {
 *   },
 * });
 */
export function useNewReactionSubscription(baseOptions?: Apollo.SubscriptionHookOptions<NewReactionSubscription, NewReactionSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<NewReactionSubscription, NewReactionSubscriptionVariables>(NewReactionDocument, options);
      }
export type NewReactionSubscriptionHookResult = ReturnType<typeof useNewReactionSubscription>;
export type NewReactionSubscriptionResult = Apollo.SubscriptionResult<NewReactionSubscription>;
export const OnlineStatusDocument = gql`
    subscription onlineStatus {
  ONLINE_STATUS {
    userId
    isOnline
  }
}
    `;

/**
 * __useOnlineStatusSubscription__
 *
 * To run a query within a React component, call `useOnlineStatusSubscription` and pass it any options that fit your needs.
 * When your component renders, `useOnlineStatusSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOnlineStatusSubscription({
 *   variables: {
 *   },
 * });
 */
export function useOnlineStatusSubscription(baseOptions?: Apollo.SubscriptionHookOptions<OnlineStatusSubscription, OnlineStatusSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<OnlineStatusSubscription, OnlineStatusSubscriptionVariables>(OnlineStatusDocument, options);
      }
export type OnlineStatusSubscriptionHookResult = ReturnType<typeof useOnlineStatusSubscription>;
export type OnlineStatusSubscriptionResult = Apollo.SubscriptionResult<OnlineStatusSubscription>;
export const TypingStatusDocument = gql`
    subscription typingStatus {
  TYPING_STATUS {
    from
    to
    isTyping
  }
}
    `;

/**
 * __useTypingStatusSubscription__
 *
 * To run a query within a React component, call `useTypingStatusSubscription` and pass it any options that fit your needs.
 * When your component renders, `useTypingStatusSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTypingStatusSubscription({
 *   variables: {
 *   },
 * });
 */
export function useTypingStatusSubscription(baseOptions?: Apollo.SubscriptionHookOptions<TypingStatusSubscription, TypingStatusSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<TypingStatusSubscription, TypingStatusSubscriptionVariables>(TypingStatusDocument, options);
      }
export type TypingStatusSubscriptionHookResult = ReturnType<typeof useTypingStatusSubscription>;
export type TypingStatusSubscriptionResult = Apollo.SubscriptionResult<TypingStatusSubscription>;