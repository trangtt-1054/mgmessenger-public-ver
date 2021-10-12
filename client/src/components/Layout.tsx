import { FC } from "react";
import styled from "styled-components";
import tw from "twin.macro";

const Layout: FC = ({ children }) => {
  return (
    <Root>
      <div className='stars'></div>
      <div className='twinkling'></div>
      <Content>{children}</Content>
    </Root>
  );
};

export default Layout;

const Root = styled.div`
  ${tw`
  w-full
  h-full
  `};
`;

const Content = styled.div`
  ${tw`
    absolute
    w-full
    h-full
  `};
`;
