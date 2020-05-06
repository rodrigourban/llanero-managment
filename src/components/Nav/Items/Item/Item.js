import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as apiActions from "../../../../store/actions/api";

const Item = styled.li`
  margin: 0;
  display: flex;
  height: 100%;
  width: auto;
  align-items: center;

  @media (max-width: 500px) {
    margin: 0;
    display: block;
    width: 100%;
  }
`;
const A = styled(Link)`
    color: black;
    text-decoration: none;
    height: 100%;
    padding: 16px 10px;
    border-bottom: 4px solid transparent;
    box-sizing: border-box;
    display: block;
    :hover {
      background-color: #1976d2;
      color: #ffffff;
    }
    &.active {
      background-color: #40A4C8;
      border-bottom: 4px solid #40a4c8;
    }
  }
  @media (max-width: 500px) {
    color: black;
    width: 100%;
    display: block;
    &.active {
      color: #40A4C8;
      background-color: white;
      border-bottom: none;
    }
  }
`;

const NavigationItem = props => {
  const dispatch = useDispatch();
  return (
    <Item>
      <A
        onClick={() => dispatch(apiActions.toggleSideDrawer())}
        to={props.link}
        className={props.active ? "active" : null}
      >
        {props.children}
      </A>
    </Item>
  );
};

export default NavigationItem;
