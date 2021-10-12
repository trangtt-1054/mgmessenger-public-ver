import { useAuth0 } from "@auth0/auth0-react";
import { Dispatch } from "@reduxjs/toolkit";
import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { stateSelector } from "../selectors";
import usersService from "../services/usersService";
import { setCurrentUser, setActiveStatus } from "../slices/home";
import { User, OnlineStatus, OnlineStatusDocument } from "../generated/graphql";
import { useSubscription } from "@apollo/client";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import tw from "twin.macro";

const actionDispatch = (dispatch: Dispatch) => ({
  setCurrentUser: (user: User) => dispatch(setCurrentUser(user)),
  setActiveStatus: (payload: OnlineStatus) =>
    dispatch(setActiveStatus(payload)),
});

type Props = {
  showFriendList?: boolean;
  toggleShowFriendList?: () => void;
  hidden?: boolean;
  className?: string;
  setLoading?: (val: boolean) => void;
};

const Navbar: FC<Props> = ({
  showFriendList,
  toggleShowFriendList,
  className,
  hidden = false,
  setLoading,
}) => {
  const history = useHistory();
  window.addEventListener("unload", () => {
    usersService.setOnlineStatus({ isOnline: false });
  });
  const { logout, user, getAccessTokenSilently, isAuthenticated, isLoading } =
    useAuth0();
  const { currentUser } = useSelector(stateSelector);
  const { setCurrentUser, setActiveStatus } = actionDispatch(useDispatch());
  const [token, setToken] = useState("");

  const { data } =
    useSubscription<{ ONLINE_STATUS: OnlineStatus }>(OnlineStatusDocument);

  useEffect(() => {
    if (currentUser?.id) {
      const setOnlineStatus = async () => {
        await usersService.setOnlineStatus({
          isOnline: true,
        });
      };
      setOnlineStatus();
    }
  }, [currentUser?.id]);

  useEffect(() => {
    if (data?.ONLINE_STATUS) {
      const { isOnline, userId } = data.ONLINE_STATUS;
      setActiveStatus({ isOnline, userId });
    }
  }, [data]);

  useEffect(() => {
    const getToken = async () => {
      return await getAccessTokenSilently();
    };

    user &&
      !currentUser?.id &&
      getToken().then((res) => {
        localStorage.setItem("auth0-token", res);
        setToken(res);
      });
  }, [user]);

  useEffect(() => {
    const getMe = async () => {
      try {
        setLoading && setLoading(true);
        await usersService.findUser().then((res) => {
          if (res) {
            setCurrentUser(res.user);
          }
        });
      } catch (e) {
        history.push("/login");
      } finally {
        setLoading && setLoading(false);
      }
    };

    !currentUser?.id && getMe();
  }, [token]);

  const onLogout = async () => {
    await usersService.setOnlineStatus({ isOnline: false });
    logout({ returnTo: `${window.location.origin}/login` });
    localStorage.removeItem("auth0-token");
  };

  return (
    <Root className={className} hidden={hidden}>
      {currentUser ? (
        <Wrap>
          <UserInfo>
            <p>
              Welcome, <Username>{currentUser.username}</Username>
            </p>
            <LogoutBtn onClick={onLogout}>Logout</LogoutBtn>
          </UserInfo>
          <BackIcon onClick={toggleShowFriendList} show={!showFriendList}>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path
                fillRule='evenodd'
                d='M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z'
                clipRule='evenodd'
              />
            </svg>
          </BackIcon>
        </Wrap>
      ) : isAuthenticated || isLoading ? null : (
        <h1>Please login</h1>
      )}
    </Root>
  );
};

export default Navbar;

const Root = styled.div<{ hidden?: boolean }>`
  ${tw`
    w-full
  `};
  display: ${(props) => (props.hidden ? "none" : undefined)};
`;

const Wrap = styled.div`
  ${tw`
    display[flex]
    justify-between
    flex-row-reverse
    align-items[center]
    m-4
  `}
`;

const BackIcon = styled.div<{ show: boolean }>`
  ${tw`
    h-6
    w-6
    sm:hidden
  `}
  ${(props) => (props.show ? tw`block` : tw`hidden`)}
`;

const UserInfo = styled.div`
  ${tw`
    flex
  `}
`;

const Username = styled.span`
  ${tw`
    text-blue-light
    font-bold
  `}
`;

const LogoutBtn = styled.button`
  ${tw`
    px-3
    h-7
    text-sm
    bg-blue-light
    bg-opacity-30
    rounded-md
    ml-4
  `}
`;
