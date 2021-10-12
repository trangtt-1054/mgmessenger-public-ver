import { Dispatch } from "@reduxjs/toolkit";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLazyQuery, useSubscription } from "@apollo/client";
import styled from "styled-components";
import tw from "twin.macro";
import TextareaAutosize from "react-textarea-autosize";
import {
  GetMessagesDocument,
  Message,
  NewReactionDocument,
  Reaction as ReactionType,
  User as UserResponse,
} from "../generated/graphql";
import { stateSelector } from "../selectors";
import usersService from "../services/usersService";
import messagesService from "../services/messagesService";
import {
  setListUsers,
  setSelectedUser,
  setMessages,
  addReaction,
} from "../slices/home";
import { SelectedUser, User } from "../types";
import Navbar from "./Navbar";
import { NewMessageDocument, TypingStatusDocument } from "../generated/graphql";
import Layout from "./Layout";
import moment from "moment";
import { Popover } from "react-tiny-popover";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";

const reactions = ["😂", "💩", "🙇‍♂️", "👍", "❤️", "😡"];

const actionDispatch = (dispatch: Dispatch) => ({
  setListUsers: (users: UserResponse[]) => dispatch(setListUsers(users)),
  setSelectedUser: (user: SelectedUser) => dispatch(setSelectedUser(user)),
  setMessages: (message: Message) => dispatch(setMessages(message)),
  addReaction: (reaction: ReactionType) => dispatch(addReaction(reaction)),
});

const Home = () => {
  const { setListUsers, setSelectedUser, setMessages, addReaction } =
    actionDispatch(useDispatch());
  const { users, currentUser } = useSelector(stateSelector);
  const [popOpen, setPopOpen] = useState("");
  const [showFriendList, setShowFriendList] = useState(true);

  const toggleShowFriendList = () => setShowFriendList(!showFriendList);

  const setRef = useCallback((node) => {
    node && node.scrollIntoView({ smooth: true });
  }, []);

  document.addEventListener("click", () => {
    if (popOpen) setPopOpen("");
  });

  const [content, setContent] = useState("");
  const [selected, setSelected] = useState(0);

  const selectedUser = users[selected];

  useEffect(() => {
    const fetchUsers = async () => {
      await usersService
        .getUsers()
        .then((res) => {
          setListUsers(res);
          selectUser({ ...res[0], messages: [] }, 0, true);
        })
        .catch((e) => console.log(e));
    };
    fetchUsers();
    return () => {
      document.removeEventListener("click", () => {
        if (popOpen) setPopOpen("");
      });
    };
  }, []);

  const [getMessages, { data: messagesData, loading: loadingMessages }] =
    useLazyQuery(GetMessagesDocument, { fetchPolicy: "network-only" });

  useEffect(() => {
    if (selectedUser)
      setSelectedUser({
        id: selectedUser.id,
        username: selectedUser.username,
        messages: messagesData?.getMessages,
      });
  }, [messagesData]);

  const selectUser = async (
    user: User,
    index: number,
    showFriendList = false
  ) => {
    setShowFriendList(showFriendList);
    if (user?.id === selectedUser?.id) return;
    setSelected(index);
    getMessages({ variables: { getMessagesParam: { from: user.id } } });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const changeContent = (e: any) => {
    setContent(e.target.value);
  };

  const sendMessage = async () => {
    await messagesService
      .sendMessage({
        to: selectedUser.id,
        content,
      })
      .catch((e) => console.log(e));
    setContent("");
  };

  const { data, error } =
    useSubscription<{ NEW_MESSAGE: Message }>(NewMessageDocument);

  const { data: typingData } = useSubscription<{
    TYPING_STATUS: { to: string; from: string; isTyping: boolean };
  }>(TypingStatusDocument);

  const { data: reactionData, error: reactionError } =
    useSubscription<{ NEW_REACTION: ReactionType }>(NewReactionDocument);

  useEffect(() => {
    if (error) {
      console.log(error);
      return;
    }
    if (data && data.NEW_MESSAGE) {
      const { NEW_MESSAGE: newMessage } = data;
      setMessages(newMessage);
    }
  }, [data?.NEW_MESSAGE]);

  useEffect(() => {
    if (reactionError) {
      console.log(reactionError);
      return;
    }
    if (reactionData?.NEW_REACTION) {
      addReaction(reactionData.NEW_REACTION);
    }
  }, [reactionData?.NEW_REACTION]);

  const handleFocus = async () => {
    await messagesService.setTypingStatus({
      to: selectedUser.id,
      isTyping: true,
    });
  };

  const handleBlur = async () => {
    await messagesService.setTypingStatus({
      to: selectedUser.id,
      isTyping: false,
    });
  };

  const reactToMessage = async (content: string, messageId: string) => {
    setPopOpen("");
    await messagesService.reactToMessage({ content, messageId });
  };

  const formatDate = (data: string) => {
    if (data === "") return "...";
    const date = new Date(+data).toUTCString();
    const formatted = moment(date).format("MMM Do");
    return formatted;
  };

  return (
    <Layout>
      <Navbar
        toggleShowFriendList={toggleShowFriendList}
        showFriendList={showFriendList}
      />
      {!selectedUser ? (
        <Loading>Loading...</Loading>
      ) : (
        <Root>
          <FriendList show={showFriendList}>
            <SectionTitle>Your Friends</SectionTitle>
            <ListWrapper>
              {users.map((u, i) => {
                return (
                  <UserContainer
                    key={u.id}
                    onClick={() => selectUser(u, i)}
                    selected={u.id === selectedUser.id}
                  >
                    <Username selected={u.id === selectedUser.id}>
                      <OnlineIndicator isOnline={u.isOnline} />
                      {u.username}
                    </Username>
                    <LatestMessage>
                      {u.latestMessage || "Let's start a conversation"}
                    </LatestMessage>
                  </UserContainer>
                );
              })}
            </ListWrapper>
          </FriendList>
          <ChatPanel show={!showFriendList}>
            <SelectedUserIndicator>
              ___Chat history with {selectedUser.username}___
            </SelectedUserIndicator>
            {loadingMessages ? (
              <LoadingMessageText>Loading messages...</LoadingMessageText>
            ) : (
              <MessagesWrapper>
                {selectedUser.messages?.map((m, i) => (
                  <MessageItem
                    key={m.id}
                    fromMe={m.from === currentUser?.id}
                    ref={i === selectedUser.messages.length - 1 ? setRef : null}
                  >
                    <Tooltip
                      trigger='mouseenter'
                      interactive
                      html={
                        <p style={{ opacity: 0.6 }}>
                          {formatDate(m.createdAt)}
                        </p>
                      }
                      position='left'
                    >
                      <Bubble
                        fromMe={m.from === currentUser?.id}
                        hasReaction={m.reactions?.length > 0}
                      >
                        {m.content}
                        {m.reactions?.length ? (
                          <ReactionWrapper>
                            {[
                              ...new Set(m.reactions.map((r) => r.content)),
                            ].map((c, i) => (
                              <ReactionItem key={i}>{c}</ReactionItem>
                            ))}
                            <ReactionCounter>
                              {m.reactions.length}
                            </ReactionCounter>
                          </ReactionWrapper>
                        ) : null}
                      </Bubble>
                    </Tooltip>
                    <Popover
                      isOpen={!!popOpen}
                      positions={["top", "bottom", "left", "right"]}
                      content={
                        <PopOverContent open={popOpen === m.id}>
                          {reactions.map((r, i) => (
                            <Reaction
                              onClick={(e) => {
                                e.stopPropagation();
                                reactToMessage(r, m.id);
                              }}
                              key={i}
                            >
                              {r}
                            </Reaction>
                          ))}
                        </PopOverContent>
                      }
                    >
                      <ReactionIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          setPopOpen(m.id);
                        }}
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          className='h-6 w-6'
                          fill='none'
                          viewBox='0 0 24 24'
                          stroke='rgba(229, 231, 235, 1)'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={1.5}
                            d='M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                      </ReactionIcon>
                    </Popover>
                  </MessageItem>
                ))}
                {typingData?.TYPING_STATUS.isTyping &&
                  typingData.TYPING_STATUS.from === selectedUser.id && (
                    <TypingIndicator>
                      {selectedUser.username} is typing...
                    </TypingIndicator>
                  )}
              </MessagesWrapper>
            )}
            {selectedUser.id && (
              <InputWrapper>
                <StyledInput
                  maxLength={255}
                  onKeyDown={onKeyDown}
                  onChange={changeContent}
                  value={content}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  maxRows={5}
                  style={{ resize: "none" }}
                />
                <SendBtn onClick={sendMessage} disabled={content === ""}>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path d='M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z' />
                  </svg>
                </SendBtn>
              </InputWrapper>
            )}
          </ChatPanel>
        </Root>
      )}
    </Layout>
  );
};

export default Home;

const Root = styled.div`
  ${tw`
    flex
    m-auto
    sm:mt-5
    justify-between
    h-screen
    sm:h-5/6
    w-full
    sm:w-10/12
  `}
  @media screen and (max-width: 640px) {
    height: calc(100% - 58px);
  }
`;

const Loading = styled.div`
  ${tw`
    w-full
    h-screen
    flex
    justify-center
    align-items[center]
  `}
`;

const FriendList = styled.div<{ show: boolean }>`
  ${tw`
    bg-blue
    bg-opacity-40
    sm:rounded-l-xl
    overflow-hidden
    h-full
    hidden
    w-full
    sm:block
    sm:min-w-sidebarMd 
    sm:max-w-sidebarMd
    lg:min-w-sidebar 
    lg:max-w-sidebar
  `}
  ${(props) => (props.show ? tw`block` : tw`hidden`)}
`;

const ListWrapper = styled.div`
  height: calc(100% - 46px);
  ${tw`
    overflow-y-auto
  `}
`;

const ChatPanel = styled.div<{ show: boolean }>`
  ${tw`
    bg-blue
    bg-opacity-40
    sm:rounded-r-xl
    w-full
    p-4
    relative
    sm:block
  `}
  ${(props) => (props.show ? tw`block` : tw`hidden`)}
`;

const LoadingMessageText = styled.div`
  ${tw`
    flex 
    justify-center 
    align-items[center] 
    h-full w-full 
    text-sm
    text-gray-300
  `}
`;

const SelectedUserIndicator = styled.p`
  ${tw`
    text-sm
    text-gray-300
    m-auto
    text-center
    mb-5
  `}
`;

const UserContainer = styled.div<{ selected: boolean }>`
  ${tw`
    cursor-pointer
    bg-blue-dark
    p-3
    `}
  ${(props) =>
    props.selected
      ? tw`bg-opacity-40`
      : tw` bg-opacity-10`} //this has to be under the above styles
`;

const Username = styled.div<{ selected: boolean }>`
  ${tw`
    font-bold
    flex
    align-items[center]
  `}
  ${(props) => props.selected && tw`text-pink`}
`;

const LatestMessage = styled.p`
  ${tw`
    mt-1
    text-sm
    text-gray-200
    opacity-80  
    truncate
  `}
`;

const SectionTitle = styled.h4`
  ${tw`
    p-3
    text-center
    text-blue-light
  `}
`;

const MessagesWrapper = styled.div`
  height: calc(100% - 130px);
  ${tw`
    overflow-y-auto
    pr-4
    pt-8
    sm:pt-6
  `}
`;

const MessageItem = styled.div<{ fromMe: boolean }>`
  ${tw`
    flex
    align-items[center]
  `}
  ${(props) => (props.fromMe ? tw`flex-row-reverse` : tw``)}
`;

const Bubble = styled.div<{ fromMe: boolean; hasReaction: boolean }>`
  ${tw`
    py-2
    px-3
    rounded-2xl
    max-w-4/5
    md:w-max
    relative
    sm:max-w-md
    md:max-w-xl
    break-all
  `}
  ${(props) =>
    props.fromMe
      ? tw`bg-blue-light bg-opacity-30 ml-2`
      : tw` bg-blue-dark bg-opacity-30 mr-2`}
  ${(props) => (props.hasReaction ? tw`mb-4` : tw`mb-2`)}
`;

const ReactionIcon = styled.div`
  ${tw`
    h-5
    mb-2
    min-w-icon
    cursor-pointer
    relative
  `}
`;

const PopOverContent = styled.div<{ open: boolean }>`
  top: -30px;
  left: -68px;
  ${tw`
    h-6
    w-max
    pb-1
    px-2
    bg-white
    rounded-full
    absolute
    flex
    shadow-xl
  `}
  ${(props) => (props.open ? tw`block` : tw`hidden`)}
`;

const Reaction = styled.button`
  :hover {
    transform: scale(1.2);
    transition: all 0.2s ease-in-out;
  }
  ${tw`
    not-first:ml-1.5
  `}
`;

const ReactionWrapper = styled.div`
  font-size: 13px;
  ${tw`
    absolute
    bg-gray-50
    rounded-full
    h-5
    px-1
    w-max
    right-0.5
  `}
`;

const ReactionItem = styled.span`
  ${tw`
  
  `}
`;

const ReactionCounter = styled.span`
  ${tw`
    text-blue
    mx-0.5
  `}
`;

const TypingIndicator = styled.p`
  ${tw`
    text-sm
    text-blue-light
    text-opacity-60
  `}
`;

const OnlineIndicator = styled.span<{ isOnline: boolean }>`
  ${tw`
    block
    rounded-full
    mt-1
    w-2
    h-2
    mr-2
  `}
  ${(props) => (props.isOnline ? tw`bg-blue-light` : tw`bg-gray-500`)}
`;

const InputWrapper = styled.div`
  ${tw`
    w-full
    absolute
    bottom-4
    left-0
    flex
    justify-between
    align-items[center]
  `}
`;

const StyledInput = styled(TextareaAutosize)`
  ${tw`
    h-6
    text-gray-200
    placeholder-gray-300 
    placeholder-opacity-40
    text-base
    px-4
    py-2
    bg-blue-dark
    bg-opacity-40
    rounded-md
    focus:bg-opacity-60
    ml-4
    w-full
  `}
`;

const SendBtn = styled.button<{ disabled: boolean }>`
  ${tw`
    pr-2
    pl-1
    sm:pl-0
    h-10
    py-1
    text-xl
    rounded-md
    bg-opacity-50
    w-16
    disabled:bg-opacity-20 
    disabled:cursor-not-allowed
    disabled:text-gray-400
  `}
  svg {
    transform: rotate(90deg);
    width: 32px;
    height: 32px;
    > path {
      fill: ${(props) => (!props.disabled ? "#2ffadb" : undefined)};
    }
  }
`;
