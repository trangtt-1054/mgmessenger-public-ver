import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { stateSelector } from "../selectors";
import usersService from "../services/usersService";
import styled from "styled-components";
import tw from "twin.macro";
import Layout from "./Layout";
import Navbar from "./Navbar";

const Login = () => {
  const { user, isLoading, loginWithRedirect, isAuthenticated } = useAuth0();
  const [loading, setLoading] = useState(false);

  const updateLoadingStatus = (val: boolean) => setLoading(val);
  const [username, setUsername] = useState("");
  const handleChange = (e: any) => {
    const value = e.target.value;
    setUsername(value);
  };

  const { currentUser } = useSelector(stateSelector);

  const login = async () => {
    try {
      await loginWithRedirect();
    } catch (e) {
      console.log(e);
    }
  };

  const register = async (e: any) => {
    e.preventDefault();
    try {
      if (user?.email && user?.name && user?.sub) {
        await usersService.register({
          newUserData: { username, email: user.email, auth0Id: user.sub },
        });
        window.location.href = "/";
      }
    } catch (e) {
      console.log(e);
    }
  };
  console.log(user?.sub);

  return (
    <Layout>
      <Navbar hidden setLoading={updateLoadingStatus} />
      <Root>
        {isLoading || loading ? (
          <p>Loading...</p>
        ) : isAuthenticated && !currentUser?.id ? (
          <>
            <p>
              Authenticated as <UserEmail>{user?.email}</UserEmail>
            </p>
            <StyledForm onSubmit={register}>
              <StyledInput
                type='text'
                placeholder='Pick an username'
                onChange={(e) => handleChange(e)}
                maxLength={20}
              />
              <SendBtn type='submit' disabled={username === ""}>
                Register
              </SendBtn>
            </StyledForm>
          </>
        ) : currentUser?.id ? (
          <>
            <Greet>
              You're back, <Username>{currentUser.username}!</Username>
            </Greet>
            <Button onClick={() => (window.location.href = "/")}>
              Go to Home Page
            </Button>
          </>
        ) : (
          <Button onClick={login}>Login with email</Button>
        )}
      </Root>
    </Layout>
  );
};

export default Login;

const Root = styled.div`
  ${tw`
    h-56
    m-auto
    text-center	
    mt-64
    md:w-1/3
    sm:w-1/2
  `}
`;

const Button = styled.button`
  ${tw`
    px-10
    h-16
    text-2xl
    rounded-full
    text-gray-300
    hover:text-white
    bg-blue
    bg-opacity-40
    hover:bg-opacity-50
    transition
    duration-200
  `}
`;

const Greet = styled.p`
  ${tw`
    text-4xl
    mb-8
  `}
`;

const Username = styled.span`
  ${tw`
    font-bold
  `}
`;

const StyledInput = styled.input`
  ${tw`
    text-gray-200
    placeholder-gray-300 
    placeholder-opacity-40
    text-base
    px-6
    py-2
    bg-blue-dark
    bg-opacity-40
    rounded-md
    focus:bg-opacity-60
    ml-4
    w-40
  `}
`;

const UserEmail = styled.span`
  ${tw`
    font-bold
    text-blue-light
  `}
`;

const SendBtn = styled.button`
  ${tw`
    px-6
    h-10
    text-xl
    rounded-md
    bg-blue-light
    bg-opacity-50
    mx-4
    disabled:bg-opacity-20 
    disabled:cursor-not-allowed
    disabled:text-gray-400
  `}
`;

const StyledForm = styled.form`
  ${tw`
    mt-4
  `}
`;
