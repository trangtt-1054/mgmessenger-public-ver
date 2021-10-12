import {
  GetMessagesInput,
  GetMessagesDocument,
  Message,
  NewMessageInput,
  AddMessageDocument,
  SetTypingStatusDocument,
  ReactToMessageInput,
  ReactToMessageDocument,
} from "../../generated/graphql";
import { apolloClient } from "../../graphql";

class messagesService {
  public async getMessages(
    getMessagesParam: GetMessagesInput
  ): Promise<Message[]> {
    const { from } = getMessagesParam;
    const { data } = await apolloClient
      .query({
        query: GetMessagesDocument,
        variables: { getMessagesParam: { from } }, //variables name phải đúng như trong generated, `getMessagesParam` chứ ko phải `getMessageParam` (thiếu s)
        fetchPolicy: "network-only",
      })
      .catch((e) => {
        throw e;
      });
    if (data) return data.getMessages;
    return [];
  }

  public async sendMessage(newMessageData: NewMessageInput) {
    const { data } = await apolloClient
      .mutate({ mutation: AddMessageDocument, variables: { newMessageData } })
      .catch((e) => {
        throw e;
      });
    if (data) return data.addMessage;
  }

  public async setTypingStatus({
    to,
    isTyping,
  }: {
    to: string;
    isTyping: boolean;
  }) {
    await apolloClient
      .mutate({
        mutation: SetTypingStatusDocument,
        variables: { typingStatusInput: { to, isTyping } },
      })
      .catch((e) => {
        console.log(e);
      });
  }

  public async reactToMessage(reactInput: ReactToMessageInput) {
    const { data } = await apolloClient
      .mutate({ mutation: ReactToMessageDocument, variables: { reactInput } })
      .catch((e) => {
        throw e;
      });

    if (data) return data.reactToMessage;
  }
}

export default new messagesService();
