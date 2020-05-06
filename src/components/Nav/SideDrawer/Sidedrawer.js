import React from "react";
import styled from "styled-components";
import Logo from "../../Logo/Logo";
import Items from "../Items/Items";
import Backdrop from "../../Backdrop/Backdrop";

const SideDrawer = styled.div`
  position: fixed;
  width: 280px;
  max-width: 70%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 200;
  background-color: white;
  padding: 32px 16px;
  box-sizing: border-box;
  transition: transform 0.3s ease-out;
  @media (min-width: 500px) {
    display: none;
  }
  &.open {
    transform: translateX(0);
  }
  &.close {
    transform: translateX(-100%);
  }
`;

const sidedrawer = props => {
  return (
    <>
      <SideDrawer className={props.open ? "open" : "close"}>
        <Logo height="11%" margin="20px" />
        <nav>
          <Items />
        </nav>
      </SideDrawer>
    </>
  );
};

export default sidedrawer;
